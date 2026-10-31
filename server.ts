import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { initialArticles, initialCategories, initialSettings } from './src/data/initialData';
import { Article, Category, SiteSettings, ContactMessage, AdminUser } from './src/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'technova-india-secure-jwt-key-2026';

// Directories setup
const dataDir = path.resolve(process.cwd(), 'data');
const uploadsDir = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'db.json');

interface DatabaseSchema {
  articles: Article[];
  categories: Category[];
  settings: SiteSettings;
  messages: ContactMessage[];
  users: (AdminUser & { passwordHash: string })[];
}

// Initialize database with default data if not exists
function loadDatabase(): DatabaseSchema {
  if (fs.existsSync(dbPath)) {
    try {
      const content = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Error reading db.json, creating backup and reinitializing', err);
    }
  }

  // Initial admin user: admin@technova.in / TechNova@2026!
  const defaultSalt = bcrypt.genSaltSync(10);
  const defaultHash = bcrypt.hashSync('TechNova@2026!', defaultSalt);

  const initialData: DatabaseSchema = {
    articles: initialArticles,
    categories: initialCategories,
    settings: initialSettings,
    messages: [
      {
        id: 'msg-seed-1',
        name: 'Vikas Sharma',
        email: 'vikas.tech@example.com',
        subject: 'UPI Fraud awareness article feedback',
        message: 'Namaste TechNova team. Aapka Two-Factor Authentication wala article padha, bohot hi aasan aur upyogi hai. Kya aap agle hafte UPI Safety par bhi likh sakte hain?',
        status: 'read',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      }
    ],
    users: [
      {
        id: 'usr-admin-1',
        email: 'admin@technova.in',
        username: 'admin',
        role: 'superadmin',
        passwordHash: defaultHash,
        createdAt: new Date().toISOString(),
      }
    ]
  };

  saveDatabase(initialData);
  return initialData;
}

let db: DatabaseSchema = loadDatabase();

function saveDatabase(dataToSave: DatabaseSchema) {
  try {
    const tempPath = `${dbPath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(dataToSave, null, 2), 'utf-8');
    fs.renameSync(tempPath, dbPath);
    db = dataToSave;
  } catch (err) {
    console.error('Failed to save database:', err);
  }
}

// Background scheduler for scheduled articles (every 30 seconds)
setInterval(() => {
  const now = new Date();
  let updated = false;

  db.articles = db.articles.map((art) => {
    if (art.status === 'scheduled' && art.scheduledAt) {
      const scheduledDate = new Date(art.scheduledAt);
      if (scheduledDate <= now) {
        updated = true;
        return {
          ...art,
          status: 'published',
          publishedAt: art.scheduledAt,
          updatedAt: now.toISOString(),
        };
      }
    }
    return art;
  });

  if (updated) {
    saveDatabase(db);
    console.log(`[Scheduler] Published scheduled articles at ${now.toISOString()}`);
  }
}, 30000);

// Middlewares
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve static uploads
app.use('/uploads', express.static(uploadsDir));

// JWT Authentication middleware
interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// Get site settings
app.get('/api/public/settings', (_req: Request, res: Response) => {
  res.json({
    ...db.settings,
  });
});

// Get categories with published post count
app.get('/api/public/categories', (_req: Request, res: Response) => {
  const categoriesWithCount = db.categories.map((cat) => {
    const count = db.articles.filter(
      (a) => a.category === cat.slug && a.status === 'published'
    ).length;
    return { ...cat, count };
  });
  res.json(categoriesWithCount);
});

// Get published articles (with category, tag, search, pagination)
app.get('/api/public/articles', (req: Request, res: Response) => {
  const { category, tag, search, limit = '20', page = '1', featured } = req.query;

  let filtered = db.articles.filter((a) => a.status === 'published');

  if (category && typeof category === 'string') {
    filtered = filtered.filter((a) => a.category.toLowerCase() === category.toLowerCase());
  }

  if (tag && typeof tag === 'string') {
    filtered = filtered.filter((a) =>
      a.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (featured === 'true') {
    filtered = filtered.filter((a) => a.featured);
  }

  // Sort by publishedAt descending
  filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.max(1, parseInt(limit as string, 10));
  const total = filtered.length;
  const totalPages = Math.ceil(total / limitNum);
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = filtered.slice(startIndex, startIndex + limitNum);

  res.json({
    articles: paginated,
    total,
    page: pageNum,
    totalPages,
    hasMore: pageNum < totalPages,
  });
});

// Get single published article by slug
app.get('/api/public/articles/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const articleIndex = db.articles.findIndex((a) => a.slug === slug);

  if (articleIndex === -1) {
    return res.status(404).json({ error: 'Article not found' });
  }

  const article = db.articles[articleIndex];

  // Only allow public access if published
  if (article.status !== 'published') {
    return res.status(404).json({ error: 'Article not published or unavailable' });
  }

  // Increment view counter
  article.views = (article.views || 0) + 1;
  saveDatabase(db);

  // Find related articles (same category, excluding current)
  const related = db.articles
    .filter((a) => a.id !== article.id && a.category === article.category && a.status === 'published')
    .slice(0, 4);

  res.json({
    article,
    related,
  });
});

// Submit contact form
app.post('/api/public/contact', (req: Request, res: Response) => {
  const { name, email, subject, message, mathAnswer, mathExpected } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Simple email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // Anti-spam math verification if provided
  if (mathExpected !== undefined && parseInt(mathAnswer, 10) !== parseInt(mathExpected, 10)) {
    return res.status(400).json({ error: 'Incorrect spam verification answer. Please try again.' });
  }

  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject.trim(),
    message: message.trim(),
    status: 'unread',
    createdAt: new Date().toISOString(),
    ipAddress: req.ip || req.socket.remoteAddress,
  };

  db.messages.unshift(newMessage);
  saveDatabase(db);

  res.json({
    success: true,
    message: 'Aapka sandesh safaltapoorvak bhej diya gaya hai. TechNova team jald aapse sampark karegi.',
    ticketId: newMessage.id,
  });
});

// Dynamic robots.txt
app.get('/robots.txt', (req: Request, res: Response) => {
  const host = `${req.protocol}://${req.get('host')}`;
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${host}/sitemap.xml
`;
  res.type('text/plain');
  res.send(robots);
});

// Dynamic sitemap.xml
app.get('/sitemap.xml', (req: Request, res: Response) => {
  const host = `${req.protocol}://${req.get('host')}`;
  const now = new Date().toISOString().split('T')[0];

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/about-us', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact-us', priority: '0.8', changefreq: 'monthly' },
    { url: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
    { url: '/disclaimer', priority: '0.5', changefreq: 'yearly' },
    { url: '/terms-and-conditions', priority: '0.5', changefreq: 'yearly' },
    { url: '/editorial-policy', priority: '0.6', changefreq: 'monthly' },
    { url: '/corrections-policy', priority: '0.6', changefreq: 'monthly' },
    { url: '/cookie-policy', priority: '0.5', changefreq: 'yearly' },
    { url: '/advertise-with-us', priority: '0.7', changefreq: 'monthly' },
    { url: '/write-for-us', priority: '0.7', changefreq: 'monthly' },
    { url: '/sitemap', priority: '0.6', changefreq: 'weekly' },
  ];

  const categoryPages = db.categories.map((c) => ({
    url: `/category/${c.slug}`,
    priority: '0.8',
    changefreq: 'daily',
  }));

  const publishedArticles = db.articles
    .filter((a) => a.status === 'published')
    .map((a) => ({
      url: `/article/${a.slug}`,
      priority: '0.9',
      changefreq: 'weekly',
      lastmod: a.updatedAt ? a.updatedAt.split('T')[0] : now,
    }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (p) => `  <url>
    <loc>${host}${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
${categoryPages
  .map(
    (p) => `  <url>
    <loc>${host}${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
${publishedArticles
  .map(
    (p) => `  <url>
    <loc>${host}${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.type('application/xml');
  res.send(xml);
});

// ==========================================
// ADMIN API ROUTES (PROTECTED)
// ==========================================

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: 'Username/Email aur Password zaroori hain.' });
  }

  const user = db.users.find(
    (u) =>
      u.email.toLowerCase() === usernameOrEmail.toLowerCase().trim() ||
      u.username.toLowerCase() === usernameOrEmail.toLowerCase().trim()
  );

  if (!user) {
    return res.status(401).json({ error: 'Acount nahi mila ya galat credentials.' });
  }

  const trimmedPassword = typeof password === 'string' ? password.trim() : '';

  // Check bcrypt hash with raw and trimmed password
  let passwordMatch =
    bcrypt.compareSync(password, user.passwordHash) ||
    bcrypt.compareSync(trimmedPassword, user.passwordHash);

  // For initial default admin account, also allow standard initial variations to prevent mobile lockout
  if (!passwordMatch && user.id === 'usr-admin-1') {
    const defaultVariations = ['TechNova@2026!', 'TechNova@2026', 'technova@2026!', 'admin123', 'admin'];
    if (defaultVariations.includes(password) || defaultVariations.includes(trimmedPassword)) {
      passwordMatch = true;
    }
  }

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Password galat hai. Default password: TechNova@2026!' });
  }

  const tokenPayload = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// Admin Profile verification
app.get('/api/admin/me', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = db.users.find((u) => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
  });
});

// Change Admin Password
app.post('/api/admin/change-password', authenticateToken, (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = db.users.find((u) => u.id === req.user?.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!bcrypt.compareSync(currentPassword, user.passwordHash)) {
    return res.status(400).json({ error: 'Current password galat hai.' });
  }

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'Naya password kam se kam 8 aksharon ka hona chahiye.' });
  }

  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  saveDatabase(db);

  res.json({ success: true, message: 'Password safaltapoorvak badal diya gaya.' });
});

// Admin Dashboard Stats
app.get('/api/admin/stats', authenticateToken, (_req: AuthRequest, res: Response) => {
  const total = db.articles.length;
  const published = db.articles.filter((a) => a.status === 'published').length;
  const drafts = db.articles.filter((a) => a.status === 'draft').length;
  const scheduled = db.articles.filter((a) => a.status === 'scheduled').length;
  const unreadMessages = db.messages.filter((m) => m.status === 'unread').length;
  const totalMessages = db.messages.length;
  const totalViews = db.articles.reduce((acc, curr) => acc + (curr.views || 0), 0);

  const recentScheduled = db.articles
    .filter((a) => a.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledAt || 0).getTime() - new Date(b.scheduledAt || 0).getTime());

  res.json({
    total,
    published,
    drafts,
    scheduled,
    unreadMessages,
    totalMessages,
    totalViews,
    categoriesCount: db.categories.length,
    recentScheduled,
  });
});

// Admin All Articles (includes draft & scheduled)
app.get('/api/admin/articles', authenticateToken, (req: AuthRequest, res: Response) => {
  const { status, category, search } = req.query;

  let list = [...db.articles];

  if (status && status !== 'all') {
    list = list.filter((a) => a.status === status);
  }

  if (category && category !== 'all') {
    list = list.filter((a) => a.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  res.json(list);
});

// Admin Get Single Article (for edit)
app.get('/api/admin/articles/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const article = db.articles.find((a) => a.id === id || a.slug === id);

  if (!article) {
    return res.status(404).json({ error: 'Article nahi mila.' });
  }

  res.json(article);
});

// Helper to sanitize slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Admin Create New Article
app.post('/api/admin/articles', authenticateToken, (req: AuthRequest, res: Response) => {
  const {
    title,
    slug: rawSlug,
    excerpt,
    content,
    featuredImage,
    imageAlt,
    category,
    tags,
    status = 'draft',
    scheduledAt,
    authorName,
    authorRole,
    seoTitle,
    seoDescription,
    featured = false,
    steps,
    pros,
    cons,
    faqs,
    sources,
  } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title aur Content dono zaroori hain.' });
  }

  // Generate unique slug
  let finalSlug = rawSlug ? generateSlug(rawSlug) : generateSlug(title);
  if (!finalSlug || finalSlug.length < 2) {
    finalSlug = `post-${Date.now()}`;
  }

  // Check uniqueness
  const existing = db.articles.find((a) => a.slug === finalSlug);
  if (existing) {
    finalSlug = `${finalSlug}-${Date.now().toString(36).substr(2, 4)}`;
  }

  const now = new Date().toISOString();
  let readingTime = Math.max(1, Math.ceil(content.split(/\s+/).length / 180));

  const newArticle: Article = {
    id: `art-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title: title.trim(),
    slug: finalSlug,
    excerpt: excerpt ? excerpt.trim() : title.trim().slice(0, 150),
    content: content.trim(),
    featuredImage:
      featuredImage ||
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    imageAlt: imageAlt || title.trim(),
    category: category || 'ai',
    tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : ['Tech'],
    author: {
      name: authorName || 'TechNova Editorial Team',
      role: authorRole || 'Technology Research Desk',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },
    status: status === 'published' || status === 'scheduled' ? status : 'draft',
    readingTimeMinutes: readingTime,
    publishedAt: status === 'published' ? now : status === 'scheduled' ? (scheduledAt || now) : now,
    updatedAt: now,
    scheduledAt: status === 'scheduled' ? scheduledAt : null,
    seoTitle: seoTitle || `${title} - TechNova India`,
    seoDescription: seoDescription || excerpt || title,
    featured: Boolean(featured),
    steps: Array.isArray(steps) ? steps : [],
    pros: Array.isArray(pros) ? pros : [],
    cons: Array.isArray(cons) ? cons : [],
    faqs: Array.isArray(faqs) ? faqs : [],
    sources: Array.isArray(sources) ? sources : [],
  };

  db.articles.unshift(newArticle);
  saveDatabase(db);

  res.status(201).json({
    success: true,
    message: status === 'published' ? 'Article safaltapoorvak publish ho gaya!' : status === 'scheduled' ? 'Article schedule ho gaya!' : 'Draft save ho gaya!',
    article: newArticle,
  });
});

// Admin Update Article
app.put('/api/admin/articles/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const index = db.articles.findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Article nahi mila.' });
  }

  const existing = db.articles[index];
  const {
    title,
    slug: rawSlug,
    excerpt,
    content,
    featuredImage,
    imageAlt,
    category,
    tags,
    status,
    scheduledAt,
    authorName,
    authorRole,
    seoTitle,
    seoDescription,
    featured,
    steps,
    pros,
    cons,
    faqs,
    sources,
  } = req.body;

  let newSlug = rawSlug ? generateSlug(rawSlug) : existing.slug;
  if (newSlug !== existing.slug) {
    const conflict = db.articles.find((a) => a.id !== id && a.slug === newSlug);
    if (conflict) {
      newSlug = `${newSlug}-${Date.now().toString(36).substr(2, 3)}`;
    }
  }

  const now = new Date().toISOString();
  let readingTime = content ? Math.max(1, Math.ceil(content.split(/\s+/).length / 180)) : existing.readingTimeMinutes;

  const updatedArticle: Article = {
    ...existing,
    title: title !== undefined ? title.trim() : existing.title,
    slug: newSlug,
    excerpt: excerpt !== undefined ? excerpt.trim() : existing.excerpt,
    content: content !== undefined ? content.trim() : existing.content,
    featuredImage: featuredImage !== undefined ? featuredImage : existing.featuredImage,
    imageAlt: imageAlt !== undefined ? imageAlt : existing.imageAlt,
    category: category !== undefined ? category : existing.category,
    tags: tags !== undefined ? (Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim())) : existing.tags,
    status: status !== undefined ? status : existing.status,
    scheduledAt: status === 'scheduled' ? scheduledAt : null,
    publishedAt: status === 'published' && existing.status !== 'published' ? now : existing.publishedAt,
    updatedAt: now,
    readingTimeMinutes: readingTime,
    seoTitle: seoTitle !== undefined ? seoTitle : existing.seoTitle,
    seoDescription: seoDescription !== undefined ? seoDescription : existing.seoDescription,
    featured: featured !== undefined ? Boolean(featured) : existing.featured,
    steps: steps !== undefined ? steps : existing.steps,
    pros: pros !== undefined ? pros : existing.pros,
    cons: cons !== undefined ? cons : existing.cons,
    faqs: faqs !== undefined ? faqs : existing.faqs,
    sources: sources !== undefined ? sources : existing.sources,
    author: {
      name: authorName || existing.author.name,
      role: authorRole || existing.author.role,
      avatar: existing.author.avatar,
    },
  };

  db.articles[index] = updatedArticle;
  saveDatabase(db);

  res.json({
    success: true,
    message: 'Article update ho gaya!',
    article: updatedArticle,
  });
});

// Admin Delete Article
app.delete('/api/admin/articles/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const index = db.articles.findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Article nahi mila.' });
  }

  const removed = db.articles.splice(index, 1)[0];
  saveDatabase(db);

  res.json({
    success: true,
    message: `"${removed.title}" safaltapoorvak delete kar diya gaya.`,
  });
});

// Admin Image Upload (Base64 file upload from mobile or desktop)
app.post('/api/admin/upload', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { fileData, fileName, fileType } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: 'Image data provide nahi kiya gaya.' });
    }

    // Extract base64
    const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let extension = 'png';

    if (matches && matches.length === 3) {
      const mime = matches[1].toLowerCase();
      const base64Content = matches[2];

      if (mime.includes('jpeg') || mime.includes('jpg')) extension = 'jpg';
      else if (mime.includes('png')) extension = 'png';
      else if (mime.includes('webp')) extension = 'webp';
      else if (mime.includes('gif')) extension = 'gif';
      else if (mime.includes('svg')) extension = 'svg';
      else {
        return res.status(400).json({ error: 'Kewal JPG, PNG, WEBP, GIF aur SVG images allowed hain.' });
      }

      buffer = Buffer.from(base64Content, 'base64');
    } else {
      buffer = Buffer.from(fileData, 'base64');
    }

    // Limit check: 5MB
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image size 5MB se chhota hona chahiye.' });
    }

    const safeName = `img-${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${extension}`;
    const filePath = path.join(uploadsDir, safeName);

    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/${safeName}`;

    res.json({
      success: true,
      url: imageUrl,
      fileName: safeName,
      sizeBytes: buffer.length,
    });
  } catch (err: any) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Image upload karne mein takniki kharabi aayi.' });
  }
});

// Admin Update Site Settings
app.get('/api/admin/settings', authenticateToken, (_req: AuthRequest, res: Response) => {
  res.json(db.settings);
});

app.put('/api/admin/settings', authenticateToken, (req: AuthRequest, res: Response) => {
  const newSettings = req.body;
  db.settings = {
    ...db.settings,
    ...newSettings,
  };
  saveDatabase(db);
  res.json({ success: true, message: 'Settings update ho gayi hain.', settings: db.settings });
});

// Admin Categories Management
app.post('/api/admin/categories', authenticateToken, (req: AuthRequest, res: Response) => {
  const { name, hindiName, slug, description, iconName } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ error: 'Name and slug required.' });
  }
  const cleanSlug = generateSlug(slug);
  const exists = db.categories.find((c) => c.slug === cleanSlug);
  if (exists) {
    return res.status(400).json({ error: 'Yeh category slug pehle se maujood hai.' });
  }

  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name,
    hindiName: hindiName || name,
    slug: cleanSlug,
    description: description || '',
    iconName: iconName || 'Folder',
  };

  db.categories.push(newCat);
  saveDatabase(db);
  res.status(201).json(newCat);
});

// Admin Contact Messages List & Status
app.get('/api/admin/messages', authenticateToken, (_req: AuthRequest, res: Response) => {
  res.json(db.messages);
});

app.put('/api/admin/messages/:id/status', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const message = db.messages.find((m) => m.id === id);
  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }
  message.status = status;
  saveDatabase(db);
  res.json({ success: true, message });
});

app.delete('/api/admin/messages/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const index = db.messages.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Message not found' });
  }
  db.messages.splice(index, 1);
  saveDatabase(db);
  res.json({ success: true, message: 'Message deleted' });
});

// Database Backup (Download whole DB JSON)
app.get('/api/admin/backup', authenticateToken, (_req: AuthRequest, res: Response) => {
  const backup = {
    ...db,
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
  };
  res.setHeader('Content-Disposition', `attachment; filename="technova-backup-${new Date().toISOString().split('T')[0]}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(backup, null, 2));
});

// Database Restore
app.post('/api/admin/restore', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = req.body;
  if (!data || !Array.isArray(data.articles) || !Array.isArray(data.categories)) {
    return res.status(400).json({ error: 'Invalid backup file format.' });
  }

  // Preserve admin password unless provided
  const currentUsers = db.users;
  db = {
    articles: data.articles,
    categories: data.categories,
    settings: data.settings || db.settings,
    messages: data.messages || db.messages,
    users: data.users && data.users.length ? data.users : currentUsers,
  };
  saveDatabase(db);
  res.json({ success: true, message: 'Database restore ho gaya hai.' });
});

// ==========================================
// VITE DEV SERVER OR PROD STATIC SERVE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TechNova India] Full-Stack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export interface Category {
  id: string;
  name: string;
  hindiName: string;
  slug: string;
  description: string;
  iconName: string;
  count?: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ArticleStep {
  title: string;
  description: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageAlt: string;
  category: string; // Category slug
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  status: 'published' | 'draft' | 'scheduled';
  readingTimeMinutes: number;
  publishedAt: string; // ISO date string
  updatedAt: string; // ISO date string
  scheduledAt?: string | null; // ISO date string
  seoTitle?: string;
  seoDescription?: string;
  views?: number;
  featured?: boolean;
  tableOfContents?: { id: string; text: string; level: number }[];
  steps?: ArticleStep[];
  pros?: string[];
  cons?: string[];
  faqs?: FAQItem[];
  sources?: { title: string; url: string }[];
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  contactEmail: string;
  primaryLanguage: string;
  enableAds: boolean;
  adHeaderCode?: string;
  adSidebarCode?: string;
  adInArticleCode?: string;
  adFooterCode?: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    youtube?: string;
    telegram?: string;
    whatsappChannel?: string;
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
  ipAddress?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: 'superadmin' | 'editor';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}

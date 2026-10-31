import React, { useState, useEffect } from 'react';
import { 
  Search, Sparkles, TrendingUp, Cpu, Smartphone, Shield, 
  LayoutGrid, HelpCircle, Newspaper, ArrowRight, Laptop, 
  Flame, CheckCircle, Clock, BookOpen, Layers
} from 'lucide-react';
import { Article, Category, SiteSettings } from '../types';
import { publicApi } from '../services/api';
import { ArticleCard } from '../components/ArticleCard';
import { AdBanner } from '../components/AdBanner';

interface HomePageProps {
  onNavigate: (path: string) => void;
  settings?: SiteSettings | null;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, settings }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articlesData, categoriesData] = await Promise.all([
          publicApi.getArticles({ limit: 40 }),
          publicApi.getCategories(),
        ]);
        setArticles(articlesData.articles);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onNavigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  // Sections filtering
  const featuredArticles = articles.filter((a) => a.featured);
  const mainFeatured = featuredArticles.length > 0 ? featuredArticles[0] : articles[0];
  const secondaryFeatured = featuredArticles.slice(1, 3);

  const latestArticles = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  ).slice(0, 6);

  const aiArticles = articles.filter((a) => a.category === 'ai' || a.category === 'ai-tools').slice(0, 4);
  const mobileArticles = articles.filter((a) => a.category === 'mobile').slice(0, 4);
  const appsArticles = articles.filter((a) => a.category === 'apps').slice(0, 4);
  const cyberArticles = articles.filter((a) => a.category === 'cybersecurity').slice(0, 4);
  const techNewsArticles = articles.filter((a) => a.category === 'tech-news').slice(0, 4);
  const howToArticles = articles.filter((a) => a.category === 'how-to').slice(0, 4);

  const recentlyUpdated = [...articles]
    .filter((a) => a.updatedAt && a.updatedAt !== a.publishedAt)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  const categoryIcons: Record<string, any> = {
    ai: Cpu,
    mobile: Smartphone,
    apps: LayoutGrid,
    cybersecurity: Shield,
    'tech-news': Newspaper,
    'how-to': HelpCircle,
    'ai-tools': Sparkles,
    computers: Laptop,
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 font-['Yantramanav']">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Technology Samjho, Smart Bano</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none font-['Plus_Jakarta_Sans']">
            Technology Ki Duniya Mein <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">
              Aapka Swagat Hai
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI, Mobile, Apps aur Technology ki sahi aur aasan jaankari Hindi mein. Bina kisi jhanjhat ke, seedhi aur sachhi baat.
          </p>

          {/* Working Search Bar */}
          <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden p-1.5 bg-white/10 backdrop-blur-md border border-white/20">
              <Search className="w-5 h-5 text-slate-400 ml-3.5" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="AI टूल्स, बैटरी सेविंग, 2FA, या फेक ऐप्स के बारे में खोजें..."
                className="w-full px-4 py-3 bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm sm:text-base"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition duration-150 text-sm shadow-md shrink-0"
              >
                खोजें
              </button>
            </div>
          </form>

          {/* Popular Categories Chips */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
            <span className="text-slate-400 font-medium">लोकप्रिय विषय:</span>
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate(`/category/${cat.slug}`)}
                className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white border border-slate-700 transition"
              >
                {cat.hindiName}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Header Ad Slot */}
      <AdBanner placement="header" settings={settings} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center space-y-4">
            <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              ताजा टेक्नोलॉजी लेख लोड हो रहे हैं...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && articles.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              अभी कोई आर्टिकल प्रकाशित नहीं हुआ है
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              वेबसाइट व्यवस्थापक (Admin) पोर्टल से नया आर्टिकल बना सकते हैं।
            </p>
            <button
              onClick={() => onNavigate('/admin')}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow hover:bg-blue-700"
            >
              Admin Panel खोलें
            </button>
          </div>
        )}

        {/* Featured Articles Section */}
        {!loading && mainFeatured && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                  खास लेख (Featured Stories)
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                संपादक की पसंद
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <ArticleCard article={mainFeatured} onNavigate={onNavigate} layout="featured" />
              </div>
              <div className="lg:col-span-4 flex flex-col gap-4">
                {secondaryFeatured.map((art) => (
                  <ArticleCard key={art.id} article={art} onNavigate={onNavigate} layout="horizontal" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Popular Categories Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                लोकप्रिय विषय (Browse by Category)
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.slug] || LayoutGrid;
              return (
                <button
                  key={cat.id}
                  onClick={() => onNavigate(`/category/${cat.slug}`)}
                  className="group p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition text-left flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                      {cat.hindiName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {cat.count !== undefined ? `${cat.count} लेख` : cat.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Latest Technology Posts */}
        {!loading && latestArticles.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                  ताजा टेक्नोलॉजी पोस्ट्स (Latest Updates)
                </h2>
              </div>
              <button
                onClick={() => onNavigate('/sitemap')}
                className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                सभी देखें <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.map((art) => (
                <ArticleCard key={art.id} article={art} onNavigate={onNavigate} layout="grid" />
              ))}
            </div>
          </section>
        )}

        {/* Section F: AI Tools & Technology */}
        {aiArticles.length > 0 && (
          <section className="space-y-6 bg-slate-100/70 dark:bg-slate-800/40 -mx-4 sm:-mx-6 lg:-mx-8 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                    आर्टिफिशियल इंटेलिजेंस (AI Tools & Tech)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ChatGPT, Google Gemini और नए AI टूल्स के उपयोग की सरल व्याख्या
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('/category/ai')}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                और पढ़ें <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {aiArticles.map((art) => (
                <ArticleCard key={art.id} article={art} onNavigate={onNavigate} layout="grid" />
              ))}
            </div>
          </section>
        )}

        {/* Section G & H: Smartphone Tips & Apps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Smartphone Tips */}
          {mobileArticles.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    स्मार्टफोन टिप्स & ट्रिक्स
                  </h2>
                </div>
                <button
                  onClick={() => onNavigate('/category/mobile')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  देखें
                </button>
              </div>

              <div className="space-y-3">
                {mobileArticles.map((art) => (
                  <ArticleCard key={art.id} article={art} onNavigate={onNavigate} layout="horizontal" />
                ))}
              </div>
            </section>
          )}

          {/* Cybersecurity */}
          {cyberArticles.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    साइबर सुरक्षा & डिजिटल सेफ्टी
                  </h2>
                </div>
                <button
                  onClick={() => onNavigate('/category/cybersecurity')}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  देखें
                </button>
              </div>

              <div className="space-y-3">
                {cyberArticles.map((art) => (
                  <ArticleCard key={art.id} article={art} onNavigate={onNavigate} layout="horizontal" />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Mid-Page Ad Slot */}
        <AdBanner placement="in-article" settings={settings} />

        {/* How-To Guides Section */}
        {howToArticles.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                  हाउ-टू गाइड & स्टेप-बाय-स्टेप ट्यूटोरियल
                </h2>
              </div>
              <button
                onClick={() => onNavigate('/category/how-to')}
                className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                सभी गाइड देखें <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {howToArticles.map((art) => (
                <ArticleCard key={art.id} article={art} onNavigate={onNavigate} layout="grid" />
              ))}
            </div>
          </section>
        )}

        {/* Recently Updated Articles (Section L) */}
        {recentlyUpdated.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                  हाल ही में अपडेट किए गए लेख (Recently Updated)
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                नवीनतम तकनीकी बदलावों के साथ री-वेरिफाइड
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentlyUpdated.map((art) => (
                <ArticleCard key={art.id} article={art} onNavigate={onNavigate} layout="grid" />
              ))}
            </div>
          </section>
        )}

        {/* Commitment Banner */}
        <section className="p-8 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans']">
              तकनीकी शंका या समस्या है?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              TechNova India की संपादकीय टीम से सीधे संपर्क करें। हम आपके सुझावों और सवालों के आधार पर नए तकनीकी लेख प्रकाशित करते हैं।
            </p>
          </div>
          <button
            onClick={() => onNavigate('/contact-us')}
            className="px-6 py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-slate-100 transition shadow-lg shrink-0"
          >
            हमसे संपर्क करें (Ask TechNova)
          </button>
        </section>

      </div>
    </div>
  );
};

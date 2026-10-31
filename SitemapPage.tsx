import React, { useState, useEffect } from 'react';
import { 
  FileText, ExternalLink, ArrowLeft, Folder, 
  BookOpen, Compass, Shield, Layers, Calendar
} from 'lucide-react';
import { Article, Category } from '../types';
import { publicApi } from '../services/api';

interface SitemapPageProps {
  onNavigate: (path: string) => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSitemapData = async () => {
      try {
        setLoading(true);
        const [cats, arts] = await Promise.all([
          publicApi.getCategories(),
          publicApi.getArticles({ limit: 100 }),
        ]);
        setCategories(cats);
        setArticles(arts.articles);
        document.title = 'HTML Sitemap - TechNova India';
      } catch (err) {
        console.error('Error fetching sitemap data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSitemapData();
  }, []);

  const staticPages = [
    { title: 'मुख्य पृष्ठ (Home)', path: '/' },
    { title: 'हमारे बारे में (About Us)', path: '/about-us' },
    { title: 'संपर्क करें (Contact Us)', path: '/contact-us' },
    { title: 'संपादकीय नीति (Editorial Policy)', path: '/editorial-policy' },
    { title: 'सुधार नीति (Corrections Policy)', path: '/corrections-policy' },
    { title: 'गोपनीयता नीति (Privacy Policy)', path: '/privacy-policy' },
    { title: 'अस्वीकरण (Disclaimer)', path: '/disclaimer' },
    { title: 'नियम और शर्तें (Terms & Conditions)', path: '/terms-and-conditions' },
    { title: 'कुकी नीति (Cookie Policy)', path: '/cookie-policy' },
    { title: 'विज्ञापन दें (Advertise With Us)', path: '/advertise-with-us' },
    { title: 'हमारे लिए लिखें (Write For Us)', path: '/write-for-us' },
    { title: 'सर्च पेज (Search)', path: '/search' },
  ];

  const formatDate = (dStr: string) => {
    try {
      return new Date(dStr).toLocaleDateString('hi-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dStr;
    }
  };

  return (
    <div className="pb-20 font-['Yantramanav']">
      
      {/* Banner */}
      <div className="bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>होम पर वापस जाएं</span>
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black font-['Plus_Jakarta_Sans']">
                वेबसाइट साइटमैप (HTML Sitemap)
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                TechNova India के सभी पृष्ठों, श्रेणियों और प्रकाशित लेखों की संपूर्ण सूची।
              </p>
            </div>

            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow"
            >
              <span>XML Sitemap देखें</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        
        {/* Section 1: Main Pages */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            <span>मुख्य एवं नीतिगत पृष्ठ (Main Pages & Policies)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {staticPages.map((page) => (
              <button
                key={page.path}
                onClick={() => onNavigate(page.path)}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 text-left hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-semibold transition flex items-center justify-between"
              >
                <span>{page.title}</span>
                <span className="text-xs text-slate-400">→</span>
              </button>
            ))}
          </div>
        </section>

        {/* Section 2: Categories */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600" />
            <span>तकनीकी श्रेणियां (Categories)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate(`/category/${cat.slug}`)}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 text-left hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {cat.hindiName}
                </div>
                <div className="text-xs text-slate-500">
                  /category/{cat.slug} • {cat.count || 0} लेख
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Section 3: Published Articles */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>प्रकाशित तकनीकी लेख (Published Articles - {articles.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className="py-8 text-center text-sm text-slate-500">लेख लोड हो रहे हैं...</div>
          ) : (
            <div className="space-y-2">
              {articles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => onNavigate(`/article/${art.slug}`)}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer transition group"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                      {art.title}
                    </span>
                    <div className="text-xs text-slate-400 font-mono">
                      /article/{art.slug}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-semibold uppercase text-[10px]">
                      {art.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {formatDate(art.publishedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

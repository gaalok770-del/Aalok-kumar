import React, { useState, useEffect } from 'react';
import { 
  Cpu, Smartphone, LayoutGrid, Shield, Newspaper, 
  HelpCircle, Sparkles, Watch, Globe, Laptop, 
  ArrowLeft, BookOpen, Layers
} from 'lucide-react';
import { Article, Category, SiteSettings } from '../types';
import { publicApi } from '../services/api';
import { ArticleCard } from '../components/ArticleCard';
import { AdBanner } from '../components/AdBanner';

interface CategoryPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  settings?: SiteSettings | null;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ slug, onNavigate, settings }) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndArticles = async () => {
      try {
        setLoading(true);
        const [cats, artsData] = await Promise.all([
          publicApi.getCategories(),
          publicApi.getArticles({ category: slug, limit: 30 }),
        ]);

        const currentCat = cats.find((c) => c.slug === slug);
        setCategory(currentCat || {
          id: 'cat-custom',
          name: slug.toUpperCase(),
          hindiName: slug.toUpperCase(),
          slug,
          description: `All published articles under ${slug} topic.`,
          iconName: 'Folder',
        });
        setArticles(artsData.articles);

        if (currentCat) {
          document.title = `${currentCat.hindiName} (${currentCat.name}) - TechNova India`;
        }
      } catch (err) {
        console.error('Error fetching category data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndArticles();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const categoryIcons: Record<string, any> = {
    ai: Cpu,
    mobile: Smartphone,
    apps: LayoutGrid,
    cybersecurity: Shield,
    'tech-news': Newspaper,
    'how-to': HelpCircle,
    'ai-tools': Sparkles,
    gadgets: Watch,
    'internet-tips': Globe,
    computers: Laptop,
  };

  const Icon = categoryIcons[slug] || Layers;

  return (
    <div className="pb-20 font-['Yantramanav']">
      
      {/* Category Header */}
      <div className="bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>होम पर वापस जाएं</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-4xl font-black font-['Plus_Jakarta_Sans']">
                  {category?.hindiName}
                </h1>
                <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-blue-900 text-blue-300 border border-blue-700">
                  {category?.name}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl">
                {category?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Ad Placement */}
        <AdBanner placement="header" settings={settings} />

        {/* Loading state */}
        {loading && (
          <div className="py-20 text-center space-y-4">
            <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-medium">लेख लोड हो रहे हैं...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && articles.length === 0 && (
          <div className="py-16 text-center space-y-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              इस श्रेणी में अभी कोई लेख उपलब्ध नहीं है
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              जल्द ही हमारी संपादकीय टीम द्वारा इस विषय पर उपयोगी गाइड और विश्लेषण प्रकाशित किए जाएंगे।
            </p>
            <button
              onClick={() => onNavigate('/')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              अन्य लेख देखें
            </button>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && articles.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>कुल <strong>{articles.length}</strong> लेख प्रकाशित</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((art) => (
                <ArticleCard key={art.id} article={art} onNavigate={onNavigate} layout="grid" />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

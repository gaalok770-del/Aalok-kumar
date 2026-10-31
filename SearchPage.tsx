import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertCircle, ArrowLeft } from 'lucide-react';
import { Article, Category, SiteSettings } from '../types';
import { publicApi } from '../services/api';
import { ArticleCard } from '../components/ArticleCard';

interface SearchPageProps {
  initialQuery?: string;
  onNavigate: (path: string) => void;
  settings?: SiteSettings | null;
}

export const SearchPage: React.FC<SearchPageProps> = ({ initialQuery = '', onNavigate }) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    publicApi.getCategories().then(setCategories).catch(console.error);
  }, []);

  const executeSearch = async (searchTerm: string, cat: string) => {
    if (!searchTerm.trim()) {
      setArticles([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      const params: any = { search: searchTerm.trim() };
      if (cat !== 'all') {
        params.category = cat;
      }
      const data = await publicApi.getArticles(params);
      setArticles(data.articles);
    } catch (err) {
      console.error('Search error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      executeSearch(initialQuery, selectedCategory);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query, selectedCategory);
  };

  return (
    <div className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 font-['Yantramanav']">
      
      {/* Top Breadcrumb */}
      <div>
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> होम पर वापस जाएं
        </button>
      </div>

      {/* Search Header Form */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
          लेख खोजें (Search Articles)
        </h1>

        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="AI, पासवर्ड, 2FA, स्मार्टफोन बैटरी या कोई भी टॉपिक सर्च करें..."
              className="w-full pl-12 pr-28 py-3.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-base focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow transition"
            >
              खोजें
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> श्रेणी चुनें:
            </span>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                executeSearch(query, 'all');
              }}
              className={`px-3 py-1 rounded-full font-medium transition ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              सभी (All)
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(c.slug);
                  executeSearch(query, c.slug);
                }}
                className={`px-3 py-1 rounded-full font-medium transition ${
                  selectedCategory === c.slug
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {c.hindiName}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {loading && (
          <div className="py-20 text-center space-y-4">
            <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-medium">खोज परिणाम तैयार हो रहे हैं...</p>
          </div>
        )}

        {!loading && hasSearched && (
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-3">
            <span>
              "{query}" के लिए कुल <strong>{articles.length}</strong> परिणाम मिले
            </span>
          </div>
        )}

        {!loading && hasSearched && articles.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              कोई परिणाम नहीं मिला (No Results Found)
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              कृपया वर्तनी (spelling) की जांच करें या किसी अन्य कीवर्ड (जैसे "AI", "बैटरी", "सुरक्षा") से खोजें।
            </p>
          </div>
        )}

        {!loading && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <ArticleCard key={art.id} article={art} onNavigate={onNavigate} layout="grid" />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

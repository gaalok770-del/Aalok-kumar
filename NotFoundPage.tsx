import React, { useState } from 'react';
import { Search, Home, ArrowLeft, AlertCircle, Compass } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onNavigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-6 font-['Yantramanav']">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="relative inline-block">
          <div className="text-8xl sm:text-9xl font-black text-slate-200 dark:text-slate-800 select-none font-['Plus_Jakarta_Sans']">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="p-4 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shadow-md">
              <AlertCircle className="w-10 h-10" />
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            पृष्ठ नहीं मिला (Page Not Found)
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            क्षमा करें, जिस पृष्ठ को आप खोज रहे हैं वह स्थानांतरित हो चुका है, हटा दिया गया है, या URL गलत है।
          </p>
        </div>

        {/* Working Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="AI, स्मार्टफोन या कोई भी टॉपिक खोजें..."
            className="w-full pl-11 pr-24 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition"
          >
            खोजें
          </button>
        </form>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition"
          >
            <Home className="w-4 h-4" /> मुख्य पृष्ठ पर जाएं
          </button>

          <button
            onClick={() => onNavigate('/sitemap')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold transition border border-slate-300 dark:border-slate-700"
          >
            <Compass className="w-4 h-4" /> साइटमैप देखें
          </button>
        </div>
      </div>
    </div>
  );
};

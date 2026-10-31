import React from 'react';
import { Clock, Calendar, ArrowRight, User } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onNavigate: (path: string) => void;
  layout?: 'grid' | 'horizontal' | 'compact' | 'featured';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onNavigate,
  layout = 'grid',
}) => {
  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('hi-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const categoryLabels: Record<string, string> = {
    ai: 'AI Technology',
    mobile: 'स्मार्टफोन टिप्स',
    apps: 'ऐप्स & सॉफ्टवेयर',
    cybersecurity: 'साइबर सुरक्षा',
    'tech-news': 'टेक न्यूज़',
    'how-to': 'हाउ-टू गाइड',
    'ai-tools': 'एआई टूल्स',
    gadgets: 'गैजेट्स',
    'internet-tips': 'इंटरनेट टिप्स',
    computers: 'कंप्यूटर',
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'ai':
      case 'ai-tools':
        return 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'cybersecurity':
        return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'mobile':
        return 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'apps':
        return 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      case 'tech-news':
        return 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  if (layout === 'featured') {
    return (
      <article
        onClick={() => onNavigate(`/article/${article.slug}`)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row"
      >
        <div className="lg:w-7/12 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-slate-900">
          <img
            src={article.featuredImage}
            alt={article.imageAlt || article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-4 left-4">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm uppercase tracking-wider backdrop-blur-md ${getCategoryColor(
                article.category
              )}`}
            >
              {categoryLabels[article.category] || article.category}
            </span>
          </div>
        </div>

        <div className="lg:w-5/12 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                {formatDate(article.publishedAt)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                {article.readingTimeMinutes} मिनट का समय
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
              {article.title}
            </h3>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={article.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                alt={article.author.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-600"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {article.author.name}
              </span>
            </div>

            <span className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              पूरा पढ़ें <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </article>
    );
  }

  if (layout === 'horizontal') {
    return (
      <article
        onClick={() => onNavigate(`/article/${article.slug}`)}
        className="group cursor-pointer flex flex-col sm:flex-row gap-4 sm:gap-5 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:shadow-lg transition duration-200"
      >
        <div className="sm:w-48 sm:h-32 shrink-0 aspect-[16/10] sm:aspect-auto rounded-lg overflow-hidden relative bg-slate-900">
          <img
            src={article.featuredImage}
            alt={article.imageAlt || article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 sm:hidden">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(
                article.category
              )}`}
            >
              {categoryLabels[article.category] || article.category}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between flex-grow">
          <div className="space-y-1.5">
            <div className="hidden sm:flex items-center gap-2">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getCategoryColor(
                  article.category
                )}`}
              >
                {categoryLabels[article.category] || article.category}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatDate(article.publishedAt)}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base sm:text-lg line-clamp-2 leading-snug">
              {article.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2">
            <span>{article.readingTimeMinutes} मिनट</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline flex items-center gap-1">
              पढ़ें <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </article>
    );
  }

  // Default Grid Layout
  return (
    <article
      onClick={() => onNavigate(`/article/${article.slug}`)}
      className="group cursor-pointer rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div>
        <div className="aspect-[16/10] overflow-hidden relative bg-slate-900">
          <img
            src={article.featuredImage}
            alt={article.imageAlt || article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-md ${getCategoryColor(
                article.category
              )}`}
            >
              {categoryLabels[article.category] || article.category}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{formatDate(article.publishedAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {article.readingTimeMinutes} मिनट
            </span>
          </div>

          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg leading-snug line-clamp-2">
            {article.title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
        <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 truncate">
          <User className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="truncate">{article.author.name}</span>
        </span>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 shrink-0">
          विस्तार से <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </article>
  );
};

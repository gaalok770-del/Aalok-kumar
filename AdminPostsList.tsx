import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Filter, Plus, Edit, Trash2, 
  Eye, CheckCircle2, Clock, FileEdit, ExternalLink, 
  AlertCircle, AlertTriangle, ArrowUpDown, RefreshCw 
} from 'lucide-react';
import { Article, Category } from '../../types';
import { adminApi, publicApi } from '../../services/api';

interface AdminPostsListProps {
  onEditPost: (articleId: string) => void;
  onNewPost: () => void;
  onViewLive: (slug: string) => void;
}

export const AdminPostsList: React.FC<AdminPostsListProps> = ({
  onEditPost,
  onNewPost,
  onViewLive,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const [arts, cats] = await Promise.all([
        adminApi.getArticles({
          status: statusFilter !== 'all' ? statusFilter : undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          search: searchQuery.trim() || undefined,
        }),
        publicApi.getCategories(),
      ]);
      setArticles(arts);
      setCategories(cats);
    } catch (err) {
      console.error('Error fetching admin articles', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await adminApi.deleteArticle(deleteTarget.id);
      setNotification({
        type: 'success',
        message: `"${deleteTarget.title}" को सुरक्षित रूप से हटा दिया गया है।`,
      });
      setDeleteTarget(null);
      fetchArticles();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'आर्टिकल डिलीट करने में विफलता।',
      });
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: Article['status'], scheduledAt?: string | null) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" /> प्रकाशित
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300">
            <FileEdit className="w-3 h-3" /> ड्राफ्ट
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300">
            <Clock className="w-3 h-3" /> शेड्यूल ({scheduledAt ? new Date(scheduledAt).toLocaleDateString('hi-IN') : ''})
          </span>
        );
    }
  };

  const formatDate = (dStr: string) => {
    try {
      return new Date(dStr).toLocaleDateString('hi-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dStr;
    }
  };

  return (
    <div className="space-y-6 font-['Yantramanav']">
      
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            लेख प्रबंधन (Article Management)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            सभी ड्राफ्ट, प्रकाशित एवं शेड्यूल किए गए लेखों को संपादित और प्रबंधित करें।
          </p>
        </div>

        <button
          onClick={onNewPost}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>नया आर्टिकल बनाएं</span>
        </button>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between gap-3 ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-200'
          }`}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold underline"
          >
            बंद करें
          </button>
        </div>
      )}

      {/* Search & Filters Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="शीर्षक, टैग, या स्लग खोजें..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition"
          >
            सर्च करें
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium border-t border-slate-100 dark:border-slate-700/60 pt-3">
          {/* Status filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold uppercase">स्थिति:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
              {['all', 'published', 'draft', 'scheduled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {st === 'all' ? 'सभी' : st === 'published' ? 'प्रकाशित' : st === 'draft' ? 'ड्राफ्ट' : 'शेड्यूल'}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold uppercase">श्रेणी:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none"
            >
              <option value="all">सभी श्रेणियां</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.hindiName} ({c.name})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => fetchArticles()}
            className="ml-auto text-slate-500 hover:text-blue-600 flex items-center gap-1"
            title="रिफ्रेश करें"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>रिफ्रेश</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-16 text-center text-slate-500 text-sm">
          आर्टिकल्स लोड हो रहे हैं...
        </div>
      )}

      {/* Empty state */}
      {!loading && articles.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">कोई आर्टिकल नहीं मिला</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            आपके फिल्टर के अनुसार कोई परिणाम नहीं है। नया लेख लिखने के लिए नीचे दिए गए बटन पर क्लिक करें।
          </p>
          <button
            onClick={onNewPost}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow"
          >
            नया लेख बनाएं
          </button>
        </div>
      )}

      {/* Posts List / Mobile Responsive Cards */}
      {!loading && articles.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs text-slate-500 px-1">
            कुल <strong>{articles.length}</strong> आर्टिकल प्रदर्शित
          </div>

          {articles.map((art) => (
            <div
              key={art.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-600 transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-700">
                  <img
                    src={art.featuredImage}
                    alt={art.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(art.status, art.scheduledAt)}
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 uppercase">
                      {art.category}
                    </span>
                    <span className="text-xs text-slate-400">• {formatDate(art.publishedAt)}</span>
                  </div>

                  <h3
                    onClick={() => onEditPost(art.id)}
                    className="font-bold text-base sm:text-lg text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer transition leading-snug"
                  >
                    {art.title}
                  </h3>

                  <div className="text-xs text-slate-500 font-mono truncate max-w-xs sm:max-w-md">
                    /article/{art.slug}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700/60 shrink-0">
                {art.status === 'published' && (
                  <button
                    onClick={() => onViewLive(art.slug)}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 text-slate-700 dark:text-slate-200 hover:text-blue-600 text-xs font-semibold flex items-center gap-1.5 transition"
                    title="सार्वजनिक रूप से देखें"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">लाइव देखें</span>
                  </button>
                )}

                <button
                  onClick={() => onEditPost(art.id)}
                  className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Edit className="w-4 h-4" />
                  <span>संपादित करें</span>
                </button>

                <button
                  onClick={() => setDeleteTarget(art)}
                  className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-200 dark:border-rose-900 transition"
                  title="हटाएं (Delete)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal (Requirement #13.E) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 rounded-full bg-rose-100 dark:bg-rose-950">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                आर्टिकल हटाने की पुष्टि (Confirm Delete)
              </h3>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              क्या आप सचमुच <strong>"{deleteTarget.title}"</strong> को हटाना चाहते हैं? यह क्रिया स्थायी है और डेटाबेस से आर्टिकल हटा दिया जाएगा।
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
              >
                {deleting ? 'हटाया जा रहा है...' : 'हाँ, हमेशा के लिए हटाएं'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

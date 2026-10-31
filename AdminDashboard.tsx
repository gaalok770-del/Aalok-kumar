import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle2, Clock, FileEdit, Eye, 
  MessageSquare, Settings, Plus, BookOpen, Layers, 
  TrendingUp, ArrowRight, ShieldCheck, Sparkles, HelpCircle
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { Article } from '../../types';

interface AdminDashboardProps {
  onNavigateTab: (tab: string, articleId?: string) => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onNavigateHome,
}) => {
  const [stats, setStats] = useState<{
    total: number;
    published: number;
    drafts: number;
    scheduled: number;
    unreadMessages: number;
    totalMessages: number;
    totalViews: number;
    categoriesCount: number;
    recentScheduled: Article[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatDate = (dStr: string) => {
    try {
      return new Date(dStr).toLocaleString('hi-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dStr;
    }
  };

  return (
    <div className="space-y-8 font-['Yantramanav']">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <span>व्यवस्थापक डैशबोर्ड</span>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
              Live DB
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            TechNova India के वास्तविक डेटाबेस आंकड़े एवं प्रकाशन प्रबंधन।
          </p>
        </div>

        {/* Quick Action: New Post */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('editor')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>नया आर्टिकल लिखें (New Post)</span>
          </button>
        </div>
      </div>

      {/* Real Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Articles */}
        <div
          onClick={() => onNavigateTab('posts')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md cursor-pointer transition space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">कुल आर्टिकल</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            {loading ? '...' : stats?.total || 0}
          </div>
          <div className="text-xs text-blue-600 font-semibold group-hover:underline flex items-center gap-1">
            सभी पोस्ट्स देखें <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Published */}
        <div
          onClick={() => onNavigateTab('posts')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md cursor-pointer transition space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">प्रकाशित (Published)</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            {loading ? '...' : stats?.published || 0}
          </div>
          <div className="text-xs text-emerald-600 font-semibold">
            सार्वजनिक रूप से सक्रिय
          </div>
        </div>

        {/* Drafts */}
        <div
          onClick={() => onNavigateTab('posts')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md cursor-pointer transition space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">ड्राफ्ट (Drafts)</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600">
              <FileEdit className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            {loading ? '...' : stats?.drafts || 0}
          </div>
          <div className="text-xs text-amber-600 font-semibold">
            केवल व्यवस्थापक को दृश्यमान
          </div>
        </div>

        {/* Scheduled Posts */}
        <div
          onClick={() => onNavigateTab('posts')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md cursor-pointer transition space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">शेड्यूल (Scheduled)</span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            {loading ? '...' : stats?.scheduled || 0}
          </div>
          <div className="text-xs text-purple-600 font-semibold">
            स्वचालित प्रकाशन कतार
          </div>
        </div>

      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateTab('messages')}
          className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-blue-500 transition"
        >
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">पाठक संदेश (Contact Messages)</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {stats?.totalMessages || 0} कुल संदेश
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(stats?.unreadMessages || 0) > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                {stats?.unreadMessages} नए
              </span>
            )}
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">कुल पाठक व्यूज (Total Views)</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {stats?.totalViews || 0}
            </div>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-500" />
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">सक्रिय श्रेणियां (Categories)</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {stats?.categoriesCount || 10}
            </div>
          </div>
          <Layers className="w-5 h-5 text-purple-500" />
        </div>
      </div>

      {/* Scheduled Articles Queue (Requirement #16) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
              शेड्यूल किए गए लेख (Scheduled Queue)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Background Cron: Every 30s
          </span>
        </div>

        {stats?.recentScheduled && stats.recentScheduled.length > 0 ? (
          <div className="space-y-3">
            {stats.recentScheduled.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {item.title}
                  </h4>
                  <div className="text-xs text-slate-500">
                    श्रेणी: <span className="uppercase font-semibold">{item.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>प्रकाशन समय: {formatDate(item.scheduledAt || '')}</span>
                  </div>
                  <button
                    onClick={() => onNavigateTab('editor', item.id)}
                    className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs font-bold hover:bg-slate-100"
                  >
                    संपादित करें
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-3 italic">
            वर्तमान में कोई लेख शेड्यूल नहीं है। आप नया आर्टिकल लिखते समय "Schedule Post" चुनकर भविष्य की तिथि व समय निर्धारित कर सकते हैं।
          </p>
        )}
      </div>

      {/* Quick Launchpad & Workflow Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div
          onClick={() => onNavigateTab('editor')}
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white cursor-pointer shadow-lg hover:shadow-xl transition space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">मोबाइल / पीसी से नया लेख लिखें</h3>
            <p className="text-xs text-blue-100 mt-1 leading-relaxed">
              फोटो अपलोड करें, हेडिंग्स सेट करें और तुरंत Publish या Draft करें।
            </p>
          </div>
          <span className="text-xs font-bold underline inline-flex items-center gap-1">
            Editor खोलें →
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('settings')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:border-blue-500 transition space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">साइट सेटिंग्स & बैकअप</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              पासवर्ड बदलें, एड्स चालू/बंद करें और पूरे डेटाबेस का JSON बैकअप डाउनलोड करें।
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 underline inline-flex items-center gap-1">
            Settings खोलें →
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('guide')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:border-emerald-500 transition space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">सेटअप व डिप्लॉयमेंट गाइड</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              GitHub डिप्लॉयमेंट, डोमेन सेटअप, मोबाइल पब्लिशिंग और डेटा रिकवरी निर्देश।
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 underline inline-flex items-center gap-1">
            गाइड पढ़ें →
          </span>
        </div>

      </div>

    </div>
  );
};

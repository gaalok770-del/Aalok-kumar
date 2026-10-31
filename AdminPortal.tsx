import React, { useState } from 'react';
import { 
  LayoutDashboard, FileText, PlusCircle, MessageSquare, 
  Settings, BookOpen, LogOut, ArrowLeft, User, Shield 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminPostsList } from './AdminPostsList';
import { AdminPostEditor } from './AdminPostEditor';
import { AdminMessages } from './AdminMessages';
import { AdminSettings } from './AdminSettings';
import { AdminSetupGuide } from './AdminSetupGuide';

interface AdminPortalProps {
  onNavigateHome: () => void;
  onViewArticle: (slug: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onNavigateHome,
  onViewArticle,
}) => {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'posts' | 'editor' | 'messages' | 'settings' | 'guide'>('dashboard');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const { user, logout } = useAuth();

  const handleEditPost = (id: string) => {
    setEditingArticleId(id);
    setCurrentTab('editor');
  };

  const handleNewPost = () => {
    setEditingArticleId(null);
    setCurrentTab('editor');
  };

  const tabs = [
    { id: 'dashboard', label: 'डैशबोर्ड', icon: LayoutDashboard },
    { id: 'posts', label: 'लेख प्रबंधन', icon: FileText },
    { id: 'editor', label: 'नया लेख', icon: PlusCircle },
    { id: 'messages', label: 'संदेश', icon: MessageSquare },
    { id: 'settings', label: 'सेटिंग्स', icon: Settings },
    { id: 'guide', label: 'सेटअप गाइड', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-['Yantramanav']">
      
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateHome}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="सार्वजनिक वेबसाइट पर जाएं"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div 
                onClick={() => setCurrentTab('dashboard')}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-sm">
                  TN
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight font-['Plus_Jakarta_Sans']">
                    TechNova Admin
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold -mt-1">
                    Control Panel
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.id === 'editor') setEditingArticleId(null);
                      setCurrentTab(tab.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User & Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
                  {user?.username?.slice(0, 1).toUpperCase() || 'A'}
                </div>
                <span className="font-semibold">{user?.username}</span>
              </div>

              <button
                onClick={logout}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-600 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition"
                title="लॉगआउट"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">लॉगआउट</span>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Horizontal Subnav */}
        <div className="md:hidden flex items-center border-t border-slate-200 dark:border-slate-800 overflow-x-auto whitespace-nowrap px-2 py-1.5 gap-1 text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'editor') setEditingArticleId(null);
                  setCurrentTab(tab.id as any);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Workspace Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <AdminDashboard
            onNavigateTab={(tab, id) => {
              if (id) setEditingArticleId(id);
              setCurrentTab(tab as any);
            }}
            onNavigateHome={onNavigateHome}
          />
        )}

        {currentTab === 'posts' && (
          <AdminPostsList
            onEditPost={handleEditPost}
            onNewPost={handleNewPost}
            onViewLive={onViewArticle}
          />
        )}

        {currentTab === 'editor' && (
          <AdminPostEditor
            articleId={editingArticleId}
            onBack={() => setCurrentTab('posts')}
            onSaved={(art) => {
              // Stay or navigate
            }}
          />
        )}

        {currentTab === 'messages' && <AdminMessages />}

        {currentTab === 'settings' && <AdminSettings />}

        {currentTab === 'guide' && <AdminSetupGuide />}
      </main>

    </div>
  );
};

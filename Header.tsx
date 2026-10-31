import React, { useState } from 'react';
import { 
  Menu, X, Search, Moon, Sun, Shield, Smartphone, 
  Cpu, LayoutGrid, Newspaper, HelpCircle, Lock, 
  ChevronRight, ArrowRight, PenSquare
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();

  const navLinks = [
    { label: 'होम', enLabel: 'Home', path: '/', icon: null },
    { label: 'AI Technology', enLabel: 'AI', path: '/category/ai', icon: Cpu },
    { label: 'स्मार्टफोन टिप्स', enLabel: 'Mobile', path: '/category/mobile', icon: Smartphone },
    { label: 'ऐप्स & सॉफ्टवेयर', enLabel: 'Apps', path: '/category/apps', icon: LayoutGrid },
    { label: 'टेक न्यूज़', enLabel: 'Tech News', path: '/category/tech-news', icon: Newspaper },
    { label: 'साइबर सुरक्षा', enLabel: 'Cybersecurity', path: '/category/cybersecurity', icon: Shield },
    { label: 'हाउ-टू गाइड', enLabel: 'How-To', path: '/category/how-to', icon: HelpCircle },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navigateTo = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white tracking-wide uppercase">
              Technology Samjho, Smart Bano
            </span>
            <span className="hidden sm:inline text-slate-400">
              भारत के पाठकों के लिए प्रामाणिक तकनीकी ज्ञान हिंदी में
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs shrink-0">
            <button
              onClick={() => navigateTo('/sitemap')}
              className="hover:text-blue-400 transition hidden md:inline text-slate-400"
            >
              साइटमैप
            </button>
            <button
              onClick={() => navigateTo('/contact-us')}
              className="hover:text-blue-400 transition hidden md:inline text-slate-400"
            >
              संपर्क करें
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => navigateTo('/admin')}
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800"
              >
                <PenSquare className="w-3.5 h-3.5" />
                <span>Admin ({user?.username})</span>
              </button>
            ) : (
              <button
                onClick={() => navigateTo('/admin/login')}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition"
                title="व्यवस्थापक लॉगिन"
              >
                <Lock className="w-3 h-3" />
                <span className="text-[11px]">Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo */}
            <div 
              onClick={() => navigateTo('/')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-xl tracking-tighter">TN</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                    TechNova
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                    India
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-normal -mt-0.5 font-['Yantramanav']">
                  टेक्नोलॉजी समझो, स्मार्ट बनो
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
                return (
                  <button
                    key={link.path}
                    onClick={() => navigateTo(link.path)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Toggle Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 sm:p-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="सर्च करें"
                title="सर्च करें"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 sm:p-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="थीम बदलें"
                title={theme === 'dark' ? 'लाइट मोड चालू करें' : 'डार्क मोड चालू करें'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none"
                aria-label="मेनू खोलें"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Search Bar */}
        {searchOpen && (
          <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="आर्टिकल, AI, स्मार्टफोन, या साइबर सुरक्षा टिप्स खोजें..."
                  autoFocus
                  className="w-full pl-12 pr-28 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base font-medium"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs sm:text-sm transition shadow-sm"
                >
                  खोजें
                </button>
              </form>
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>लोकप्रिय खोजें:</span>
                {['Artificial Intelligence', 'Battery Save', '2FA', 'Fake Apps', 'Cloud Storage'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      onNavigate(`/search?q=${encodeURIComponent(term)}`);
                      setSearchOpen(false);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Quick Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mb-4 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="सर्च करें..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </form>

            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
                return (
                  <button
                    key={link.path}
                    onClick={() => navigateTo(link.path)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-base font-semibold text-left transition ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                        : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="w-5 h-5 text-blue-500" />}
                      <span>{link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
              <button
                onClick={() => navigateTo('/about-us')}
                className="w-full px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center justify-between"
              >
                <span>About TechNova India</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => navigateTo('/contact-us')}
                className="w-full px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center justify-between"
              >
                <span>संपर्क करें (Contact Us)</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              {isAuthenticated ? (
                <button
                  onClick={() => navigateTo('/admin')}
                  className="w-full mt-3 p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 text-sm shadow-md"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('/admin/login')}
                  className="w-full mt-3 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold flex items-center justify-center gap-2 text-sm"
                >
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Admin Login</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

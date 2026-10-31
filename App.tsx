import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CookieConsent } from './components/CookieConsent';
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { CategoryPage } from './pages/CategoryPage';
import { SearchPage } from './pages/SearchPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PolicyPage, PolicyType } from './pages/PolicyPage';
import { SitemapPage } from './pages/SitemapPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminPortal } from './pages/admin/AdminPortal';
import { publicApi } from './services/api';
import { SiteSettings } from './types';

function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [currentSearch, setCurrentSearch] = useState(window.location.search || '');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    publicApi.getSettings().then(setSettings).catch(console.error);

    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setCurrentSearch(window.location.search || '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    const [pathName, queryStr] = path.split('?');
    window.history.pushState({}, '', path);
    setCurrentPath(pathName);
    setCurrentSearch(queryStr ? `?${queryStr}` : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Extract query param
  const getQueryParam = (param: string) => {
    const params = new URLSearchParams(currentSearch);
    return params.get(param) || '';
  };

  // Route matcher
  const renderRoute = () => {
    // 1. Admin Portal
    if (currentPath.startsWith('/admin')) {
      if (currentPath === '/admin/login') {
        if (isAuthenticated) {
          return <AdminPortal onNavigateHome={() => navigate('/')} onViewArticle={(slug) => navigate(`/article/${slug}`)} />;
        }
        return <AdminLogin onLoginSuccess={() => navigate('/admin')} onNavigateHome={() => navigate('/')} />;
      }

      if (!isAuthenticated && !authLoading) {
        return <AdminLogin onLoginSuccess={() => navigate('/admin')} onNavigateHome={() => navigate('/')} />;
      }

      return (
        <AdminPortal
          onNavigateHome={() => navigate('/')}
          onViewArticle={(slug) => navigate(`/article/${slug}`)}
        />
      );
    }

    // 2. Home Page
    if (currentPath === '/') {
      return <HomePage onNavigate={navigate} settings={settings} />;
    }

    // 3. Static Pages
    if (currentPath === '/about-us') {
      return <AboutPage onNavigate={navigate} settings={settings} />;
    }

    if (currentPath === '/contact-us') {
      return (
        <ContactPage
          onNavigate={navigate}
          settings={settings}
          initialSubject={getQueryParam('subject')}
        />
      );
    }

    if (currentPath === '/sitemap') {
      return <SitemapPage onNavigate={navigate} />;
    }

    if (currentPath === '/search') {
      return (
        <SearchPage
          initialQuery={getQueryParam('q')}
          onNavigate={navigate}
          settings={settings}
        />
      );
    }

    // 4. Policy Pages
    const validPolicies: PolicyType[] = [
      'privacy-policy',
      'disclaimer',
      'terms-and-conditions',
      'editorial-policy',
      'corrections-policy',
      'cookie-policy',
      'advertise-with-us',
      'write-for-us',
    ];

    const cleanPath = currentPath.replace(/^\//, '') as PolicyType;
    if (validPolicies.includes(cleanPath)) {
      return <PolicyPage type={cleanPath} onNavigate={navigate} settings={settings} />;
    }

    // 5. Category Page (/category/:slug)
    const categoryMatch = currentPath.match(/^\/category\/([a-zA-Z0-9_-]+)/);
    if (categoryMatch) {
      return <CategoryPage slug={categoryMatch[1]} onNavigate={navigate} settings={settings} />;
    }

    // 6. Article Page (/article/:slug)
    const articleMatch = currentPath.match(/^\/article\/([a-zA-Z0-9_-]+)/);
    if (articleMatch) {
      return <ArticlePage slug={articleMatch[1]} onNavigate={navigate} settings={settings} />;
    }

    // 7. 404 Fallback
    return <NotFoundPage onNavigate={navigate} />;
  };

  const isAdminView = currentPath.startsWith('/admin') && isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Show public header on non-admin pages */}
      {!isAdminView && <Header currentPath={currentPath} onNavigate={navigate} />}

      {/* Main Content Area */}
      <main className="flex-grow">{renderRoute()}</main>

      {/* Show public footer on non-admin pages */}
      {!isAdminView && (
        <Footer
          onNavigate={navigate}
          onOpenCookieSettings={() => setCookieSettingsOpen(true)}
        />
      )}

      {/* Cookie Consent Banner and Settings Modal */}
      <CookieConsent
        forceOpen={cookieSettingsOpen}
        onCloseModal={() => setCookieSettingsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

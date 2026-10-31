import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, User, Share2, Tag, ChevronRight, 
  HelpCircle, CheckCircle2, XCircle, ArrowLeft, ExternalLink, 
  AlertCircle, Sparkles, Eye, Check, BookOpen, ShieldCheck, 
  MessageSquare
} from 'lucide-react';
import { Article, SiteSettings } from '../types';
import { publicApi } from '../services/api';
import { ShareButtons } from '../components/ShareButtons';
import { ArticleCard } from '../components/ArticleCard';
import { AdBanner } from '../components/AdBanner';

interface ArticlePageProps {
  slug: string;
  onNavigate: (path: string) => void;
  settings?: SiteSettings | null;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ slug, onNavigate, settings }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await publicApi.getArticleBySlug(slug);
        setArticle(data.article);
        setRelated(data.related);

        // Update page title & OpenGraph dynamically
        if (data.article) {
          document.title = `${data.article.title} - TechNova India`;
        }
      } catch (err: any) {
        console.error('Failed to load article', err);
        setError(err.message || 'Article nahi mila ya hata diya gaya hai.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('hi-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">लेख लोड हो रहा है...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">लेख नहीं मिला (Article Not Found)</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          यह आर्टिकल शायद हटा दिया गया है या इसका URL बदल गया है।
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> मुख्य पृष्ठ पर लौटें (Back to Home)
        </button>
      </div>
    );
  }

  // Schema.org Article JSON-LD
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.excerpt,
    image: [article.featuredImage],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'TechNova India',
      url: window.location.origin,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': window.location.href,
    },
    inLanguage: 'hi',
  };

  return (
    <article className="pb-20 font-['Yantramanav']">
      {/* Schema.org Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap">
          <button onClick={() => onNavigate('/')} className="hover:text-blue-600">
            होम
          </button>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <button
            onClick={() => onNavigate(`/category/${article.category}`)}
            className="hover:text-blue-600 uppercase font-semibold"
          >
            {article.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-slate-700 dark:text-slate-300 truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate(`/category/${article.category}`)}
              className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase tracking-wide"
            >
              {article.category}
            </button>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              {article.readingTimeMinutes} मिनट का पठन समय
            </span>
            {article.views && (
              <>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  {article.views} पाठकों ने पढ़ा
                </span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight font-['Plus_Jakarta_Sans']">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {article.excerpt}
          </p>

          {/* Author & Timestamp Bar */}
          <div className="pt-4 border-t border-b border-slate-200 dark:border-slate-800 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt={article.author.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-blue-500/30"
              />
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{article.author.name}</span>
                  <span title="सत्यापित लेखक"><ShieldCheck className="w-4 h-4 text-emerald-500" /></span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {article.author.role}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5 sm:text-right">
              <div>प्रकाशित: <strong className="text-slate-700 dark:text-slate-300">{formatDate(article.publishedAt)}</strong></div>
              {article.updatedAt && article.updatedAt !== article.publishedAt && (
                <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                  अपडेट किया गया: {formatDate(article.updatedAt)}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <figure className="space-y-2">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800">
            <img
              src={article.featuredImage}
              alt={article.imageAlt || article.title}
              className="w-full h-full object-cover"
            />
          </div>
          {article.imageAlt && (
            <figcaption className="text-xs text-center text-slate-500 dark:text-slate-400 italic">
              चित्र: {article.imageAlt}
            </figcaption>
          )}
        </figure>

        {/* Share Buttons Top */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <ShareButtons title={article.title} />
          <button
            onClick={() => onNavigate(`/contact-us?subject=Correction:${encodeURIComponent(article.title)}`)}
            className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>सुधार का सुझाव दें</span>
          </button>
        </div>

        {/* In-Article Advertisement Slot */}
        <AdBanner placement="in-article" settings={settings} />

        {/* Main Content Body */}
        <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed space-y-6">
          <div
            dangerouslySetInnerHTML={{
              __html: article.content
                .replace(/^## (.*$)/gim, '<h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-10 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2 font-[\'Plus_Jakarta_Sans\']">$1</h2>')
                .replace(/^### (.*$)/gim, '<h3 class="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mt-6 mb-3 font-[\'Plus_Jakarta_Sans\']">$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n\n/g, '<p class="my-4">')
            }}
          />
        </div>

        {/* Step-by-Step Instructions if present */}
        {article.steps && article.steps.length > 0 && (
          <section className="my-10 p-6 sm:p-8 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                स्टेप-बाय-स्टेप निर्देश (Step-by-Step Guide)
              </h2>
            </div>

            <div className="space-y-4">
              {article.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pros & Cons Box */}
        {((article.pros && article.pros.length > 0) || (article.cons && article.cons.length > 0)) && (
          <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {article.pros && article.pros.length > 0 && (
              <div className="p-6 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-4">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-lg">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>फायदे / Do's</span>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-200">
                  {article.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {article.cons && article.cons.length > 0 && (
              <div className="p-6 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-4">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-lg">
                  <XCircle className="w-5 h-5" />
                  <span>सावधानियां / Don'ts</span>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-200">
                  {article.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* FAQs Section */}
        {article.faqs && article.faqs.length > 0 && (
          <section className="my-10 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                अक्सर पूछे जाने वाले सवाल (FAQs)
              </h2>
            </div>

            <div className="space-y-3">
              {article.faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-white flex items-center justify-between gap-4 text-base"
                    >
                      <span>{faq.question}</span>
                      <span className="text-blue-600 font-extrabold text-lg">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700/60 pt-3 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Credible Sources & Citations */}
        {article.sources && article.sources.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              प्रामाणिक संदर्भ और स्रोत (Verified Sources):
            </span>
            <ul className="space-y-1">
              {article.sources.map((src, i) => (
                <li key={i}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    {src.title} <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <Tag className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">टैग्स:</span>
            {article.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onNavigate(`/search?q=${encodeURIComponent(tag)}`)}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 text-slate-700 dark:text-slate-300 transition border border-slate-200 dark:border-slate-700"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Bottom Sharing & Correction Notice */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <ShareButtons title={article.title} />

          <button
            onClick={() => onNavigate('/corrections-policy')}
            className="text-xs text-slate-500 hover:underline"
          >
            TechNova India संपादकीय सुधार नीति पढ़ें →
          </button>
        </div>

        {/* Author Bio Box */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <img
            src={article.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={article.author.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
          />
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              लेखक: {article.author.name}
            </h3>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {article.author.role}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
              TechNova India संपादकीय टीम के सदस्य। भारत के पाठकों के लिए तकनीकी शब्दावली को सरल और सुलभ बनाने के लिए प्रतिबद्ध।
            </p>
          </div>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                संबंधित लेख (Related Articles)
              </h2>
              <button
                onClick={() => onNavigate(`/category/${article.category}`)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                इस श्रेणी में और देखें →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => (
                <ArticleCard key={rel.id} article={rel} onNavigate={onNavigate} layout="grid" />
              ))}
            </div>
          </section>
        )}

      </div>
    </article>
  );
};

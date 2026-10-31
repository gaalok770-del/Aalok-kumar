import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, Send, Clock, Eye, Trash2, ArrowLeft, Upload, 
  Image as ImageIcon, CheckCircle2, AlertCircle, Sparkles, 
  Bold, Italic, Heading2, Heading3, List, ListOrdered, 
  Link as LinkIcon, Quote, Code, Table, HelpCircle, 
  Plus, X, ShieldCheck, ChevronDown, Check, Camera
} from 'lucide-react';
import { Article, Category, ArticleStep, FAQItem } from '../../types';
import { adminApi, publicApi } from '../../services/api';

interface AdminPostEditorProps {
  articleId?: string | null;
  onBack: () => void;
  onSaved: (article: Article) => void;
}

export const AdminPostEditor: React.FC<AdminPostEditorProps> = ({
  articleId,
  onBack,
  onSaved,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('ai');
  const [tagsInput, setTagsInput] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [authorName, setAuthorName] = useState('TechNova Editorial Team');
  const [authorRole, setAuthorRole] = useState('Technology Research Desk');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft');
  const [scheduledAt, setScheduledAt] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [featured, setFeatured] = useState(false);

  // Structured Sections
  const [steps, setSteps] = useState<ArticleStep[]>([]);
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [sources, setSources] = useState<{ title: string; url: string }[]>([]);

  // UI tabs & preview
  const [activeTab, setActiveTab] = useState<'write' | 'preview' | 'seo' | 'structured'>('write');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    publicApi.getCategories().then(setCategories).catch(console.error);

    if (articleId) {
      loadArticle(articleId);
    }
  }, [articleId]);

  const loadArticle = async (id: string) => {
    try {
      setLoading(true);
      const art = await adminApi.getArticle(id);
      setTitle(art.title);
      setSlug(art.slug);
      setExcerpt(art.excerpt || '');
      setContent(art.content || '');
      setCategory(art.category || 'ai');
      setTagsInput(art.tags ? art.tags.join(', ') : '');
      setFeaturedImage(art.featuredImage || '');
      setImageAlt(art.imageAlt || '');
      setAuthorName(art.author?.name || 'TechNova Editorial Team');
      setAuthorRole(art.author?.role || 'Technology Research Desk');
      setStatus(art.status);
      setScheduledAt(art.scheduledAt ? art.scheduledAt.slice(0, 16) : '');
      setSeoTitle(art.seoTitle || '');
      setSeoDescription(art.seoDescription || '');
      setFeatured(Boolean(art.featured));
      setSteps(art.steps || []);
      setPros(art.pros || []);
      setCons(art.cons || []);
      setFaqs(art.faqs || []);
      setSources(art.sources || []);
    } catch (err: any) {
      console.error('Failed to load article for edit', err);
      setFeedback({ type: 'error', message: 'आर्टिकल लोड करने में त्रुटि।' });
    } finally {
      setLoading(false);
    }
  };

  const autoGenerateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!articleId && !slug) {
      setSlug(autoGenerateSlug(val));
    }
  };

  // Image upload handler (Mobile camera or Desktop file)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'इमेज का साइज 5MB से कम होना चाहिए।' });
      return;
    }

    // Check type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setFeedback({ type: 'error', message: 'केवल JPG, PNG, WEBP, GIF या SVG इमेज समर्थित हैं।' });
      return;
    }

    try {
      setUploadingImage(true);
      setFeedback(null);

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const uploadRes = await adminApi.uploadImage(base64Data, file.name);
          setFeaturedImage(uploadRes.url);
          if (!imageAlt) setImageAlt(title || file.name);
          setFeedback({ type: 'success', message: 'इमेज सफलतापूर्वक अपलोड और सुरक्षित हो गई!' });
        } catch (uploadErr: any) {
          setFeedback({ type: 'error', message: uploadErr.message || 'इमेज अपलोड में विफलता।' });
        } finally {
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadingImage(false);
      setFeedback({ type: 'error', message: 'इमेज पढ़ने में त्रुटि।' });
    }
  };

  // Toolbar formatting helpers
  const insertFormatting = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('article-content-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${prefix}${selected || 'टेक्स्ट'}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 50);
  };

  // Save or Publish action
  const handleSaveArticle = async (targetStatus: 'draft' | 'published' | 'scheduled') => {
    setFeedback(null);

    if (!title.trim()) {
      setFeedback({ type: 'error', message: 'कृपया आर्टिकल का शीर्षक (Title) अवश्य भरें।' });
      return;
    }

    if (!content.trim()) {
      setFeedback({ type: 'error', message: 'कृपया आर्टिकल की मुख्य सामग्री (Content) भरें।' });
      return;
    }

    if (targetStatus === 'scheduled' && !scheduledAt) {
      setFeedback({ type: 'error', message: 'शेड्यूल करने के लिए कृपया भविष्य की तारीख और समय चुनें।' });
      return;
    }

    try {
      setSubmitting(true);

      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: Partial<Article> = {
        title: title.trim(),
        slug: slug.trim() || autoGenerateSlug(title),
        excerpt: excerpt.trim() || title.trim().slice(0, 150),
        content: content.trim(),
        category,
        tags: parsedTags.length > 0 ? parsedTags : ['Tech'],
        featuredImage:
          featuredImage ||
          'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        imageAlt: imageAlt.trim() || title.trim(),
        author: {
          name: authorName.trim() || 'TechNova Editorial Team',
          role: authorRole.trim() || 'Technology Research Desk',
        },
        status: targetStatus,
        scheduledAt: targetStatus === 'scheduled' ? new Date(scheduledAt).toISOString() : null,
        seoTitle: seoTitle.trim() || `${title.trim()} - TechNova India`,
        seoDescription: seoDescription.trim() || excerpt.trim() || title.trim(),
        featured,
        steps,
        pros,
        cons,
        faqs,
        sources,
      };

      let result: any;
      if (articleId) {
        result = await adminApi.updateArticle(articleId, payload);
      } else {
        result = await adminApi.createArticle(payload);
      }

      setFeedback({
        type: 'success',
        message:
          targetStatus === 'published'
            ? 'बधाई! आपका आर्टिकल तुरंत सार्वजनिक रूप से प्रकाशित हो गया है और होमपेज पर दिखाई दे रहा है।'
            : targetStatus === 'scheduled'
            ? 'आर्टिकल सफलता पूर्वक शेड्यूल हो गया है। निर्धारित समय पर यह अपने-आप पब्लिश हो जाएगा।'
            : 'ड्राफ्ट सफलतापूर्वक सेव हो गया है।',
      });

      onSaved(result.article);
    } catch (err: any) {
      console.error('Save article error', err);
      setFeedback({ type: 'error', message: err.message || 'आर्टिकल सेव करने में त्रुटि।' });
    } finally {
      setSubmitting(false);
    }
  };

  // Structured Item Helpers
  const addStep = () => {
    setSteps([...steps, { title: '', description: '' }]);
  };
  const updateStep = (index: number, key: 'title' | 'description', val: string) => {
    const updated = [...steps];
    updated[index][key] = val;
    setSteps(updated);
  };
  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };
  const updateFaq = (index: number, key: 'question' | 'answer', val: string) => {
    const updated = [...faqs];
    updated[index][key] = val;
    setFaqs(updated);
  };
  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500 font-medium">
        आर्टिकल एडिटर लोड हो रहा है...
      </div>
    );
  }

  return (
    <div className="pb-16 space-y-6 font-['Yantramanav']">
      
      {/* Editor Top Bar with Mobile-friendly Action Buttons */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title="वापस जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
            {articleId ? 'आर्टिकल संपादित करें' : 'नया आर्टिकल लिखें'}
          </span>
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {/* Save Draft */}
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSaveArticle('draft')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-300 dark:border-slate-700"
          >
            <Save className="w-3.5 h-3.5 text-amber-500" />
            <span>Save Draft</span>
          </button>

          {/* Schedule */}
          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              if (!scheduledAt) {
                // Set default to tomorrow 9 AM
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(9, 0, 0, 0);
                setScheduledAt(tomorrow.toISOString().slice(0, 16));
              }
              setActiveTab('seo'); // switch to settings tab to confirm date
              handleSaveArticle('scheduled');
            }}
            className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-bold transition flex items-center gap-1.5 border border-purple-300 dark:border-purple-800"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </button>

          {/* Publish Now Button (Prominent) */}
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSaveArticle('published')}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Now</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-start gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span className="font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* Editor Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('write')}
          className={`px-4 py-2.5 border-b-2 transition ${
            activeTab === 'write'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          1. मुख्य कंटेंट (Write Content)
        </button>

        <button
          onClick={() => setActiveTab('structured')}
          className={`px-4 py-2.5 border-b-2 transition ${
            activeTab === 'structured'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          2. स्टेप्स, FAQs और Do/Don't ({steps.length + faqs.length})
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2.5 border-b-2 transition ${
            activeTab === 'seo'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          3. SEO, लेखक & शेड्यूलिंग
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2.5 border-b-2 transition ${
            activeTab === 'preview'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          4. लाइव प्रीव्यू (Preview)
        </button>
      </div>

      {/* TAB 1: Write Content */}
      {activeTab === 'write' && (
        <div className="space-y-6">
          
          {/* Main Title Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              आर्टिकल का शीर्षक (Article Title) *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="उदा. Artificial Intelligence Kya Hai? Aasan Bhasha Mein Samjhein"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base sm:text-lg font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Quick Meta Row: Category + Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                श्रेणी (Category) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.hindiName} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                SEO-Friendly Slug (URL)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="artificial-intelligence-kya-hai"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Featured Image Uploader (Mobile Camera & Desktop upload) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                फ़ीचर्ड इमेज (Featured Image)
              </label>
              <span className="text-xs text-slate-400">JPG, PNG, WEBP (अधिकतम 5MB)</span>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Image Preview Box */}
              <div className="md:col-span-5 aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center relative">
                {featuredImage ? (
                  <>
                    <img
                      src={featuredImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFeaturedImage('')}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition"
                      title="इमेज हटाएं"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-4 text-slate-400 space-y-1">
                    <ImageIcon className="w-8 h-8 mx-auto text-slate-400" />
                    <span className="text-xs">कोई इमेज चयनित नहीं</span>
                  </div>
                )}
              </div>

              {/* Upload Buttons & Options */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploadingImage ? 'अपलोड हो रहा है...' : 'मोबाइल / पीसी से फोटो चुनें'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // Pre-fill a safe tech visual if needed
                      setFeaturedImage(
                        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
                      );
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                  >
                    Tech Unsplash Image
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium">या इमेज URL सीधे पेस्ट करें:</span>
                  <input
                    type="url"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium">इमेज Alt Text (दृष्टिबाधित पाठकों और SEO के लिए):</span>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="उदा. Artificial Intelligence Neural Network Concept"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Short Excerpt */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              संक्षिप्त विवरण (Short Excerpt) *
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="आर्टिकल का 2-लाइन सार जो कार्ड्स और सोशल शेयरिंग पर दिखेगा..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Main Content Area with Rich-Text / Markdown Toolbar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                मुख्य सामग्री (Main Article Content) *
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {content.split(/\s+/).filter(Boolean).length} शब्द
              </span>
            </div>

            {/* Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 rounded-t-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              <button
                type="button"
                onClick={() => insertFormatting('**', '**')}
                className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                title="बोल्ड (Bold)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('*', '*')}
                className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                title="इटैलिक (Italic)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <button
                type="button"
                onClick={() => insertFormatting('\n## ', '\n')}
                className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                title="Heading 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('\n### ', '\n')}
                className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                title="Heading 3"
              >
                <Heading3 className="w-4 h-4" />
              </button>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <button
                type="button"
                onClick={() => insertFormatting('\n* ')}
                className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                title="बुलेट सूची"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('\n1. ')}
                className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                title="क्रमांकित सूची"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('\n> ')}
                className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                title="उद्धरण (Quote)"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('`', '`')}
                className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                title="इनलाइन कोड"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>

            <textarea
              id="article-content-area"
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="यहाँ अपने आर्टिकल की विस्तृत सामग्री हिंदी में लिखें..."
              className="w-full p-4 rounded-b-xl border border-t-0 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none"
            />
          </div>

        </div>
      )}

      {/* TAB 2: Structured Elements (Steps, Pros/Cons, FAQs) */}
      {activeTab === 'structured' && (
        <div className="space-y-8">
          
          {/* Step-by-Step Instructions Builder */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  स्टेप-बाय-स्टेप निर्देश (Step-by-Step Instructions)
                </h3>
                <p className="text-xs text-slate-500">
                  पाठकों को आसानी से समझाने के लिए क्रमवार चरण जोड़ें।
                </p>
              </div>
              <button
                type="button"
                onClick={addStep}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> स्टेप जोड़ें
              </button>
            </div>

            {steps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600">स्टेप #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeStep(idx)}
                    className="text-slate-400 hover:text-rose-600 text-xs"
                  >
                    हटाएं
                  </button>
                </div>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateStep(idx, 'title', e.target.value)}
                  placeholder="चरण का शीर्षक (जैसे: सेटिंग्स खोलें)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                />
                <textarea
                  rows={2}
                  value={step.description}
                  onChange={(e) => updateStep(idx, 'description', e.target.value)}
                  placeholder="चरण का विवरण..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            ))}
          </div>

          {/* Pros & Cons Builder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pros */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
              <h3 className="font-bold text-base text-emerald-600">फायदे / Do's (Pros)</h3>
              <div className="space-y-2">
                {pros.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={p}
                      onChange={(e) => {
                        const updated = [...pros];
                        updated[i] = e.target.value;
                        setPros(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setPros(pros.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setPros([...pros, ''])}
                  className="text-xs text-emerald-600 font-bold underline"
                >
                  + एक और फायदा जोड़ें
                </button>
              </div>
            </div>

            {/* Cons */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
              <h3 className="font-bold text-base text-rose-600">सावधानियां / Don'ts (Cons)</h3>
              <div className="space-y-2">
                {cons.map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={c}
                      onChange={(e) => {
                        const updated = [...cons];
                        updated[i] = e.target.value;
                        setCons(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setCons(cons.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setCons([...cons, ''])}
                  className="text-xs text-rose-600 font-bold underline"
                >
                  + एक और सावधानी जोड़ें
                </button>
              </div>
            </div>
          </div>

          {/* FAQs Builder */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                अक्सर पूछे जाने वाले सवाल (FAQs)
              </h3>
              <button
                type="button"
                onClick={addFaq}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> नया सवाल जोड़ें
              </button>
            </div>

            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">FAQ #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeFaq(idx)}
                    className="text-slate-400 hover:text-rose-600 text-xs"
                  >
                    हटाएं
                  </button>
                </div>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                  placeholder="प्रश्न (Question)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                />
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                  placeholder="उत्तर (Answer)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: SEO, Author, Tags & Scheduling */}
      {activeTab === 'seo' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-6">
          <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-3">
            सर्च इंजन ऑप्टिमाइज़ेशन और पब्लिशिंग सेटिंग्स
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={`${title || 'शीर्षक'} - TechNova India`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                टैग्स (Tags - अल्पविराम से अलग करें)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="AI, Smartphone, Battery, Android, Cybersecurity"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              SEO Meta Description (120-160 शब्द)
            </label>
            <textarea
              rows={2}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Google सर्च स्निपेट के लिए विवरण..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
            />
          </div>

          {/* Author Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                लेखक का नाम (Author Name)
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="TechNova Editorial Team"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                लेखक की भूमिका (Author Role)
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="Technology Research Desk"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
              />
            </div>
          </div>

          {/* Scheduled Publishing Option */}
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 space-y-2">
            <label className="block text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>शेड्यूल प्रकाशन तिथि एवं समय (Schedule Date & Time)</span>
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="px-3.5 py-2 rounded-lg border border-purple-300 dark:border-purple-800 bg-white dark:bg-slate-900 text-xs font-mono"
            />
            <p className="text-[11px] text-purple-700 dark:text-purple-400">
              TechNova सर्वर बैकग्राउंड में हर 30 सेकंड में स्वतः जांच करेगा और इस समय पर आर्टिकल लाइव कर देगा।
            </p>
          </div>

          {/* Featured Post Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured-checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="featured-checkbox" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
              होमपेज पर मुख्य फीचर्ड आर्टिकल के रूप में पिन करें (Featured Story)
            </label>
          </div>
        </div>
      )}

      {/* TAB 4: Live Preview */}
      {activeTab === 'preview' && (
        <div className="p-6 sm:p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 max-w-4xl mx-auto">
          <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-200">
            * यह पूर्वावलोकन (Preview) है। लाइव प्रकाशित करने के लिए ऊपर <strong>Publish Now</strong> दबाएं।
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
              {category}
            </span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {title || 'शीर्षक यहाँ प्रदर्शित होगा'}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-base">
              {excerpt || 'संक्षिप्त विवरण...'}
            </p>
          </div>

          {featuredImage && (
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-900">
              <img src={featuredImage} alt={imageAlt || title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 whitespace-pre-line text-base leading-relaxed">
            {content || 'सामग्री यहाँ प्रदर्शित होगी...'}
          </div>
        </div>
      )}

    </div>
  );
};

import React from 'react';
import { 
  ShieldCheck, ArrowUpRight, Heart, Mail, ExternalLink, 
  Sparkles, Lock, FileText, CheckCircle2, Globe, Shield
} from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenCookieSettings?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCookieSettings }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 font-['Yantramanav']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('/')}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-500/20">
                TN
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tight font-['Plus_Jakarta_Sans']">
                  TechNova <span className="text-blue-400">India</span>
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  टेक्नोलॉजी समझो, स्मार्ट बनो
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              TechNova India भारत का एक स्वतंत्र, प्रामाणिक और उपयोगी हिंदी टेक्नोलॉजी ब्लॉग है। हमारा उद्देश्य भारतीय पाठकों, छात्रों और प्रोफेशनल्स तक आर्टिफिशियल इंटेलिजेंस, स्मार्टफोन ट्रिक्स, सॉफ्टवेयर और डिजिटल सुरक्षा की सटीक जानकारी सरल भाषा में पहुंचाना है।
            </p>

            <div className="flex items-center gap-2 text-xs text-blue-400 font-medium bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>सत्यापित और निष्पक्ष तकनीकी जानकारी (Verified Fact-Checked Content)</span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center transition text-slate-400"
                aria-label="X (Twitter)"
              >
                <span className="text-xs font-bold">X</span>
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-sky-500 hover:text-white flex items-center justify-center transition text-slate-400"
                aria-label="Telegram"
              >
                <span className="text-xs font-bold">TG</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 hover:text-white flex items-center justify-center transition text-slate-400"
                aria-label="YouTube"
              >
                <span className="text-xs font-bold">YT</span>
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition text-slate-400"
                aria-label="WhatsApp Channel"
              >
                <span className="text-xs font-bold">WA</span>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-['Plus_Jakarta_Sans']">
              प्रमुख विषय (Categories)
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('/category/ai')} className="hover:text-blue-400 transition">
                  Artificial Intelligence (AI)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/mobile')} className="hover:text-blue-400 transition">
                  स्मार्टफोन टिप्स & बैटरी
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/cybersecurity')} className="hover:text-blue-400 transition">
                  साइबर सुरक्षा & 2FA
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/apps')} className="hover:text-blue-400 transition">
                  ऐप्स और सॉफ्टवेयर
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/how-to')} className="hover:text-blue-400 transition">
                  हाउ-टू गाइड & समाधान
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/tech-news')} className="hover:text-blue-400 transition">
                  टेक्नोलॉजी न्यूज़
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/computers')} className="hover:text-blue-400 transition">
                  कंप्यूटर & क्लाउड स्टोरेज
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Editorial Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-['Plus_Jakarta_Sans']">
              नीतियां व मानक (Policies)
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('/editorial-policy')} className="hover:text-blue-400 transition">
                  संपादकीय नीति (Editorial Policy)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/corrections-policy')} className="hover:text-blue-400 transition">
                  सुधार नीति (Corrections Policy)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy-policy')} className="hover:text-blue-400 transition">
                  गोपनीयता नीति (Privacy Policy)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/disclaimer')} className="hover:text-blue-400 transition">
                  अस्वीकरण (Disclaimer)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms-and-conditions')} className="hover:text-blue-400 transition">
                  नियम और शर्तें (Terms)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/cookie-policy')} className="hover:text-blue-400 transition">
                  कुकी नीति (Cookie Policy)
                </button>
              </li>
            </ul>
          </div>

          {/* Connect & Useful Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-['Plus_Jakarta_Sans']">
              जुड़ें और संसाधन (Connect)
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('/about-us')} className="hover:text-blue-400 transition">
                  हमारे बारे में (About Us)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact-us')} className="hover:text-blue-400 transition">
                  संपर्क करें (Contact Us)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/write-for-us')} className="hover:text-blue-400 transition">
                  लेखक बनें (Write For Us)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/advertise-with-us')} className="hover:text-blue-400 transition">
                  विज्ञापन दें (Advertise)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/sitemap')} className="hover:text-blue-400 transition">
                  HTML साइटमैप (Sitemap)
                </button>
              </li>
              <li>
                <a 
                  href="/sitemap.xml" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 hover:text-blue-400 transition"
                >
                  XML Sitemap <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('/admin')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-blue-400 border border-slate-700 hover:bg-slate-700 transition"
                >
                  <Lock className="w-3 h-3" />
                  <span>व्यवस्थापक पोर्टल (Admin)</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Copyright & Cookie Consent Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} TechNova India. सर्वाधिकार सुरक्षित (All Rights Reserved).
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            {onOpenCookieSettings && (
              <button
                onClick={onOpenCookieSettings}
                className="hover:text-white underline underline-offset-4 transition"
              >
                कुकी प्राथमिकताएं (Cookie Settings)
              </button>
            )}
            <span>•</span>
            <span>Made for Indian Tech Learners</span>
            <span>•</span>
            <span className="text-slate-500">v1.0.0 Production</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

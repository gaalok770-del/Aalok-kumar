import React from 'react';
import { 
  ShieldCheck, Target, Users, BookOpen, Mail, Sparkles, 
  HelpCircle, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { SiteSettings } from '../types';

interface AboutPageProps {
  onNavigate: (path: string) => void;
  settings?: SiteSettings | null;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, settings }) => {
  return (
    <div className="pb-20 font-['Yantramanav']">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TechNova India Identity</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-['Plus_Jakarta_Sans'] tracking-tight">
            हमारे बारे में (About TechNova India)
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            "Technology Samjho, Smart Bano" — भारतीय पाठकों के लिए स्वतंत्र, स्पष्ट और व्यावहारिक तकनीकी मार्गदर्शक।
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-12">
        
        {/* What TechNova India is */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>TechNova India क्या है?</span>
          </h2>
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong>TechNova India</strong> एक स्वतंत्र डिजिटल प्रकाशन (Digital Publication) और टेक्नोलॉजी ज्ञान मंच है। आज के तेजी से बदलते डिजिटल युग में हर दिन नए AI टूल्स, स्मार्टफोन फीचर्स, ऑनलाइन फ्रॉड और ऐप्स सामने आ रहे हैं। 
          </p>
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            अंग्रेजी माध्यम में तकनीकी जानकारी प्रचुर मात्रा में उपलब्ध है, लेकिन भारत के करोड़ों सामान्य पाठकों, ग्रामीण व अर्ध-शहरी युवाओं, छात्रों और गृहिणियों के लिए सरल, प्रामाणिक और बिना किसी कठिन जार्गन (Technical jargon) के हिंदी में ज्ञान उपलब्ध कराना हमारा प्राथमिक लक्ष्य है।
          </p>
        </section>

        {/* Purpose */}
        <section className="p-6 sm:p-8 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span>हमारा उद्देश्य और मिशन (Our Mission)</span>
          </h2>
          <ul className="space-y-3 text-sm sm:text-base text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>सटीक और सत्यापित ज्ञान:</strong> हम इंटरनेट पर फैली भ्रामक खबरों या फेक डाउनलोड बटनों के बजाय केवल परीक्षित और प्रामाणिक तथ्य प्रकाशित करते हैं।</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>डिजिटल सुरक्षा जागरूकता:</strong> साइबर फ्रॉड, बैंक OTP घोटाले, और फर्जी ऐप्स से नागरिकों को सतर्क करना।</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>प्रैक्टिकल समाधान:</strong> समस्याओं के वास्तविक समाधान और स्टेप-बाय-स्टेप स्क्रीन गाइड उपलब्ध कराना।</span>
            </li>
          </ul>
        </section>

        {/* Topics Covered */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span>हम किन विषयों पर लिखते हैं? (Topics Covered)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">आर्टिफिशियल इंटेलिजेंस (AI)</h3>
              <p className="text-slate-600 dark:text-slate-400">ChatGPT, Google Gemini, इमेज व वीडियो AI टूल्स और भविष्य के जॉब्स।</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">स्मार्टफोन और हार्डवेयर</h3>
              <p className="text-slate-600 dark:text-slate-400">Android/iOS टिप्स, बैटरी लाइफ सेविंग, 5G सेटिंग्स, और सॉफ्टवेयर अपडेट्स।</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">साइबर सुरक्षा और डिजिटल प्राइवेसी</h3>
              <p className="text-slate-600 dark:text-slate-400">टू-फैक्टर ऑथेंटिकेशन (2FA), पासवर्ड मैनेजर्स, पब्लिक वाई-फाई सुरक्षा, और फिशिंग बचाव।</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">सॉफ्टवेयर और उपयोगी वेबसाइट्स</h3>
              <p className="text-slate-600 dark:text-slate-400">दैनिक जीवन को आसान बनाने वाले उपयोगी वेब टूल्स और मोबाइल ऐप्स की समीक्षा।</p>
            </div>
          </div>
        </section>

        {/* Commitment to Accurate Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span>सटीकता और निष्पक्षता की प्रतिबद्धता</span>
          </h2>
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            TechNova India किसी भी प्रायोजित सामग्री (Sponsored Content) या विज्ञापन को स्पष्ट रूप से लेबल करता है। हम कभी भी नकली रिव्यूज, फैब्रिकेटेड आंकड़े, या क्लिकबेट हेडलाइंस का सहारा नहीं लेते। हमारे हर लेख में प्राथमिक स्रोतों और आधिकारिक गाइडलाइन्स (जैसे MeitY, CERT-In, Android, Apple Security) के संदर्भ दिए जाते हैं।
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/editorial-policy')}
              className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              हमारी संपूर्ण संपादकीय नीति (Editorial Policy) पढ़ें <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Ownership & Transparency */}
        <section className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            स्वामित्व और संचालन (Ownership & Operations)
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            TechNova India तकनीक उत्साही स्वतंत्र शोधकर्ताओं और लेखकों द्वारा संचालित एक डिजिटल मंच है। हम किसी भी हार्डवेयर निर्माता या ऐप डेवलपर के दबाव में काम नहीं करते। वेबसाइट के मालिक और प्रकाशक विवरण व्यवस्थापक सेटिंग्स के माध्यम से पूरी तरह कॉन्फ़िगर किए जा सकते हैं।
          </p>
          <div className="pt-2 text-xs text-slate-500">
            ऑफिशियल संपर्क ईमेल:{' '}
            <strong className="text-blue-600 dark:text-blue-400">
              {settings?.contactEmail || 'contact@technova.in'}
            </strong>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="p-8 rounded-2xl bg-blue-600 text-white text-center space-y-4 shadow-lg">
          <h3 className="text-2xl font-bold font-['Plus_Jakarta_Sans']">
            क्या आपके पास कोई सवाल या सुझाव है?
          </h3>
          <p className="text-sm text-blue-100 max-w-lg mx-auto">
            हम अपने पाठकों के फीडबैक का हमेशा स्वागत करते हैं। यदि आपको किसी लेख में कोई त्रुटि दिखे या आप किसी खास विषय पर गाइड चाहते हों, तो बेझिझक संपर्क करें।
          </p>
          <button
            onClick={() => onNavigate('/contact-us')}
            className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-slate-100 transition shadow"
          >
            हमसे संपर्क करें (Contact Us Page)
          </button>
        </section>

      </div>
    </div>
  );
};

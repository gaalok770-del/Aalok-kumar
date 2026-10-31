import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Check, X, Settings2 } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentProps {
  forceOpen?: boolean;
  onCloseModal?: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ forceOpen, onCloseModal }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('technova_cookie_consent');
    if (!saved) {
      setShowBanner(true);
    } else {
      try {
        setPreferences(JSON.parse(saved));
      } catch {
        setShowBanner(true);
      }
    }
  }, []);

  useEffect(() => {
    if (forceOpen) {
      setShowModal(true);
    }
  }, [forceOpen]);

  const savePreferences = (prefs: CookiePreferences) => {
    setPreferences(prefs);
    localStorage.setItem('technova_cookie_consent', JSON.stringify(prefs));
    setShowBanner(false);
    setShowModal(false);
    if (onCloseModal) onCloseModal();
  };

  const handleAcceptAll = () => {
    savePreferences({ essential: true, analytics: true, marketing: true });
  };

  const handleAcceptEssential = () => {
    savePreferences({ essential: true, analytics: false, marketing: false });
  };

  if (!showBanner && !showModal) {
    return null;
  }

  return (
    <>
      {/* Bottom Floating Banner */}
      {showBanner && !showModal && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Cookie className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm">कुकी और गोपनीयता सहमति (Cookie Consent)</h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              TechNova India आपके अनुभव को बेहतर बनाने, सुरक्षा बनाए रखने और साइट के सुचारू संचालन के लिए आवश्यक कुकीज का उपयोग करता है।
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                सभी स्वीकारें (Accept All)
              </button>
              <button
                onClick={handleAcceptEssential}
                className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition"
              >
                केवल आवश्यक (Essential)
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                title="कस्टमाइज़ करें"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Detailed Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  कुकी प्राथमिकताएं (Cookie Preferences)
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  if (onCloseModal) onCloseModal();
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              {/* Essential */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                  <span>1. आवश्यक कुकीज (Strictly Essential)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">सदैव सक्रिय</span>
                </div>
                <p>वेबसाइट की मूल सुरक्षा, डार्क मोड प्राथमिकताओं और लॉगिन सत्र के लिए अनिवार्य हैं।</p>
              </div>

              {/* Analytics */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                  <span>2. एनालिटिक्स कुकीज (Site Analytics)</span>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>
                <p>हमें समझने में मदद करता है कि पाठक कौन से लेख अधिक पसंद कर रहे हैं ताकि हम बेहतर कंटेंट बना सकें।</p>
              </div>

              {/* Marketing */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                  <span>3. विज्ञापन एवं पार्टनर कुकीज (Marketing / Ads)</span>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>
                <p>यदि अधिकृत विज्ञापनदाता सक्षम किए जाएं तो प्रासंगिक विज्ञापन प्रदर्शित करने के लिए।</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => savePreferences(preferences)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                पसंद सेव करें (Save Preferences)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

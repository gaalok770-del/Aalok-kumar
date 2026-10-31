import React, { useState, useEffect } from 'react';
import { 
  Settings, KeyRound, Download, Upload, ShieldCheck, 
  Save, AlertCircle, CheckCircle2, Megaphone, Globe, Mail 
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { adminApi } from '../../services/api';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [settingsFeedback, setSettingsFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error fetching settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSavingSettings(true);
      setSettingsFeedback(null);
      await adminApi.updateSettings(settings);
      setSettingsFeedback({ type: 'success', message: 'साइट सेटिंग्स सफलतापूर्वक सुरक्षित कर दी गई हैं!' });
    } catch (err: any) {
      setSettingsFeedback({ type: 'error', message: err.message || 'सेटिंग्स सेव करने में त्रुटि।' });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (newPassword.length < 8) {
      setPasswordFeedback({ type: 'error', message: 'नया पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'नए पासवर्ड का मिलान नहीं हुआ।' });
      return;
    }

    try {
      await adminApi.changePassword(currentPassword, newPassword);
      setPasswordFeedback({ type: 'success', message: 'पासवर्ड सफलतापूर्वक बदल दिया गया है!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordFeedback({ type: 'error', message: err.message || 'पासवर्ड बदलने में त्रुटि।' });
    }
  };

  // Download DB Backup
  const handleDownloadBackup = () => {
    window.open('/api/admin/backup', '_blank');
  };

  // Restore DB from file
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const json = JSON.parse(reader.result as string);
        await adminApi.restoreDatabase(json);
        alert('डेटाबेस सफलतापूर्वक रीस्टोर हो गया है!');
        window.location.reload();
      } catch (err) {
        alert('गलत बैकअप फाइल फॉर्मेट। कृपया मान्य JSON बैकअप चुनें।');
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-500">सेटिंग्स लोड हो रही हैं...</div>;
  }

  return (
    <div className="space-y-8 font-['Yantramanav'] pb-16">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
          वेबसाइट सेटिंग्स (Settings)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          पहचान, सुरक्षा, विज्ञापन स्लॉट्स और डेटाबेस बैकअप कॉन्फ़िगरेशन।
        </p>
      </div>

      {/* Section 1: Site Identity & Contact */}
      {settings && (
        <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span>वेबसाइट पहचान एवं संपर्क विवरण (Site Identity)</span>
            </h2>
          </div>

          {settingsFeedback && (
            <div
              className={`p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                settingsFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-50 text-rose-800 border border-rose-300'
              }`}
            >
              {settingsFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{settingsFeedback.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                साइट का नाम (Site Name)
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                टैगलाइन (Tagline)
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              संपर्क ईमेल (Official Contact Email)
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
            />
          </div>

          {/* Advertisements Management (Requirement #19) */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-amber-500" />
                  <span>विज्ञापन प्रबंधन (Advertising Placements)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Google AdSense या पार्टनर विज्ञापन कोड को सक्षम या कस्टमाइज़ करें।
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableAds}
                  onChange={(e) => setSettings({ ...settings, enableAds: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {settings.enableAds && (
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    Header Banner Ad Code (HTML / Script)
                  </label>
                  <textarea
                    rows={2}
                    value={settings.adHeaderCode || ''}
                    onChange={(e) => setSettings({ ...settings, adHeaderCode: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    In-Article Ad Code (HTML / Script)
                  </label>
                  <textarea
                    rows={2}
                    value={settings.adInArticleCode || ''}
                    onChange={(e) => setSettings({ ...settings, adInArticleCode: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={savingSettings}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{savingSettings ? 'सेव हो रहा है...' : 'सेटिंग्स सेव करें'}</span>
          </button>
        </form>
      )}

      {/* Section 2: Change Admin Password */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
          <KeyRound className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            व्यवस्थापक पासवर्ड बदलें (Change Password)
          </h2>
        </div>

        {passwordFeedback && (
          <div
            className={`p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
              passwordFeedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-rose-50 text-rose-800 border border-rose-300'
            }`}
          >
            {passwordFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{passwordFeedback.message}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              वर्तमान पासवर्ड (Current Password)
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              नया पासवर्ड (New Password - न्यूनतम 8 अक्षर)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              नया पासवर्ड दोहराएं (Confirm New Password)
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>पासवर्ड अपडेट करें</span>
          </button>
        </form>
      </div>

      {/* Section 3: Database Backup & Restore */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-emerald-600" />
          <span>डेटाबेस बैकअप एवं रीस्टोर (Zero Data Loss Protection)</span>
        </h2>
        <p className="text-xs text-slate-500">
          सभी लेखों, सेटिंग्स और संदेशों का एक क्लिक में संपूर्ण बैकअप डाउनलोड करें या सर्वर पर रीस्टोर करें।
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>डेटाबेस JSON डाउनलोड करें (Export)</span>
          </button>

          <label className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-slate-300 dark:border-slate-600">
            <Upload className="w-4 h-4" />
            <span>बैकअप फाइल से रीस्टोर करें (Import)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleRestoreFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

    </div>
  );
};

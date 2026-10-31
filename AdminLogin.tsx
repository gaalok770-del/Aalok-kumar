import React, { useState } from 'react';
import { 
  Lock, Mail, ArrowRight, ShieldCheck, KeyRound, AlertCircle, 
  Sparkles, Eye, EyeOff, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('admin@technova.in');
  const [password, setPassword] = useState('TechNova@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const performLogin = async (userVal: string, passVal: string) => {
    setError(null);
    const cleanUser = userVal.trim();
    const cleanPass = passVal.trim();

    if (!cleanUser || !cleanPass) {
      setError('कृपया ईमेल/यूजरनेम और पासवर्ड दोनों दर्ज करें।');
      return;
    }

    try {
      setLoading(true);
      await login(cleanUser, cleanPass);
      onLoginSuccess();
    } catch (err: any) {
      console.error('Admin login error', err);
      setError(err.message || 'लॉगिन विफल। कृपया क्रेडेंशियल्स की जांच करें।');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(usernameOrEmail, password);
  };

  const fillAndLoginDefault = () => {
    setUsernameOrEmail('admin@technova.in');
    setPassword('TechNova@2026!');
    performLogin('admin@technova.in', 'TechNova@2026!');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-['Yantramanav']">
      <div className="max-w-md w-full space-y-6">
        
        {/* Top Logo & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-700 text-white shadow-lg shadow-blue-500/20 mb-2">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            TechNova व्यवस्थापक पोर्टल
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            सुरक्षित एडमिन पैनल में लॉगिन करें और मोबाइल या कंप्यूटर से लेख प्रकाशित करें।
          </p>
        </div>

        {/* Login Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                ईमेल या यूजरनेम (Email / Username)
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="admin@technova.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  पासवर्ड (Password)
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'छुपाएं' : 'दिखाएं'}</span>
                </button>
              </div>
              <div className="relative flex items-center">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>सत्यापन हो रहा है...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>लॉगिन करें (Admin Login)</span>
                </>
              )}
            </button>

            {/* Quick 1-Click Login Button */}
            <button
              type="button"
              disabled={loading}
              onClick={fillAndLoginDefault}
              className="w-full py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>One-Click Quick Admin Login (डिफ़ॉल्ट लॉगिन)</span>
            </button>
          </form>

          {/* Quick Default Credentials Helper Box */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-slate-900/60 border border-blue-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                प्रारंभिक व्यवस्थापक क्रेडेंशियल्स:
              </span>
              <button
                type="button"
                onClick={() => {
                  setUsernameOrEmail('admin@technova.in');
                  setPassword('TechNova@2026!');
                }}
                className="text-[11px] font-bold text-blue-700 dark:text-blue-400 underline hover:text-blue-800"
              >
                Reset Fields
              </button>
            </div>
            <div className="text-slate-600 dark:text-slate-400 font-mono text-[11px] space-y-0.5">
              <div>ईमेल: <strong>admin@technova.in</strong></div>
              <div>पासवर्ड: <strong>TechNova@2026!</strong></div>
            </div>
            <p className="text-[10px] text-slate-500">
              * लॉगिन के बाद व्यवस्थापक सेटिंग्स में जाकर आप पासवर्ड बदल सकते हैं।
            </p>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onNavigateHome}
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
            >
              ← वेबसाइट के मुख्य पृष्ठ पर लौटें
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

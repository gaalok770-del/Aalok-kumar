import React, { useState } from 'react';
import { 
  Mail, Send, CheckCircle2, AlertCircle, MessageSquare, 
  Clock, ShieldCheck, MapPin, RefreshCw 
} from 'lucide-react';
import { SiteSettings } from '../types';
import { publicApi } from '../services/api';

interface ContactPageProps {
  onNavigate: (path: string) => void;
  settings?: SiteSettings | null;
  initialSubject?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  settings,
  initialSubject = '',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState('');

  // Spam protection math puzzle
  const [mathPuzzle, setMathPuzzle] = useState(() => {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 1;
    return { a, b, answer: a + b };
  });
  const [mathInput, setMathInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
    ticketId?: string;
  } | null>(null);

  const resetPuzzle = () => {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 1;
    setMathPuzzle({ a, b, answer: a + b });
    setMathInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'कृपया फॉर्म के सभी आवश्यक फील्ड भरें।',
      });
      return;
    }

    if (parseInt(mathInput, 10) !== mathPuzzle.answer) {
      setStatusMessage({
        type: 'error',
        text: 'स्पैम सुरक्षा का गलत उत्तर। कृपया गणित के सवाल का सही उत्तर दें।',
      });
      return;
    }

    try {
      setLoading(true);
      const res = await publicApi.submitContact({
        name,
        email,
        subject,
        message,
        mathAnswer: parseInt(mathInput, 10),
        mathExpected: mathPuzzle.answer,
      });

      setStatusMessage({
        type: 'success',
        text: res.message || 'आपका संदेश सफलतापूर्वक भेज दिया गया है।',
        ticketId: res.ticketId,
      });

      // Clear fields
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      resetPuzzle();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'संदेश भेजने में तकनीकी समस्या आई। कृपया पुनः प्रयास करें।',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20 font-['Yantramanav']">
      
      {/* Banner */}
      <div className="bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black font-['Plus_Jakarta_Sans'] tracking-tight">
            संपर्क करें (Contact TechNova India)
          </h1>
          <p className="text-base text-slate-300 max-w-xl mx-auto">
            प्रश्नों, सुझावों, संपादकीय सुधार, या साझेदारी के लिए हमारी टीम से सीधा संपर्क करें।
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Info Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                सीधी बातचीत व संपर्क विवरण
              </h2>

              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 dark:text-white">ईमेल पता:</span>
                    <a
                      href={`mailto:${settings?.contactEmail || 'contact@technova.in'}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                    >
                      {settings?.contactEmail || 'contact@technova.in'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 dark:text-white">प्रतिक्रिया समय (Response Time):</span>
                    <span>24 से 48 कार्य घंटों के भीतर उत्तर दिया जाता है।</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 dark:text-white">गोपनीयता आश्वासन:</span>
                    <span>आपका ईमेल सुरक्षित रहता है और कभी किसी तीसरे पक्ष के साथ साझा नहीं किया जाता।</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 space-y-1">
                <strong>लेखक या समीक्षक हैं?</strong>
                <p>
                  यदि आप TechNova India पर तकनीकी लेख लिखना चाहते हैं, तो कृपया{' '}
                  <button onClick={() => onNavigate('/write-for-us')} className="text-blue-600 underline font-semibold">
                    Write For Us
                  </button>{' '}
                  पेज देखें।
                </p>
              </div>
            </div>
          </div>

          {/* Right Functional Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                  संदेश भेजें (Send a Message)
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  नीचे दिया गया फॉर्म सीधे हमारे सुरक्षित सर्वर पर संदेश सुरक्षित करता है।
                </p>
              </div>

              {/* Status Alert */}
              {statusMessage && (
                <div
                  className={`p-4 rounded-xl text-sm flex items-start gap-3 ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-semibold">{statusMessage.text}</p>
                    {statusMessage.ticketId && (
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        संदर्भ आईडी (Ticket ID): <strong>{statusMessage.ticketId}</strong>
                      </p>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      आपका नाम (Full Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="उदा. राहुल शर्मा"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      ईमेल पता (Email Address) *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    विषय (Subject) *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="संदेश का मुख्य विषय (जैसे: लेख में सुधार, प्रश्न, विज्ञापन)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    विस्तृत संदेश (Your Message) *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="अपना संदेश यहाँ लिखें..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                {/* Spam Protection Puzzle */}
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>सुरक्षा जांच: {mathPuzzle.a} + {mathPuzzle.b} = ?</span>
                    <button
                      type="button"
                      onClick={resetPuzzle}
                      className="text-slate-400 hover:text-blue-600 transition"
                      title="नया सवाल"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="number"
                    required
                    value={mathInput}
                    onChange={(e) => setMathInput(e.target.value)}
                    placeholder="उत्तर लिखें"
                    className="w-28 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>भेजा जा रहा है...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>संदेश भेजें (Submit Message)</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

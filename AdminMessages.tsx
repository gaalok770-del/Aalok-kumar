import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Mail, Trash2, CheckCircle2, Clock, 
  User, RefreshCw, AlertCircle 
} from 'lucide-react';
import { ContactMessage } from '../../types';
import { adminApi } from '../../services/api';

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getMessages();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusChange = async (id: string, newStatus: 'unread' | 'read' | 'replied') => {
    try {
      await adminApi.updateMessageStatus(id, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('क्या आप इस संदेश को हटाना चाहते हैं?')) return;
    try {
      await adminApi.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Error deleting message', err);
    }
  };

  const formatDate = (dStr: string) => {
    try {
      return new Date(dStr).toLocaleString('hi-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return dStr;
    }
  };

  return (
    <div className="space-y-6 font-['Yantramanav'] pb-16">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            पाठक पूछताछ एवं संदेश (Contact Inquiries)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            पाठकों द्वारा संपर्क फॉर्म के माध्यम से भेजे गए सभी संदेश।
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>रिफ्रेश</span>
        </button>
      </div>

      {loading && (
        <div className="py-16 text-center text-slate-500 text-sm">संदेश लोड हो रहे हैं...</div>
      )}

      {!loading && messages.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">कोई संदेश नहीं मिला</h3>
          <p className="text-xs text-slate-500">
            जब पाठक संपर्क फॉर्म भरेंगे, उनके संदेश यहाँ सुरक्षित रूप से दिखाई देंगे।
          </p>
        </div>
      )}

      {!loading && messages.length > 0 && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            कुल <strong>{messages.length}</strong> संदेश सुरक्षित
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-2xl border transition space-y-3 ${
                msg.status === 'unread'
                  ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {msg.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {msg.name}
                    </h3>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {msg.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                    ID: {msg.id}
                  </span>
                  <span>•</span>
                  <span>{formatDate(msg.createdAt)}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  विषय: {msg.subject}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 whitespace-pre-line">
                  {msg.message}
                </p>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className="text-slate-500">स्थिति:</span>
                  <select
                    value={msg.status}
                    onChange={(e) => handleStatusChange(msg.id, e.target.value as any)}
                    className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                  >
                    <option value="unread">नया (Unread)</option>
                    <option value="read">पढ़ा गया (Read)</option>
                    <option value="replied">उत्तर दिया (Replied)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${msg.email}?subject=Re:%20${encodeURIComponent(msg.subject)}`}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>ईमेल उत्तर दें</span>
                  </a>

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                    title="डिलीट करें"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

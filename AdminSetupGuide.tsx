import React from 'react';
import { 
  BookOpen, Terminal, Smartphone, Database, HardDrive, 
  Key, Shield, Globe, Server, Download, RefreshCw, 
  CheckCircle2, AlertTriangle, Layers, Lock
} from 'lucide-react';

export const AdminSetupGuide: React.FC = () => {
  return (
    <div className="space-y-8 font-['Yantramanav'] pb-20">
      
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-blue-600" />
          <span>उत्पादन सेटअप, डिप्लॉयमेंट एवं मोबाइल पब्लिशिंग गाइड</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          TechNova India को स्थानीय स्तर पर चलाने, GitHub पर पुश करने, क्लाउड पर होस्ट करने और मोबाइल से आर्टिकल पब्लिश करने का संपूर्ण मैनुअल।
        </p>
      </div>

      {/* Guide Content Sections */}
      <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300">
        
        {/* Section 1: Source code & Local run */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-600" />
            <span>1. सोर्स कोड और लोकल डेवलपमेंट सेटअप (Local Setup)</span>
          </h2>
          <p>
            TechNova India Node.js, Express, React, Vite और Tailwind CSS से निर्मित एक पूर्ण-स्टैक (Full-Stack) एप्लिकेशन है।
          </p>
          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2 overflow-x-auto">
            <div># रिपॉजिटरी क्लोन करें या ज़िप डाउनलोड करें</div>
            <div className="text-emerald-400">git clone https://github.com/your-username/technova-india.git</div>
            <div className="text-emerald-400">cd technova-india</div>
            <br />
            <div># सभी निर्भरताएं (Dependencies) स्थापित करें</div>
            <div className="text-emerald-400">npm install</div>
            <br />
            <div># डेवलपमेंट सर्वर प्रारंभ करें (Port 3000)</div>
            <div className="text-emerald-400">npm run dev</div>
          </div>
          <p className="text-xs text-slate-500">
            ब्राउज़र में <strong>http://localhost:3000</strong> खोलें। सार्वजनिक वेबसाइट और <strong>/admin</strong> दोनों तुरंत सक्रिय होंगे।
          </p>
        </div>

        {/* Section 2: Environment Variables & Secrets */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-600" />
            <span>2. एन्वायर्नमेंट वेरिएबल्स एवं सीक्रेट्स (.env)</span>
          </h2>
          <p>
            रूट डायरेक्टरी में <code className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded font-mono text-xs">.env</code> फाइल बनाएं:
          </p>
          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-1 overflow-x-auto">
            <div>PORT=3000</div>
            <div>NODE_ENV=production</div>
            <div>JWT_SECRET=your_super_secret_high_entropy_key_2026</div>
            <div>APP_URL=https://yourdomain.com</div>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs">
            * कभी भी JWT_SECRET या डेटाबेस क्रेडेंशियल्स को सार्वजनिक गिट रिपॉजिटरी में कमिट न करें। <code className="font-mono">.gitignore</code> में <code className="font-mono">.env</code> सुरक्षित है।
          </div>
        </div>

        {/* Section 3: Database & Image Storage */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <span>3. डेटाबेस और इमेज स्टोरेज पर्सिस्टेंस</span>
          </h2>
          <p>
            TechNova India बिना किसी भारी SQL सर्वर प्रबंधन के एक शक्तिशाली ऑटोमैटिक JSON डेटाबेस इंजन (<code className="font-mono text-xs">data/db.json</code>) का उपयोग करता है।
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li><strong>डेटा डायरेक्टरी:</strong> <code className="font-mono">/data/db.json</code> में सभी लेख, श्रेणियां, सेटिंग्स और पासवर्ड हैश सुरक्षित रहते हैं। प्रत्येक बदलाव पर यह सुरक्षित तरीके से डिस्क पर राइट होता है।</li>
            <li><strong>इमेज डायरेक्टरी:</strong> <code className="font-mono">/uploads/</code> में मोबाइल फोन या कंप्यूटर से अपलोड की गई सभी तस्वीरें सुरक्षित सेव होती हैं और Express द्वारा <code className="font-mono">/uploads/imagename.jpg</code> पर सीधे सर्व की जाती हैं।</li>
            <li><strong>क्लाउड डिप्लॉयमेंट टिप:</strong> यदि आप Docker, Railway, Render या VPS (DigitalOcean/Linode) पर डिप्लॉय करते हैं, तो <code className="font-mono">/data</code> और <code className="font-mono">/uploads</code> को एक <em>Persistent Volume</em> के साथ माउंट करें।</li>
          </ul>
        </div>

        {/* Section 4: First Administrator Login */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            <span>4. पहले व्यवस्थापक (First Admin) का लॉगिन और पासवर्ड परिवर्तन</span>
          </h2>
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2 text-xs">
            <p><strong>प्रारंभिक डिफ़ॉल्ट क्रेडेंशियल्स:</strong></p>
            <div className="font-mono text-[11px] space-y-0.5 text-slate-800 dark:text-slate-200">
              <div>ईमेल: <strong>admin@technova.in</strong> (या यूजरनेम: admin)</div>
              <div>पासवर्ड: <strong>TechNova@2026!</strong></div>
            </div>
          </div>
          <p className="text-xs">
            1. <code className="font-mono">/admin/login</code> पर जाएं और ऊपर दिए गए क्रेडेंशियल्स से लॉगिन करें।
            <br />
            2. लॉगिन के बाद बाईं ओर / ऊपर दिए गए <strong>"सेटिंग्स (Settings)"</strong> टैब पर जाएं।
            <br />
            3. <strong>"व्यवस्थापक पासवर्ड बदलें"</strong> सेक्शन में जाकर अपना व्यक्तिगत, 8+ अक्षरों का मजबूत पासवर्ड सेट करें।
          </p>
        </div>

        {/* Section 5: Mobile Publishing Guide (Crucial user requirement) */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white space-y-4 shadow-lg">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-sky-400" />
            <span>5. मोबाइल फोन से बिना कोड छुए आर्टिकल कैसे लिखें और पब्लिश करें?</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            TechNova India का व्यवस्थापक पैनल विशेष रूप से टचस्क्रीन मोबाइल और स्मार्टफोन्स के लिए अनुकूलित है:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-300">
            <li>अपने फोन के Chrome या Safari ब्राउज़र में वेबसाइट का एड्रेस खोलें और <code className="font-mono bg-white/10 px-1.5 py-0.5 rounded">/admin</code> पर जाएं।</li>
            <li>सुरक्षित लॉगिन करें।</li>
            <li>डैशबोर्ड पर <strong>"+ नया आर्टिकल लिखें"</strong> बटन पर टैप करें।</li>
            <li><strong>"मोबाइल / पीसी से फोटो चुनें"</strong> पर टैप करके सीधे फोन की गैलरी से फोटो चुनें या कैमरे से खींचें।</li>
            <li>शीर्षक, श्रेणी और हिंदी सामग्री टाइप करें।</li>
            <li>नीचे दिए गए <strong>"Publish Now"</strong> बटन पर टैप करें।</li>
            <li>आपका आर्टिकल तुरंत लाइव हो जाएगा और होमपेज, संबंधित श्रेणी एवं साइटमैप में दिखने लगेगा!</li>
          </ol>
        </div>

        {/* Section 6: Free Hosting vs Paid Providers */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            <span>6. क्लाउड होस्टिंग, कस्टम डोमेन और HTTPS (Free vs Paid)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <strong className="block text-sm text-emerald-600">मुफ्त / फ्री टियर्स (Free Plans):</strong>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                <li><strong>Render / Railway:</strong> फ्री टियर में Node.js Express फुल-स्टैक ऐप आसानी से होस्ट होता है।</li>
                <li><strong>Google Cloud Run:</strong> फ्री टियर में हर महीने 20 लाख अनुरोध मुफ्त मिलते हैं।</li>
                <li><strong>Cloudflare:</strong> फ्री SSL/HTTPS और निशुल्क CDN प्रॉक्सी सुरक्षा।</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <strong className="block text-sm text-blue-600">कस्टम डोमेन एवं पेड अपग्रेड्स:</strong>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                <li><strong>डोमेन नेम:</strong> <code className="font-mono">technova.in</code> (~₹499/वर्ष Godaddy या Cloudflare से)।</li>
                <li><strong>Persistent Storage:</strong> VPS या क्लाउड वॉल्यूम पर ₹300-₹500/महीना ताकि अनगिनत तस्वीरें हमेशा सुरक्षित रहें।</li>
                <li><strong>ईमेल डिलीवरी:</strong> Brevo / Resend (प्रतिदिन 300 ईमेल मुफ्त)।</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 7: Backup and Disaster Recovery */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>7. बैकअप एवं डिजास्टर रिकवरी (Disaster Recovery)</span>
          </h2>
          <p className="text-xs leading-relaxed">
            यदि कभी सर्वर क्रैश हो जाए या आपको नए होस्ट पर माइग्रेट करना हो:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>व्यवस्थापक सेटिंग्स में जाकर समय-समय पर <strong>"डेटाबेस JSON डाउनलोड करें"</strong> पर क्लिक करके बैकअप अपने कंप्यूटर या Google Drive पर सुरक्षित रखें।</li>
            <li>नए सर्वर पर TechNova चलाकर केवल <strong>"बैकअप फाइल से रीस्टोर करें"</strong> पर वह JSON फाइल अपलोड कर दें। सारा डेटा, श्रेणियां और लेख 1 सेकंड में वापस आ जाएंगे!</li>
          </ul>
        </div>

      </div>

    </div>
  );
};

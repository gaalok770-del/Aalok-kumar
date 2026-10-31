import React, { useEffect } from 'react';
import { 
  Shield, FileText, AlertTriangle, CheckCircle2, 
  RefreshCw, Cookie, Megaphone, PenTool, ArrowLeft, Mail 
} from 'lucide-react';
import { SiteSettings } from '../types';

export type PolicyType = 
  | 'privacy-policy'
  | 'disclaimer'
  | 'terms-and-conditions'
  | 'editorial-policy'
  | 'corrections-policy'
  | 'cookie-policy'
  | 'advertise-with-us'
  | 'write-for-us';

interface PolicyPageProps {
  type: PolicyType;
  onNavigate: (path: string) => void;
  settings?: SiteSettings | null;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ type, onNavigate, settings }) => {
  const contactEmail = settings?.contactEmail || 'contact@technova.in';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [type]);

  const renderContent = () => {
    switch (type) {
      case 'privacy-policy':
        return {
          title: 'गोपनीयता नीति (Privacy Policy)',
          subtitle: 'TechNova India पर आपके व्यक्तिगत डेटा की सुरक्षा और उपयोग के पारदर्शी नियम।',
          icon: Shield,
          date: 'अंतिम संशोधन: 2026-03-20',
          body: (
            <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. परिचय एवं उद्देश्य</h2>
                <p>
                  TechNova India ("हम", "हमारी साइट") में हम अपने पाठकों की गोपनीयता का पूरा सम्मान करते हैं। यह गोपनीयता नीति स्पष्ट करती है कि जब आप हमारी वेबसाइट पर आते हैं, तो कौन-सी जानकारी एकत्र की जाती है, उसका उपयोग कैसे किया जाता है और आपके क्या अधिकार हैं।
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. एकत्र की जाने वाली जानकारी</h2>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>स्वैच्छिक जानकारी:</strong> जब आप हमारे संपर्क फॉर्म के जरिए संदेश भेजते हैं, तो आपका नाम, ईमेल और विषय हमारे सर्वर में संदेश का उत्तर देने के लिए सुरक्षित रखा जाता है।</li>
                  <li><strong>सर्वर लॉग्स (Server Logs):</strong> वेबसाइट की सुरक्षा और स्पैम से बचाव के लिए मानक सर्वर लॉग्स जैसे IP एड्रेस, ब्राउज़र प्रकार, अनुरोध का समय स्वचालित रूप से लॉग हो सकते हैं।</li>
                  <li><strong>कुकीज (Cookies):</strong> साइट की थीम (डार्क/लाइट मोड) और प्राथमिकताओं को याद रखने के लिए स्थानीय स्टोरेज/कुकीज का उपयोग किया जाता है।</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Google AdSense एवं विज्ञापन पार्टनर्स</h2>
                <p>
                  जब विज्ञापन सक्षम किए जाते हैं, तो तीसरे पक्ष के वेंडर्स (जैसे Google) उपयोगकर्ताओं के पिछले विजिट्स के आधार पर विज्ञापन प्रदर्शित करने के लिए कुकीज़ का उपयोग कर सकते हैं। उपयोगकर्ता Google Ad Settings में जाकर वैयक्तिकृत विज्ञापन ऑप्ट-आउट कर सकते हैं।
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. बच्चों की गोपनीयता (Children's Privacy)</h2>
                <p>
                  हमारी वेबसाइट सामान्य तकनीक सीखने वाले पाठकों के लिए है। हम 13 वर्ष से कम उम्र के बच्चों से जानबूझकर कोई भी व्यक्तिगत पहचान योग्य जानकारी एकत्र नहीं करते हैं।
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. डेटा सुरक्षा एवं संपर्क</h2>
                <p>
                  हम किसी भी उपयोगकर्ता के डेटा को तीसरे पक्ष को व्यावसायिक लाभ के लिए नहीं बेचते। यदि आपके पास इस नीति से संबंधित कोई प्रश्न हैं, तो आप <a href={`mailto:${contactEmail}`} className="text-blue-600 underline font-semibold">{contactEmail}</a> पर संपर्क कर सकते हैं।
                </p>
              </section>
            </div>
          )
        };

      case 'disclaimer':
        return {
          title: 'अस्वीकरण (Disclaimer)',
          subtitle: 'सामग्री की प्रकृति, सटीकता की सीमाएं और निष्पक्ष सूचना प्रकटीकरण।',
          icon: AlertTriangle,
          date: 'अंतिम संशोधन: 2026-03-20',
          body: (
            <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. केवल सूचनात्मक एवं शैक्षणिक उद्देश्य</h2>
                <p>
                  TechNova India पर प्रकाशित सभी लेख, गाइड, सुझाव और विश्लेषण केवल सामान्य तकनीकी शिक्षा और जागरूकता के उद्देश्य से प्रदान किए जाते हैं। हम किसी भी कानूनी, वित्तीय या आधिकारिक तकनीकी वारंटी का दावा नहीं करते।
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. तकनीकी बदलाव और कीमतों में परिवर्तन</h2>
                <p>
                  प्रौद्योगिकी बहुत तेजी से बदलती है। किसी ऐप का इंटरफेस, स्मार्टफोन सॉफ्टवेयर वर्जन या गैजेट्स की कीमतें हमारे लेख लिखने के बाद बदल सकती हैं। हम पाठकों को सलाह देते हैं कि किसी भी वित्तीय लेनदेन या महत्वपूर्ण सिस्टम अपडेट से पहले आधिकारिक वेबसाइट पर पुष्टि अवश्य करें।
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. बाहरी लिंक्स (External Links)</h2>
                <p>
                  हमारे लेखों में सुविधा और प्रमाण के लिए बाहरी वेबसाइटों के लिंक्स शामिल होते हैं। उन बाहरी साइटों की सामग्री, सुरक्षा या नीतियों पर TechNova India का कोई नियंत्रण नहीं है।
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. एफिलिएट और प्रायोजित सामग्री</h2>
                <p>
                  यदि किसी लेख में कोई एफिलिएट लिंक या प्रायोजित (Sponsored) उत्पाद शामिल होगा, तो उसे लेख के प्रारंभ में ही स्पष्ट रूप से चिन्हित किया जाएगा। हमारी समीक्षाएं सदैव स्वतंत्र और निष्पक्ष रहेंगी।
                </p>
              </section>
            </div>
          )
        };

      case 'terms-and-conditions':
        return {
          title: 'नियम और शर्तें (Terms & Conditions)',
          subtitle: 'TechNova India वेबसाइट का उपयोग करने संबंधी नियम और कानूनी शर्तें।',
          icon: FileText,
          date: 'अंतिम संशोधन: 2026-03-20',
          body: (
            <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. शर्तों की स्वीकृति</h2>
                <p>
                  TechNova India वेबसाइट का उपयोग करके आप इन नियमों और शर्तों से बंधे होने की सहमति देते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया साइट का उपयोग न करें।
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. बौद्धिक संपदा अधिकार (Intellectual Property)</h2>
                <p>
                  TechNova India पर प्रकाशित सभी मूल हिंदी लेख, व्याख्याएं, और संरचना हमारी बौद्धिक संपदा हैं। किसी भी लेख की पूरी सामग्री को बिना पूर्व लिखित अनुमति के कॉपी, री-पब्लिश या री-प्रोड्यूस करना प्रतिबंधित है। आप स्रोत के उचित श्रेय (Proper Attribution & Backlink) के साथ संक्षिप्त अंश साझा कर सकते हैं।
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. निषिद्ध गतिविधियाँ</h2>
                <p>वेबसाइट पर निम्नलिखित कृत्य प्रतिबंधित हैं:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>साइट पर किसी भी प्रकार के स्पैम, मैलवेयर या दुर्भावनापूर्ण कोड भेजना।</li>
                  <li>वेबसाइट के सर्वर या सुरक्षा तंत्र को नुकसान पहुँचाने का प्रयास।</li>
                  <li>अनुचित या गैर-कानूनी टिप्पणियाँ या संदेश भेजना।</li>
                </ul>
              </section>
            </div>
          )
        };

      case 'editorial-policy':
        return {
          title: 'संपादकीय नीति (Editorial Policy)',
          subtitle: 'विश्वसनीयता, तथ्य-जांच और पत्रकारिता मानकों के प्रति हमारी अटूट प्रतिबद्धता।',
          icon: CheckCircle2,
          date: 'अंतिम संशोधन: 2026-03-20',
          body: (
            <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. प्राथमिक एवं प्रामाणिक स्रोतों की प्राथमिकता</h2>
                <p>
                  TechNova India की संपादकीय टीम केवल आधिकारिक रिलीज, शोध पत्रों, डेवलपर दस्तावेज़ों (जैसे Google Developer, Apple Security, MeitY) से जानकारी की पुष्टि के बाद ही लेख प्रकाशित करती है। हम अनजानी सोशल मीडिया अफवाहों को तकनीकी तथ्य के रूप में कभी प्रस्तुत नहीं करते।
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. भ्रामक हेडलाइंस (No Clickbait) से पूर्ण परहेज</h2>
                <p>
                  हमारा शीर्षक सदैव लेख की वास्तविक सामग्री को दर्शाता है। पाठकों का समय अत्यंत मूल्यवान है, इसलिए हम झूठे वादों ("यह 1 क्लिक में फोन की बैटरी 100 साल चलाएगा!") जैसे सनसनीखेज दावों से दूर रहते हैं।
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. समाचार और राय में स्पष्ट अंतर</h2>
                <p>
                  जब हम किसी घटना या अपडेट की रिपोर्ट करते हैं, तो वह तटस्थ होती है। यदि किसी लेख में लेखक की व्यक्तिगत समीक्षा या राय शामिल है, तो उसे स्पष्ट रूप से "समीक्षा / विश्लेषण" के रूप में टैग किया जाता है।
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. पुरानी सामग्री का नियमित नवीनीकरण</h2>
                <p>
                  तकनीकी जानकारी पुरानी हो सकती है। हमारी टीम प्रकाशित लेखों की समय-समय पर समीक्षा करती है और महत्वपूर्ण बदलाव होने पर 'Updated Date' के साथ लेख को नवीनीकृत करती है।
                </p>
              </section>
            </div>
          )
        };

      case 'corrections-policy':
        return {
          title: 'सुधार नीति (Corrections Policy)',
          subtitle: 'गलतियों को ईमानदारी से स्वीकार करना और तुरंत पारदर्शी सुधार करना।',
          icon: RefreshCw,
          date: 'अंतिम संशोधन: 2026-03-20',
          body: (
            <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. हमारी सुधार नीति का सिद्धांत</h2>
                <p>
                  सटीकता हमारा सर्वोच्च मानक है, किंतु मनुष्य होने के नाते कभी-कभी अनजाने में कोई वर्तनी, तकनीकी संस्करण संख्या या तथ्य की त्रुटि हो सकती है। TechNova India अपनी गलतियों को छुपाने के बजाय उन्हें तुरंत और स्पष्ट रूप से सुधारने में विश्वास रखता है।
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. त्रुटि रिपोर्ट कैसे करें?</h2>
                <p>
                  यदि आपको हमारे किसी भी लेख में कोई गलत तथ्य, आउटडेटेड जानकारी या लिंक दिखता है, तो कृपया निम्नलिखित माध्यम से हमें सूचित करें:
                </p>
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 space-y-2">
                  <p className="font-semibold text-blue-900 dark:text-blue-300">
                    ईमेल: <a href={`mailto:${contactEmail}?subject=Editorial%20Correction`} className="underline">{contactEmail}</a>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    कृपया विषय में "Correction: [Article Title]" लिखें और सही स्रोत या संदर्भ संलग्न करें।
                  </p>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. सुधार प्रक्रिया</h2>
                <p>
                  हमारी तथ्य-जांच टीम 24 घंटे के भीतर दावे का परीक्षण करती है। यदि त्रुटि प्रमाणित होती है, तो लेख में तुरंत संशोधन किया जाता है और लेख के अंत में एक नोट (Correction Note) जोड़ा जाता है।
                </p>
              </section>
            </div>
          )
        };

      case 'cookie-policy':
        return {
          title: 'कुकी नीति (Cookie Policy)',
          subtitle: 'हमारी वेबसाइट पर कुकीज और स्थानीय स्टोरेज तकनीकों का उपयोग।',
          icon: Cookie,
          date: 'अंतिम संशोधन: 2026-03-20',
          body: (
            <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. कुकीज क्या होती हैं?</h2>
                <p>
                  कुकीज छोटी टेक्स्ट फाइलें होती हैं जो वेबसाइट खोलते समय आपके ब्राउज़र में स्टोर की जाती हैं। यह वेबसाइट को यह याद रखने में मदद करती है कि आपने कौन-सी सेटिंग्स (जैसे डार्क मोड) चुनी थीं।
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. हम कौन-सी कुकीज इस्तेमाल करते हैं?</h2>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>अनिवार्य कुकीज:</strong> वेबसाइट नेविगेशन, व्यवस्थापक लॉगिन सुरक्षा और डार्क मोड के लिए।</li>
                  <li><strong>पसंद कुकीज:</strong> आपकी भाषा और कुकी सहमति विकल्पों को याद रखने के लिए।</li>
                  <li><strong>एनालिटिक्स कुकीज:</strong> यह समझने के लिए कि कौन से आर्टिकल सबसे ज्यादा पढ़े जा रहे हैं (यदि सक्षम हो)।</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. अपनी कुकी प्राथमिकताएं कैसे बदलें?</h2>
                <p>
                  आप हमारे फूटर में दिए गए "कुकी प्राथमिकताएं (Cookie Settings)" लिंक पर क्लिक करके किसी भी समय अपनी पसंद अपडेट कर सकते हैं।
                </p>
              </section>
            </div>
          )
        };

      case 'advertise-with-us':
        return {
          title: 'विज्ञापन दें (Advertise With Us)',
          subtitle: 'लाखों भारतीय तकनीकी शिक्षार्थियों और पाठकों तक अपने उत्पाद व सेवाओं को पहुंचाएं।',
          icon: Megaphone,
          date: 'अपडेटेड: 2026-03-20',
          body: (
            <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. TechNova India का पाठक वर्ग</h2>
                <p>
                  TechNova India भारत के तकनीक-प्रेमी छात्रों, डेवलपर्स, स्मार्टफोन खरीदारों और डिजिटल सुरक्षा के प्रति जागरूक नागरिकों का एक तेजी से बढ़ता हुआ समुदाय है। हमारे पाठक निष्पक्ष और व्यावहारिक सलाह की तलाश में आते हैं।
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. उपलब्ध विज्ञापन प्रारूप</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <strong className="block text-slate-900 dark:text-white mb-1">हेडर लीडरबोर्ड (728x90 / 320x50)</strong>
                    <span>वेबसाइट के शीर्ष पर प्रमुख दृश्यता।</span>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <strong className="block text-slate-900 dark:text-white mb-1">इन-आर्टिकल बैनर्स</strong>
                    <span>उच्च पठन संलग्नता वाले अनुच्छेदों के बीच प्रासंगिक विज्ञापन।</span>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <strong className="block text-slate-900 dark:text-white mb-1">प्रायोजित लेख (Sponsored Guides)</strong>
                    <span>स्पष्ट "Sponsored" लेबल के साथ मूल्यवान शैक्षणिक ट्यूटोरियल।</span>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <strong className="block text-slate-900 dark:text-white mb-1">न्यूजलेटर व चैनल स्पॉन्सरशिप</strong>
                    <span>सीधे हमारे टेक फॉलोअर्स तक लक्षित संदेश।</span>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. विज्ञापन नीतियां</h2>
                <p>
                  हम किसी भी फर्जी लोन ऐप, सट्टेबाजी/जुआ, पायरेसी, या भ्रामक सॉफ्टवेयर के विज्ञापनों को स्वीकार नहीं करते।
                </p>
              </section>

              <div className="p-6 rounded-2xl bg-blue-600 text-white space-y-3">
                <h3 className="font-bold text-lg">विज्ञापन दरों और मीडिया किट के लिए संपर्क करें:</h3>
                <p className="text-sm text-blue-100">
                  कृपया अपनी कंपनी के विवरण और अभियान के लक्ष्यों के साथ <a href={`mailto:${contactEmail}`} className="underline font-bold">{contactEmail}</a> पर ईमेल भेजें।
                </p>
              </div>
            </div>
          )
        };

      case 'write-for-us':
        return {
          title: 'हमारे लिए लिखें (Write For Us)',
          subtitle: 'यदि आप तकनीक को सरल हिंदी में समझाना जानते हैं, तो TechNova India में आपका स्वागत है।',
          icon: PenTool,
          date: 'अपडेटेड: 2026-03-20',
          body: (
            <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. हम किन लेखकों की तलाश में हैं?</h2>
                <p>
                  TechNova India उन तकनीकी उत्साही, डेवलपर्स, साइबर सुरक्षा शोधकर्ताओं और तकनीकी छात्रों का स्वागत करता है जो कठिन अंग्रेजी अवधारणाओं को शुद्ध, स्पष्ट और बोलचाल की हिंदी में समझाने में सक्षम हैं।
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. सबमिशन गाइडलाइन्स (Submission Guidelines)</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>100% मौलिक सामग्री:</strong> लेख पूरी तरह मूल होना चाहिए। AI द्वारा उत्पन्न कच्ची कॉपी-पेस्ट सामग्री या किसी अन्य साइट से चुराया गया कंटेंट तुरंत अस्वीकार कर दिया जाएगा।</li>
                  <li><strong>सरल और समझने योग्य भाषा:</strong> तकनीकी शब्द अंग्रेजी लिपि में रखे जा सकते हैं (जैसे 2FA, RAM, Cache), लेकिन वाक्य संरचना शुद्ध और स्पष्ट हिंदी में होनी चाहिए।</li>
                  <li><strong>स्क्रीनशॉट और चरण:</strong> यदि आप ट्यूटोरियल लिख रहे हैं, तो स्टेप-बाय-स्टेप निर्देश और स्पष्ट हेडिंग्स आवश्यक हैं।</li>
                  <li><strong>न्यूनतम शब्द सीमा:</strong> लेख में कम से कम 800 से 1500 शब्द होने चाहिए ताकि विषय का संपूर्ण विश्लेषण हो सके।</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. आर्टिकल पिच कैसे भेजें?</h2>
                <p>
                  अपने विषय का शीर्षक, संक्षिप्त रूपरेखा (Outline) और अपने पिछले लेखन के नमूने हमें{' '}
                  <a href={`mailto:${contactEmail}?subject=Write%20For%20Us%20Pitch`} className="text-blue-600 underline font-semibold">
                    {contactEmail}
                  </a>{' '}
                  पर भेजें। हमारी संपादकीय टीम 3 कार्य दिवसों के भीतर समीक्षा करेगी।
                </p>
              </section>
            </div>
          )
        };
    }
  };

  const content = renderContent();
  const Icon = content.icon;

  return (
    <div className="pb-20 font-['Yantramanav']">
      
      {/* Top Header */}
      <div className="bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>होम पर वापस जाएं</span>
          </button>

          <div className="flex items-center gap-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 shrink-0">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black font-['Plus_Jakarta_Sans']">
                {content.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {content.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        <div className="p-6 sm:p-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="text-xs text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-3">
            {content.date} • TechNova India आधिकारिक दस्तावेज
          </div>

          {content.body}

          <div className="pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <span>TechNova India Legal & Editorial Desk</span>
            <button
              onClick={() => onNavigate('/contact-us')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              इस नीति के संबंध में संपर्क करें →
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

import React from 'react';
import { SiteSettings } from '../types';

interface AdBannerProps {
  placement: 'header' | 'sidebar' | 'in-article' | 'footer';
  settings?: SiteSettings | null;
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement, settings }) => {
  if (!settings?.enableAds) {
    return null;
  }

  let adCode: string | undefined;
  let defaultNotice = '';
  let containerClass = 'my-6';

  switch (placement) {
    case 'header':
      adCode = settings.adHeaderCode;
      defaultNotice = 'TechNova India Partner Ad Space (Header Leaderboard 728x90 / 320x50)';
      containerClass = 'max-w-7xl mx-auto px-4 my-4';
      break;
    case 'sidebar':
      adCode = settings.adSidebarCode;
      defaultNotice = 'Verified Tech Ad Partner (Square 300x250)';
      containerClass = 'my-6';
      break;
    case 'in-article':
      adCode = settings.adInArticleCode;
      defaultNotice = 'डिजिटल सुरक्षा संदेश / Tech Partner Ad (In-Article Responsive)';
      containerClass = 'my-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700';
      break;
    case 'footer':
      adCode = settings.adFooterCode;
      defaultNotice = 'TechNova Partner Network';
      containerClass = 'my-6';
      break;
  }

  return (
    <div className={`overflow-hidden text-center transition-all ${containerClass}`}>
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
          विज्ञापन • ADVERTISEMENT
        </span>
      </div>

      {adCode && adCode.trim() ? (
        <div
          className="ad-container text-xs text-slate-600 dark:text-slate-400"
          dangerouslySetInnerHTML={{ __html: adCode }}
        />
      ) : (
        <div className="p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40">
          {defaultNotice}
        </div>
      )}
    </div>
  );
};

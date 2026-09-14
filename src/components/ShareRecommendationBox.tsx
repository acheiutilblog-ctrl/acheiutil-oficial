import React, { useState } from 'react';
import { Share2, Check, Copy, Heart, MessageSquare, Sparkles } from 'lucide-react';

interface ShareRecommendationBoxProps {
  title?: string;
  subtitle?: string;
  productName?: string;
  shareUrl?: string;
  customMessage?: string;
  variant?: 'card' | 'banner' | 'compact';
}

export const ShareRecommendationBox: React.FC<ShareRecommendationBoxProps> = ({
  title,
  subtitle,
  productName,
  shareUrl,
  customMessage,
  variant = 'card',
}) => {
  const [copied, setCopied] = useState(false);

  const currentUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : 'https://acheiutil.com');
  
  const resolvedTitle = title || (productName ? `Gostou desta dica? Compartilhe com quem precisa!` : `Curtiu o AcheiUtil? Indique para amigos e família!`);
  const resolvedSubtitle = subtitle || (productName 
    ? `Economize o tempo de quem você gosta enviando esta análise completa e sincera antes da compra.`
    : `Ajude mais pessoas a descobrirem se produtos realmente valem a pena antes de comprar.`);

  const textToShare = customMessage || (productName 
    ? `Dá uma olhada nesta análise sincera do ${productName} que achei no acheiutil.com: ${currentUrl}`
    : `Encontrei um site muito bom com análises sinceras e achados úteis para casa, pets e o dia a dia: ${currentUrl}`);

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(textToShare);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareTelegram = () => {
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedText = encodeURIComponent(textToShare);
    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank');
  };

  // Variant: Compact (fits in small sidebars or toolbars)
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 p-2 rounded-xl bg-orange-50/80 border border-orange-200/80 text-xs">
        <span className="font-bold text-orange-950 flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Indicar dica:
        </span>
        <button
          onClick={handleShareWhatsApp}
          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer"
        >
          WhatsApp
        </button>
        <button
          onClick={handleCopyLink}
          className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition-colors cursor-pointer"
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
    );
  }

  // Variant: Banner (horizontal layout, great for homepage between sections)
  if (variant === 'banner') {
    return (
      <div 
        id="share-recommendation-banner"
        className="my-10 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-xs relative overflow-hidden"
      >
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-orange-200/30 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-700 bg-orange-100/90 px-2 py-0.5 rounded-md">
                  Gostou do AcheiUtil?
                </span>
                <span className="text-xs text-rose-600 flex items-center gap-1 font-bold">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" /> Espalhe coisas úteis
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                {resolvedTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mt-1 leading-relaxed">
                {resolvedSubtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              id="btn-share-whatsapp-banner"
              onClick={handleShareWhatsApp}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-emerald-600/20 hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Indicar no WhatsApp</span>
            </button>

            <button
              id="btn-copy-link-banner"
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm transition-all duration-200 hover:border-slate-400 cursor-pointer flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span className="text-emerald-700">Link Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copiar Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Variant: Card (Default - perfect for bottom of reviews or cards)
  return (
    <section
      id="share-recommendation-card"
      aria-label="Compartilhar ou indicar análise"
      className="my-8 bg-gradient-to-br from-white via-orange-50/40 to-amber-50/60 rounded-3xl p-6 sm:p-8 border border-orange-200 shadow-sm relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center shrink-0 text-orange-600">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">
                Gostou deste achado?
              </span>
              <span className="text-xs text-rose-500 flex items-center gap-1 font-semibold">
                <Heart className="w-3.5 h-3.5 fill-rose-500" /> Vale a pena indicar
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-['Outfit']">
              {resolvedTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg leading-relaxed">
              {resolvedSubtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-emerald-600/20 hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Mandar no WhatsApp</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm transition-colors hover:border-slate-400 cursor-pointer flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span className="text-emerald-700">Link Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copiar Link</span>
              </>
            )}
          </button>

          <button
            onClick={handleShareTelegram}
            className="hidden sm:flex px-3 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 font-bold text-xs transition-colors cursor-pointer items-center justify-center gap-1.5"
            title="Compartilhar no Telegram"
          >
            <span>Telegram</span>
          </button>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { 
  Share2, 
  Check, 
  Copy, 
  Heart, 
  MessageSquare, 
  Sparkles, 
  Send, 
  Facebook, 
  Twitter 
} from 'lucide-react';

interface ShareRecommendationBoxProps {
  title?: string;
  subtitle?: string;
  productName?: string;
  shareUrl?: string;
  productImage?: string;
  customMessage?: string;
  variant?: 'card' | 'banner' | 'compact';
}

export const ShareRecommendationBox: React.FC<ShareRecommendationBoxProps> = ({
  title,
  subtitle,
  productName,
  shareUrl,
  productImage,
  customMessage,
  variant = 'card',
}) => {
  const [copied, setCopied] = useState(false);

  // Guarantee that the URL is specific to the product if available
  const resolvedUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : 'https://acheiutil.com');
  
  const resolvedTitle = title || (productName ? `Gostou da análise do ${productName}?` : `Curtiu o AcheiUtil? Indique para amigos e família!`);
  const resolvedSubtitle = subtitle || (productName 
    ? `Indique este achado para quem está pensando em comprar ou para o grupo da família/amigos!`
    : `Ajude mais pessoas a descobrirem se produtos realmente valem a pena antes de comprar.`);

  const textToShare = customMessage || (productName 
    ? `Dá uma olhada nesta análise sincera do ${productName} que achei no acheiutil.com: ${resolvedUrl}`
    : `Encontrei um site muito bom com análises sinceras e achados úteis para casa, pets e o dia a dia: ${resolvedUrl}`);

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(textToShare);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleShareTelegram = () => {
    const encodedUrl = encodeURIComponent(resolvedUrl);
    const encodedText = encodeURIComponent(textToShare);
    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank');
  };

  const handleShareFacebook = () => {
    const encodedUrl = encodeURIComponent(resolvedUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
  };

  const handleSharePinterest = () => {
    const encodedUrl = encodeURIComponent(resolvedUrl);
    const encodedMedia = encodeURIComponent(productImage || 'https://acheiutil.com/logo-detective.png');
    const encodedDesc = encodeURIComponent(productName ? `Análise sincera: ${productName} - acheiutil.com` : 'Achados Úteis e Reviews no acheiutil.com');
    window.open(`https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedMedia}&description=${encodedDesc}`, '_blank');
  };

  const handleShareX = () => {
    const encodedUrl = encodeURIComponent(resolvedUrl);
    const tweetText = encodeURIComponent(`Análise sincera do Sr. Detetive: ${productName || 'Achado Útil no Mercado Livre'}`);
    window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${tweetText}`, '_blank');
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Variant: Compact (fits in small sidebars or toolbars)
  if (variant === 'compact') {
    return (
      <div className="flex flex-col gap-2 p-3 rounded-2xl bg-orange-50/80 border border-orange-200/80 text-xs">
        <div className="font-bold text-orange-950 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Compartilhar Dica:
          </span>
          {copied && <span className="text-[10px] text-emerald-600 font-bold">Link Copiado!</span>}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleShareWhatsApp}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
            title="Compartilhar no WhatsApp"
          >
            <MessageSquare className="w-3 h-3 fill-white" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={handleShareTelegram}
            className="px-2 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
            title="Compartilhar no Telegram"
          >
            <Send className="w-3 h-3 fill-white" />
            <span>Telegram</span>
          </button>
          <button
            onClick={handleShareFacebook}
            className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
            title="Compartilhar no Facebook"
          >
            <Facebook className="w-3 h-3 fill-white" />
            <span>Face</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="px-2 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition-colors cursor-pointer text-[11px]"
            title="Copiar Link"
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
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
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
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

          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto">
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleShareTelegram}
              className="px-3.5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 fill-white" />
              <span>Telegram</span>
            </button>

            <button
              onClick={handleShareFacebook}
              className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Facebook className="w-3.5 h-3.5 fill-white" />
              <span>Facebook</span>
            </button>

            <button
              onClick={handleSharePinterest}
              className="px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <span className="font-serif font-black text-xs leading-none">P</span>
              <span>Pinterest</span>
            </button>

            <button
              onClick={handleShareX}
              className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Twitter className="w-3.5 h-3.5 fill-white" />
              <span>X</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span className="text-emerald-700">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copiar Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Variant: Card (Default - shown prominently at bottom of product reviews)
  return (
    <section
      id="share-recommendation-card"
      aria-label="Compartilhar ou indicar análise"
      className="my-8 bg-gradient-to-br from-white via-orange-50/40 to-amber-50/60 rounded-3xl p-6 sm:p-8 border border-orange-200 shadow-sm relative overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Info Column */}
        <div className="flex items-start gap-3.5 max-w-xl">
          <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center shrink-0 text-orange-600 mt-0.5">
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
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-['Outfit'] leading-tight">
              {resolvedTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              {resolvedSubtitle}
            </p>
          </div>
        </div>

        {/* Buttons Row - ALL Social Media visible */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0 pt-1 lg:pt-0">
          
          {/* WhatsApp */}
          <button
            id="btn-share-whatsapp"
            onClick={handleShareWhatsApp}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-emerald-600/20 hover:scale-105 cursor-pointer flex items-center justify-center gap-1.5"
            title="Mandar no WhatsApp"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>WhatsApp</span>
          </button>

          {/* Telegram */}
          <button
            id="btn-share-telegram"
            onClick={handleShareTelegram}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-sky-500/20 hover:scale-105 cursor-pointer flex items-center justify-center gap-1.5"
            title="Compartilhar no Telegram"
          >
            <Send className="w-3.5 h-3.5 fill-white" />
            <span>Telegram</span>
          </button>

          {/* Facebook */}
          <button
            id="btn-share-facebook"
            onClick={handleShareFacebook}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-blue-600/20 hover:scale-105 cursor-pointer flex items-center justify-center gap-1.5"
            title="Compartilhar no Facebook"
          >
            <Facebook className="w-3.5 h-3.5 fill-white" />
            <span>Facebook</span>
          </button>

          {/* Pinterest */}
          <button
            id="btn-share-pinterest"
            onClick={handleSharePinterest}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-rose-600/20 hover:scale-105 cursor-pointer flex items-center justify-center gap-1.5"
            title="Salvar no Pinterest"
          >
            <span className="font-serif font-black text-sm leading-none">P</span>
            <span>Pinterest</span>
          </button>

          {/* X (Twitter) */}
          <button
            id="btn-share-x"
            onClick={handleShareX}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-slate-900/20 hover:scale-105 cursor-pointer flex items-center justify-center gap-1.5"
            title="Compartilhar no X (Twitter)"
          >
            <Twitter className="w-3.5 h-3.5 fill-white" />
            <span>X</span>
          </button>

          {/* Copiar Link */}
          <button
            id="btn-copy-link"
            onClick={handleCopyLink}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm transition-colors hover:border-slate-400 cursor-pointer flex items-center justify-center gap-1.5"
            title="Copiar Link do Artigo"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span className="text-emerald-700">Copiado!</span>
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
    </section>
  );
};

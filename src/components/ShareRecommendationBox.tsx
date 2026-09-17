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
  Twitter,
  Instagram,
  Music2
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
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

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

  const handleShareInstagram = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: resolvedTitle,
          text: textToShare,
          url: resolvedUrl,
        });
        return;
      } catch (err) {
        // Fallback below
      }
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(resolvedUrl);
      setShareFeedback('Link copiado! Cole na figurinha de Link dos seus Stories ou envie no Direct do Instagram 📸');
      setTimeout(() => setShareFeedback(null), 5000);
    }
    window.open('https://www.instagram.com/', '_blank');
  };

  const handleShareTikTok = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: resolvedTitle,
          text: textToShare,
          url: resolvedUrl,
        });
        return;
      } catch (err) {
        // Fallback below
      }
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(resolvedUrl);
      setShareFeedback('Link copiado! Cole na sua Bio ou mencione nos comentários do TikTok 🎵');
      setTimeout(() => setShareFeedback(null), 5000);
    }
    window.open('https://www.tiktok.com/', '_blank');
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
            className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
            title="Compartilhar no WhatsApp"
            aria-label="WhatsApp"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
          </button>
          <button
            onClick={handleShareInstagram}
            className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white transition-all hover:scale-105 active:scale-95 hover:opacity-90 cursor-pointer flex items-center justify-center shadow-xs"
            title="Compartilhar no Instagram"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </button>
          <button
            onClick={handleShareTikTok}
            className="w-8 h-8 rounded-lg bg-slate-950 hover:bg-black text-white transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center border border-slate-800 shadow-xs"
            title="Compartilhar no TikTok"
            aria-label="TikTok"
          >
            <Music2 className="w-4 h-4 text-cyan-400" />
          </button>
          <button
            onClick={handleShareTelegram}
            className="w-8 h-8 rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
            title="Compartilhar no Telegram"
            aria-label="Telegram"
          >
            <Send className="w-3.5 h-3.5 fill-white" />
          </button>
          <button
            onClick={handleShareFacebook}
            className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
            title="Compartilhar no Facebook"
            aria-label="Facebook"
          >
            <Facebook className="w-4 h-4 fill-white" />
          </button>
          <button
            onClick={handleSharePinterest}
            className="w-8 h-8 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
            title="Salvar no Pinterest"
            aria-label="Pinterest"
          >
            <span className="font-serif font-black text-xs leading-none">P</span>
          </button>
          <button
            onClick={handleShareX}
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-black text-white transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
            title="Compartilhar no X (Twitter)"
            aria-label="X (Twitter)"
          >
            <Twitter className="w-3.5 h-3.5 fill-white" />
          </button>
          <button
            onClick={handleCopyLink}
            className={`w-8 h-8 rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center shadow-xs ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            title={copied ? 'Link Copiado!' : 'Copiar Link'}
            aria-label="Copiar Link"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-600" />
            )}
          </button>
        </div>
        {shareFeedback && (
          <p className="text-[10px] text-orange-900 bg-orange-100/90 rounded-md p-1.5 font-medium leading-tight">
            {shareFeedback}
          </p>
        )}
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
            {/* WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
              title="Compartilhar no WhatsApp"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-5 h-5 fill-white" />
            </button>

            {/* Instagram */}
            <button
              onClick={handleShareInstagram}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
              title="Compartilhar no Instagram"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </button>

            {/* TikTok */}
            <button
              onClick={handleShareTikTok}
              className="w-10 h-10 rounded-xl bg-slate-950 hover:bg-black text-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center border border-slate-800"
              title="Compartilhar no TikTok"
              aria-label="TikTok"
            >
              <Music2 className="w-5 h-5 text-cyan-400" />
            </button>

            {/* Telegram */}
            <button
              onClick={handleShareTelegram}
              className="w-10 h-10 rounded-xl bg-sky-500 hover:bg-sky-600 text-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
              title="Compartilhar no Telegram"
              aria-label="Telegram"
            >
              <Send className="w-4 h-4 fill-white" />
            </button>

            {/* Facebook */}
            <button
              onClick={handleShareFacebook}
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
              title="Compartilhar no Facebook"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 fill-white" />
            </button>

            {/* Pinterest */}
            <button
              onClick={handleSharePinterest}
              className="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
              title="Salvar no Pinterest"
              aria-label="Pinterest"
            >
              <span className="font-serif font-black text-base leading-none">P</span>
            </button>

            {/* X (Twitter) */}
            <button
              onClick={handleShareX}
              className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-black text-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
              title="Compartilhar no X (Twitter)"
              aria-label="X (Twitter)"
            >
              <Twitter className="w-4 h-4 fill-white" />
            </button>

            {/* Copiar Link */}
            <button
              onClick={handleCopyLink}
              className={`w-10 h-10 rounded-xl border transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center shadow-sm ${
                copied
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
              }`}
              title={copied ? 'Link Copiado com sucesso!' : 'Copiar Link'}
              aria-label="Copiar Link"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              ) : (
                <Copy className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {shareFeedback && (
          <div className="mt-3 p-2.5 rounded-xl bg-orange-100/90 text-orange-900 text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <span>{shareFeedback}</span>
            <button onClick={() => setShareFeedback(null)} className="text-orange-700 hover:text-orange-950 font-bold ml-2">✕</button>
          </div>
        )}
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

        {/* Buttons Row - ALL Social Media visible as elegant icon-only buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
          
          {/* WhatsApp */}
          <button
            id="btn-share-whatsapp"
            onClick={handleShareWhatsApp}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
            title="Compartilhar no WhatsApp"
            aria-label="WhatsApp"
          >
            <MessageSquare className="w-5 h-5 fill-white" />
          </button>

          {/* Instagram */}
          <button
            id="btn-share-instagram"
            onClick={handleShareInstagram}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
            title="Compartilhar no Instagram"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </button>

          {/* TikTok */}
          <button
            id="btn-share-tiktok"
            onClick={handleShareTikTok}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950 hover:bg-black text-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center border border-slate-800"
            title="Compartilhar no TikTok"
            aria-label="TikTok"
          >
            <Music2 className="w-5 h-5 text-cyan-400" />
          </button>

          {/* Telegram */}
          <button
            id="btn-share-telegram"
            onClick={handleShareTelegram}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-sky-500 hover:bg-sky-600 text-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
            title="Compartilhar no Telegram"
            aria-label="Telegram"
          >
            <Send className="w-4 h-4 fill-white" />
          </button>

          {/* Facebook */}
          <button
            id="btn-share-facebook"
            onClick={handleShareFacebook}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
            title="Compartilhar no Facebook"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5 fill-white" />
          </button>

          {/* Pinterest */}
          <button
            id="btn-share-pinterest"
            onClick={handleSharePinterest}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
            title="Salvar no Pinterest"
            aria-label="Pinterest"
          >
            <span className="font-serif font-black text-lg leading-none">P</span>
          </button>

          {/* X (Twitter) */}
          <button
            id="btn-share-x"
            onClick={handleShareX}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 hover:bg-black text-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
            title="Compartilhar no X (Twitter)"
            aria-label="X (Twitter)"
          >
            <Twitter className="w-4 h-4 fill-white" />
          </button>

          {/* Copiar Link */}
          <button
            id="btn-copy-link"
            onClick={handleCopyLink}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center shadow-sm ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
            }`}
            title={copied ? 'Link Copiado!' : 'Copiar Link'}
            aria-label="Copiar Link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
            ) : (
              <Copy className="w-4 h-4 text-slate-600" />
            )}
          </button>

        </div>
      </div>

      {shareFeedback && (
        <div className="mt-4 p-3 rounded-2xl bg-orange-100 border border-orange-200 text-orange-950 text-xs sm:text-sm font-semibold flex items-center justify-between animate-fadeIn">
          <span>{shareFeedback}</span>
          <button onClick={() => setShareFeedback(null)} className="text-orange-800 hover:text-orange-950 font-bold ml-2">✕</button>
        </div>
      )}
    </section>
  );
};


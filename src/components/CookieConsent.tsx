import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Check, X, ExternalLink } from 'lucide-react';

interface CookieConsentProps {
  onOpenCookiesPolicy: () => void;
  forceShow?: boolean;
  onCloseForce?: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  onOpenCookiesPolicy,
  forceShow = false,
  onCloseForce,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
      return;
    }
    try {
      const consent = localStorage.getItem('acheiutil_cookie_consent');
      if (!consent) {
        // Small delay so it appears smoothly after page load
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsVisible(false);
    }
  }, [forceShow]);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('acheiutil_cookie_consent', 'accepted');
      localStorage.setItem('acheiutil_cookie_consent_date', new Date().toISOString());
    } catch (e) {
      console.warn('Could not save cookie consent:', e);
    }
    setIsVisible(false);
    if (onCloseForce) onCloseForce();
  };

  const handleRejectNonEssential = () => {
    try {
      localStorage.setItem('acheiutil_cookie_consent', 'rejected_optional');
      localStorage.setItem('acheiutil_cookie_consent_date', new Date().toISOString());
    } catch (e) {
      console.warn('Could not save cookie rejection:', e);
    }
    setIsVisible(false);
    if (onCloseForce) onCloseForce();
  };

  if (!isVisible) return null;

  return (
    <aside
      id="cookie-consent-banner"
      aria-label="Aviso de Cookies e Privacidade"
      className="fixed bottom-3 left-3 right-3 sm:left-6 sm:bottom-6 sm:right-auto sm:max-w-xl z-50 bg-slate-950/95 text-slate-100 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl shadow-black/60 backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3.5 mb-3">
        <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0 text-orange-400">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-sm sm:text-base text-white font-['Outfit'] flex items-center gap-1.5">
              Privacidade & Uso de Cookies
            </h3>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> LGPD
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mt-1.5">
            O <strong>acheiutil.com</strong> utiliza cookies essenciais para navegação e para viabilizar links seguros de afiliados com o Mercado Livre. Também usamos métricas anônimas para entender o interesse dos leitores e aprimorar nossas curadorias. Você pode escolher como prefere navegar:
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-800/80">
        <button
          onClick={onOpenCookiesPolicy}
          className="text-xs text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors text-center sm:text-left cursor-pointer flex items-center justify-center sm:justify-start gap-1 py-1"
        >
          <span>Ler Política de Cookies & Privacidade</span>
          <ExternalLink className="w-3 h-3" />
        </button>

        <div className="flex items-center gap-2">
          <button
            id="btn-cookie-reject"
            onClick={handleRejectNonEssential}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer border border-slate-700 flex items-center justify-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Apenas Essenciais</span>
          </button>

          <button
            id="btn-cookie-accept"
            onClick={handleAcceptAll}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/25 cursor-pointer flex items-center justify-center gap-1"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Aceitar Todos</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

import React from 'react';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface TopBannerProps {
  text?: string;
  active?: boolean;
}

export const TopBanner: React.FC<TopBannerProps> = ({
  text = '🔥 Ofertas Exclusivas Mercado Livre: Até 40% OFF com Frete Grátis Full nos produtos selecionados!',
  active = true,
}) => {
  if (!active) return null;

  return (
    <div id="top-announcement-banner" className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white text-xs sm:text-sm py-2 px-4 shadow-sm border-b border-blue-800/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap mx-auto sm:mx-0">
          <span className="flex items-center gap-1 bg-orange-500 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase shrink-0 animate-pulse">
            <Zap className="w-3 h-3" /> Mercado Livre
          </span>
          <span className="font-medium text-slate-100 truncate">{text}</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs text-blue-200 shrink-0">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Compra 100% Segura
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Links Oficiais Verificados
          </span>
        </div>
      </div>
    </div>
  );
};

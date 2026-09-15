import React, { useState } from 'react';
import { ShieldCheck, Heart, Mail, Sparkles, Home, Palette, FileText, Cookie, Handshake, Users, Sliders, Share2, MessageSquare, Check, Copy, Lock } from 'lucide-react';
import { ProductCategory, InstitutionalTab } from '../types';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory | 'todas') => void;
  contactEmail?: string;
  onOpenAdmin?: () => void;
  onOpenInstitutional?: (tab: InstitutionalTab) => void;
  onOpenCookiesBanner?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  contactEmail = 'contato@acheiutil.com',
  onOpenAdmin,
  onOpenInstitutional,
  onOpenCookiesBanner,
}) => {
  const [footerCopied, setFooterCopied] = useState(false);

  const handleCopySiteLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin || 'https://acheiutil.com');
      setFooterCopied(true);
      setTimeout(() => setFooterCopied(false), 2500);
    }
  };

  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-5">
              <div className="shrink-0 flex items-center justify-center">
                <img
                  src="/logo-detective.png?v=6"
                  alt="acheiutil.com"
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/logo.png';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-white font-['Outfit'] leading-none">
                  achei<span className="text-orange-500">util</span>
                  <span className="text-slate-400 font-normal text-base">.com</span>
                </span>
                <span className="text-xs font-semibold text-orange-400 tracking-tight mt-1">
                  Antes de comprar, descubra se vale a pena.
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mb-4">
              O seu portal definitivo de achados úteis, reviews sinceras e curadoria de alta qualidade para <b>Casa, Utilidades, Decoração e Pet</b> com links verificados do Mercado Livre.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
              <Mail className="w-4 h-4 text-orange-400" />
              <span>Contato: {contactEmail}</span>
            </div>

            {/* Indique o Site Rápido */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 w-full max-w-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Gostou do AcheiUtil? Indique!</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug mb-2.5">
                Ajude amigos e familiares a economizarem tempo e dinheiro com análises honestas.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = encodeURIComponent('Conhece o acheiutil.com? Tem análises sinceras de produtos antes de comprar no Mercado Livre: https://acheiutil.com');
                    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                  }}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3 h-3 fill-white" />
                  <span>No WhatsApp</span>
                </button>
                <button
                  onClick={handleCopySiteLink}
                  className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                >
                  {footerCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                      <span className="text-emerald-300 font-bold">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copiar Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Categories Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 font-['Outfit']">
              Categorias
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onSelectCategory('casa')}
                  className="hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Home className="w-3.5 h-3.5 text-slate-500" /> Casa & Cozinha
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('utilidades')}
                  className="hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-500" /> Utilidades
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('decoracao')}
                  className="hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Palette className="w-3.5 h-3.5 text-slate-500" /> Decoração
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('pet')}
                  className="hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Heart className="w-3.5 h-3.5 text-slate-500" /> Pets
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional / Legal Links (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 font-['Outfit'] flex items-center gap-1.5">
              <span>Institucional & Legal</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onOpenInstitutional && onOpenInstitutional('termos')}
                  className="hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-2 text-slate-300"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" /> Termos de Uso
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInstitutional && onOpenInstitutional('privacidade')}
                  className="hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-2 text-slate-300"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Política de Privacidade (LGPD)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInstitutional && onOpenInstitutional('cookies')}
                  className="hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-2 text-slate-300"
                >
                  <Cookie className="w-3.5 h-3.5 text-amber-400" /> Política de Cookies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInstitutional && onOpenInstitutional('afiliados')}
                  className="hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-2 text-slate-300"
                >
                  <Handshake className="w-3.5 h-3.5 text-orange-400" /> Divulgação de Afiliados
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInstitutional && onOpenInstitutional('sobre')}
                  className="hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-2 text-slate-300"
                >
                  <Users className="w-3.5 h-3.5 text-slate-500" /> Quem Somos (Sobre Nós)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInstitutional && onOpenInstitutional('contato')}
                  className="hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-2 text-slate-300"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> Fale Conosco
                </button>
              </li>
              {onOpenCookiesBanner && (
                <li className="pt-1">
                  <button
                    onClick={onOpenCookiesBanner}
                    className="text-[11px] text-slate-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 underline underline-offset-2"
                  >
                    <Sliders className="w-3 h-3 text-amber-400" /> Gerenciar Preferências de Cookies
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Transparency & Disclaimer (3 cols) */}
          <div className="lg:col-span-3 bg-slate-900/70 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              Transparência Editorial
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Não somos patrocinados por marcas de produtos. Ganho comissão quando você compra pelos links de afiliados do Mercado Livre, sem custo adicional para você.
            </p>
            <button
              onClick={() => onOpenInstitutional && onOpenInstitutional('afiliados')}
              className="text-[11px] font-bold text-orange-400 hover:text-orange-300 underline cursor-pointer"
            >
              Saiba como funciona nossa curadoria →
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <p className="flex items-center">
              © {new Date().getFullYear()} acheiutil.com — Todos os direitos reservados.
            </p>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="opacity-15 hover:opacity-100 text-slate-500 hover:text-orange-400 transition-opacity cursor-pointer p-1"
                title="Acesso Administrativo"
                aria-label="Acesso Administrativo"
              >
                <Lock className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
          <div>
            <span>Mercado Livre ® é marca registrada de MercadoLibre S.R.L.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};


import React from 'react';
import { ShoppingBag, ShieldCheck, Heart, Mail, Sparkles, Home, Palette } from 'lucide-react';
import { ProductCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory | 'todas') => void;
  contactEmail?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  contactEmail = 'contato@acheiutil.com',
}) => {
  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white p-1.5 rounded-xl shadow-xs shrink-0 flex items-center justify-center">
                <img
                  src="/logo-icon.svg"
                  alt="acheiutil.com"
                  className="h-10 w-10 sm:h-11 sm:w-11 object-contain"
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

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail className="w-4 h-4 text-orange-400" />
              <span>Contato editorial: {contactEmail}</span>
            </div>
          </div>

          {/* Categories Links (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-['Outfit']">
              Categorias Principais
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
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
                  <Sparkles className="w-3.5 h-3.5 text-slate-500" /> Utilidades do Dia a Dia
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('decoracao')}
                  className="hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Palette className="w-3.5 h-3.5 text-slate-500" /> Decoração & Iluminação
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('pet')}
                  className="hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Heart className="w-3.5 h-3.5 text-slate-500" /> Itens para Cães e Gatos
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Affiliate Notice (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900/70 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              Análises Independentes & Transparência
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Não recebo produtos de fabricantes e não sou patrocinado por marcas. Ganho comissão quando você compra pelos meus links, sem custo a mais para você. Pesquiso ficha técnica, leio o que quem comprou realmente diz e comparo preços e garantias no Mercado Livre para você decidir com clareza se vale a pena.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} acheiutil.com — Todos os direitos reservados.</p>
          <div>
            <span>Mercado Livre ® é marca registrada de MercadoLibre S.R.L.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

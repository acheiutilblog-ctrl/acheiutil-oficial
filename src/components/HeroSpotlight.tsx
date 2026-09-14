import React from 'react';
import { Sparkles, ShieldCheck, Zap, Truck, CheckCircle2, ChevronRight, Search, MessageSquareQuote, Scale } from 'lucide-react';
import { Product } from '../types';

interface HeroSpotlightProps {
  featuredProduct?: Product;
  onSelectProduct: (product: Product) => void;
}

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({
  featuredProduct,
  onSelectProduct,
}) => {
  return (
    <section className="mb-10">
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-blue-800 shadow-xl overflow-hidden relative">
        
        {/* Background decorative glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Headline & Value Proposition (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 bg-blue-800/80 border border-blue-700/60 rounded-full px-3.5 py-1 text-xs font-semibold text-blue-200 mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Curadoria Real • Casa, Decoração, Utilidades & Pet</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] tracking-tight leading-tight mb-4">
              Antes de comprar, <span className="text-orange-400">descubra se vale a pena.</span>
            </h1>

            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed mb-4 max-w-xl">
              Pesquiso produtos para casa, decoração e pet no <b>Mercado Livre</b> e escrevo o que encontrei: os prós, os contras e o que os compradores realmente dizem.
            </p>

            {/* Transparency Note */}
            <div className="bg-blue-900/40 border border-blue-700/50 rounded-2xl p-3.5 mb-6 max-w-xl">
              <p className="text-xs text-blue-200/90 leading-relaxed">
                <span className="font-bold text-white">Análises independentes:</span> Não recebo produtos de fabricantes e não sou patrocinado por marcas. Ganho comissão quando você compra pelos meus links, sem custo a mais para você.
              </p>
            </div>

            {/* 3 Pillars of Curatorship */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl mb-2">
              
              <div className="bg-blue-900/50 rounded-2xl p-3.5 border border-blue-800/70 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-300">
                  <Search className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Eu pesquiso o produto</span>
                </div>
                <p className="text-[11px] text-blue-200/80 leading-snug">
                  Ficha técnica, medidas, voltagem e material. Tudo o que costuma dar problema depois da compra.
                </p>
              </div>

              <div className="bg-blue-900/50 rounded-2xl p-3.5 border border-blue-800/70 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <MessageSquareQuote className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Leio quem já comprou</span>
                </div>
                <p className="text-[11px] text-blue-200/80 leading-snug">
                  Passo por dezenas de avaliações reais e anoto as reclamações que mais se repetem.
                </p>
              </div>

              <div className="bg-blue-900/50 rounded-2xl p-3.5 border border-blue-800/70 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Curadoria no Mercado Livre</span>
                </div>
                <p className="text-[11px] text-blue-200/80 leading-snug">
                  Preço real, reputação de lojas oficiais e envio Full para você comprar com total segurança e garantia.
                </p>
              </div>

            </div>
          </div>

          {/* Featured Highlight Card (5 cols) */}
          {featuredProduct && (
            <div className="lg:col-span-5">
              <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-200/80 flex flex-col gap-3 group relative">
                
                <div className="flex items-center justify-between">
                  <span className="bg-orange-500 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Destaque da Semana
                  </span>
                  <span className="text-xs font-bold text-blue-900 uppercase">
                    {featuredProduct.category}
                  </span>
                </div>

                <div
                  onClick={() => onSelectProduct(featuredProduct)}
                  className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-100 cursor-pointer"
                >
                  <img
                    src={featuredProduct.images?.[0] || '/logo.png'}
                    alt={featuredProduct.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (featuredProduct.images?.[1] && target.src !== featuredProduct.images[1]) {
                        target.src = featuredProduct.images[1];
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {featuredProduct.discountPercentage && (
                    <div className="absolute top-2 right-2 bg-orange-600 text-white font-black text-xs px-2 py-0.5 rounded-md shadow-sm">
                      -{featuredProduct.discountPercentage}% OFF
                    </div>
                  )}
                </div>

                <div>
                  <h3
                    onClick={() => onSelectProduct(featuredProduct)}
                    className="font-bold text-slate-950 text-base line-clamp-2 hover:text-blue-700 cursor-pointer transition-colors"
                  >
                    {featuredProduct.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {featuredProduct.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Menor preço hoje:</span>
                    <div className="text-xl font-black text-slate-950 font-['Outfit']">
                      {featuredProduct.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectProduct(featuredProduct)}
                    className="py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Ver Review</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

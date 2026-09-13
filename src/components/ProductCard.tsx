import React from 'react';
import {
  Star,
  Zap,
  Truck,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award,
  BookOpen,
} from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80';
  const isArticle = product.isGuideOrArticle || product.price <= 0;

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const cleanSnippet = (text?: string) => {
    if (!text) return '';
    return text
      .replace(/^[\s"“”'&#8220;`]*html\s*/i, '')
      .replace(/^[\s"“”'&#8220;`]+/i, '')
      .replace(/[\s"“”'&#8221;`]+$/i, '')
      .trim();
  };

  return (
    <article
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
    >
      {/* Top badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 items-center">
        {isArticle ? (
          <span className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-sm tracking-wide flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            {product.articleBadge || 'GUIA'}
          </span>
        ) : (
          <>
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-sm tracking-wide">
                {product.discountPercentage}% OFF
              </span>
            )}
            {product.isFull && (
              <span className="bg-emerald-600 text-white font-bold text-[11px] px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                <Zap className="w-3 h-3 fill-amber-300 text-amber-300" /> FULL
              </span>
            )}
          </>
        )}
      </div>

      {product.verdict?.badge && !isArticle && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-blue-900/90 backdrop-blur-xs text-blue-100 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border border-blue-700/50">
            <Award className="w-3 h-3 text-orange-400" />
            <span className="truncate max-w-[120px]">{product.verdict.badge}</span>
          </span>
        </div>
      )}

      {/* Product Image Area */}
      <div
        onClick={() => onSelect(product)}
        className="relative pt-[75%] bg-slate-100 overflow-hidden cursor-pointer"
      >
        <img
          src={mainImage}
          alt={product.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            const backup = product.images?.[1] || 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80';
            if (target.src !== backup) {
              target.src = backup;
            }
          }}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <span className="text-xs font-semibold text-white bg-blue-950/80 px-2.5 py-1 rounded-lg flex items-center gap-1">
            {isArticle ? 'Ler Artigo & Dicas' : 'Ver Review & Ficha Técnica'} <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Category & Store */}
        <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
          <span className="font-semibold text-blue-700 uppercase tracking-wider text-[11px]">
            {isArticle ? 'Artigo & Guia' : (product.subcategory || product.category)}
          </span>
          {product.officialStore && (
            <span className="text-slate-500 text-[11px] truncate max-w-[130px]" title={product.officialStore}>
              {product.officialStore}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect(product)}
          className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-blue-700 cursor-pointer transition-colors mb-2"
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Stars rating */}
        <div className="flex items-center gap-1.5 mb-3 text-xs">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-200 text-slate-300'
                }`}
              />
            ))}
          </div>
          <span className="font-bold text-slate-800">{product.rating.toFixed(1)}</span>
          <span className="text-slate-400 text-[11px]">({product.reviewCount} avaliações)</span>
        </div>

        {/* Summary */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4">
          {cleanSnippet(product.summary)}
        </p>

        {/* Pricing area or Article Action Area */}
        <div className="mt-auto pt-3 border-t border-slate-100">
          {isArticle ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-blue-900 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  {product.articleBadge || 'Conteúdo Informativo'}
                </span>
                <span className="text-emerald-700 font-semibold text-[11px]">Leitura Grátis</span>
              </div>
              <div className="mt-1">
                <button
                  id={`read-review-${product.id}`}
                  onClick={() => onSelect(product)}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 hover:text-blue-950 border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Ler Artigo Completo</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-xs text-slate-400 line-through">
                  {formatBRL(product.originalPrice)}
                </div>
              )}

              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                  {formatBRL(product.price)}
                </span>
                {product.freeShipping && (
                  <span className="text-emerald-700 font-semibold text-xs flex items-center gap-0.5">
                    <Truck className="w-3.5 h-3.5" /> Frete Grátis
                  </span>
                )}
              </div>

              {product.installments && (
                <div className="text-xs text-slate-500 font-medium mb-4">
                  {product.installments.toLowerCase().startsWith('em') || product.installments.toLowerCase().startsWith('ou') ? '' : 'em '}
                  <span className="text-slate-700 font-semibold">{product.installments}</span>
                </div>
              )}

              {/* Action CTAs */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  id={`read-review-${product.id}`}
                  onClick={() => onSelect(product)}
                  className="w-full py-2.5 px-2 rounded-xl text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  Ler Review
                </button>

                <a
                  id={`affiliate-link-${product.id}`}
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1 text-center"
                >
                  <span>Ver no ML</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

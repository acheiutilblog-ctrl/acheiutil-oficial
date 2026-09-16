import React, { useState, useEffect } from 'react';
import {
  Star,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  Check,
  X,
  Award,
  Share2,
  Copy,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Sparkles,
  ChevronDown,
  Info,
  BadgePercent,
  BookOpen,
} from 'lucide-react';
import { Product } from '../types';
import { updatePageSEO } from '../lib/seo';
import { ProductCard } from './ProductCard';
import { ShareRecommendationBox } from './ShareRecommendationBox';

interface ReviewDetailProps {
  product: Product;
  onBack: () => void;
  onSelectRelated: (product: Product) => void;
  relatedProducts: Product[];
}

export const ReviewDetail: React.FC<ReviewDetailProps> = ({
  product,
  onBack,
  onSelectRelated,
  relatedProducts,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const isArticle = product.isGuideOrArticle || product.price <= 0;
  const isGenericMeli =
    !product.affiliateUrl ||
    product.affiliateUrl.includes('www.mercadolivre.com.br?affiliate');

  const cleanSnippet = (text?: string) => {
    if (!text) return '';
    return text
      .replace(/^[\s"“”'&#8220;`]*html\s*/i, '')
      .replace(/^[\s"“”'&#8220;`]+/i, '')
      .replace(/[\s"“”'&#8221;`]+$/i, '')
      .trim();
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updatePageSEO(product);
    setSelectedImageIndex(0);
    setOpenFaq(0); // Open first FAQ by default

    // Clean up or replace broken images inside the review content container
    const timer = setTimeout(() => {
      const container = document.getElementById('review-article-body');
      if (container) {
        const imgs = container.querySelectorAll('img');
        imgs.forEach((img) => {
          img.onerror = () => {
            if (product.images && product.images[0] && img.src !== product.images[0]) {
              img.src = product.images[0];
            } else {
              img.style.display = 'none';
              if (img.parentElement && img.parentElement.tagName === 'DIV') {
                img.parentElement.style.display = 'none';
              }
            }
          };
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [product]);

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/logo.png'];

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Olha esse achado que vi no acheiutil.com: ${product.title} por ${formatBRL(product.price)}!\n${product.affiliateUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div id="product-review-detail" className="pb-24 lg:pb-16 pt-4">
      {/* Breadcrumbs & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm text-slate-500">
          <nav className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={onBack}
              className="flex items-center gap-1 hover:text-blue-900 font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Início
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="capitalize text-slate-600 font-medium">{product.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-md">
              {product.title}
            </span>
          </nav>

          {/* Social share & Indicar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={handleShareWhatsApp}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors text-xs flex items-center gap-1.5 font-bold cursor-pointer border border-emerald-200/60"
              title="Indicar pelo WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors text-xs flex items-center gap-1.5 font-bold cursor-pointer border border-blue-200/60"
              title="Compartilhar no Facebook"
            >
              <span>Facebook</span>
            </button>
            <button
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                const desc = encodeURIComponent(`${product.title} - Análise sincera no acheiutil.com`);
                const media = encodeURIComponent(product.images?.[0] || '');
                window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${desc}`, '_blank');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors text-xs flex items-center gap-1.5 font-bold cursor-pointer border border-rose-200/60"
              title="Salvar no Pinterest"
            >
              <span>Pinterest</span>
            </button>
            <button
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                const text = encodeURIComponent(`Análise do Sr. Detetive: ${product.title} vale a pena? Confira:`);
                window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors text-xs flex items-center gap-1.5 font-bold cursor-pointer border border-slate-200"
              title="Compartilhar no X (Twitter)"
            >
              <span>X</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs flex items-center gap-1 font-semibold cursor-pointer border border-slate-200"
              title="Copiar Link"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: Gallery & Sticky Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left Column: Gallery & Highlights (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Title Header on mobile / desktop */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {product.subcategory || product.category}
                </span>
                {product.isFull && (
                  <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-md flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-amber-300 text-amber-300" /> Envio FULL Mercado Livre
                  </span>
                )}
                {product.officialStore && (
                  <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    {product.officialStore}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-['Outfit'] tracking-tight leading-tight mb-2">
                {product.title}
              </h1>

              {product.subtitle && (
                <p className="text-sm sm:text-base text-slate-600 mb-3">
                  {product.subtitle}
                </p>
              )}

              {/* Rating & Reviewer info */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900">{product.rating.toFixed(1)}</span>
                  <span>({product.reviewCount} opiniões no Mercado Livre)</span>
                </div>

                <span className="flex items-center gap-1 text-slate-500">
                  <Calendar className="w-3.5 h-3.5" /> Atualizado em 2026
                </span>
              </div>
            </div>

            {/* Gallery Main */}
            <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200 shadow-sm">
              <div className="relative aspect-4/3 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  src={images[selectedImageIndex] || images[0] || '/logo.png'}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (images[1] && target.src !== images[1]) {
                      target.src = images[1];
                    }
                  }}
                  className="w-full h-full object-contain"
                />
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-orange-600 text-white font-extrabold text-sm px-3 py-1 rounded-xl shadow-md">
                    -{product.discountPercentage}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} foto ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Summary Box */}
            <div className="bg-gradient-to-br from-blue-50/70 to-slate-50 rounded-2xl p-5 border border-blue-100">
              <h2 className="text-base font-bold text-blue-950 flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-orange-500" /> Resumo da Curadoria: Vale a Pena?
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {cleanSnippet(product.summary)}
              </p>
            </div>

          </div>

          {/* Right Column: Sticky Conversion Buy Box (5 cols) */}
          <div className="lg:col-span-5">
            <div className={`sticky top-24 bg-white rounded-3xl p-6 border-2 shadow-xl flex flex-col gap-5 ${
              isArticle 
                ? 'border-blue-500/30 shadow-blue-950/5' 
                : 'border-orange-500/30 shadow-orange-950/5'
            }`}>
              
              {/* Badge top */}
              <div className="flex items-center justify-between">
                {isArticle ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    <BookOpen className="w-4 h-4 text-blue-600" /> {product.articleBadge || 'Guia & Artigo'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                    <BadgePercent className="w-4 h-4 text-orange-500" /> Menor Preço Garantido
                  </span>
                )}
                <span className="text-xs text-slate-400 font-medium">
                  {isArticle ? 'Conteúdo Livre & Dicas' : 'Link de Afiliado Seguro'}
                </span>
              </div>

              {/* Price block or Article Info block */}
              {isArticle ? (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                  <h3 className="font-extrabold text-blue-950 text-base mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Guia Informativo & Dicas
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Este artigo é uma análise opinativa e informativa para você fazer compras conscientes e seguras no Mercado Livre.
                  </p>
                </div>
              ) : (
                <div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-sm text-slate-400 line-through mb-0.5">
                      De {formatBRL(product.originalPrice)}
                    </div>
                  )}
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-950 font-['Outfit']">
                      {formatBRL(product.price)}
                    </span>
                    {product.discountPercentage && (
                      <span className="text-sm font-extrabold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">
                        {product.discountPercentage}% de economia
                      </span>
                    )}
                  </div>

                  {product.installments && (
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                      {product.installments.toLowerCase().startsWith('em até') || product.installments.toLowerCase().startsWith('ou') || product.installments.toLowerCase().startsWith('em ') ? '' : 'em até '}
                      <span className="font-bold text-slate-900">{product.installments}</span>
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <span>* Preço e disponibilidade sujeitos a alteração no Mercado Livre</span>
                  </p>
                </div>
              )}

              {/* Main Conversion CTA */}
              {!isGenericMeli && (
                <div className="flex flex-col gap-2.5">
                  <a
                    id="buy-btn-primary"
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-4 px-6 rounded-2xl text-white font-extrabold text-base sm:text-lg shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-center ${
                      isArticle
                        ? 'bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 shadow-blue-900/25'
                        : 'bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/30 hover:shadow-orange-500/40'
                    }`}
                  >
                    <span>VER OFERTA NO MERCADO LIVRE</span>
                    <ExternalLink className="w-5 h-5" />
                  </a>

                  <p className="text-center text-[11px] text-slate-400">
                    {isArticle
                      ? '⚡ Acesso oficial direto à página do Mercado Livre com garantia de compra'
                      : '⚡ Redirecionamento oficial direto para o Mercado Livre com garantia de melhor valor'}
                  </p>
                </div>
              )}

              {/* Mercado Livre Trust Badges */}
              <div className="bg-slate-50 rounded-2xl p-4 flex flex-col gap-3 border border-slate-100 text-xs text-slate-700">
                {product.freeShipping && (
                  <div className="flex items-start gap-2.5">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Frete Grátis com Envio Rápido</span>
                      <p className="text-slate-500 text-[11px]">Receba com máxima agilidade pelo Mercado Envios</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Compra Garantida Mercado Livre</span>
                    <p className="text-slate-500 text-[11px]">Receba o produto que está esperando ou seu dinheiro de volta</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <RotateCcw className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">30 Dias para Devolução Grátis</span>
                    <p className="text-slate-500 text-[11px]">Se não gostar ou não servir, devolva sem burocracia</p>
                  </div>
                </div>
              </div>

              {/* Veredito Score Box */}
              {product.verdict && (
                <div className="bg-gradient-to-br from-blue-950 to-blue-900 text-white rounded-2xl p-4 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-blue-200 flex items-center gap-1">
                      <Award className="w-4 h-4 text-orange-400" /> Nota Achei Útil
                    </span>
                    <span className="text-xl font-black text-amber-300 font-['Outfit']">
                      {product.verdict.score} / 10
                    </span>
                  </div>
                  <p className="text-xs text-blue-100/90 leading-snug">
                    "{product.verdict.summary}"
                  </p>
                </div>
              )}

              {/* Sidebar Indique este Produto */}
              <ShareRecommendationBox
                variant="compact"
                productName={product.title}
              />

            </div>
          </div>

        </div>

        {/* In-depth Review Content Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 mb-12 shadow-xs">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit'] mb-6 flex items-center gap-2">
              <span className="w-2 h-7 bg-orange-500 rounded-full inline-block"></span>
              Guia Completo e Avaliação dos Compradores
            </h2>

            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 text-base">
              {product.reviewContent.includes('<p') || product.reviewContent.includes('<h') || product.reviewContent.includes('<style') ? (
                <div 
                  id="review-article-body"
                  className="space-y-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-slate-900 [&>h2]:mt-6 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:mt-4 [&>p]:text-slate-700 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5 [&>a]:text-orange-600 [&>a]:font-bold hover:[&>a]:underline [&_img]:rounded-2xl [&_img]:my-4 [&_img]:max-w-full [&_img]:border [&_img]:border-slate-200"
                  dangerouslySetInnerHTML={{ 
                    __html: product.reviewContent
                      .replace(/^(\s*<p[^>]*>\s*<\/p>\s*)?(&#8220;|[“”"'])\s*`*html\s*/i, '')
                      .replace(/^```html\s*/i, '')
                      .replace(/(&#8220;|[“”"'])\s*$/i, '')
                      .replace(/\s*```\s*$/i, '')
                      .replace(/&#8220;/g, '')
                      .trim()
                  }}
                />
              ) : (
                product.reviewContent.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))
              )}
            </div>
          </div>

          {/* Pros and Cons Section */}
          <div className="mt-10 pt-8 border-t border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-6">
              Pontos Fortes vs Pontos de Atenção
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Pros Card */}
              <div className="bg-emerald-50/70 rounded-2xl p-5 sm:p-6 border border-emerald-200/80">
                <h4 className="font-bold text-emerald-900 text-base mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  O Que Nós Mais Gostamos (Prós)
                </h4>
                <ul className="space-y-3 text-sm text-emerald-950">
                  {product.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons Card */}
              <div className="bg-rose-50/70 rounded-2xl p-5 sm:p-6 border border-rose-200/80">
                <h4 className="font-bold text-rose-900 text-base mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  Pontos de Atenção (Contras)
                </h4>
                <ul className="space-y-3 text-sm text-rose-950">
                  {product.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* Verdict Recommendation Box */}
          {product.verdict && (
            <div className="mt-10 bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" /> Para Quem Este Produto é Recomendado?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-white rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-800 block mb-1">👍 É ideal para:</span>
                  <p className="text-slate-700">{product.verdict.recommendedFor}</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-800 block mb-1">⚠️ Pode não ser ideal para:</span>
                  <p className="text-slate-700">{product.verdict.notRecommendedFor}</p>
                </div>
              </div>
            </div>
          )}

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && !product.reviewContent.includes('<table') && (
            <div className="mt-10 pt-8 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-4">
                Ficha Técnica e Especificações
              </h3>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-slate-200">
                    {product.specifications.map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="py-3 px-4 font-semibold text-slate-700 w-1/3 sm:w-1/4">
                          {spec.label}
                        </td>
                        <td className="py-3 px-4 text-slate-900">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Frequently Asked Questions (FAQ) */}
          {product.faqs && product.faqs.length > 0 && (
            <div className="mt-10 pt-8 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-4">
                Dúvidas Frequentes sobre o Produto
              </h3>
              <div className="space-y-3">
                {product.faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-4 text-left font-semibold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 transition-transform ${
                            isOpen ? 'rotate-180 text-orange-500' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-sm text-slate-600 bg-slate-50/50 border-t border-slate-100 pt-2">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Conversion Banner in Review */}
          {!isGenericMeli && (
            <div className="mt-10 p-6 bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">
                  Oportunidade no Mercado Livre
                </span>
                <h4 className="text-lg sm:text-xl font-bold font-['Outfit']">
                  Gostou do {product.title}?
                </h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Acesse o anúncio oficial no Mercado Livre e aproveite o menor preço com garantia.
                </p>
              </div>
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shrink-0 flex items-center gap-2 shadow-lg shadow-orange-500/30 transition-transform hover:scale-105"
              >
                <span>Ver Oferta no Mercado Livre</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Share / Indique o Produto ou o Site */}
          <ShareRecommendationBox
            productName={product.title}
            title={`Gostou da análise do ${product.title}?`}
            subtitle="Indique este achado para quem está pensando em comprar ou para o grupo da família/amigos!"
          />

        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
                  Outros Achados em {product.category.toUpperCase()}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Produtos similares recomendados pela nossa curadoria
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} onSelect={onSelectRelated} />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* MOBILE STICKY CTA BAR (High Conversion on Smartphones) */}
      {!isGenericMeli && (
        <div
          id="mobile-sticky-cta"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-2xl"
        >
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            {isArticle ? (
              <>
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {product.title}
                    </div>
                    <div className="text-[10px] text-blue-700 font-semibold">
                      {product.articleBadge || 'Guia & Artigo Informativo'}
                    </div>
                  </div>
                </div>

                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-black text-xs shadow-md shadow-blue-700/30 flex items-center gap-1.5"
                >
                  <span>VER OFERTA NO ML</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img
                    src={images[0]}
                    alt={product.title}
                    className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="truncate">
                    <div className="text-sm font-black text-slate-900 font-['Outfit']">
                      {formatBRL(product.price)}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {product.installments || 'À vista ou parcelado'}
                    </div>
                  </div>
                </div>

                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-xs shadow-md shadow-orange-500/30 flex items-center gap-1.5"
                >
                  <span>VER OFERTA NO ML</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

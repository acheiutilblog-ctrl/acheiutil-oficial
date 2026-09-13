import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  ExternalLink,
  Code,
  Sparkles,
  Layers,
  HelpCircle,
  Eye,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Product } from '../types';

interface WordPressButtonGeneratorProps {
  products: Product[];
  initialProductId?: string;
  onSelectProduct?: (prod: Product) => void;
}

export const WordPressButtonGenerator: React.FC<WordPressButtonGeneratorProps> = ({
  products,
  initialProductId,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || products[0]?.id || 'custom'
  );

  // Custom inputs if 'custom' is selected
  const [customTitle, setCustomTitle] = useState('Mini Processador e Triturador Elétrico USB 250ml');
  const [customUrl, setCustomUrl] = useState('https://meli.la/22vWZ9m');
  const [customPrice, setCustomPrice] = useState('49,90');
  const [customOriginalPrice, setCustomOriginalPrice] = useState('79,90');
  const [customInstallments, setCustomInstallments] = useState('3x de R$ 16,63 sem juros');
  const [customImage, setCustomImage] = useState(
    'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=80'
  );

  // Style selection
  const [buttonStyle, setButtonStyle] = useState<'ml-yellow' | 'orange-vibrant' | 'full-box' | 'inline-pill'>('ml-yellow');
  const [buttonText, setButtonText] = useState('Ver Menor Preço no Mercado Livre Oficial');
  const [includeBadges, setIncludeBadges] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  // Get active product data
  const activeProduct = useMemo(() => {
    if (selectedProductId === 'custom') {
      return {
        id: 'custom',
        title: customTitle,
        affiliateUrl: customUrl,
        price: parseFloat(customPrice.replace(',', '.')) || 0,
        originalPrice: customOriginalPrice ? parseFloat(customOriginalPrice.replace(',', '.')) : undefined,
        installments: customInstallments,
        images: [customImage],
        isFull: true,
        freeShipping: true,
      } as unknown as Product;
    }
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [selectedProductId, customTitle, customUrl, customPrice, customOriginalPrice, customInstallments, customImage, products]);

  // Sync button text when product or style changes if desired
  const handleProductChange = (id: string) => {
    setSelectedProductId(id);
    setCopied(false);
  };

  // Generate self-contained, inline-styled HTML ready for WordPress Gutenberg / Elementor / Classic Editor
  const generatedHtml = useMemo(() => {
    if (!activeProduct) return '';

    const url = activeProduct.affiliateUrl || 'https://www.mercadolivre.com.br';
    const title = activeProduct.title || 'Produto Selecionado';
    const priceFormatted = activeProduct.price
      ? activeProduct.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : '';
    const origPriceFormatted = activeProduct.originalPrice
      ? activeProduct.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : '';
    const discount =
      activeProduct.originalPrice && activeProduct.price
        ? Math.round(((activeProduct.originalPrice - activeProduct.price) / activeProduct.originalPrice) * 100)
        : null;

    const imgUrl = activeProduct.images?.[0] || '';
    const absoluteImgUrl = imgUrl.startsWith('http')
      ? imgUrl
      : window.location.origin + imgUrl;

    if (buttonStyle === 'ml-yellow') {
      return `<!-- Botão Oficial Mercado Livre (acheiutil.com) -->
<div style="text-align:center;margin:28px 0;clear:both;">
  <a href="${url}" target="_blank" rel="nofollow noopener sponsored" style="display:inline-flex;align-items:center;justify-content:center;gap:10px;background-color:#ffe600;color:#2d3277;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:17px;font-weight:800;padding:16px 32px;text-decoration:none;border-radius:10px;box-shadow:0 4px 14px rgba(0,0,0,0.12);line-height:1.2;border:none;">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d3277" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
    <span>${buttonText}</span>
  </a>
  ${
    includeBadges
      ? `<div style="font-size:12px;color:#6b7280;margin-top:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    ⚡ Compra 100% Garantida no Mercado Livre • Envio Rápido Full
  </div>`
      : ''
  }
</div>`;
    }

    if (buttonStyle === 'orange-vibrant') {
      return `<!-- Botão Laranja Alta Conversão (acheiutil.com) -->
<div style="text-align:center;margin:28px 0;clear:both;">
  <a href="${url}" target="_blank" rel="nofollow noopener sponsored" style="display:inline-flex;align-items:center;justify-content:center;gap:10px;background-color:#ff7700;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:17px;font-weight:800;padding:16px 36px;text-decoration:none;border-radius:12px;box-shadow:0 6px 18px rgba(255,119,0,0.35);line-height:1.2;border:none;">
    <span>${buttonText}</span>
    <span style="font-size:18px;">👉</span>
  </a>
  ${
    includeBadges
      ? `<div style="font-size:12px;color:#6b7280;margin-top:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    🔒 Menor Preço Garantido no Mercado Livre Oficial
  </div>`
      : ''
  }
</div>`;
    }

    if (buttonStyle === 'inline-pill') {
      return `<!-- Mini Botão Inline (acheiutil.com) -->
<a href="${url}" target="_blank" rel="nofollow noopener sponsored" style="display:inline-flex;align-items:center;gap:6px;background-color:#fffbeb;border:1px solid #fde68a;color:#b45309;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;font-weight:700;padding:6px 14px;border-radius:20px;text-decoration:none;margin:0 4px;vertical-align:middle;">
  <span>🛒 ${buttonText}</span>
</a>`;
    }

    // Default: 'full-box'
    return `<!-- Box de Oferta Mercado Livre (acheiutil.com) -->
<div style="background:#ffffff;border:2px solid #e2e8f0;border-radius:16px;padding:24px;margin:32px auto;max-width:560px;box-shadow:0 10px 25px rgba(0,0,0,0.06);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;text-align:center;box-sizing:border-box;">
  <div style="display:inline-block;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:800;letter-spacing:0.5px;padding:4px 14px;border-radius:20px;margin-bottom:14px;text-transform:uppercase;">
    ⭐ OFERTA RECOMENDADA
  </div>
  ${
    absoluteImgUrl
      ? `<div style="margin-bottom:16px;">
    <img src="${absoluteImgUrl}" alt="${title}" style="max-height:190px;max-width:100%;object-fit:contain;margin:0 auto;border-radius:12px;" />
  </div>`
      : ''
  }
  <h3 style="font-size:19px;font-weight:800;color:#0f172a;margin:0 0 10px 0;line-height:1.35;">${title}</h3>
  
  <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:8px;flex-wrap:wrap;">
    <span style="font-size:28px;font-weight:900;color:#16a34a;">${priceFormatted}</span>
    ${
      origPriceFormatted
        ? `<span style="font-size:14px;color:#94a3b8;text-decoration:line-through;">${origPriceFormatted}</span>`
        : ''
    }
    ${
      discount
        ? `<span style="background:#fef2f2;color:#dc2626;font-size:12px;font-weight:800;padding:2px 8px;border-radius:6px;">${discount}% OFF</span>`
        : ''
    }
  </div>

  ${
    activeProduct.installments
      ? `<div style="font-size:13px;color:#475569;margin-bottom:18px;">em até <strong>${activeProduct.installments}</strong></div>`
      : '<div style="margin-bottom:14px;"></div>'
  }

  <a href="${url}" target="_blank" rel="nofollow noopener sponsored" style="display:inline-flex;align-items:center;justify-content:center;gap:10px;width:100%;max-width:420px;background-color:#ffe600;color:#2d3277;font-size:16px;font-weight:800;padding:15px 24px;text-decoration:none;border-radius:10px;box-shadow:0 4px 14px rgba(0,0,0,0.12);box-sizing:border-box;line-height:1.2;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d3277" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
    <span>${buttonText}</span>
  </a>

  ${
    includeBadges
      ? `<div style="font-size:11px;color:#64748b;margin-top:14px;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;">
    <span>⚡ Envio Rápido FULL</span>
    <span>•</span>
    <span>🛡️ Compra 100% Protegida</span>
    <span>•</span>
    <span>⭐ Loja Oficial</span>
  </div>`
      : ''
  }
</div>`;
  }, [activeProduct, buttonStyle, buttonText, includeBadges]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = generatedHtml;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Gerador de Botão de Alta Conversão para WordPress
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
            Criar Botão de Compra para o seu Blog WordPress
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Gere botões e cards de oferta com seu link de afiliado do Mercado Livre prontos para colar em qualquer post do WordPress sem precisar instalar nenhum plugin.
          </p>
        </div>

        <button
          onClick={() => setShowTutorial(!showTutorial)}
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-blue-800" />
          <span>Como colar no WordPress?</span>
          {showTutorial ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Accordion Tutorial */}
      {showTutorial && (
        <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200/80 text-xs sm:text-sm text-slate-700 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/60 pb-3">
            <p className="font-extrabold text-blue-950 flex items-center gap-2 text-sm sm:text-base">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
              Guia Passo a Passo: Como colocar o botão no seu site/blog WordPress
            </p>
            <span className="text-[11px] font-bold text-blue-700 bg-white px-2.5 py-1 rounded-full border border-blue-200 shadow-2xs">
              ⚡ Sem precisar instalar nenhum plugin
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="bg-white p-4 rounded-xl border border-blue-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs mb-2">1</span>
                <span className="font-black text-slate-900 block text-xs sm:text-sm mb-1">Copiar o Código</span>
                <p className="text-slate-600 leading-relaxed">
                  Escolha o produto e o modelo visual abaixo (ex: <i>Amarelo Oficial ML</i> ou <i>Box de Oferta</i>) e clique no botão <b>"Copiar Código HTML"</b>.
                </p>
              </div>
              <div className="mt-3 text-[11px] font-semibold text-orange-600 bg-orange-50 p-2 rounded-lg border border-orange-100">
                👉 O código já vai com seu link de afiliado!
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-blue-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs mb-2">2</span>
                <span className="font-black text-slate-900 block text-xs sm:text-sm mb-1">No Post do WordPress</span>
                <p className="text-slate-600 leading-relaxed">
                  No editor Gutenberg do WordPress, clique no sinal de <b>+</b> (Adicionar Bloco), pesquise por <b>HTML Personalizado</b> (ou <i>Custom HTML</i>) e insira o bloco.
                </p>
              </div>
              <div className="mt-3 text-[11px] font-mono text-slate-600 bg-slate-100 p-2 rounded-lg">
                Bloco: [ HTML Personalizado ]
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-blue-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs mb-2">3</span>
                <span className="font-black text-slate-900 block text-xs sm:text-sm mb-1">Colar & Publicar</span>
                <p className="text-slate-600 leading-relaxed">
                  Cole o código dentro do bloco (Ctrl + V). Clique na aba <b>"Visualizar"</b> do próprio bloco para conferir o botão lindo e pronto para gerar cliques e comissões!
                </p>
              </div>
              <div className="mt-3 text-[11px] font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                ✅ Pronto como botão de compra principal!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Left Column: Form Settings (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* 1. Pick Product */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              1. Selecionar Produto
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-orange-500 outline-hidden bg-white"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title.length > 55 ? p.title.substring(0, 55) + '...' : p.title} (R$ {p.price.toFixed(2)})
                </option>
              ))}
              <option value="custom">✍️ Outro Produto (Digitar link e título personalizado)</option>
            </select>
          </div>

          {/* Custom Fields if 'custom' */}
          {selectedProductId === 'custom' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Título do Produto</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Seu Link de Afiliado ML</label>
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Preço Atual (R$)</label>
                  <input
                    type="text"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Preço Original (R$)</label>
                  <input
                    type="text"
                    value={customOriginalPrice}
                    onChange={(e) => setCustomOriginalPrice(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Choose Style */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-orange-500" />
              2. Escolher Estilo Visual
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              
              <button
                type="button"
                onClick={() => setButtonStyle('ml-yellow')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  buttonStyle === 'ml-yellow'
                    ? 'border-amber-400 bg-amber-50/50 ring-2 ring-amber-300'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <span className="font-extrabold text-xs text-slate-900 block">Amarelo Oficial ML</span>
                  <span className="text-[10px] text-slate-500">Padrão Mercado Livre</span>
                </div>
                <div className="w-full h-5 rounded bg-[#ffe600] flex items-center justify-center text-[10px] font-bold text-[#2d3277]">
                  Comprar
                </div>
              </button>

              <button
                type="button"
                onClick={() => setButtonStyle('orange-vibrant')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  buttonStyle === 'orange-vibrant'
                    ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-300'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <span className="font-extrabold text-xs text-slate-900 block">Laranja Achei Útil</span>
                  <span className="text-[10px] text-slate-500">CTA de Alta Conversão</span>
                </div>
                <div className="w-full h-5 rounded bg-[#ff7700] flex items-center justify-center text-[10px] font-bold text-white">
                  Ver Oferta 👉
                </div>
              </button>

              <button
                type="button"
                onClick={() => setButtonStyle('full-box')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  buttonStyle === 'full-box'
                    ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-300'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <span className="font-extrabold text-xs text-slate-900 block">Box de Oferta Completo</span>
                  <span className="text-[10px] text-slate-500">Card com foto, preço e botão</span>
                </div>
                <div className="w-full h-5 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-semibold text-slate-600">
                  Card com Foto
                </div>
              </button>

              <button
                type="button"
                onClick={() => setButtonStyle('inline-pill')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  buttonStyle === 'inline-pill'
                    ? 'border-amber-400 bg-amber-50/50 ring-2 ring-amber-300'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <span className="font-extrabold text-xs text-slate-900 block">Mini Botão Inline</span>
                  <span className="text-[10px] text-slate-500">Para o meio do parágrafo</span>
                </div>
                <div className="w-full h-5 rounded-full bg-amber-100 flex items-center justify-center text-[9px] font-bold text-amber-800">
                  🛒 Ver no ML
                </div>
              </button>

            </div>
          </div>

          {/* 3. Text & Extras */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                3. Texto do Botão
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Ex: Ver Menor Preço no Mercado Livre Oficial"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden"
              />
            </div>

            {buttonStyle !== 'inline-pill' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="include-badges-toggle"
                  checked={includeBadges}
                  onChange={(e) => setIncludeBadges(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <label htmlFor="include-badges-toggle" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Incluir selo de garantia (⚡ Compra Protegida / Envio Full)
                </label>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              onClick={handleCopyCode}
              className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-orange-500/30'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-white" />
                  <span>Código Copiado para a Área de Transferência!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 text-white" />
                  <span>Copiar Código HTML para o WordPress</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              Basta colar no bloco <b>HTML Personalizado</b> do WordPress. Não precisa de plugin.
            </p>
          </div>

        </div>

        {/* Right Column: Live Preview & HTML Code (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Visual Preview Box */}
          <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-600" />
                Pré-visualização em Tempo Real (Como ficará no WordPress)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500 font-semibold">
                Simulação Post
              </span>
            </div>

            {/* Simulated WordPress Post Sheet */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex-1 flex flex-col justify-center items-center overflow-hidden min-h-[220px]">
              <div
                className="w-full flex justify-center"
                dangerouslySetInnerHTML={{ __html: generatedHtml }}
              />
            </div>
          </div>

          {/* Raw HTML Code Output with Copy Button */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 flex flex-col border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold text-slate-300 font-mono">
                  Código HTML Gerado (Pronto para WordPress)
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="text-[11px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>

            <pre className="text-[11px] font-mono text-slate-300 bg-black/40 p-3.5 rounded-xl overflow-x-auto max-h-36 leading-relaxed whitespace-pre-wrap select-all">
              {generatedHtml}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};

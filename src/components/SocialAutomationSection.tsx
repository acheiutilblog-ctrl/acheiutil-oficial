import React, { useState } from 'react';
import { 
  Rss, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Facebook, 
  Instagram, 
  Twitter, 
  Flame, 
  Users, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { Product } from '../types';

interface SocialAutomationSectionProps {
  products: Product[];
  siteUrl?: string;
}

export const SocialAutomationSection: React.FC<SocialAutomationSectionProps> = ({
  products,
  siteUrl = 'https://acheiutil.com',
}) => {
  const [rssCopied, setRssCopied] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [postTone, setPostTone] = useState<'amigo' | 'achado' | 'pet'>('amigo');
  const [copiedGroupText, setCopiedGroupText] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const rssFeedUrl = `${siteUrl}/feed`;

  const handleCopyRss = () => {
    navigator.clipboard.writeText(rssFeedUrl);
    setRssCopied(true);
    setTimeout(() => setRssCopied(false), 2500);
  };

  // Generate engaging, anti-spam copy for Facebook Groups
  const getGroupPostText = () => {
    if (!selectedProduct) return '';

    const productUrl = selectedProduct.slug
      ? `${siteUrl}/${selectedProduct.slug}/`
      : `${siteUrl}/?product=${selectedProduct.id}`;
    const priceStr = `R$ ${Number(selectedProduct.price || 0).toFixed(2).replace('.', ',')}`;

    if (postTone === 'pet' || selectedProduct.category === 'pet') {
      return `🐾 Pessoal que tem pet, olha esse achadinho que encontrei no Mercado Livre!\n\n${selectedProduct.title}\n\nO que achei muito legal:\n✨ ${selectedProduct.pros?.[0] || 'Super prático e resistente para o dia a dia'}\n✨ ${selectedProduct.pros?.[1] || 'Fácil de limpar e muito confortável'}\n\n💰 Tá saindo por cerca de ${priceStr}${selectedProduct.isFull ? ' (com envio Full bem rápido)' : ''}.\n\nDeixei a análise sincera com os detalhes e o link seguro aqui: ${productUrl}\n\nAlguém já conhecia ou tem em casa? Me contem nos comentários! 👇`;
    }

    if (postTone === 'achado') {
      return `🔥 Achadinho super útil que vale cada centavo!\n\n${selectedProduct.title}\n\nAnálise rápida do que você precisa saber:\n✅ Ponto forte: ${selectedProduct.pros?.[0] || 'Excelente acabamento e praticidade'}\n✅ Preço atual: cerca de ${priceStr}\n⚠️ Fique atento: ${selectedProduct.cons?.[0] || 'Vale a pena conferir as medidas exatas antes de comprar'}\n\n👉 Review completa do Sr. Detetive com prós, contras e link direto do Mercado Livre: ${productUrl}\n\nO que acharam dessa utilidade?`;
    }

    // Default 'amigo' (Dica sincera e descontraída para Casa & Decoração)
    return `Gente, precisava compartilhar essa dica com vocês que também amam casa organizada! 🥰\n\nEstava pesquisando no Mercado Livre e analisei este produto:\n👉 ${selectedProduct.title}\n\nO que mais me chamou a atenção foi a praticidade (${selectedProduct.pros?.[0] || 'resolve um problemão do dia a dia'}) e o preço justo (por volta de ${priceStr}).\n\nFiz uma análise detalhada com prós, contras e onde achar original no ML:\n🔗 ${productUrl}\n\nEspero que ajude quem estiver procurando algo assim! O que acharam?`;
  };

  const handleCopyGroupText = () => {
    navigator.clipboard.writeText(getGroupPostText());
    setCopiedGroupText(true);
    setTimeout(() => setCopiedGroupText(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-900/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Automação Social & Divulgação
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight">
              Como Divulgar Automaticamente no Facebook, Instagram, Pinterest e X
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              O seu site já possui um <b>Feed RSS 2.0 ativo</b>. Assim como o Jetpack funcionava no WordPress, você pode conectar esse feed em ferramentas de automação para que cada novo review seja publicado sozinho nas suas redes sociais.
            </p>
          </div>

          <div className="shrink-0 bg-white/10 p-4 rounded-2xl border border-white/15 flex flex-col items-center justify-center gap-1 text-center min-w-[160px]">
            <Rss className="w-7 h-7 text-orange-400 mb-1" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Feed RSS</span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Ativo & Online
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 1. RSS Automation & 2. Facebook Groups Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 1: Feed RSS para Automação nas Redes */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Rss className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">Seu Feed RSS Oficial</h4>
                  <p className="text-xs text-slate-500">Atualiza automaticamente a cada novo post</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
                Padrão Universal
              </span>
            </div>

            {/* RSS Box with copy button */}
            <div className="p-3.5 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="truncate font-mono text-xs text-orange-400">
                {rssFeedUrl}
              </div>
              <button
                onClick={handleCopyRss}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                {rssCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Step-by-step with Metricool / Buffer */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                Ferramentas Gratuitas recomendadas para substituir o Jetpack:
              </p>

              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1.5 text-xs text-indigo-950">
                <div className="flex items-center justify-between font-bold text-indigo-900">
                  <span>1. Metricool (Mais recomendado - Em Português)</span>
                  <span className="text-[10px] bg-indigo-200/60 text-indigo-800 px-2 py-0.5 rounded-md">Plano Grátis</span>
                </div>
                <p className="text-indigo-800/80 leading-relaxed text-[11px]">
                  Permite conectar sua <b>Página do Facebook, Instagram, Pinterest e X</b> em uma só conta. Você adiciona o seu Feed RSS (`{rssFeedUrl}`) e ele publica automaticamente sempre que tiver um review novo!
                </p>

                {/* Important notice about repeated posts */}
                <div className="mt-2 p-2.5 rounded-lg bg-amber-100/70 border border-amber-200 text-[11px] text-amber-900">
                  <p className="font-bold flex items-center gap-1 text-amber-950 mb-0.5">
                    ⚠️ Atenção para não repetir posts no Facebook:
                  </p>
                  <p className="leading-relaxed">
                    No Metricool, ao criar ou editar a sua <b>Autolista</b>, certifique-se de <b>DESATIVAR</b> a opção <b>"Repetir autolista" (Circular)</b>. Se essa opção estiver ligada, o Metricool fica postando os mesmos produtos em loop infinito a cada 12h ou 24h.
                  </p>
                </div>

                <a
                  href="https://metricool.com/pt-br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 hover:underline pt-0.5"
                >
                  <span>Acessar Metricool Grátis</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>2. Buffer ou Zapier / IFTTT</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">Alternativas</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  No <b>Buffer</b> ou <b>Zapier</b>, basta criar uma regra: <i>"Quando surgir novo item no RSS Feed → Criar post no Facebook / X / Pinterest"</i>.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Formato XML 100% validado
            </span>
            <a
              href="/feed"
              target="_blank"
              className="text-orange-600 hover:text-orange-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>Ver Feed no Navegador</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* CARD 2: Grupos do Facebook (Casa, Decoração e Pet) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">Postar em Grupos do Facebook</h4>
                  <p className="text-xs text-slate-500">Casa, Organização, Decoração e Pets</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                Alto Tráfego Orgânico
              </span>
            </div>

            {/* Warning Alert about Meta policies */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-950">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900 mb-0.5">Aviso Importante sobre Automação em Grupos:</p>
                <p className="text-amber-800 leading-relaxed text-[11px]">
                  O Facebook <b>bloqueia e bane domínios</b> que usam robôs ou extensões piratas para postar automaticamente em grupos de outras pessoas (considerado SPAM pela Meta).
                </p>
                <p className="text-amber-800 leading-relaxed text-[11px] mt-1 font-semibold">
                  A forma segura e com maior resultado é: postar na sua página e clicar em <u>Compartilhar no Grupo</u>, ou usar o nosso gerador de texto pronto abaixo com 1 clique!
                </p>
              </div>
            </div>

            {/* Product Selector for Group Post Generator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Escolha o Produto para Gerar a Postagem:
                </label>
                <div className="flex items-center gap-1 text-[11px]">
                  <button
                    onClick={() => setPostTone('amigo')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                      postTone === 'amigo' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Dica Casa
                  </button>
                  <button
                    onClick={() => setPostTone('achado')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                      postTone === 'achado' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Achadinho ML
                  </button>
                  <button
                    onClick={() => setPostTone('pet')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                      postTone === 'pet' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Pets 🐶
                  </button>
                </div>
              </div>

              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full text-xs font-medium py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.category.toUpperCase()}] {p.title.slice(0, 55)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Generated Text Box */}
            <div className="relative">
              <textarea
                readOnly
                rows={5}
                value={getGroupPostText()}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-sans leading-relaxed resize-none focus:outline-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={handleCopyGroupText}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedGroupText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                  <span className="text-white">Texto Copiado com Link!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Texto Formatado para Grupo</span>
                </>
              )}
            </button>

            <a
              href="https://www.facebook.com/groups/feed/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            >
              <Facebook className="w-3.5 h-3.5 text-blue-600" />
              <span>Abrir Grupos do Facebook</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

      </div>

      {/* 3 Step Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
          <HelpCircle className="w-4 h-4 text-orange-500" />
          Resumo Prático: O seu Fluxo de Divulgação Perfeito
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="w-7 h-7 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center text-xs mb-2">1</div>
            <p className="font-bold text-slate-900">Cadastre o Review no Site</p>
            <p className="text-slate-600 leading-relaxed">
              Você cadastra o produto ou importa pelo link do Mercado Livre aqui no Painel. Ele ganha a review do Sr. Detetive.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs mb-2">2</div>
            <p className="font-bold text-slate-900">Metricool / Buffer Posta Sozinho</p>
            <p className="text-slate-600 leading-relaxed">
              O Metricool lê o seu Feed RSS (`{rssFeedUrl}`) e publica imediatamente na sua <b>Página do Facebook, Instagram, Pinterest e X</b> com foto e link.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs mb-2">3</div>
            <p className="font-bold text-slate-900">Compartilhe nos Grupos</p>
            <p className="text-slate-600 leading-relaxed">
              Com 1 clique, compartilhe o post da sua página nos grupos de Casa, Decoração e Pet onde você participa. Zero risco de banimento e alto engajamento!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

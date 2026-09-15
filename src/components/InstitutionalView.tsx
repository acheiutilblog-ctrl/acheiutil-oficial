import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  Cookie, 
  Handshake, 
  Users, 
  Mail, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  Eye,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { InstitutionalTab } from '../types';

interface InstitutionalViewProps {
  initialTab?: InstitutionalTab;
  onBack: () => void;
  contactEmail?: string;
  onOpenCookieBanner?: () => void;
}

export const InstitutionalView: React.FC<InstitutionalViewProps> = ({
  initialTab = 'termos',
  onBack,
  contactEmail = 'contato@acheiutil.com',
  onOpenCookieBanner,
}) => {
  const [activeTab, setActiveTab] = useState<InstitutionalTab>(initialTab);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactMail, setContactMail] = useState('');
  const [contactSubject, setContactSubject] = useState('Dúvida sobre Review');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMail.trim() || !contactMessage.trim()) return;

    // Simulate reliable submission feedback
    setContactSent(true);
  };

  const navItems: { id: InstitutionalTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'termos', label: 'Termos de Uso', icon: <FileText className="w-4 h-4" /> },
    { id: 'privacidade', label: 'Política de Privacidade', icon: <ShieldCheck className="w-4 h-4" />, badge: 'LGPD' },
    { id: 'cookies', label: 'Política de Cookies', icon: <Cookie className="w-4 h-4" /> },
    { id: 'afiliados', label: 'Divulgação de Afiliados', icon: <Handshake className="w-4 h-4" /> },
    { id: 'sobre', label: 'Quem Somos', icon: <Users className="w-4 h-4" /> },
    { id: 'contato', label: 'Fale Conosco', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <div id="institutional-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb & Return Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-900 hover:text-orange-500 transition-colors cursor-pointer py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-orange-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Página Inicial</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Início</span>
          <span>/</span>
          <span className="text-slate-400">Institucional</span>
          <span>/</span>
          <span className="font-semibold text-slate-900">
            {navItems.find((n) => n.id === activeTab)?.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs sticky top-24">
          <div className="px-3 py-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Páginas Institucionais & Legais
            </span>
            <h2 className="text-lg font-black text-slate-900 font-['Outfit']">
              achei<span className="text-orange-500">util</span>.com
            </h2>
          </div>

          <nav className="flex flex-col gap-1.5" aria-label="Menu Institucional">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-blue-900 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-amber-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-blue-800 text-emerald-300 border border-blue-700'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-6 pt-5 border-t border-slate-100 px-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Mail className="w-3.5 h-3.5 text-orange-500" />
              <span>Dúvidas jurídicas ou editoriais:</span>
            </div>
            <a
              href={`mailto:${contactEmail}`}
              className="text-xs font-bold text-blue-900 hover:text-orange-500 underline break-all"
            >
              {contactEmail}
            </a>
          </div>
        </div>

        {/* Right Content Area (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs">
          
          {/* TAB 1: TERMOS DE USO */}
          {activeTab === 'termos' && (
            <article className="prose prose-slate max-w-none text-slate-700 space-y-5 text-sm sm:text-base leading-relaxed">
              <div className="pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  Condições Gerais de Navegação
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
                  Termos de Uso
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Última atualização: 14 de setembro de 2026
                </p>
              </div>

              <section>
                <h3 className="text-lg font-bold text-slate-900">1. Aceitação dos Termos</h3>
                <p>
                  Bem-vindo ao <strong>acheiutil.com</strong>. Ao navegar, ler artigos, consultar comparativos ou utilizar qualquer recurso disponibilizado neste website, você declara que leu, compreendeu e concorda integralmente com estes Termos de Uso. Caso não concorde com qualquer disposição aqui estabelecida, recomendamos descontinuar a navegação imediatamente.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900">2. Natureza dos Conteúdos e Finalidade Editorial</h3>
                <p>
                  O <strong>acheiutil.com</strong> é um portal independente de conteúdo editorial, curadoria, reviews e guias de compras focado em utilidades para o lar, itens de cozinha, produtos para pets e decoração. 
                </p>
                <p>
                  Nosso objetivo é auxiliar os consumidores através de análises criteriosas de especificações técnicas, consolidação de depoimentos de compradores verificados e indicação das melhores ofertas. 
                  <strong> O acheiutil.com NÃO é uma loja virtual, NÃO armazena estoque e NÃO processa pagamentos diretamente em seus servidores.</strong>
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900">3. Relação Comercial e Compras no Mercado Livre</h3>
                <p>
                  Todos os botões e links de produtos identificados como "Ver Oferta", "Conferir no Mercado Livre" ou equivalentes redirecionam o usuário para páginas oficiais da plataforma <strong>Mercado Livre</strong> (ou de seus vendedores credenciados).
                </p>
                <ul>
                  <li><strong>Processamento de Pagamento:</strong> É de responsabilidade exclusiva do Mercado Livre e dos meios por ele autorizados (Mercado Pago, cartões, Pix).</li>
                  <li><strong>Envio, Frete e Logística:</strong> A entrega é operada pelos vendedores ou pela malha logística do Mercado Livre (ex: Mercado Envios Full).</li>
                  <li><strong>Garantia, Trocas e Devoluções:</strong> Seguem estritamente as políticas oficiais da plataforma parceira e do Código de Defesa do Consumidor (art. 49, direito de arrependimento em até 7 dias, com garantia estendida de 30 dias oferecida pelo Mercado Livre).</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900">4. Oscilação de Preços e Disponibilidade</h3>
                <p>
                  Os preços, descontos, condições de frete e estoques divulgados no <strong>acheiutil.com</strong> refletem os valores apurados no momento da curadoria. O Mercado Livre e os vendedores parceiros possuem autonomia para alterar valores e promoções a qualquer momento, sem aviso prévio. O preço oficial prevalecerá sempre no momento da finalização da compra no site do Mercado Livre.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900">5. Propriedade Intelectual</h3>
                <p>
                  Os textos opinativos, análises, estrutura visual, logotipos e conteúdos autorais produzidos pelo <strong>acheiutil.com</strong> são protegidos pela legislação de direitos autorais (Lei nº 9.610/98). É proibida a reprodução parcial ou total para fins comerciais sem autorização prévia por escrito.
                </p>
                <p className="text-xs text-slate-500">
                  <em>Mercado Livre ® é marca registrada de titularidade de MercadoLibre S.R.L. As marcas e fotografias de produtos citadas pertencem aos seus respectivos fabricantes e detentores, sendo mencionadas estritamente para fins de identificação, análise crítica e divulgação informativa.</em>
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900">6. Foro e Legislação Aplicável</h3>
                <p>
                  Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Para dirimir eventuais controvérsias decorrentes da utilização deste website, fica eleito o Foro da Comarca de domicílio do usuário consumidor.
                </p>
              </section>
            </article>
          )}

          {/* TAB 2: POLÍTICA DE PRIVACIDADE (LGPD) */}
          {activeTab === 'privacidade' && (
            <article className="prose prose-slate max-w-none text-slate-700 space-y-5 text-sm sm:text-base leading-relaxed">
              <div className="pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
                  Política de Privacidade
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Última atualização: 14 de setembro de 2026
                </p>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs sm:text-sm text-emerald-950 flex items-start gap-3">
                <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Nosso compromisso com você:</strong> O acheiutil.com não comercializa, não aluga e não compartilha dados pessoais de seus visitantes com terceiros para fins de spam ou publicidade invasiva. Não solicitamos senhas bancárias nem dados de cartão de crédito.
                </div>
              </div>

              <section>
                <h3 className="text-lg font-bold text-slate-900">1. Quais Dados Coletamos</h3>
                <p>
                  Durante a navegação regular no <strong>acheiutil.com</strong>, podemos registrar exclusivamente:
                </p>
                <ul>
                  <li><strong>Dados Técnicos de Navegação:</strong> Endereço IP anonimizado, tipo de navegador, sistema operacional, resolução de tela e páginas acessadas dentro do nosso portal (para fins de estatística e diagnóstico técnico).</li>
                  <li><strong>Dados Fornecidos Voluntariamente:</strong> Nome e endereço de e-mail informados quando o usuário decide nos enviar uma mensagem voluntária através do formulário de contato ou e-mail editorial.</li>
                  <li><strong>Cookies e Identificadores de Afiliados:</strong> Cookies anônimos para identificar cliques em links de recomendação, necessários para que a plataforma parceira (Mercado Livre) reconheça a origem do acesso.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900">2. O que NÃO Coletamos</h3>
                <p>
                  Como não operamos checkout no site, <strong>jamais coletamos, armazenamos ou temos acesso a:</strong>
                </p>
                <ul>
                  <li>Números de cartão de crédito ou débito;</li>
                  <li>Dados bancários ou chaves Pix;</li>
                  <li>Senhas de acesso à conta do Mercado Livre;</li>
                  <li>Endereço residencial completo para entrega (fornecido por você diretamente no ambiente criptografado do Mercado Livre).</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900">3. Finalidade do Tratamento dos Dados</h3>
                <p>Os dados limitados que coletamos são utilizados exclusivamente para:</p>
                <ol>
                  <li>Assegurar a estabilidade, rapidez e segurança do website;</li>
                  <li>Analisar anonimamente quais guias de produtos despertam maior interesse no público, orientando futuras análises;</li>
                  <li>Responder a mensagens e solicitações enviadas através do canal Fale Conosco;</li>
                  <li>Atender a exigências legais e regulatórias vigentes.</li>
                </ol>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900">4. Direitos do Titular de Dados (Art. 18 da LGPD)</h3>
                <p>
                  Você, na qualidade de titular dos dados, pode a qualquer momento exercer seus direitos previstos pela LGPD, incluindo:
                </p>
                <ul>
                  <li>Confirmação da existência de tratamento;</li>
                  <li>Acesso aos dados pessoais que porventura tenhamos arquivado (como histórico de mensagens de contato);</li>
                  <li>Correção de dados incompletos ou inexatos;</li>
                  <li>Eliminação ou revogação do consentimento para tratamento de dados não essenciais.</li>
                </ul>
                <p>
                  Para exercer qualquer um desses direitos, basta enviar uma mensagem direta para o nosso Encarregado de Proteção de Dados (DPO) através do e-mail: <strong>{contactEmail}</strong>.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900">5. Segurança da Informação</h3>
                <p>
                  Toda a comunicação entre o seu navegador e o <strong>acheiutil.com</strong> é protegida por criptografia moderna SSL/TLS (protocolo HTTPS), garantindo que terceiros não possam interceptar o tráfego dos dados durante a navegação.
                </p>
              </section>
            </article>
          )}

          {/* TAB 3: POLÍTICA DE COOKIES */}
          {activeTab === 'cookies' && (
            <article className="prose prose-slate max-w-none text-slate-700 space-y-5 text-sm sm:text-base leading-relaxed">
              <div className="pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Transparência e Controle
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
                  Política de Cookies
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Saiba exatamente o que são, para que servem e como gerenciar seus cookies
                </p>
              </div>

              {/* Interactive Reset Preference Box */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base flex items-center gap-2 text-white">
                    <Cookie className="w-5 h-5 text-orange-400" /> Suas Preferências Atuais
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Você pode alterar ou revogar sua decisão de consentimento de cookies a qualquer momento.
                  </p>
                </div>
                <button
                  onClick={() => {
                    try {
                      localStorage.removeItem('acheiutil_cookie_consent');
                    } catch {}
                    if (onOpenCookieBanner) {
                      onOpenCookieBanner();
                    } else {
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-transform active:scale-95 cursor-pointer shrink-0"
                >
                  Reabrir Banner de Cookies
                </button>
              </div>

              <section>
                <h3 className="text-lg font-bold text-slate-900">1. O que são Cookies?</h3>
                <p>
                  Cookies são pequenos arquivos de texto transferidos para o seu navegador quando você visita uma página da web. Eles permitem que o site memorize informações sobre a sua visita (como idioma preferido, se você já aceitou o aviso de privacidade ou links de navegação), proporcionando uma experiência mais fluida e segura.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900">2. Categorias de Cookies Utilizados no AcheiUtil</h3>
                
                <div className="space-y-3 not-prose my-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cookies Estritamente Necessários (Essenciais)
                      </span>
                      <span className="text-[10px] uppercase font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                        Sempre Ativos
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Fundamentais para o carregamento do layout, segurança da página e gravação do seu consentimento na barra da LGPD. Sem eles, o site não funciona corretamente.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Handshake className="w-4 h-4 text-orange-500" /> Cookies de Afiliados (Parceria Comercial)
                      </span>
                      <span className="text-[10px] uppercase font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                        Funcionais
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Quando você clica em um botão de recomendação para o Mercado Livre, um identificador anônimo é emitido para que a plataforma de compras saiba que você conheceu a oferta por meio do acheiutil.com. Não armazena dados confidenciais do usuário.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-blue-600" /> Cookies de Desempenho e Métricas (Analíticos)
                      </span>
                      <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        Opcionais
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Coletam dados estatísticos consolidados e anonimizados (como total de visitas e artigos mais lidos através de ferramentas como o Google Analytics). Podem ser rejeitados a qualquer momento pelo leitor.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900">3. Como Desativar Cookies no seu Navegador</h3>
                <p>
                  Além das opções oferecidas em nosso banner, você pode a qualquer momento bloquear ou apagar cookies salvos diretamente nas configurações de privacidade do seu navegador de internet:
                </p>
                <ul>
                  <li><strong>Google Chrome:</strong> Configurações &gt; Privacidade e segurança &gt; Cookies e outros dados de sites.</li>
                  <li><strong>Mozilla Firefox:</strong> Configurações &gt; Privacidade e Segurança &gt; Cookies e dados de sites.</li>
                  <li><strong>Apple Safari:</strong> Preferências &gt; Privacidade &gt; Gerenciar Dados de Sites.</li>
                  <li><strong>Microsoft Edge:</strong> Configurações &gt; Cookies e permissões de site.</li>
                </ul>
              </section>
            </article>
          )}

          {/* TAB 4: DIVULGAÇÃO DE AFILIADOS & TRANSPARÊNCIA */}
          {activeTab === 'afiliados' && (
            <article className="prose prose-slate max-w-none text-slate-700 space-y-5 text-sm sm:text-base leading-relaxed">
              <div className="pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  Compromisso com o Código de Defesa do Consumidor e CONAR
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
                  Divulgação de Afiliados & Transparência
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Nossa política aberta de monetização e independência editorial
                </p>
              </div>

              <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 text-xs sm:text-sm text-orange-950 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Regra de ouro do AcheiUtil:</strong> Comprar através dos nossos links NÃO aumenta o preço do produto em nenhum centavo. A comissão é paga integralmente pela plataforma parceira como parte de seu custo de divulgação.
                </div>
              </div>

              <section>
                <h3 className="text-lg font-bold text-slate-900">1. Programa de Afiliados do Mercado Livre</h3>
                <p>
                  O <strong>acheiutil.com</strong> participa do programa de afiliados oficial do <strong>Mercado Livre</strong>. Isso significa que podemos receber uma pequena comissão por compras qualificadas realizadas por leitores que foram encaminhados através dos links disponíveis em nossos artigos, guias e fichas de produtos.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900">2. Independência Editorial: Não Vendemos Opinião</h3>
                <p>
                  Acreditamos firmemente que o único modelo de negócio sustentável na internet a longo prazo é a <strong>confiança incondicional do leitor</strong>. Por isso, adotamos regras rígidas de independência:
                </p>
                <ul>
                  <li><strong>Não aceitamos pagamentos para falar bem:</strong> Fabricantes e vendedores não podem pagar para obter notas altas ou ocultar defeitos de produtos.</li>
                  <li><strong>Apontamos os contras sem medo:</strong> Se um produto tem limitações (por exemplo, voltagem restrita, acabamento em plástico frágil, manual complexo ou vazão baixa), isso é destacado em negrito em nossas tabelas de prós e contras.</li>
                  <li><strong>Prioridade para reputação:</strong> Priorizamos anúncios com envio Full, lojas oficiais e vendedores com classificação MercadoLíder Platinum/Gold para resguardar a compra de quem nos lê.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900">3. Por Que Esse Modelo Beneficia Você?</h3>
                <p>
                  Graças ao programa de afiliados, o portal <strong>acheiutil.com</strong> permanece 100% gratuito e aberto para todos os consumidores, sem a necessidade de assinaturas pagas (paywalls) e sem entupir a tela com anúncios pop-up invasivos ou banners piscantes que atrapalham a leitura.
                </p>
              </section>
            </article>
          )}

          {/* TAB 5: QUEM SOMOS / SOBRE O ACHEIUTIL */}
          {activeTab === 'sobre' && (
            <article className="prose prose-slate max-w-none text-slate-700 space-y-5 text-sm sm:text-base leading-relaxed">
              <div className="pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Nossa História e Propósito
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
                  Quem Somos — Sobre o AcheiUtil
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Descubra a história por trás do portal que ajuda você a comprar com segurança
                </p>
              </div>

              <section>
                <h3 className="text-lg font-bold text-slate-900">Nossa Missão</h3>
                <blockquote className="border-l-4 border-orange-500 pl-4 py-1 text-base sm:text-lg font-bold text-slate-900 font-['Outfit'] bg-orange-50/50 rounded-r-xl">
                  "Antes de comprar, descubra se vale a pena."
                </blockquote>
                <p>
                  Comprar na internet hoje é ao mesmo tempo incrível e exaustivo. São milhares de modelos parecidos, preços que variam todos os dias, anúncios confusos e fotos com tratamento de estúdio que nem sempre mostram a realidade do produto que chega na sua porta.
                </p>
                <p>
                  O <strong>acheiutil.com</strong> nasceu para resolver esse problema. Criamos um filtro humano e minucioso, separando o que é realmente prático, durável e de bom custo-benefício daquilo que é apenas propaganda vazia.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900">O Que Analisamos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <h4 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-1.5">
                      🏠 Casa & Cozinha Prática
                    </h4>
                    <p className="text-xs text-slate-600">
                      Purificadores, air fryers, organizadores e ferramentas que poupam espaço e tempo na rotina doméstica.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <h4 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-1.5">
                      ✨ Utilidades do Dia a Dia
                    </h4>
                    <p className="text-xs text-slate-600">
                      Itens inteligentes, repetidores de sinal, ferramentas compactas e soluções que resolvem pequenos incômodos.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <h4 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-1.5">
                      🎨 Decoração & Conforto
                    </h4>
                    <p className="text-xs text-slate-600">
                      Iluminação LED, ventiladores retráteis, capas e detalhes que transformam ambientes sem gastar uma fortuna em reformas.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <h4 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-1.5">
                      🐾 Cuidado com Pets
                    </h4>
                    <p className="text-xs text-slate-600">
                      Camas ortopédicas laváveis, bebedouros automáticos, arranhadores e produtos que proporcionam bem-estar aos animais.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900">Como é Feita Nossa Curadoria</h3>
                <p>Não nos limitamos a copiar o que diz a embalagem. Nossa metodologia envolve:</p>
                <ol>
                  <li><strong>Varredura de Avaliações Reais:</strong> Analisamos dezenas de comentários de quem comprou e usou há 30, 60 ou 90 dias, caçando problemas recorrentes.</li>
                  <li><strong>Checagem de Voltagem e Medidas:</strong> Verificamos se o tamanho do produto realmente cabe em pias, bancadas, armários e portas padrão de casas brasileiras.</li>
                  <li><strong>Verificação de Procedência:</strong> Conferimos se o produto possui garantia nacional, manual em português e se os vendedores contam com boa reputação no Mercado Livre.</li>
                </ol>
              </section>
            </article>
          )}

          {/* TAB 6: FALE CONOSCO / CONTATO */}
          {activeTab === 'contato' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Canal Direto com a Equipe
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
                  Fale Conosco
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Tem alguma dúvida sobre uma análise, sugestão de produto para investigarmos ou pedido de suporte? Estamos à disposição.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Contact Info (5 cols) */}
                <div className="md:col-span-5 flex flex-col gap-4">
                  <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-100">
                    <h4 className="font-bold text-sm text-blue-950 flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-orange-500" /> E-mail Oficial
                    </h4>
                    <p className="text-xs text-slate-600 mb-2">
                      Para contato geral, dúvidas editoriais ou exercício de direitos da LGPD:
                    </p>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-sm font-extrabold text-blue-900 hover:text-orange-600 underline break-all"
                    >
                      {contactEmail}
                    </a>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                    <h4 className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                      <Info className="w-4 h-4 text-blue-600" /> Horário de Atendimento
                    </h4>
                    <p>Segunda a Sexta-feira, das 09h às 18h (horário de Brasília).</p>
                    <p className="text-[11px] text-slate-500">
                      Respondemos a todas as mensagens com atenção em até 24 a 48 horas úteis.
                    </p>
                  </div>
                </div>

                {/* Contact Form (7 cols) */}
                <div className="md:col-span-7">
                  {contactSent ? (
                    <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                      <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                      <h4 className="text-lg font-bold text-emerald-950 font-['Outfit']">
                        Mensagem Enviada com Sucesso!
                      </h4>
                      <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-sm mx-auto">
                        Obrigado pelo contato! Nossa equipe recebeu sua mensagem e retornará para o e-mail <strong>{contactMail}</strong> em breve.
                      </p>
                      <button
                        onClick={() => {
                          setContactSent(false);
                          setContactMessage('');
                        }}
                        className="mt-3 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
                      >
                        Enviar Outra Mensagem
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 mb-1">
                          Seu Nome Completo *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Ex: Carlos Silva"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 mb-1">
                          Seu E-mail *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={contactMail}
                          onChange={(e) => setContactMail(e.target.value)}
                          placeholder="exemplo@gmail.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-700 mb-1">
                          Assunto
                        </label>
                        <select
                          id="contact-subject"
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                        >
                          <option value="Dúvida sobre Review">Dúvida sobre um produto ou review</option>
                          <option value="Sugestão de Produto">Sugestão de produto para curadoria</option>
                          <option value="Correção de Informação">Reportar preço ou informação desatualizada</option>
                          <option value="Privacidade e LGPD">Solicitação de Privacidade / LGPD</option>
                          <option value="Parceria Comercial">Parcerias e Propostas</option>
                          <option value="Outro">Outro assunto</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 mb-1">
                          Sua Mensagem *
                        </label>
                        <textarea
                          id="contact-message"
                          required
                          rows={4}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Como podemos te ajudar?"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-y"
                        />
                      </div>

                      <button
                        id="btn-submit-contact"
                        type="submit"
                        className="w-full py-3 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Enviar Mensagem</span>
                      </button>

                      <p className="text-[11px] text-slate-400 text-center">
                        Seus dados serão tratados estritamente para responder à sua mensagem, conforme a nossa Política de Privacidade.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

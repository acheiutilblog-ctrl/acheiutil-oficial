import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Zap, Truck, RotateCcw } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Como funciona a seleção de produtos do acheiutil.com?',
      a: 'Nossa curadoria pesquisa e filtra diariamente os produtos mais vendidos e com as melhores notas no Mercado Livre nas categorias de Casa, Utilidades, Decoração e Pet. Reunimos as opiniões de quem realmente comprou, checamos a reputação do vendedor, fotos reais enviadas por clientes e o custo-benefício para você não perder tempo procurando.',
    },
    {
      q: 'Os links levam direto para o site oficial do Mercado Livre?',
      a: 'Sim! Todos os nossos links de "Ver Oferta" ou "Comprar no Mercado Livre" redirecionam você de forma 100% segura para os anúncios oficiais no Mercado Livre, onde você conta com a proteção do programa Compra Garantida e pagamento via Mercado Pago.',
    },
    {
      q: 'O que significa o selo "Envio FULL"?',
      a: 'O selo FULL indica que o produto está armazenado diretamente no centro de distribuição próprio do Mercado Livre. Isso significa que ele é despachado imediatamente e costuma chegar na sua casa no dia seguinte ou em até 48 horas úteis.',
    },
    {
      q: 'E se eu comprar e não gostar do produto?',
      a: 'Você tem até 30 dias após receber o produto para solicitar a devolução gratuita no Mercado Livre, desde que o produto esteja em perfeitas condições e na embalagem original.',
    },
  ];

  return (
    <section className="mb-14 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" /> Dúvidas Frequentes
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit']">
            Como Funciona a Compra Segura no Mercado Livre?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tudo o que você precisa saber sobre as nossas indicações e garantias
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4 hover:bg-slate-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-orange-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

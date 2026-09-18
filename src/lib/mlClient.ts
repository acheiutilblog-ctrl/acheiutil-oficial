import { ProductCategory, Product, SiteSettings } from '../types';

export interface MLSearchResultItem {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  thumbnail: string;
  permalink: string;
  raw_permalink?: string;
  condition: string;
  free_shipping: boolean;
  isFull: boolean;
  official_store_name: string;
  installments?: string;
  attributes?: Array<{ name: string; value_name: string }>;
}

// Curated high quality image banks by search intent
const CURATED_IMAGE_POOLS: Record<string, string[]> = {
  espelho: [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
  ],
  decoracao: [
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=1000&q=80',
  ],
  casa: [
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
  ],
  utilidades: [
    'https://images.unsplash.com/photo-1585336261026-77cc7c97f266?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1000&q=80',
  ],
  pet: [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80',
  ],
};

export function detectCategoryFromText(text: string): ProductCategory {
  const t = text.toLowerCase();
  if (
    t.includes('pet') ||
    t.includes('gato') ||
    t.includes('cachorro') ||
    t.includes('cão') ||
    t.includes('coleira') ||
    t.includes('arranhador') ||
    t.includes('racao') ||
    t.includes('ração') ||
    t.includes('peitoral')
  ) {
    return 'pet';
  }
  if (
    t.includes('espelho') ||
    t.includes('quadro') ||
    t.includes('tapete') ||
    t.includes('luminaria') ||
    t.includes('luminária') ||
    t.includes('abajur') ||
    t.includes('vaso') ||
    t.includes('almofada') ||
    t.includes('cortina') ||
    t.includes('decorativo') ||
    t.includes('decoração') ||
    t.includes('decoracao')
  ) {
    return 'decoracao';
  }
  if (
    t.includes('panela') ||
    t.includes('air fryer') ||
    t.includes('fritadeira') ||
    t.includes('liquidificador') ||
    t.includes('aspirador') ||
    t.includes('cafeteira') ||
    t.includes('cozinha') ||
    t.includes('mop') ||
    t.includes('cama') ||
    t.includes('quarto')
  ) {
    return 'casa';
  }
  return 'utilidades';
}

function getImagesForQuery(query: string, category: ProductCategory): string[] {
  const q = query.toLowerCase();
  if (q.includes('espelho')) return CURATED_IMAGE_POOLS.espelho;
  if (q.includes('pet') || q.includes('gato') || q.includes('cão') || q.includes('cachorro')) return CURATED_IMAGE_POOLS.pet;
  if (CURATED_IMAGE_POOLS[category]) return CURATED_IMAGE_POOLS[category];
  return CURATED_IMAGE_POOLS.utilidades;
}

export function generateClientMLResults(query: string, affiliateTag = 'acheiutilbr2659'): MLSearchResultItem[] {
  const clean = query.trim();
  const titleCapitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
  const category = detectCategoryFromText(clean);
  const images = getImagesForQuery(clean, category);
  const cleanAffiliate = affiliateTag.trim() || 'acheiutilbr2659';

  const isMirror = clean.toLowerCase().includes('espelho');

  if (isMirror) {
    return [
      {
        id: 'MLB-' + Math.floor(2000000000 + Math.random() * 800000000),
        title: `${titleCapitalized} Lapidado Corpo Inteiro com Suporte Invisível`,
        price: 139.90,
        original_price: 199.90,
        thumbnail: images[0],
        permalink: `https://www.mercadolivre.com.br/busca?q=${encodeURIComponent(clean)}&affiliate=${cleanAffiliate}`,
        condition: 'new',
        free_shipping: true,
        isFull: true,
        official_store_name: 'Decora Casa Oficial',
        installments: '10x de R$ 13,99 sem juros',
        attributes: [
          { name: 'Formato', value_name: 'Orgânico Fluido' },
          { name: 'Tipo de Vidro', value_name: 'Cristal 3mm Lapidado' },
          { name: 'Fixação', value_name: 'Suporte Invisível Duplo' },
        ],
      },
      {
        id: 'MLB-' + Math.floor(2000000000 + Math.random() * 800000000),
        title: `${titleCapitalized} Grande Parede 80x50cm Borda Bisote`,
        price: 179.00,
        original_price: 249.00,
        thumbnail: images[1] || images[0],
        permalink: `https://www.mercadolivre.com.br/busca?q=${encodeURIComponent(clean)}&affiliate=${cleanAffiliate}`,
        condition: 'new',
        free_shipping: true,
        isFull: true,
        official_store_name: 'Design & Espelhos Brasil',
        installments: '12x de R$ 14,92 sem juros',
        attributes: [
          { name: 'Dimensões', value_name: '80cm x 50cm' },
          { name: 'Acabamento', value_name: 'Lapidação Premium' },
          { name: 'Ambiente', value_name: 'Sala, Quarto e Hall' },
        ],
      },
      {
        id: 'MLB-' + Math.floor(2000000000 + Math.random() * 800000000),
        title: `${titleCapitalized} com Fita de LED Quente Integrada`,
        price: 219.90,
        original_price: 299.90,
        thumbnail: images[2] || images[0],
        permalink: `https://www.mercadolivre.com.br/busca?q=${encodeURIComponent(clean)}&affiliate=${cleanAffiliate}`,
        condition: 'new',
        free_shipping: true,
        isFull: true,
        official_store_name: 'Iluminação & Arte Decor',
        installments: '10x de R$ 21,99 sem juros',
        attributes: [
          { name: 'Iluminação', value_name: 'LED Luz Quente 3000K' },
          { name: 'Alimentação', value_name: 'Bivolt 110V/220V' },
          { name: 'Garantia', value_name: '12 Meses' },
        ],
      },
    ];
  }

  return [
    {
      id: 'MLB-' + Math.floor(2000000000 + Math.random() * 800000000),
      title: `${titleCapitalized} Premium - Alta Durabilidade e Eficiência`,
      price: 129.90,
      original_price: 189.90,
      thumbnail: images[0],
      permalink: `https://www.mercadolivre.com.br/busca?q=${encodeURIComponent(clean)}&affiliate=${cleanAffiliate}`,
      condition: 'new',
      free_shipping: true,
      isFull: true,
      official_store_name: 'Loja Oficial Mercado Livre',
      installments: '6x de R$ 21,65 sem juros',
      attributes: [
        { name: 'Condição', value_name: 'Novo Lacrado' },
        { name: 'Envio', value_name: 'Mercado Livre Full' },
      ],
    },
    {
      id: 'MLB-' + Math.floor(2000000000 + Math.random() * 800000000),
      title: `${titleCapitalized} Mais Vendido Categoria Especial`,
      price: 89.90,
      original_price: 129.90,
      thumbnail: images[1] || images[0],
      permalink: `https://www.mercadolivre.com.br/busca?q=${encodeURIComponent(clean)}&affiliate=${cleanAffiliate}`,
      condition: 'new',
      free_shipping: true,
      isFull: true,
      official_store_name: 'Mercado Líder Gold',
      installments: '3x de R$ 29,97 sem juros',
      attributes: [
        { name: 'Destaque', value_name: 'Campeão de Vendas' },
        { name: 'Garantia', value_name: 'Garantia do Fabricante' },
      ],
    },
  ];
}

export function generateClientReviewCopy(
  title: string,
  category: ProductCategory,
  price: number
) {
  const pNum = Number(price) || 99.9;
  const isMirror = title.toLowerCase().includes('espelho');

  if (isMirror) {
    return {
      summary: `O ${title} é uma das maiores tendências de decoração moderna de interiores. Seu corte assimétrico orgânico valoriza instantaneamente salas, halls de entrada, quartos e lavabos, trazendo amplitude, elegância e um toque contemporâneo único para qualquer parede.`,
      reviewContent: `Avaliamos de perto o acabamento e a qualidade do ${title} e o resultado surpreendeu positivamente. Diferente dos espelhos convencionais retangulares, o formato orgânico atua como uma verdadeira obra de arte na parede.\n\nO vidro de cristal de alta definição não distorce a imagem reflexa mesmo quando visto a distâncias maiores. As bordas contam com lapidação premium polida e suave, eliminando qualquer risco de corte e garantindo total segurança no manuseio e na limpeza.\n\nA instalação é extremamente prática com o suporte invisível traseiro, mantendo o espelho bem fixo e rente à parede. Quem busca transformar a estética da casa sem gastar com reformas encontra aqui uma escolha de altíssimo impacto visual pelo melhor preço do mercado.`,
      pros: [
        'Design orgânico assimétrico que moderniza qualquer ambiente',
        'Vidro de cristal de alta definição sem distorções reflexivas',
        'Bordas com lapidação suave e segura (sem cantos vivos)',
        'Suporte de fixação reforçado e imperceptível na parede',
        'Embalagem super protegida com garantia de entrega intacta',
        'Excelente custo-benefício em comparação com vidraçarias sob medida',
      ],
      cons: [
        'A parede precisa estar bem nivelada para o alinhamento ideal',
        'Embalagem grande requer cuidado ao desempacotar',
      ],
      verdict: {
        score: 9.8,
        badge: 'Escolha de Decoração',
        summary: `Por R$ ${pNum.toFixed(2).replace('.', ',')}, entrega a sofisticação de peças de arquitetura de luxo por uma fração do preço comercial.`,
        recommendedFor: 'Quem quer modernizar a sala, quarto, closet ou lavabo com um toque de elegância sofisticada.',
        notRecommendedFor: 'Quem procura exclusivamente espelhos tradicionais pequenos de bancada.',
      },
      specifications: [
        { label: 'Formato', value: 'Orgânico Assimétrico' },
        { label: 'Tipo de Espelho', value: 'Vidro Cristal Prata (não oxida)' },
        { label: 'Borda', value: 'Lapidada e Polida' },
        { label: 'Fixação', value: 'Suporte metálico reforçado incluso' },
        { label: 'Garantia', value: '3 meses com Nota Fiscal' },
      ],
      faqs: [
        {
          question: 'O espelho distorce a imagem de longe?',
          answer: 'Não. Ele é fabricado em espelho de cristal legítimo com nitidez 100% fiel, sem as ondulações típicas de plásticos espelhados ou vidros finos.',
        },
        {
          question: 'Como funciona a fixação na parede?',
          answer: 'O espelho já vem com suporte fixador soldado/colado na parte traseira. Basta instalar os parafusos/buchas na parede e pendurar com segurança.',
        },
        {
          question: 'E se quebrar durante o transporte?',
          answer: 'O produto é enviado em embalagem reforçada com madeira e isopor. Além disso, a Compra Garantida do Mercado Livre assegura troca ou reembolso imediato caso ocorra qualquer imprevisto.',
        },
      ],
    };
  }

  // Generic high conversion copy for any product
  return {
    summary: `O ${title} se consolidou como uma das melhores alternativas de compra no Mercado Livre na categoria de ${category}. Reúne excelente durabilidade, acabamento de primeira linha e ótima relação custo-benefício para quem quer comprar com inteligência e segurança.`,
    reviewContent: `Testamos e analisamos a fundo as características do ${title}. O produto cumpre exatamente o que promete em suas especificações oficiais, destacando-se pela facilidade de instalação, ergonomia e robustez dos componentes.\n\nNo dia a dia, a praticidade é imediata. Os materiais utilizados são resistentes e oferecem sensação de durabilidade prolongada, sem apresentar sinais de fragilidade.\n\nAproveite a comodidade do envio Full com entrega rápida e a proteção completa do programa Compra Garantida do Mercado Livre.`,
    pros: [
      'Excelente custo-benefício comprovado pelos compradores',
      'Construção reforçada com acabamento de qualidade',
      'Fácil de usar e manter no dia a dia',
      'Entrega rápida e segura pelo Mercado Livre Full',
      'Acompanha garantia e Nota Fiscal oficial',
    ],
    cons: [
      'Geralmente esgota rápido em promoções e datas sazonais',
      'Manual resumido (mas o uso é bem intuitivo)',
    ],
    verdict: {
      score: 9.6,
      badge: 'Compra Recomendada',
      summary: `Vale muito a pena pelo preço de R$ ${pNum.toFixed(2).replace('.', ',')}, entregando padrão superior de qualidade na sua categoria.`,
      recommendedFor: 'Consumidores que buscam qualidade comprovada com preço justo e entrega expressa.',
      notRecommendedFor: 'Quem procura apenas versões industriais pesadas de altíssima escala.',
    },
    specifications: [
      { label: 'Categoria', value: category.toUpperCase() },
      { label: 'Condição', value: 'Produto Novo e Lacrado' },
      { label: 'Garantia', value: 'Garantia Oficial com Nota Fiscal' },
      { label: 'Envio', value: 'Mercado Envios Full Rápido' },
    ],
    faqs: [
      {
        question: 'O produto é original com garantia?',
        answer: 'Sim, acompanha Nota Fiscal Eletrônica e garantia oficial do fabricante ou vendedor certificado.',
      },
      {
        question: 'Posso devolver se não atender às expectativas?',
        answer: 'Sim, você tem até 30 dias após o recebimento para devolução grátis através da Compra Garantida do Mercado Livre.',
      },
    ],
  };
}

export type ProductCategory = 'casa' | 'utilidades' | 'decoracao' | 'pet';

export type InstitutionalTab = 'termos' | 'privacidade' | 'cookies' | 'afiliados' | 'sobre' | 'contato';

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface ProductVerdict {
  score: number; // 0 - 10
  badge: string; // "Escolha do Editor", "Melhor Custo-Benefício", "Mais Vendido"
  summary: string;
  recommendedFor: string;
  notRecommendedFor: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  installments?: string;
  rating: number;
  reviewCount: number;
  freeShipping: boolean;
  isFull: boolean;
  officialStore?: string;
  affiliateUrl: string;
  images: string[];
  summary: string;
  reviewContent: string;
  pros: string[];
  cons: string[];
  verdict: ProductVerdict;
  specifications: ProductSpecification[];
  faqs: ProductFAQ[];
  featured: boolean;
  dealOfTheDay: boolean;
  bestSeller: boolean;
  createdAt: string;
  updatedAt: string;
  mlbId?: string;
  isGuideOrArticle?: boolean;
  articleBadge?: string;
  wordpressPostId?: number;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  affiliateTag: string; // Mercado Livre primary tag (e.g. acheiutilbr2659)
  meliAffiliateTag?: string; // Etiqueta oficial Mercado Livre (e.g. acheiutilbr2659)
  amazonAffiliateTag?: string; // Tag Amazon Associados (e.g. acheiutil-20)
  contactEmail: string;
  whatsappNotice?: string;
  bannerText: string;
  bannerActive: boolean;
  adminPin?: string;
  wordpressSiteUrl?: string;
  logoUrl?: string;
  googleAnalyticsId?: string;
}

export interface MLListingItem {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  thumbnail: string;
  pictures?: { url: string; secure_url?: string }[];
  permalink: string;
  condition: string;
  free_shipping?: boolean;
  shipping?: { free_shipping?: boolean; logistic_type?: string };
  seller?: { nickname?: string };
  official_store_name?: string;
  category_id?: string;
  attributes?: { name: string; value_name: string }[];
}

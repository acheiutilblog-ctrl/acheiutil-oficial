import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { TopBanner } from './components/TopBanner';
import { HeroSpotlight } from './components/HeroSpotlight';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { ReviewDetail } from './components/ReviewDetail';
import { AdminPanel } from './components/AdminPanel';
import { AdminAuthModal } from './components/AdminAuthModal';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { InstitutionalView } from './components/InstitutionalView';
import { CookieConsent } from './components/CookieConsent';
import { ShareRecommendationBox } from './components/ShareRecommendationBox';
import { Product, ProductCategory, SiteSettings, InstitutionalTab } from './types';
import { updatePageSEO } from './lib/seo';
import { Zap, Flame, Sparkles, RefreshCw, Settings, LogOut, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    affiliateTag: 'acheiutil-20',
    siteName: 'acheiutil.com',
    tagline: 'Achados Úteis no Mercado Livre',
    bannerText: '🔥 Ofertas Exclusivas Mercado Livre: Até 40% OFF com Frete Grátis Full nos produtos selecionados!',
    bannerActive: true,
    contactEmail: 'contato@acheiutil.com',
    adminPin: 'admin123',
  });
  const [loading, setLoading] = useState(true);

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('acheiutil_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'review' | 'admin' | 'institutional'>('home');
  const [institutionalTab, setInstitutionalTab] = useState<InstitutionalTab>('termos');
  const [showCookieBannerForce, setShowCookieBannerForce] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentCategory, setCurrentCategory] = useState<ProductCategory | 'todas' | 'guias'>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll for Back-to-Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check URL path, query parameters or hash (e.g. /cama-com-gavetas-..., ?product=wp-5292, ?admin=true, #admin, ?page=termos)
  useEffect(() => {
    const checkUrlTriggers = () => {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase().replace('#', '');
      
      // Clean path: e.g. "/cama-com-gavetas-a-nova-tendencia-que-pode-substituir-a-cama-box-em-2026/" -> "cama-com-gavetas-a-nova-tendencia-que-pode-substituir-a-cama-box-em-2026"
      let rawPath = '';
      try {
        rawPath = decodeURIComponent(window.location.pathname).replace(/^\/+|\/+$/g, '').trim().toLowerCase();
      } catch {
        rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '').trim().toLowerCase();
      }

      const validTabs: InstitutionalTab[] = ['termos', 'privacidade', 'cookies', 'afiliados', 'sobre', 'contato'];

      // 1. Institutional pages by path (e.g. /termos or /privacidade)
      if (validTabs.includes(rawPath as InstitutionalTab)) {
        setInstitutionalTab(rawPath as InstitutionalTab);
        setCurrentView('institutional');
        return;
      }

      // 2. Admin trigger by path (/admin)
      if (rawPath === 'admin') {
        if (isAdminAuthenticated) {
          setCurrentView('admin');
        } else {
          setIsAuthModalOpen(true);
        }
        return;
      }

      // 3. Product trigger by clean URL path (matching WordPress permalinks!)
      if (rawPath && products.length > 0) {
        const cleanSlug = rawPath.replace(/^(produto|review|analise)\//, '');
        const foundByPath = products.find((p) => {
          const pSlug = (p.slug || '').toLowerCase();
          const pId = (p.id || '').toLowerCase();
          return (
            pSlug === cleanSlug ||
            pId === cleanSlug ||
            pSlug === rawPath ||
            pId === rawPath ||
            (pSlug && pSlug.replace(/^https-acheiutil-com-/, '') === cleanSlug) ||
            (pSlug && cleanSlug.includes(pSlug)) ||
            (pSlug && pSlug.includes(cleanSlug) && cleanSlug.length > 8)
          );
        });

        if (foundByPath) {
          setSelectedProduct(foundByPath);
          setCurrentView('review');
          updatePageSEO(foundByPath);
          return;
        }
      }

      // 4. Product trigger by query: e.g. ?product=wp-5292 or ?p=wp-5292
      const productId = params.get('product') || params.get('p') || params.get('prod');
      if (productId && products.length > 0) {
        const cleanId = productId.toLowerCase();
        const foundByQuery = products.find(
          (p) => 
            p.id.toLowerCase() === cleanId || 
            (p.slug && p.slug.toLowerCase() === cleanId) ||
            (p.slug && p.slug.toLowerCase().includes(cleanId))
        );
        if (foundByQuery) {
          setSelectedProduct(foundByQuery);
          setCurrentView('review');
          updatePageSEO(foundByQuery);
          return;
        }
      }

      // 5. Admin trigger by query or hash (?admin=true, #admin)
      const hasAdminParam = params.has('admin') && (params.get('admin') === 'true' || params.get('admin') === '' || params.get('admin') === '1');
      const hasAdminHash = hash === 'admin';
      if (hasAdminParam || hasAdminHash) {
        if (isAdminAuthenticated) {
          setCurrentView('admin');
        } else {
          setIsAuthModalOpen(true);
        }
        return;
      }

      // 6. Institutional pages triggers by query or hash (e.g. ?page=privacidade or #termos)
      const pageParam = (params.get('page') || '').toLowerCase();
      if (validTabs.includes(pageParam as InstitutionalTab)) {
        setInstitutionalTab(pageParam as InstitutionalTab);
        setCurrentView('institutional');
        return;
      }
      if (validTabs.includes(hash as InstitutionalTab)) {
        setInstitutionalTab(hash as InstitutionalTab);
        setCurrentView('institutional');
        return;
      }

      // 7. If user navigated back via browser and URL is home, return to home view
      if (!rawPath && !productId && !hasAdminParam && !pageParam && currentView === 'review') {
        setSelectedProduct(null);
        setCurrentView('home');
        updatePageSEO();
      }
    };

    checkUrlTriggers();
    
    // Keyboard shortcut for site administrator: Ctrl+Shift+A or Cmd+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        if (isAdminAuthenticated) {
          setCurrentView('admin');
        } else {
          setIsAuthModalOpen(true);
        }
      }
    };

    window.addEventListener('popstate', checkUrlTriggers);
    window.addEventListener('hashchange', checkUrlTriggers);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', checkUrlTriggers);
      window.removeEventListener('hashchange', checkUrlTriggers);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAdminAuthenticated, products, currentView]);


  // Fetch initial data from server API with static fallback for Vercel / Netlify
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        const list = data.products || data.data || [];
        if (Array.isArray(list) && list.length > 0) {
          setProducts(list);
          return;
        }
      }
    } catch (err) {
      console.warn('API /api/products not available, falling back to static data:', err);
    }

    // Static fallback if API is not hosted (e.g. Vercel static, Cloudflare Pages, Netlify)
    try {
      const fallbackRes = await fetch('/data/products.json');
      if (fallbackRes.ok) {
        const fallbackList = await fallbackRes.json();
        if (Array.isArray(fallbackList)) {
          setProducts(fallbackList);
        }
      }
    } catch (fallbackErr) {
      console.error('Failed to load static fallback products:', fallbackErr);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        const settingsData = data.settings || data.data;
        if (settingsData) {
          setSettings(settingsData);
          return;
        }
      }
    } catch (err) {
      console.warn('API /api/settings not available, falling back to static settings:', err);
    }

    // Static fallback
    try {
      const savedBackup = localStorage.getItem('acheiutil_settings_backup');
      if (savedBackup) {
        setSettings(JSON.parse(savedBackup));
      }
      const fallbackRes = await fetch('/data/settings.json');
      if (fallbackRes.ok) {
        const fallbackSettings = await fallbackRes.json();
        if (fallbackSettings) {
          setSettings((prev) => ({ ...fallbackSettings, ...prev }));
        }
      }
    } catch (fallbackErr) {
      console.error('Failed to load static fallback settings:', fallbackErr);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchSettings()]);
      setLoading(false);
    };
    init();
  }, []);

  // Ensure browser tab favicon strictly uses the new detective logo
  useEffect(() => {
    const applyFavicon = () => {
      const timestamp = Date.now();
      const iconUrl = `/logo-detective.png?v=${timestamp}`;
      
      const setLink = (selector: string, rel: string, type?: string) => {
        let link = document.querySelector(selector) as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement('link');
          link.rel = rel;
          if (type) link.type = type;
          document.head.appendChild(link);
        }
        link.href = iconUrl;
      };

      setLink("link[rel='icon'][sizes='32x32']", "icon", "image/png");
      setLink("link[rel='icon']:not([sizes])", "icon", "image/png");
      setLink("link[rel='shortcut icon']", "shortcut icon");
      setLink("link[rel='apple-touch-icon']", "apple-touch-icon");
    };

    applyFavicon();
    window.addEventListener('logoUpdated', applyFavicon);
    return () => window.removeEventListener('logoUpdated', applyFavicon);
  }, []);

  // Dynamically load Google Analytics if configured
  useEffect(() => {
    const gaId = settings.googleAnalyticsId?.trim();
    if (!gaId) return;

    if (!document.getElementById('ga-gtag-script')) {
      const script = document.createElement('script');
      script.id = 'ga-gtag-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      const inlineScript = document.createElement('script');
      inlineScript.id = 'ga-gtag-init';
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `;
      document.head.appendChild(inlineScript);
    }
  }, [settings.googleAnalyticsId]);

  // Update SEO when view changes
  useEffect(() => {
    if (currentView === 'home') {
      const catLabel = currentCategory !== 'todas'
        ? currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)
        : undefined;
      updatePageSEO(undefined, catLabel);
    }
  }, [currentView, currentCategory]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCat =
          currentCategory === 'todas'
            ? true
            : currentCategory === 'guias'
            ? (p.isGuideOrArticle || p.price <= 0)
            : p.category === currentCategory;
        const q = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(q));
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortOption === 'discount') {
          return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        }
        if (sortOption === 'rating') {
          return b.rating - a.rating;
        }
        if (sortOption === 'price-asc') {
          return a.price - b.price;
        }
        if (sortOption === 'price-desc') {
          return b.price - a.price;
        }
        // default recent: by created date or id
        return (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime());
      });
  }, [products, currentCategory, searchTerm, sortOption]);

  // Reset pagination to page 1 whenever category, search or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentCategory, searchTerm, sortOption]);

  // Pagination calculation (12 products per page)
  const PRODUCTS_PER_PAGE = 12;
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Featured Product for Hero Spotlight
  const featuredProduct = useMemo(() => {
    return products.find((p) => p.featured && p.price > 0) || products.find((p) => p.price > 0) || products[0];
  }, [products]);

  // Deals of the day (only real products with prices)
  const dealsOfTheDay = useMemo(() => {
    return products.filter((p) => !p.isGuideOrArticle && p.price > 0 && (p.dealOfTheDay || (p.discountPercentage && p.discountPercentage >= 20)));
  }, [products]);

  // Save Settings handler
  const handleSaveSettings = async (newSettings: SiteSettings) => {
    // Update local state and backup immediately
    setSettings(newSettings);
    try {
      localStorage.setItem('acheiutil_settings_backup', JSON.stringify(newSettings));
    } catch {
      // ignore
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && (data.settings || data.data)) {
          setSettings(data.settings || data.data);
          try {
            localStorage.setItem('acheiutil_settings_backup', JSON.stringify(data.settings || data.data));
          } catch {
            // ignore
          }
        }
      }
    } catch (err: any) {
      console.warn('Backend /api/settings post error, kept local fallback:', err);
    }
  };

  // Select a product to view review
  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    setCurrentView('review');
    try {
      const targetPath = prod.slug ? `/${prod.slug}/` : `/?product=${encodeURIComponent(prod.id)}`;
      const currentPath = window.location.pathname;
      if (currentPath !== targetPath && currentPath !== `/${prod.slug}`) {
        window.history.pushState({ productId: prod.id, slug: prod.slug }, '', targetPath);
      }
    } catch (e) {
      console.warn('History pushState error:', e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setCurrentView('home');
    setSelectedProduct(null);
    try {
      if (window.location.pathname !== '/' || window.location.search.length > 0) {
        window.history.pushState({}, '', '/');
      }
    } catch (e) {
      console.warn('History pushState error:', e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Related products for the review view
  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products
      .filter((p) => p.id !== selectedProduct.id && p.category === selectedProduct.category)
      .slice(0, 4);
  }, [products, selectedProduct]);

  // Handlers for Admin authentication & visibility
  const [adminInitialTab, setAdminInitialTab] = useState<'manage' | 'ml-api' | 'form' | 'settings' | 'export' | 'wpbutton'>('manage');

  const handleOpenAdmin = () => {
    setAdminInitialTab('manage');
    if (isAdminAuthenticated) {
      setCurrentView(currentView === 'admin' ? 'home' : 'admin');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleOpenWordPressGuide = () => {
    setAdminInitialTab('wpbutton');
    if (isAdminAuthenticated) {
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      localStorage.setItem('acheiutil_admin_auth', 'true');
    } catch {
      // ignore
    }
    setIsAuthModalOpen(false);
    setCurrentView('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem('acheiutil_admin_auth');
    } catch {
      // ignore
    }
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-orange-500 selection:text-white">
      
      {/* Top Admin Security Toolbar - ONLY visible to authenticated administrator */}
      {isAdminAuthenticated && (
        <div className="bg-slate-900 text-slate-200 text-xs px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-300">Modo Administrador Conectado</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden md:inline text-slate-400 text-[11px]">
              O leitor comum não vê este painel nem botões de administração
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
              className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{currentView === 'admin' ? 'Visualizar como Leitor' : 'Gerenciar Produtos'}</span>
            </button>
            <button
              onClick={handleAdminLogout}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/80 hover:text-rose-200 text-slate-300 transition-all flex items-center gap-1 cursor-pointer text-xs border border-slate-700"
              title="Encerrar sessão de administrador"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair do Modo Admin</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Notification Announcement Banner */}
      <TopBanner text={settings.bannerText} active={settings.bannerActive} />

      {/* Main Header with Logo & Categories */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setCurrentView('home');
        }}
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          if (currentView !== 'home') setCurrentView('home');
        }}
        onGoHome={handleGoHome}
      />

      {/* Loading state indicator */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-24 gap-3">
          <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">
            Carregando achados e ofertas do acheiutil.com...
          </p>
        </div>
      ) : (
        <main className="flex-1">
          {/* ================= VIEW: INSTITUTIONAL & LEGAL PAGES ================= */}
          {currentView === 'institutional' && (
            <InstitutionalView
              initialTab={institutionalTab}
              onBack={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              contactEmail={settings.contactEmail}
              onOpenCookieBanner={() => setShowCookieBannerForce(true)}
            />
          )}

          {/* ================= VIEW: ADMIN PANEL ================= */}
          {currentView === 'admin' && (
            <AdminPanel
              products={products}
              onClose={() => setCurrentView('home')}
              onRefreshProducts={fetchProducts}
              onSelectProductForPreview={(prod) => {
                setSelectedProduct(prod);
                setCurrentView('review');
              }}
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onLogout={handleAdminLogout}
              initialTab={adminInitialTab}
            />
          )}

          {/* ================= VIEW: PRODUCT REVIEW DETAIL ================= */}
          {currentView === 'review' && selectedProduct && (
            <ReviewDetail
              product={selectedProduct}
              onBack={handleGoHome}
              onSelectRelated={handleSelectProduct}
              relatedProducts={relatedProducts}
            />
          )}

          {/* ================= VIEW: HOME & CATALOG ================= */}
          {currentView === 'home' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
              
              {/* Hero Spotlight on top of homepage (only when not searching) */}
              {!searchTerm && currentCategory === 'todas' && (
                <HeroSpotlight
                  featuredProduct={featuredProduct}
                  onSelectProduct={handleSelectProduct}
                />
              )}

              {/* Deals Ticker / Highlights when on home */}
              {!searchTerm && currentCategory === 'todas' && dealsOfTheDay.length > 0 && (
                <div className="mb-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-4 sm:p-5 shadow-lg shadow-orange-500/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <Flame className="w-6 h-6 text-amber-200 fill-amber-200" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-base sm:text-lg tracking-tight font-['Outfit']">
                        ⚡ Ofertas Relâmpago com Envio FULL no Mercado Livre
                      </h2>
                      <p className="text-xs text-orange-100">
                        Preços especiais selecionados com desconto de até 40% e entrega em 24h
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                    {dealsOfTheDay.slice(0, 3).map((deal) => (
                      <button
                        key={deal.id}
                        onClick={() => handleSelectProduct(deal)}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-left whitespace-nowrap transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
                      >
                        <span className="font-bold truncate max-w-[140px]">{deal.title}</span>
                        <span className="bg-white text-orange-600 font-extrabold text-[10px] px-1.5 py-0.5 rounded">
                          {deal.discountPercentage}% OFF
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Filter Bar with Categories and Sort */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                    {searchTerm
                      ? `Resultados para "${searchTerm}"`
                      : currentCategory === 'todas'
                      ? 'Todos os Achados em Destaque'
                      : `Achados para ${currentCategory.toUpperCase()}`}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Avaliações sinceras, prós e contras e os melhores preços do Mercado Livre
                  </p>
                </div>
              </div>

              <FilterBar
                currentCategory={currentCategory}
                onSelectCategory={setCurrentCategory}
                sortOption={sortOption}
                onSortChange={setSortOption}
                totalProducts={filteredProducts.length}
              />

              {/* Products Grid */}
              <div id="catalog-grid" className="scroll-mt-24">
                {filteredProducts.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                      {paginatedProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onSelect={handleSelectProduct}
                        />
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="mb-14 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-slate-500 text-center sm:text-left">
                          Exibindo achados <strong className="text-slate-800">{(currentPage - 1) * PRODUCTS_PER_PAGE + 1}</strong> até{' '}
                          <strong className="text-slate-800">
                            {Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)}
                          </strong>{' '}
                          de um total de <strong className="text-slate-800">{filteredProducts.length}</strong> produtos
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap justify-center">
                          <button
                            onClick={() => {
                              setCurrentPage((prev) => Math.max(prev - 1, 1));
                              document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            aria-label="Página anterior"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Anterior</span>
                          </button>

                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                            const isEdge = pageNum === 1 || pageNum === totalPages;
                            const isNear = Math.abs(pageNum - currentPage) <= 1;
                            if (!isEdge && !isNear) {
                              if (pageNum === 2 || pageNum === totalPages - 1) {
                                return (
                                  <span key={pageNum} className="px-1 text-slate-400 text-xs">
                                    ...
                                  </span>
                                );
                              }
                              return null;
                            }
                            return (
                              <button
                                key={pageNum}
                                onClick={() => {
                                  setCurrentPage(pageNum);
                                  document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`min-w-9 h-9 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  currentPage === pageNum
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 scale-105'
                                    : 'bg-slate-50 hover:bg-slate-200 text-slate-700 border border-slate-200/50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}

                          <button
                            onClick={() => {
                              setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                              document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            aria-label="Próxima página"
                          >
                            <span>Próxima</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 mb-14 shadow-xs">
                  <Sparkles className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                    Tente mudar o termo de busca ou navegar por outra categoria de Casa, Utilidades, Decoração ou Pet.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentCategory('todas');
                    }}
                    className="py-2.5 px-5 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Ver Todos os Produtos
                  </button>
                </div>
              )}
              </div>

              {/* Indique o Site Banner */}
              <ShareRecommendationBox
                variant="banner"
                title="Gostou do AcheiUtil? Indique para quem você gosta!"
                subtitle="Economize o tempo e o bolso dos seus amigos e familiares enviando nossas dicas sinceras e achados selecionados."
              />

              {/* Conversion FAQ Section on Homepage */}
              <FAQSection />

            </div>
          )}
        </main>
      )}

      {/* Comprehensive E-commerce Trust Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        contactEmail={settings.contactEmail}
        onOpenAdmin={handleOpenAdmin}
        onOpenInstitutional={(tab) => {
          setInstitutionalTab(tab);
          setCurrentView('institutional');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCookiesBanner={() => setShowCookieBannerForce(true)}
      />

      {/* LGPD Cookie Consent Banner */}
      <CookieConsent
        onOpenCookiesPolicy={() => {
          setInstitutionalTab('cookies');
          setCurrentView('institutional');
          setShowCookieBannerForce(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        forceShow={showCookieBannerForce}
        onCloseForce={() => setShowCookieBannerForce(false)}
      />

      {/* Admin Authentication Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
        expectedPin={settings.adminPin || 'admin123'}
      />

      {/* Floating Back to Top Button - Posicionado mais acima */}
      {showScrollTop && (
        <button
          id="btn-scroll-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-10 right-6 sm:bottom-12 sm:right-8 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-blue-900 hover:bg-orange-500 text-white shadow-xl shadow-blue-950/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-white/20"
          title="Subir para o topo"
          aria-label="Voltar ao topo da página"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </button>
      )}

    </div>
  );
}

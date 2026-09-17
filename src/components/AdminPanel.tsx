import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Search,
  Zap,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  SlidersHorizontal,
  ArrowLeft,
  Bot,
  Save,
  Tag,
  Truck,
  Star,
  RefreshCw,
  Eye,
  Check,
  X,
  Download,
  FileCode,
  FileSpreadsheet,
  Server,
  HelpCircle,
  Copy,
  ChevronLeft,
  ChevronRight,
  Share2,
  Rss,
} from 'lucide-react';
import { Product, ProductCategory, SiteSettings } from '../types';
import { WordPressButtonGenerator } from './WordPressButtonGenerator';
import { SocialAutomationSection } from './SocialAutomationSection';

interface AdminPanelProps {
  products: Product[];
  onClose: () => void;
  onRefreshProducts: () => Promise<void>;
  onSelectProductForPreview: (product: Product) => void;
  settings: SiteSettings;
  onSaveSettings: (settings: SiteSettings) => Promise<void>;
  onLogout?: () => void;
  initialTab?: 'manage' | 'ml-api' | 'form' | 'settings' | 'export' | 'wpbutton' | 'social';
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  onClose,
  onRefreshProducts,
  onSelectProductForPreview,
  settings,
  onSaveSettings,
  onLogout,
  initialTab = 'manage',
}) => {
  const [activeTab, setActiveTab] = useState<'manage' | 'ml-api' | 'form' | 'settings' | 'export' | 'wpbutton' | 'social'>(initialTab);
  const [adminSearch, setAdminSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [targetButtonProductId, setTargetButtonProductId] = useState<string>('');

  // Product Form state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    subtitle: '',
    category: 'casa',
    subcategory: '',
    price: 0,
    originalPrice: undefined,
    installments: '',
    rating: 4.8,
    reviewCount: 150,
    freeShipping: true,
    isFull: true,
    officialStore: '',
    affiliateUrl: '',
    images: [],
    summary: '',
    reviewContent: '',
    pros: [],
    cons: [],
    verdict: {
      score: 9.6,
      badge: 'Escolha do Editor',
      summary: '',
      recommendedFor: '',
      notRecommendedFor: '',
    },
    specifications: [],
    faqs: [],
    featured: false,
    dealOfTheDay: false,
    bestSeller: false,
  });

  // Photo URL input
  const [newImageUrl, setNewImageUrl] = useState('');

  // Pro & Con input
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');

  // Specification input
  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // FAQ input
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // ML API Search state
  const [mlQuery, setMlQuery] = useState('');
  const [mlSearching, setMlSearching] = useState(false);
  const [mlResults, setMlResults] = useState<any[]>([]);
  const [mlGeneratingId, setMlGeneratingId] = useState<string | null>(null);

  // Settings form
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);
  const [syncingWp, setSyncingWp] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoTimestamp, setLogoTimestamp] = useState(Date.now());

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch('/api/upload-logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: reader.result }),
        });
        const data = await res.json();
        if (data.success) {
          setLogoTimestamp(Date.now());
          window.dispatchEvent(new CustomEvent('logoUpdated'));
          showNotice('success', '✅ Logo oficial do Detetive atualizado com sucesso em todo o site e na aba do navegador!');
        } else {
          showNotice('error', data.message || 'Erro ao atualizar logo.');
        }
      } catch (err: any) {
        showNotice('error', err.message || 'Erro ao enviar logo.');
      } finally {
        setUploadingLogo(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSyncWordPress = async () => {
    setSyncingWp(true);
    try {
      const res = await fetch('/api/wordpress/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotice('success', `✅ ${data.count} posts sincronizados do acheiutil.com com sucesso!`);
        await onRefreshProducts();
      } else {
        showNotice('error', data.error || 'Erro ao sincronizar posts.');
      }
    } catch (err: any) {
      showNotice('error', err.message || 'Falha de conexão com o servidor.');
    } finally {
      setSyncingWp(false);
    }
  };

  // Switch to create mode
  const handleNewProduct = () => {
    setEditingProductId(null);
    setFormData({
      title: '',
      subtitle: '',
      category: 'casa',
      subcategory: 'Cozinha Inteligente',
      price: 99.9,
      originalPrice: 149.9,
      installments: '3x de R$ 33,30 sem juros',
      rating: 4.8,
      reviewCount: 200,
      freeShipping: true,
      isFull: true,
      officialStore: 'Loja Oficial Mercado Livre',
      affiliateUrl: `https://www.mercadolivre.com.br/?affiliate=${localSettings.affiliateTag || 'acheiutil-20'}`,
      images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80'],
      summary: 'Resumo com foco em conversão e dor do cliente.',
      reviewContent: 'Análise detalhada do produto após testes práticos.',
      pros: ['Excelente custo-benefício', 'Material de alta durabilidade'],
      cons: ['Manual de instruções simples'],
      verdict: {
        score: 9.5,
        badge: 'Recomendação Achei Útil',
        summary: 'Vale a pena pela qualidade e menor preço no Mercado Livre.',
        recommendedFor: 'Quem busca praticidade no dia a dia.',
        notRecommendedFor: 'Quem procura equipamentos profissionais.',
      },
      specifications: [
        { label: 'Garantia', value: '12 meses' },
        { label: 'Origem', value: 'Nacional com NF' },
      ],
      faqs: [
        { question: 'O produto é original com nota fiscal?', answer: 'Sim, vendido por loja oficial com nota fiscal eletrônica.' },
      ],
      featured: false,
      dealOfTheDay: false,
      bestSeller: false,
    });
    setActiveTab('form');
  };

  // Switch to edit mode
  const handleEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setFormData({ ...prod });
    setActiveTab('form');
  };

  // Delete product
  const handleDeleteProduct = async (id: string, title: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o produto "${title}"?`)) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotice('success', 'Produto excluído com sucesso!');
        await onRefreshProducts();
      } else {
        showNotice('error', data.message || 'Erro ao excluir produto.');
      }
    } catch (err: any) {
      showNotice('error', 'Falha ao excluir produto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save product form (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.price) {
      showNotice('error', 'Preencha título, categoria e preço.');
      return;
    }

    try {
      setLoading(true);
      const url = editingProductId ? `/api/products/${editingProductId}` : '/api/products';
      const method = editingProductId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        showNotice('success', editingProductId ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
        await onRefreshProducts();
        setActiveTab('manage');
      } else {
        showNotice('error', data.message || 'Erro ao salvar produto.');
      }
    } catch (err: any) {
      showNotice('error', 'Falha ao salvar produto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add Photo via URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), newImageUrl.trim()],
    }));
    setNewImageUrl('');
  };

  // Upload/Paste Photo File directly to static server
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const base64Str = event.target.result as string;
        try {
          showNotice('success', 'Enviando foto para o servidor...');
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: base64Str,
              name: formData.title || 'produto'
            })
          });
          const uploadData = await uploadRes.json();
          if (uploadData.success && uploadData.url) {
            setFormData((prev) => ({
              ...prev,
              images: [...(prev.images || []), uploadData.url],
            }));
            showNotice('success', 'Foto salva e adicionada com sucesso!');
          } else {
            // Fallback to base64 if server fails
            setFormData((prev) => ({
              ...prev,
              images: [...(prev.images || []), base64Str],
            }));
            showNotice('success', 'Foto anexada!');
          }
        } catch (uploadErr) {
          setFormData((prev) => ({
            ...prev,
            images: [...(prev.images || []), base64Str],
          }));
          showNotice('success', 'Foto anexada localmente!');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Remove Photo
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  // Pros & Cons helpers
  const handleAddPro = () => {
    if (!newPro.trim()) return;
    setFormData((prev) => ({ ...prev, pros: [...(prev.pros || []), newPro.trim()] }));
    setNewPro('');
  };

  const handleRemovePro = (index: number) => {
    setFormData((prev) => ({ ...prev, pros: (prev.pros || []).filter((_, i) => i !== index) }));
  };

  const handleAddCon = () => {
    if (!newCon.trim()) return;
    setFormData((prev) => ({ ...prev, cons: [...(prev.cons || []), newCon.trim()] }));
    setNewCon('');
  };

  const handleRemoveCon = (index: number) => {
    setFormData((prev) => ({ ...prev, cons: (prev.cons || []).filter((_, i) => i !== index) }));
  };

  // Spec helper
  const handleAddSpec = () => {
    if (!newSpecLabel.trim() || !newSpecValue.trim()) return;
    setFormData((prev) => ({
      ...prev,
      specifications: [...(prev.specifications || []), { label: newSpecLabel.trim(), value: newSpecValue.trim() }],
    }));
    setNewSpecLabel('');
    setNewSpecValue('');
  };

  const handleRemoveSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: (prev.specifications || []).filter((_, i) => i !== index),
    }));
  };

  // FAQ helper
  const handleAddFaq = () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    setFormData((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: newFaqQ.trim(), answer: newFaqA.trim() }],
    }));
    setNewFaqQ('');
    setNewFaqA('');
  };

  const handleRemoveFaq = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== index),
    }));
  };

  // Mercado Livre API Search
  const handleSearchML = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mlQuery.trim()) return;

    try {
      setMlSearching(true);
      const res = await fetch(`/api/mercadolivre/search?q=${encodeURIComponent(mlQuery.trim())}&limit=12`);
      const data = await res.json();
      if (data.success) {
        setMlResults(data.results || []);
        if (data.results?.length === 0) {
          showNotice('error', 'Nenhum resultado encontrado no Mercado Livre para esse termo.');
        }
      } else {
        showNotice('error', data.message || 'Erro ao consultar Mercado Livre.');
      }
    } catch (err: any) {
      showNotice('error', 'Falha na busca ML: ' + err.message);
    } finally {
      setMlSearching(false);
    }
  };

  // Auto-import from ML & Auto-generate Review with AI
  const handleImportAndGenerate = async (mlItem: any) => {
    try {
      setMlGeneratingId(mlItem.id);

      // Guess category from title
      const titleLower = mlItem.title.toLowerCase();
      let detectedCategory: ProductCategory = 'utilidades';
      if (titleLower.includes('gato') || titleLower.includes('cão') || titleLower.includes('pet') || titleLower.includes('cachorro') || titleLower.includes('coleira')) {
        detectedCategory = 'pet';
      } else if (titleLower.includes('tapete') || titleLower.includes('luminaria') || titleLower.includes('quadro') || titleLower.includes('cortina') || titleLower.includes('vaso') || titleLower.includes('abajur')) {
        detectedCategory = 'decoracao';
      } else if (titleLower.includes('panela') || titleLower.includes('aspirador') || titleLower.includes('fritadeira') || titleLower.includes('air fryer') || titleLower.includes('cozinha') || titleLower.includes('quarto')) {
        detectedCategory = 'casa';
      }

      // 1. Fetch deep item details (description, pictures)
      let detailedPictures = [mlItem.thumbnail];
      let mlDesc = '';
      try {
        const itemRes = await fetch(`/api/mercadolivre/item/${mlItem.id}`);
        const itemData = await itemRes.json();
        if (itemData.success && itemData.item) {
          if (itemData.item.pictures?.length > 0) {
            detailedPictures = itemData.item.pictures.slice(0, 5);
          }
          mlDesc = itemData.item.description || '';
        }
      } catch (e) {
        console.warn('Could not fetch deep item details, using basic info');
      }

      // 2. Call AI review generator
      const aiRes = await fetch('/api/mercadolivre/generate-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: mlItem.title,
          category: detectedCategory,
          price: mlItem.price,
          rawDescription: mlDesc,
          attributes: mlItem.attributes,
        }),
      });

      const aiData = await aiRes.json();
      const generated = aiData.data || {};

      // 3. Populate form
      setEditingProductId(null);
      setFormData({
        title: mlItem.title,
        subtitle: generated.summary?.slice(0, 140) || 'Destaque e melhor preço no Mercado Livre.',
        category: detectedCategory,
        subcategory: detectedCategory === 'casa' ? 'Eletroportáteis' : detectedCategory === 'pet' ? 'Acessórios Pet' : detectedCategory === 'decoracao' ? 'Ambientes' : 'Praticidade',
        price: Number(mlItem.price) || 99.9,
        originalPrice: mlItem.original_price ? Number(mlItem.original_price) : undefined,
        installments: mlItem.installments || 'Em até 10x sem juros',
        rating: 4.8,
        reviewCount: Math.floor(Math.random() * 800) + 120,
        freeShipping: mlItem.free_shipping ?? true,
        isFull: mlItem.isFull ?? true,
        officialStore: mlItem.official_store_name || 'Mercado Livre Oficial',
        affiliateUrl: mlItem.permalink,
        images: detailedPictures,
        summary: generated.summary || 'Excelente achado com alta aprovação dos compradores.',
        reviewContent: generated.reviewContent || 'Review detalhada do produto.',
        pros: generated.pros || ['Ótimo custo-benefício', 'Entrega rápida Full'],
        cons: generated.cons || ['Estoque concorrido'],
        verdict: generated.verdict || {
          score: 9.6,
          badge: 'Escolha do Editor',
          summary: 'Excelente compra com garantia e preço justo.',
          recommendedFor: 'Quem quer economizar sem abrir mão de qualidade.',
          notRecommendedFor: 'Quem busca versões industriais.',
        },
        specifications: generated.specifications || [
          { label: 'Condição', value: 'Novo Lacrado' },
          { label: 'Garantia', value: 'Garantia do Fabricante' },
        ],
        faqs: generated.faqs || [
          { question: 'O produto é original com nota fiscal?', answer: 'Sim, acompanha nota fiscal oficial emitida pelo vendedor.' },
        ],
        featured: true,
        dealOfTheDay: false,
        bestSeller: false,
        mlbId: mlItem.id,
      });

      setActiveTab('form');
      showNotice('success', 'Produto e Review gerados com sucesso! Revise e clique em "Salvar Produto".');
    } catch (err: any) {
      showNotice('error', 'Erro ao importar produto: ' + err.message);
    } finally {
      setMlGeneratingId(null);
    }
  };

  // Save settings
  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSaveSettings(localSettings);
      setSavedSettingsSuccess(true);
      setTimeout(() => setSavedSettingsSuccess(false), 5000);
      showNotice('success', 'Configurações atualizadas e salvas com sucesso!');
    } catch (err: any) {
      showNotice('error', 'Falha ao salvar configurações: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const [adminPage, setAdminPage] = useState(1);
  const [adminPerPage, setAdminPerPage] = useState(10);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = adminSearch.toLowerCase().trim();
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q)
      );
    });
  }, [products, adminSearch]);

  useEffect(() => {
    setAdminPage(1);
  }, [adminSearch, adminPerPage]);

  const adminTotalPages = adminPerPage > 0 ? (Math.ceil(filteredProducts.length / adminPerPage) || 1) : 1;
  const paginatedAdminProducts = useMemo(() => {
    if (adminPerPage === 0) return filteredProducts;
    const start = (adminPage - 1) * adminPerPage;
    return filteredProducts.slice(start, start + adminPerPage);
  }, [filteredProducts, adminPage, adminPerPage]);

  return (
    <div id="admin-panel-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Voltar ao Blog"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img src="/logo-detective.png?v=6" alt="acheiutil.com" className="w-12 h-12 object-contain drop-shadow-xs" onError={(e) => { e.currentTarget.src = '/logo.png'; }} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 font-['Outfit']">
                Painel Administrativo
              </h1>
              <span className="bg-orange-100 text-orange-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
                acheiutil.com
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Gerencie produtos, fotos, links de afiliado e importe direto da API do Mercado Livre
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNewProduct}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Novo Produto Manual
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-semibold text-xs sm:text-sm border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
              title="Encerrar sessão de administrador"
            >
              <X className="w-4 h-4" /> Sair do Painel
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast (Inline + Floating) */}
      {notification && (
        <>
          <div
            className={`mt-4 p-4 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span className="font-semibold">{notification.message}</span>
          </div>

          {/* Floating Toast for visibility when scrolled */}
          <div
            className={`fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold border transition-all duration-300 ${
              notification.type === 'success'
                ? 'bg-emerald-700 text-white border-emerald-600 shadow-emerald-950/30'
                : 'bg-rose-700 text-white border-rose-600 shadow-rose-950/30'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-white shrink-0" />
            )}
            <span className="flex-1">{notification.message}</span>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mt-6 border-b border-slate-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('manage')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'manage'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          📦 Produtos Cadastrados ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('ml-api')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ml-api'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>API Mercado Livre & IA</span>
        </button>

        <button
          onClick={() => setActiveTab('form')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'form'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          {editingProductId ? '✏️ Editar Produto' : '➕ Adicionar Produto'}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'settings'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          ⚙️ Afiliado & Configurações
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'social'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Share2 className="w-4 h-4 text-orange-500" />
          <span>📡 Divulgar no Facebook, Insta & Grupos</span>
        </button>

        <button
          onClick={() => setActiveTab('wpbutton')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'wpbutton'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>Gerador de Botão WordPress</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'export'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Download className="w-4 h-4 text-orange-500" />
          <span>Exportar para WordPress</span>
        </button>
      </div>

      {/* ================= TAB 1: MANAGE PRODUCTS ================= */}
      {activeTab === 'manage' && (
        <div className="mt-6 flex flex-col gap-4">

          {/* WordPress Sync Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                WP
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  Sincronização com seu Blog WordPress (acheiutil.com)
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-semibold">
                    {products.length} Posts / Artigos Ativos
                  </span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Importa automaticamente novos artigos e reviews que você publicar no seu WordPress para cá.
                </p>
              </div>
            </div>

            <button
              onClick={handleSyncWordPress}
              disabled={syncingWp}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${syncingWp ? 'animate-spin' : ''}`} />
              <span>{syncingWp ? 'Sincronizando...' : '🔄 Sincronizar Agora'}</span>
            </button>
          </div>
          
          {/* Search bar & Pagination Controls inside admin */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrar por nome ou categoria..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden"
              />
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 hidden sm:inline">Exibir:</span>
                <select
                  value={adminPerPage}
                  onChange={(e) => setAdminPerPage(Number(e.target.value))}
                  className="px-2.5 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 font-semibold focus:border-orange-500 outline-hidden cursor-pointer"
                >
                  <option value={10}>10 por página</option>
                  <option value={20}>20 por página</option>
                  <option value={50}>50 por página</option>
                  <option value={0}>Ver todos</option>
                </select>
              </div>
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                Total: {filteredProducts.length} produtos
              </span>
            </div>
          </div>

          {/* Table of products */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Produto</th>
                    <th className="py-3.5 px-4">Categoria</th>
                    <th className="py-3.5 px-4">Preço</th>
                    <th className="py-3.5 px-4">Destaques</th>
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedAdminProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 max-w-xs sm:max-w-md">
                          <img
                            src={prod.images?.[0] || 'https://via.placeholder.com/80'}
                            alt={prod.title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="truncate">
                            <span className="font-bold text-slate-900 block truncate" title={prod.title}>
                              {prod.title}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-slate-400">
                                {prod.officialStore || 'Mercado Livre'} • ★ {prod.rating} ({prod.reviewCount})
                              </span>
                              {prod.affiliateUrl && prod.affiliateUrl.includes('meli.la') ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-200">
                                  ✓ Link Oficial meli.la
                                </span>
                              ) : prod.affiliateUrl && prod.affiliateUrl.includes('/p/') ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-sm border border-blue-200">
                                  ✓ Produto Exato ML
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-200" title="Busca automática do produto no Mercado Livre com sua tag">
                                  ⚡ Busca Direta (Com sua Tag)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded text-xs uppercase tracking-wider">
                          {prod.category}
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-0.5 truncate">
                          {prod.subcategory}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-extrabold text-slate-900">
                        {prod.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        {prod.originalPrice && (
                          <span className="block text-[10px] text-slate-400 line-through font-normal">
                            {prod.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {prod.featured && (
                            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Destaque
                            </span>
                          )}
                          {prod.dealOfTheDay && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Oferta Dia
                            </span>
                          )}
                          {prod.bestSeller && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Mais Vendido
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setTargetButtonProductId(prod.id);
                              setActiveTab('wpbutton');
                            }}
                            className="px-2 py-1 rounded-lg text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 cursor-pointer font-bold text-xs flex items-center gap-1 border border-orange-200"
                            title="Gerar Botão para WordPress deste produto"
                          >
                            <FileCode className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[11px]">Botão WP</span>
                          </button>
                          <button
                            onClick={() => onSelectProductForPreview(prod)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-slate-100 cursor-pointer"
                            title="Visualizar no Blog"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditProduct(prod)}
                            className="p-1.5 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer"
                            title="Editar Produto"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.title)}
                            className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 cursor-pointer"
                            title="Excluir Produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Nenhum produto encontrado. Adicione um novo produto ou use a API do Mercado Livre!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Admin Table Pagination Bar */}
            {adminPerPage > 0 && adminTotalPages > 1 && (
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-slate-600 font-medium">
                  Exibindo produtos <strong className="text-slate-900">{(adminPage - 1) * adminPerPage + 1}</strong> até{' '}
                  <strong className="text-slate-900">{Math.min(adminPage * adminPerPage, filteredProducts.length)}</strong>{' '}
                  de <strong className="text-slate-900">{filteredProducts.length}</strong>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  <button
                    type="button"
                    onClick={() => setAdminPage((p) => Math.max(p - 1, 1))}
                    disabled={adminPage === 1}
                    className="p-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-semibold flex items-center gap-1"
                    title="Página Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </button>
                  {Array.from({ length: adminTotalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setAdminPage(num)}
                      className={`min-w-8 h-8 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                        adminPage === num
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAdminPage((p) => Math.min(p + 1, adminTotalPages))}
                    disabled={adminPage === adminTotalPages}
                    className="p-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-semibold flex items-center gap-1"
                    title="Próxima Página"
                  >
                    <span className="hidden sm:inline">Próxima</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: MERCADO LIVRE API INTEGRATION ================= */}
      {activeTab === 'ml-api' && (
        <div className="mt-6 flex flex-col gap-6">
          
          {/* Explanation Banner */}
          <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white rounded-3xl p-6 border border-blue-800 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wide mb-1">
                  <Zap className="w-4 h-4" /> Integração Oficial Mercado Livre API
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-['Outfit']">
                  Importador Automático de Produtos e Gerador de Reviews
                </h2>
                <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-2xl leading-relaxed">
                  Digite qualquer produto desejado (ex: <i>"robô aspirador"</i>, <i>"air fryer inox"</i>, <i>"arranhador gato"</i>, <i>"tapete escandinavo"</i>) ou insira o código MLB. O sistema conecta na API do Mercado Livre, puxa dados reais e usa inteligência artificial para escrever a review completa de alta conversão!
                </p>
              </div>
            </div>

            {/* Search form */}
            <form onSubmit={handleSearchML} className="mt-6 flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar produto no Mercado Livre (ex: bebedouro inox gato, aspirador wap, luminaria nordica)..."
                  value={mlQuery}
                  onChange={(e) => setMlQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 rounded-xl text-sm font-medium border-2 border-transparent focus:border-orange-500 outline-hidden"
                />
              </div>
              <button
                type="submit"
                disabled={mlSearching}
                className="py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {mlSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Buscar no Mercado Livre</span>
              </button>
            </form>
          </div>

          {/* Search Results */}
          {mlResults.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-lg">
                  Resultados da API do Mercado Livre ({mlResults.length} produtos encontrados)
                </h3>
                <span className="text-xs text-slate-500">
                  Tag de Afiliado vinculada: <b className="text-orange-600">{localSettings.affiliateTag}</b>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mlResults.map((item) => {
                  const isGenerating = mlGeneratingId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between hover:shadow-lg transition-all"
                    >
                      <div>
                        <div className="relative aspect-4/3 bg-slate-100 rounded-xl overflow-hidden mb-3">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-contain"
                          />
                          {item.isFull && (
                            <span className="absolute top-2 left-2 bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Zap className="w-3 h-3 fill-amber-300 text-amber-300" /> FULL
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-semibold text-blue-700 block mb-1 truncate">
                          {item.official_store_name}
                        </span>

                        <h4 className="font-bold text-slate-900 text-sm line-clamp-2 mb-2" title={item.title}>
                          {item.title}
                        </h4>

                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-lg font-black text-slate-900 font-['Outfit']">
                            {Number(item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                          {item.free_shipping && (
                            <span className="text-emerald-700 text-xs font-semibold flex items-center gap-0.5">
                              <Truck className="w-3 h-3" /> Frete Grátis
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action button */}
                      <button
                        onClick={() => handleImportAndGenerate(item)}
                        disabled={isGenerating}
                        className="w-full py-2.5 px-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-400" />
                            <span>Gerando Review IA...</span>
                          </>
                        ) : (
                          <>
                            <Bot className="w-4 h-4 text-orange-400" />
                            <span>Importar & Gerar Review IA</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ================= TAB 3: PRODUCT FORM (CREATE / EDIT) ================= */}
      {activeTab === 'form' && (
        <form onSubmit={handleSaveProduct} className="mt-6 flex flex-col gap-6">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
              {editingProductId ? 'Editar Detalhes do Produto' : 'Cadastrar Novo Produto'}
            </h2>
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Salvando...' : 'Salvar Produto'}</span>
            </button>
          </div>

          {/* Section 1: Basic Info */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-5 bg-orange-500 rounded-full inline-block"></span>
              Informações Básicas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Título do Produto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Robô Aspirador WAP Robot W300 Bivolt com Filtro HEPA"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Subtítulo / Chamada de Conversão
                </label>
                <input
                  type="text"
                  placeholder="Ex: Limpeza autônoma diária com dupla escova giratória e retorno automático."
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Categoria *
                </label>
                <select
                  value={formData.category || 'casa'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden bg-white"
                >
                  <option value="casa">Casa</option>
                  <option value="utilidades">Utilidades</option>
                  <option value="decoracao">Decoração</option>
                  <option value="pet">Pet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Subcategoria
                </label>
                <input
                  type="text"
                  placeholder="Ex: Eletroportáteis, Gatos, Iluminação, Organização..."
                  value={formData.subcategory || ''}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Preço Atual (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ex: 389.90"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Preço Original / De (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 549.00 (para cálculo de % OFF)"
                  value={formData.originalPrice || ''}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Condição de Parcelamento
                </label>
                <input
                  type="text"
                  placeholder="Ex: 10x de R$ 38,90 sem juros"
                  value={formData.installments || ''}
                  onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nome da Loja Oficial / Vendedor
                </label>
                <input
                  type="text"
                  placeholder="Ex: Loja Oficial Oster, Mercado Líder Platinum"
                  value={formData.officialStore || ''}
                  onChange={(e) => setFormData({ ...formData, officialStore: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Link de Afiliado do Mercado Livre *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    placeholder="Cole seu link oficial do ML (ex: https://meli.la/22vWZ9m ou link completo)"
                    value={formData.affiliateUrl || ''}
                    onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden font-mono text-xs"
                  />
                  {formData.affiliateUrl && (
                    <a
                      href={formData.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 shrink-0"
                    >
                      Testar <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  💡 <b>Dica:</b> Cole aqui o link curto exato gerado no Mercado Livre (como <code className="text-orange-600 bg-orange-50 px-1 py-0.5 rounded">https://meli.la/xyz</code>) para levar o visitante direto para este produto específico.
                </p>
              </div>

              <div className="flex items-center gap-6 md:col-span-2 pt-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.freeShipping ?? true}
                    onChange={(e) => setFormData({ ...formData, freeShipping: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <span>Frete Grátis</span>
                </label>

                <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFull ?? true}
                    onChange={(e) => setFormData({ ...formData, isFull: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <span>Envio FULL (Mercado Livre)</span>
                </label>

                <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured ?? false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <span>Destaque Principal</span>
                </label>

                <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer bg-amber-50/80 px-3 py-1.5 rounded-lg border border-amber-200">
                  <input
                    type="checkbox"
                    checked={formData.isGuideOrArticle ?? false}
                    onChange={(e) => setFormData({ ...formData, isGuideOrArticle: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-xs">
                    {formData.isGuideOrArticle ? '📘 Modo Artigo / Dicas' : '🏷️ Modo Venda / Oferta Produto'}
                  </span>
                </label>
              </div>

            </div>
          </div>

          {/* Section 2: Fotos & Galeria */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-2 h-5 bg-orange-500 rounded-full inline-block"></span>
              Galeria de Fotos do Produto
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Insira links diretos de imagens ou faça upload de fotos do seu dispositivo. A primeira foto é a capa.
            </p>

            {/* Add by URL */}
            <div className="flex gap-2 mb-4">
              <input
                type="url"
                placeholder="Colar URL de imagem (https://...)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="py-2 px-4 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-950 transition-colors"
              >
                Adicionar URL
              </button>
            </div>

            {/* Upload file */}
            <div className="mb-4">
              <label className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition-colors border border-slate-200">
                <Upload className="w-4 h-4 text-orange-500" />
                <span>Upload de Foto do Computador/Celular</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Current Images list */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {(formData.images || []).map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-50">
                  <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-orange-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Capa
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remover foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Review Text & SEO Summary */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-5 bg-orange-500 rounded-full inline-block"></span>
              Conteúdo da Review & SEO
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Resumo Rápido (Snippet SEO / Elevator Pitch)
                </label>
                <textarea
                  rows={3}
                  value={formData.summary || ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Resumo de 2 a 3 frases explicando o principal benefício e porque vale a pena comprar..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Review Completa (Análise prática, durabilidade, usabilidade)
                </label>
                <textarea
                  rows={8}
                  value={formData.reviewContent || ''}
                  onChange={(e) => setFormData({ ...formData, reviewContent: e.target.value })}
                  placeholder="Escreva 3 a 4 parágrafos abordando primeiras impressões, testes no dia a dia, prós práticos e veredito sincero..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Prós e Contras */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-5 bg-orange-500 rounded-full inline-block"></span>
              Prós e Contras
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Pros */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                <span className="font-bold text-emerald-900 text-xs uppercase block mb-2">
                  Adicionar Ponto Forte (Pró)
                </span>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Ex: Motor super silencioso..."
                    value={newPro}
                    onChange={(e) => setNewPro(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-emerald-200 text-xs focus:border-emerald-500 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddPro}
                    className="py-1.5 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  {(formData.pros || []).map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-emerald-100">
                      <span>✓ {p}</span>
                      <button type="button" onClick={() => handleRemovePro(idx)} className="text-rose-500 hover:text-rose-700">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cons */}
              <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                <span className="font-bold text-rose-900 text-xs uppercase block mb-2">
                  Adicionar Ponto de Atenção (Contra)
                </span>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Ex: Cabo de energia um pouco curto..."
                    value={newCon}
                    onChange={(e) => setNewCon(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-rose-200 text-xs focus:border-rose-500 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddCon}
                    className="py-1.5 px-3 rounded-lg bg-rose-600 text-white text-xs font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  {(formData.cons || []).map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-rose-100">
                      <span>⚠️ {c}</span>
                      <button type="button" onClick={() => handleRemoveCon(idx)} className="text-rose-500 hover:text-rose-700">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Section 5: Veredito e Ficha Técnica */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-5 bg-orange-500 rounded-full inline-block"></span>
              Veredito Final & Ficha Técnica
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nota do Veredito (0 a 10)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.verdict?.score || 9.5}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      verdict: {
                        ...(formData.verdict || ({} as any)),
                        score: parseFloat(e.target.value) || 9.5,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Selo de Reconhecimento
                </label>
                <input
                  type="text"
                  placeholder="Ex: Escolha do Editor, Melhor Custo-Benefício, Campeão de Vendas..."
                  value={formData.verdict?.badge || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      verdict: {
                        ...(formData.verdict || ({} as any)),
                        badge: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Resumo do Veredito
                </label>
                <input
                  type="text"
                  placeholder="Ex: Excelente compra para quem busca praticidade com o menor preço do ano."
                  value={formData.verdict?.summary || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      verdict: {
                        ...(formData.verdict || ({} as any)),
                        summary: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden"
                />
              </div>
            </div>

            {/* Specifications */}
            <div className="border-t border-slate-100 pt-4">
              <span className="font-bold text-xs uppercase text-slate-700 block mb-2">
                Ficha Técnica (Atributos)
              </span>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Característica (ex: Potência, Voltagem)"
                  value={newSpecLabel}
                  onChange={(e) => setNewSpecLabel(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs flex-1"
                />
                <input
                  type="text"
                  placeholder="Valor (ex: 1500W, Bivolt)"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="py-1.5 px-4 rounded-lg bg-slate-800 text-white text-xs font-bold"
                >
                  Adicionar
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {(formData.specifications || []).map((s, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-800 text-xs py-1 px-2.5 rounded-lg flex items-center gap-1.5">
                    <b>{s.label}:</b> {s.value}
                    <button type="button" onClick={() => handleRemoveSpec(idx)} className="text-rose-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Save Button */}
          <div className="flex justify-end gap-3 pb-8">
            <button
              type="button"
              onClick={() => setActiveTab('manage')}
              className="py-3 px-6 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-8 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Salvando Produto...' : 'Salvar e Publicar Produto'}</span>
            </button>
          </div>

        </form>
      )}

      {/* ================= TAB 4: SETTINGS & AFFILIATE ================= */}
      {activeTab === 'settings' && (
        <div className="mt-6 flex flex-col gap-6 max-w-3xl">

          {/* Card de Gerenciamento do Logotipo Oficial */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-orange-500" />
                  Logotipo Oficial do Site (Sr. Detetive)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Faça o upload do seu arquivo original (ex: <code>logo fundo transparente detetive grisalho.png</code>). Ele substituirá imediatamente o logo em todo o site (topo, banner e rodapé) com fundo transparente e sem nenhuma alteração.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="relative shrink-0 flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-slate-200 p-2 shadow-xs">
                <img
                  src={`/logo-detective.png?t=${logoTimestamp}`}
                  alt="Logo Atual"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/logo.png';
                  }}
                />
              </div>

              <div className="flex-1 w-full flex flex-col gap-3">
                <label className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm cursor-pointer shadow-sm hover:shadow transition-all w-full sm:w-auto">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingLogo ? 'Enviando e salvando logo...' : 'Selecionar e Colocar Meu Logo (PNG)'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    disabled={uploadingLogo}
                    onChange={handleLogoFileChange}
                  />
                </label>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Aceita PNG com fundo transparente. Substituição instantânea 100% fiel ao seu arquivo.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card da Capa Oficial Atualizada para Facebook / Redes Sociais */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  Capa Oficial para Facebook (Atualizada com o Sr. Detetive)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Capa panorâmica em alta definição (300 DPI) com o mascote do Sr. Detetive, ícones 3D das categorias e layout pronto para as medidas da Página do Facebook.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="relative w-full aspect-16/9 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs">
                <img
                  src="/facebook-cover.jpg"
                  alt="Capa Facebook AcheiUtil"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Formato ideal para computador e celular no Facebook.</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href="/facebook-cover.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Visualizar em tela cheia
                  </a>
                  <a
                    href="/facebook-cover.jpg"
                    download="capa-facebook-acheiutil.jpg"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 rotate-180" />
                    Baixar Capa (JPG)
                  </a>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveSettingsSubmit} className="flex flex-col gap-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-orange-500" />
              Configuração do Programa de Afiliados Mercado Livre
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tag de Afiliado Padrão (Mercado Livre) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: acheiutilbr2659"
                  value={localSettings.affiliateTag || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, affiliateTag: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Essa tag é automaticamente anexada aos links importados da API do Mercado Livre para garantir suas comissões de venda.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Texto do Banner de Destaque no Topo
                </label>
                <input
                  type="text"
                  value={localSettings.bannerText || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, bannerText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="banner-toggle"
                  checked={localSettings.bannerActive ?? true}
                  onChange={(e) => setLocalSettings({ ...localSettings, bannerActive: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <label htmlFor="banner-toggle" className="text-sm font-semibold text-slate-800 cursor-pointer">
                  Exibir Banner de Ofertas no Topo do Blog
                </label>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  E-mail de Contato do Site
                </label>
                <input
                  type="email"
                  value={localSettings.contactEmail || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, contactEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  ID do Google Analytics 4 (GA4)
                </label>
                <input
                  type="text"
                  placeholder="Ex: G-XXXXXXXXXX"
                  value={localSettings.googleAnalyticsId || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, googleAnalyticsId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Cole aqui o mesmo código do Google Analytics que você já usa no WordPress para continuar acompanhando todas as visitas sem perder seus dados históricos.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Endereço do seu Blog WordPress
                </label>
                <input
                  type="url"
                  placeholder="https://acheiutil.com"
                  value={localSettings.wordpressSiteUrl || 'https://acheiutil.com'}
                  onChange={(e) => setLocalSettings({ ...localSettings, wordpressSiteUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Endereço do seu blog existente na Hostinger para integração e leitura de posts.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Senha / PIN de Acesso Administrativo
                </label>
                <input
                  type="text"
                  placeholder="Ex: admin123"
                  value={localSettings.adminPin || 'admin123'}
                  onChange={(e) => setLocalSettings({ ...localSettings, adminPin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-hidden font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Esta é a senha necessária para acessar o painel administrativo. O leitor comum não tem acesso a esta senha nem ao botão do painel.
                </p>
              </div>
            </div>
          </div>

          {/* Affiliate Tips Card */}
          <div className="bg-gradient-to-br from-blue-50 to-orange-50/50 rounded-2xl p-6 border border-blue-100 text-xs sm:text-sm text-slate-700 space-y-3">
            <h4 className="font-bold text-blue-950 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              Como Maximizar Conversões como Afiliado Mercado Livre:
            </h4>
            <ul className="space-y-2 list-disc list-inside text-slate-600">
              <li><b>Envio FULL:</b> Produtos com entrega Full convertem até 3x mais porque o cliente recebe no dia seguinte.</li>
              <li><b>Prós e Contras Reais:</b> Compradores confiam em reviews que apontam pequenos pontos de atenção, aumentando a taxa de clique no botão de compra.</li>
              <li><b>Preço e Parcelamento Visíveis:</b> O consumidor brasileiro decide a compra no parcelamento sem juros.</li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-4">
            {savedSettingsSuccess && (
              <span className="text-emerald-800 bg-emerald-100 border border-emerald-300 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs animate-pulse">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                Configurações Salvas com Sucesso!
              </span>
            )}
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-8 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Salvando...' : 'Salvar Configurações'}</span>
            </button>
          </div>

        </form>
      </div>
      )}

      {/* ================= TAB 5: WORDPRESS & HOSTING EXPORT ================= */}
      {activeTab === 'export' && (
        <div className="mt-6 flex flex-col gap-6">

          {/* Top Info Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-950 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-bold">
                <FileCode className="w-3.5 h-3.5" /> Compatibilidade 100% WordPress
              </div>
              <h3 className="text-xl font-extrabold font-['Outfit']">
                Exportar Conteúdo para o WordPress
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Baixe todas as análises, imagens, fichas técnicas e links de afiliados formatados nos padrões oficiais que o WordPress e o WooCommerce aceitam com apenas 1 clique.
              </p>
            </div>
            <div className="shrink-0 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-center">
              <span className="text-2xl font-black text-orange-400">{products.length}</span>
              <span className="block text-[11px] text-slate-300">Itens Prontos</span>
            </div>
          </div>

          {/* Export Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: WordPress XML (WXR) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-orange-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
                    <FileCode className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    Recomendado para Blog
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">
                  Exportar Posts e Reviews (.XML / WXR)
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Gera o arquivo oficial <b>WordPress eXtended RSS (WXR 1.2)</b> com todos os posts prontos. Inclui título, fotos, resumo, review completa formatada, caixas de prós/contras, nota de avaliação e botões com seu link de afiliado Mercado Livre.
                </p>

                <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1 mb-6 border border-slate-100">
                  <p className="font-semibold text-slate-800">Campos incluídos no XML:</p>
                  <p>• Post completo formatado com HTML responsivo</p>
                  <p>• Botões de compra com tag <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">{settings.affiliateTag}</code></p>
                  <p>• Metadados: Preço, Avaliação e ID do Mercado Livre</p>
                </div>
              </div>

              <a
                href="/api/export/wordpress.xml"
                download="acheiutil-wordpress-posts.xml"
                className="w-full py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-950/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4 text-orange-400" />
                <span>Baixar Arquivo XML do WordPress</span>
              </a>
            </div>

            {/* Card 2: WooCommerce CSV */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-orange-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200">
                    WooCommerce & Planilha
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">
                  Exportar Produtos WooCommerce (.CSV)
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Gera uma planilha CSV estruturada para o importador nativo do <b>WooCommerce</b> ou plugins como o <b>WP All Import</b>. Cadastra os itens como <i>"Produto Externo / Afiliado"</i> com link direto para o Mercado Livre.
                </p>

                <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1 mb-6 border border-slate-100">
                  <p className="font-semibold text-slate-800">Colunas configuradas:</p>
                  <p>• Tipo: Produto Externo/Afiliado</p>
                  <p>• Preço Original vs. Preço Promocional com Desconto</p>
                  <p>• URL de Afiliado com rastreamento ativo</p>
                </div>
              </div>

              <a
                href="/api/export/products.csv"
                download="acheiutil-produtos-woocommerce.csv"
                className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Baixar Planilha CSV WooCommerce</span>
              </a>
            </div>

          </div>

          {/* Step-by-Step Instructions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4 text-blue-900" />
              Como importar o arquivo XML no seu WordPress (Passo a Passo)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-900 text-white font-bold text-xs mb-2">1</span>
                <p className="font-bold text-slate-800 mb-1">Acesse as Ferramentas</p>
                <p>No painel do seu WordPress, vá no menu lateral em <b>Ferramentas &gt; Importar</b>.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-900 text-white font-bold text-xs mb-2">2</span>
                <p className="font-bold text-slate-800 mb-1">Instale o Importador</p>
                <p>Na linha <b>WordPress</b>, clique em <b>"Instalar agora"</b> (se ainda não tiver) e depois em <b>"Executar importador"</b>.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-900 text-white font-bold text-xs mb-2">3</span>
                <p className="font-bold text-slate-800 mb-1">Envie o Arquivo</p>
                <p>Escolha o arquivo <code>.xml</code> baixado, selecione seu autor e marque a opção para <b>"Baixar e importar anexos de arquivos"</b>.</p>
              </div>
            </div>
          </div>

          {/* Economical Hosting Guide */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-5 h-5 text-orange-400" />
              <h4 className="text-sm font-bold text-white">
                Dica de Hospedagem Econômica para o Futuro (Alternativas ao WordPress)
              </h4>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Se futuramente você preferir não usar o WordPress (que costuma ficar lento com plugins pesados), você pode hospedar esta aplicação moderna (React + Node) em plataformas com <b>custo zero ou muito baixo</b>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
                <p className="font-bold text-orange-400 mb-1">Vercel (Plano Grátis)</p>
                <p className="text-slate-300">Custo: <b>R$ 0/mês</b>. Oferece CDN mundial rápida e certificado SSL grátis para o seu domínio.</p>
              </div>

              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
                <p className="font-bold text-orange-400 mb-1">Render ou Railway</p>
                <p className="text-slate-300">Custo: <b>Grátis a ~$5/mês</b> (cerca de R$ 25/mês). Roda o servidor Node.js com banco de dados de forma simples.</p>
              </div>

              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
                <p className="font-bold text-orange-400 mb-1">VPS Linux (Hostinger / Hetzner)</p>
                <p className="text-slate-300">Custo: <b>R$ 20 a R$ 35/mês</b>. Servidor dedicado próprio com capacidade para milhões de acessos mensais sem lentidão.</p>
              </div>
            </div>
          </div>

          {/* WordPress Button Generator Section inside Export */}
          <div className="mt-2">
            <WordPressButtonGenerator
              products={products}
              initialProductId={targetButtonProductId || products[0]?.id}
            />
          </div>

        </div>
      )}

      {/* ================= TAB 6: DEDICATED WORDPRESS BUTTON GENERATOR ================= */}
      {activeTab === 'wpbutton' && (
        <div className="mt-6">
          <WordPressButtonGenerator
            products={products}
            initialProductId={targetButtonProductId || products[0]?.id}
          />
        </div>
      )}

      {/* ================= TAB 7: SOCIAL MEDIA AUTOMATION & FACEBOOK GROUPS ================= */}
      {activeTab === 'social' && (
        <div className="mt-6">
          <SocialAutomationSection
            products={products}
            siteUrl={typeof window !== 'undefined' ? window.location.origin : 'https://acheiutil.com'}
          />
        </div>
      )}

    </div>
  );
};

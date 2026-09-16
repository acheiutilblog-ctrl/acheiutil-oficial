import React, { useState, useRef } from 'react';
import {
  Home,
  Sparkles,
  Palette,
  Heart,
  Search,
  SlidersHorizontal,
  X,
  Menu,
  ShoppingBag,
  BookOpen,
  Share2,
  Upload,
} from 'lucide-react';
import { ProductCategory } from '../types';

interface HeaderProps {
  currentCategory: ProductCategory | 'todas' | 'guias';
  onSelectCategory: (cat: ProductCategory | 'todas' | 'guias') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  onGoHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpenMobile, setSearchOpenMobile] = useState(false);

  const categories = [
    { id: 'todas', label: 'Todos os Achados', icon: Sparkles },
    { id: 'casa', label: 'Casa', icon: Home },
    { id: 'utilidades', label: 'Utilidades', icon: Sparkles },
    { id: 'decoracao', label: 'Decoração', icon: Palette },
    { id: 'pet', label: 'Pet', icon: Heart },
    { id: 'guias', label: 'Guias & Dicas', icon: BookOpen },
  ] as const;

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 sm:h-26 md:h-28 gap-3 py-1.5">
          
          {/* Brand Logo & Slogan */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => {
                onGoHome();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 group text-left cursor-pointer focus:outline-hidden py-1"
            >
              {/* Logo do Sr. Detetive com fundo transparente e alta definição - aumentado proporcionalmente */}
              <div className="relative flex items-center justify-center shrink-0">
                <img
                  src="/logo-detective.png?v=20260916-max"
                  alt="acheiutil.com"
                  className="h-22 w-22 sm:h-24 sm:w-24 md:h-28 md:w-28 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = '/logo.png';
                  }}
                />
              </div>

              <div className="flex flex-col justify-center">
                <div className="flex items-center font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tight text-blue-950 font-['Outfit'] leading-none">
                  <span>achei</span>
                  <span className="text-orange-500">util</span>
                  <span className="text-slate-400 font-normal text-base sm:text-lg">.com</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-blue-900 tracking-tight mt-1 sm:mt-1.5 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Antes de comprar, descubra se vale a pena.
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="header-search-input"
                type="text"
                placeholder="Buscar produtos (ex: air fryer, robô aspirador, pet)..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-100 hover:bg-slate-50 focus:bg-white text-sm text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-hidden transition-all shadow-2xs"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Share / Indicar Site Button */}
            <button
              id="header-indicar-btn"
              onClick={() => {
                const text = encodeURIComponent(
                  'Olha esse site com análises sinceras de produtos antes de comprar no Mercado Livre: https://acheiutil.com'
                );
                window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 hover:text-orange-800 text-xs font-bold transition-all border border-orange-200/80 cursor-pointer shadow-2xs"
              title="Indicar o site no WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 text-orange-600" />
              <span>Indicar Site</span>
            </button>

            {/* Mobile search toggle */}
            <button
              id="mobile-search-toggle"
              onClick={() => setSearchOpenMobile(!searchOpenMobile)}
              className="p-2 text-slate-600 hover:text-blue-900 rounded-lg lg:hidden"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile menu trigger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-blue-900 rounded-lg md:hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input drawer */}
        {searchOpenMobile && (
          <div className="py-2.5 pb-3 border-t border-slate-100 lg:hidden">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="header-mobile-search"
                type="text"
                autoFocus
                placeholder="Buscar produtos e reviews..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-100 text-sm text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-orange-500 outline-hidden"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Desktop Category Navigation */}
        <nav id="desktop-category-nav" className="hidden md:flex items-center gap-1 border-t border-slate-100 py-2.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-nav-${cat.id}`}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onGoHome();
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden bg-white border-b border-slate-200 px-4 py-3 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Categorias</p>
          <div className="flex flex-col gap-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = currentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`mobile-cat-nav-${cat.id}`}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onGoHome();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-blue-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                const text = encodeURIComponent(
                  'Olha esse site com análises sinceras de produtos antes de comprar no Mercado Livre: https://acheiutil.com'
                );
                window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-orange-50 text-orange-700 font-bold text-xs border border-orange-200"
            >
              <Share2 className="w-4 h-4 text-orange-600" />
              <span>Indicar AcheiUtil no WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

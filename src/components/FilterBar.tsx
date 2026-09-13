import React from 'react';
import { ProductCategory } from '../types';
import {
  Sparkles,
  Home,
  Palette,
  Heart,
  ArrowUpDown,
  Filter,
  BookOpen,
} from 'lucide-react';

interface FilterBarProps {
  currentCategory: ProductCategory | 'todas' | 'guias';
  onSelectCategory: (cat: ProductCategory | 'todas' | 'guias') => void;
  sortOption: string;
  onSortChange: (sort: string) => void;
  totalProducts: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentCategory,
  onSelectCategory,
  sortOption,
  onSortChange,
  totalProducts,
}) => {
  const categories = [
    { id: 'todas', label: 'Todos os Produtos', icon: Sparkles },
    { id: 'casa', label: 'Casa', icon: Home },
    { id: 'utilidades', label: 'Utilidades', icon: Sparkles },
    { id: 'decoracao', label: 'Decoração', icon: Palette },
    { id: 'pet', label: 'Pet', icon: Heart },
    { id: 'guias', label: 'Guias & Dicas', icon: BookOpen },
  ] as const;

  return (
    <div id="filter-bar" className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = currentCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                isActive
                  ? 'bg-blue-950 text-white border-blue-950 shadow-sm'
                  : 'bg-white text-slate-700 hover:text-blue-950 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sort & Count */}
      <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
        <span className="text-slate-500 font-medium">
          <strong className="text-slate-900">{totalProducts}</strong> achados
        </span>

        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent text-slate-800 text-xs font-medium outline-hidden cursor-pointer"
          >
            <option value="recent">Mais Recentes</option>
            <option value="discount">Maior Desconto (% OFF)</option>
            <option value="rating">Melhor Avaliados</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
          </select>
        </div>
      </div>
    </div>
  );
};

import { Leaf, Wheat, Milk, Tractor, Sprout, Apple, Package, FlaskConical, ChevronRight, ChevronLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Category {
  icon: React.ElementType;
  labelKey: string;
  color: string;
  bgColor: string;
}

const categories: Category[] = [
  { icon: Apple, labelKey: 'categories.freshProduce', color: 'text-red-500', bgColor: 'bg-red-50' },
  { icon: Wheat, labelKey: 'categories.grains', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  { icon: Milk, labelKey: 'categories.dairy', color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { icon: Leaf, labelKey: 'categories.livestock', color: 'text-green-600', bgColor: 'bg-green-50' },
  { icon: Tractor, labelKey: 'categories.equipment', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  { icon: Sprout, labelKey: 'categories.organic', color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
  { icon: Package, labelKey: 'categories.processed', color: 'text-orange-500', bgColor: 'bg-orange-50' },
  { icon: FlaskConical, labelKey: 'categories.fertilizers', color: 'text-purple-500', bgColor: 'bg-purple-50' },
];

export default function CategoryGrid() {
  const { t } = useApp();

  return (
    <div className="bg-card rounded-xl p-3 sm:p-4 lg:p-6">
      <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">{t('categories.all')}</h3>
      
      {/* Mobile Horizontal Scroll */}
      <div className="sm:hidden">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-3 px-3 snap-x snap-mandatory">
          {categories.map((category) => (
            <a
              key={category.labelKey}
              href={`/category/${category.labelKey}`}
              className="flex flex-col items-center gap-2 min-w-[70px] snap-start"
            >
              <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center transition-transform active:scale-95`}>
                <category.icon className={`h-6 w-6 ${category.color}`} />
              </div>
              <span className="text-[10px] text-foreground text-center leading-tight max-w-[70px]">
                {t(category.labelKey)}
              </span>
            </a>
          ))}
        </div>
      </div>
      
      {/* Tablet & Desktop Grid */}
      <div className="hidden sm:grid sm:grid-cols-4 lg:grid-cols-2 gap-3">
        {categories.map((category) => (
          <a
            key={category.labelKey}
            href={`/category/${category.labelKey}`}
            className="category-card group"
          >
            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${category.bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
              <category.icon className={`h-5 w-5 lg:h-6 lg:w-6 ${category.color}`} />
            </div>
            <span className="text-xs lg:text-sm text-foreground text-center leading-tight">
              {t(category.labelKey)}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

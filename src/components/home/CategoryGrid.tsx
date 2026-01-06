import { Leaf, Wheat, Milk, Tractor, Sprout, Apple, Package, FlaskConical } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

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
    <div className="bg-card rounded-xl p-4 lg:p-6">
      <h3 className="font-semibold text-foreground mb-4">{t('categories.all')}</h3>
      <div className="grid grid-cols-4 lg:grid-cols-2 gap-3">
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

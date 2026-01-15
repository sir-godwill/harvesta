import { Leaf, Wheat, Milk, Tractor, Sprout, Apple, Package, FlaskConical, Fish, Gem, Coffee } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { fetchCategories, Category } from '@/lib/productManagementApi';
import { Skeleton } from '@/components/ui/skeleton';

// Map icon strings (from DB) to Lucide components
const iconMap: Record<string, React.ElementType> = {
  apple: Apple,
  wheat: Wheat,
  milk: Milk,
  leaf: Leaf,
  tractor: Tractor,
  sprout: Sprout,
  package: Package,
  flask: FlaskConical,
  fish: Fish,
  gem: Gem,
  coffee: Coffee,
};

// Periodic colors for categories without specific styling
const categoryStyles = [
  { color: 'text-red-500', bgColor: 'bg-red-50' },
  { color: 'text-amber-600', bgColor: 'bg-amber-50' },
  { color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { color: 'text-green-600', bgColor: 'bg-green-50' },
  { color: 'text-gray-600', bgColor: 'bg-gray-100' },
  { color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
  { color: 'text-orange-500', bgColor: 'bg-orange-50' },
  { color: 'text-purple-500', bgColor: 'bg-purple-50' },
];

export default function CategoryGrid() {
  const { t } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      const { data } = await fetchCategories();
      if (data) {
        setCategories(data);
      }
      setLoading(false);
    }
    loadCategories();
  }, []);

  // Auto-scroll effect for mobile
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const autoScroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;

        // Reset to start when reaching the end
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }

        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    // Only auto-scroll on mobile
    const isMobile = window.innerWidth < 640;
    if (categories.length > 0 && isMobile) {
      animationId = requestAnimationFrame(autoScroll);
    }

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused, categories]);

  if (loading) {
    return (
      <div className="bg-card rounded-xl p-3 sm:p-4 lg:p-6">
        <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">{t('categories.all')}</h3>
        <div className="grid grid-cols-4 lg:grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Skeleton key={i} className="h-20 sm:h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  // Duplicate categories for seamless loop if enough exist
  const displayCategories = categories.length > 3 ? [...categories, ...categories] : categories;

  const getCategoryStyle = (index: number) => categoryStyles[index % categoryStyles.length];
  const getIcon = (iconName?: string) => {
    if (!iconName) return Package; // Default
    return iconMap[iconName.toLowerCase()] || Package;
  };

  return (
    <div className="bg-card rounded-xl p-3 sm:p-4 lg:p-6">
      <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">{t('categories.all')}</h3>

      {/* Mobile Horizontal Scroll with Auto-scroll */}
      <div className="sm:hidden overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 min-w-0"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
        >
          {displayCategories.map((category, index) => {
            const style = getCategoryStyle(index);
            const Icon = getIcon(category.icon);
            return (
              <a
                key={`${category.id}-${index}`}
                href={`/category/${category.slug}`}
                className="flex flex-col items-center gap-1.5 min-w-[56px] flex-shrink-0"
              >
                <div className={`w-10 h-10 rounded-xl ${style.bgColor} flex items-center justify-center transition-transform active:scale-90`}>
                  <Icon className={`h-5 w-5 ${style.color}`} />
                </div>
                <span className="text-[9px] text-foreground text-center leading-tight max-w-[56px] truncate">
                  {category.name}
                </span>
              </a>
            )
          })}
        </div>
      </div>

      {/* Tablet & Desktop Grid */}
      <div className="hidden sm:grid sm:grid-cols-4 lg:grid-cols-2 gap-3">
        {categories.map((category, index) => {
          const style = getCategoryStyle(index);
          const Icon = getIcon(category.icon);
          return (
            <a
              key={category.id}
              href={`/category/${category.slug}`}
              className="category-card group"
              title={category.name}
            >
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${style.bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <Icon className={`h-5 w-5 lg:h-6 lg:w-6 ${style.color}`} />
              </div>
              <span className="text-xs lg:text-sm text-foreground text-center leading-tight line-clamp-2">
                {category.name}
              </span>
            </a>
          )
        })}
      </div>
    </div>
  );
}

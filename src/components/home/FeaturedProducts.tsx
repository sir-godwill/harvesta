import { ChevronRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import ProductCard from './ProductCard';
import { useFeaturedProducts, transformProduct } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedProducts() {
  const { t } = useApp();
  const { data: products, isLoading } = useFeaturedProducts(8);
  
  const transformedProducts = products?.map(transformProduct) || [];

  if (isLoading) {
    return (
      <section className="py-3 sm:py-6">
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-foreground">
            {t('home.featuredProducts')}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3 lg:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-card rounded-lg p-2 sm:p-3">
              <Skeleton className="aspect-square rounded-md mb-2" />
              <Skeleton className="h-3 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-3 sm:py-6">
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-foreground">
          {t('home.featuredProducts')}
        </h2>
        <a href="/products" className="flex items-center gap-0.5 text-primary text-xs sm:text-sm font-medium hover:underline">
          View All
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </a>
      </div>
      
      {transformedProducts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No featured products available</p>
        </div>
      ) : (
        <>
          {/* Mobile 2-Column Grid */}
          <div className="grid grid-cols-2 gap-1.5 sm:hidden">
            {transformedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Tablet & Desktop Grid */}
          <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {transformedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

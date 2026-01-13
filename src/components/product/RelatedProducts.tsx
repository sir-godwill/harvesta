import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Leaf, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RelatedProduct } from '@/lib/productApi';

interface RelatedProductsProps {
  products: RelatedProduct[];
  formatPrice: (price: number) => string;
  className?: string;
}

export function RelatedProducts({ products, formatPrice, className }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="font-bold text-lg text-foreground">Related Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {products.map((product) => (
          <Link 
            key={product.id} 
            to={`/product/${product.id}`}
            className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-square relative overflow-hidden bg-muted">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              {product.isOrganic && (
                <Badge className="absolute top-2 left-2 bg-green-600 text-white text-[10px] px-1.5 py-0.5">
                  <Leaf className="w-3 h-3 mr-0.5" />
                  Organic
                </Badge>
              )}
            </div>
            <div className="p-3 space-y-1">
              <p className="text-sm text-foreground line-clamp-2 leading-tight min-h-[2.5rem]">
                {product.name}
              </p>
              <p className="text-primary font-bold text-sm">
                {formatPrice(product.price)}<span className="text-xs text-muted-foreground font-normal">/{product.unit}</span>
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {product.rating}
                </span>
                <span>{product.soldCount.toLocaleString()} sold</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

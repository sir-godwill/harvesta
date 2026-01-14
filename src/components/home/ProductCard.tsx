import { Star, ShieldCheck } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  priceMax?: number;
  moq: number;
  unit: string;
  supplier: string;
  location: string;
  rating: number;
  sold: number;
  verified: boolean;
  goldSupplier?: boolean;
  discount?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { formatPrice, t } = useApp();

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="card-product group cursor-pointer h-full">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted rounded-t-lg sm:rounded-t-xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.discount && (
            <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-primary text-primary-foreground text-[8px] sm:text-xs font-medium px-1 sm:px-2 py-0.5 rounded">
              {product.discount}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-1.5 sm:p-3">
          {/* Badges - Now visible on all screen sizes */}
          <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-2 flex-wrap">
            {product.verified && (
              <Badge variant="secondary" className="bg-success/10 text-success text-[7px] sm:text-[10px] px-0.5 sm:px-1.5 py-0 h-3.5 sm:h-5">
                <ShieldCheck className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5" />
                {t('product.verified')}
              </Badge>
            )}
            {product.goldSupplier && (
              <Badge variant="secondary" className="bg-warning/10 text-warning text-[7px] sm:text-[10px] px-0.5 sm:px-1.5 py-0 h-3.5 sm:h-5">
                {t('product.goldSupplier')}
              </Badge>
            )}
          </div>
          
          {/* Title */}
          <h3 className="text-[10px] sm:text-sm font-medium text-foreground line-clamp-2 mb-1 sm:mb-2 min-h-[1.75rem] sm:min-h-[2.5rem] leading-tight">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-baseline gap-0.5 mb-0.5 flex-wrap">
            <span className="price-primary text-xs sm:text-lg font-bold">
              {formatPrice(product.price)}
            </span>
            {product.priceMax && (
              <>
                <span className="text-muted-foreground text-[8px] sm:text-sm">~</span>
                <span className="price-primary text-xs sm:text-lg font-bold">
                  {formatPrice(product.priceMax)}
                </span>
              </>
            )}
          </div>
          
          {/* MOQ - Compact on mobile */}
          <p className="text-[8px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-2">
            {t('product.moq')}: {product.moq} {product.unit}
          </p>
          
          {/* Rating & Sold */}
          <div className="flex items-center gap-1 text-[8px] sm:text-xs text-muted-foreground">
            <div className="flex items-center gap-0.5">
              <Star className="h-2 w-2 sm:h-3 sm:w-3 fill-warning text-warning" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span className="text-primary font-medium">{product.sold >= 1000 ? `${(product.sold/1000).toFixed(0)}K+` : `${product.sold}+`} sold</span>
          </div>
          
          {/* Supplier Info - Hidden on mobile */}
          <div className="hidden sm:flex items-center justify-between pt-2 mt-2 border-t border-border">
            <span className="text-xs text-muted-foreground truncate max-w-[60%]">
              {product.supplier}
            </span>
            <span className="text-xs text-muted-foreground">
              {product.location}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

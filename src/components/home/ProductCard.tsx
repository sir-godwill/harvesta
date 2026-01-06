import { Star, Check, ShieldCheck } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';

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
    <div className="card-product group cursor-pointer">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
            {product.discount}
          </div>
        )}
        {product.verified && (
          <div className="absolute top-2 right-2 bg-success text-success-foreground p-1 rounded-full">
            <Check className="h-3 w-3" />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-3">
        {/* Badges */}
        <div className="flex items-center gap-1.5 mb-2">
          {product.verified && (
            <Badge variant="secondary" className="bg-success/10 text-success text-[10px] px-1.5 py-0 h-5">
              <ShieldCheck className="h-3 w-3 mr-0.5" />
              {t('product.verified')}
            </Badge>
          )}
          {product.goldSupplier && (
            <Badge variant="secondary" className="bg-warning/10 text-warning text-[10px] px-1.5 py-0 h-5">
              {t('product.goldSupplier')}
            </Badge>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="flex items-baseline gap-1 mb-1">
          <span className="price-primary text-lg">
            {formatPrice(product.price)}
          </span>
          {product.priceMax && (
            <>
              <span className="text-muted-foreground text-sm">~</span>
              <span className="price-primary text-lg">
                {formatPrice(product.priceMax)}
              </span>
            </>
          )}
        </div>
        
        {/* MOQ */}
        <p className="text-xs text-muted-foreground mb-2">
          {t('product.moq')}: {product.moq} {product.unit}
        </p>
        
        {/* Rating & Sold */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
          <span>•</span>
          <span>{product.sold.toLocaleString()}+ sold</span>
        </div>
        
        {/* Supplier Info */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground truncate max-w-[60%]">
            {product.supplier}
          </span>
          <span className="text-xs text-muted-foreground">
            {product.location}
          </span>
        </div>
      </div>
    </div>
  );
}

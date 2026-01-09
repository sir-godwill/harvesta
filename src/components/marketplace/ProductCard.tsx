import { ShoppingCart, FileText, BarChart3, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrustBadge } from './TrustBadge';
import type { Product, Vendor } from '@/types/marketplace';

interface ProductCardProps {
  product: Product;
  vendor?: Vendor;
  onAddToCart?: () => void;
  onRequestQuote?: () => void;
  onCompare?: () => void;
  className?: string;
}

export function ProductCard({ product, vendor, onAddToCart, onRequestQuote, onCompare, className }: ProductCardProps) {
  const lowestPrice = product.pricingTiers.reduce((min, tier) => tier.pricePerUnit < min ? tier.pricePerUnit : min, product.pricingTiers[0].pricePerUnit);

  return (
    <div className={cn('group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow', className)}>
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        {product.originalPrice && (
          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">-{Math.round((1 - product.currentPrice / product.originalPrice) * 100)}%</Badge>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {vendor?.isVerified && <TrustBadge type="verified" size="sm" />}
          {vendor?.isQualityChecked && <TrustBadge type="quality" size="sm" />}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">{product.category}</Badge>
          <Badge variant="outline" className="text-xs">{product.grade}</Badge>
        </div>

        <h3 className="font-semibold text-foreground line-clamp-2 leading-tight min-h-[2.5rem]">{product.name}</h3>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" /><span>{product.origin}</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">${product.currentPrice.toFixed(2)}</span>
            {product.originalPrice && <span className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>}
            <span className="text-xs text-muted-foreground">/ {product.unit}</span>
          </div>
          <p className="text-xs text-secondary font-medium">As low as ${lowestPrice.toFixed(2)} for bulk orders</p>
        </div>

        <div className="inline-flex items-center gap-1 text-xs bg-warning/10 text-warning px-2 py-1 rounded">
          <span>MOQ: {product.moq} {product.unit}</span>
        </div>

        {vendor && (
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-xs font-medium text-primary">{vendor.name.charAt(0)}</span></div>
            <span className="text-sm text-muted-foreground truncate flex-1">{vendor.name}</span>
            <span className="text-xs text-muted-foreground">⭐ {vendor.rating}</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1 gap-1.5" onClick={onAddToCart}><ShoppingCart className="w-4 h-4" /> Add</Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={onRequestQuote}><FileText className="w-4 h-4" /></Button>
          <Button size="sm" variant="ghost" className="gap-1.5" onClick={onCompare}><BarChart3 className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  );
}
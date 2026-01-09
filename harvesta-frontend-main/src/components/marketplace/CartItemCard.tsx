import { Trash2, Heart, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { QuantityInput } from './QuantityInput';
import { PricingTierTable, PricingDisplay } from './PricingTierTable';
import type { CartItem } from '@/types/marketplace';

interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  onSaveForLater: () => void;
  className?: string;
}

export function CartItemCard({
  item,
  onQuantityChange,
  onRemove,
  onSaveForLater,
  className,
}: CartItemCardProps) {
  const { product, quantity } = item;
  const isBelowMoq = quantity < product.moq;

  // Calculate current price based on quantity
  const getApplicablePrice = () => {
    const tier = product.pricingTiers.find(
      t => quantity >= t.minQuantity && (t.maxQuantity === null || quantity <= t.maxQuantity)
    );
    return tier?.pricePerUnit || product.currentPrice;
  };

  const currentPrice = getApplicablePrice();

  return (
    <div className={cn(
      'flex gap-4 p-4 bg-card rounded-lg border transition-all hover:shadow-md animate-fade-in',
      isBelowMoq && 'border-warning/50 bg-warning/5',
      className
    )}>
      {/* Product Image */}
      <div className="shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 space-y-3">
        <div>
          <h4 className="font-semibold text-foreground line-clamp-2">
            {product.name}
          </h4>
          <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
            <span className="bg-muted px-2 py-0.5 rounded">{product.grade}</span>
            <span>•</span>
            <span>{product.origin}</span>
            <span>•</span>
            <span>{product.category}</span>
          </div>
        </div>

        {/* MOQ Warning */}
        {isBelowMoq && (
          <div className="flex items-center gap-2 text-sm text-warning bg-warning/10 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              Minimum order quantity is <strong>{product.moq} {product.unit}</strong>. 
              Please increase quantity to proceed.
            </span>
          </div>
        )}

        {/* Pricing Tiers */}
        <PricingTierTable
          tiers={product.pricingTiers}
          currentQuantity={quantity}
          unit={product.unit}
        />

        {/* Quantity and Price Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <QuantityInput
            value={quantity}
            onChange={onQuantityChange}
            min={1}
            moq={product.moq}
            unit={product.unit}
          />

          <PricingDisplay
            currentPrice={currentPrice}
            originalPrice={product.originalPrice}
            unit={product.unit}
            quantity={quantity}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSaveForLater}
            className="text-muted-foreground hover:text-primary gap-1"
          >
            <Heart className="w-4 h-4" />
            Save for later
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}

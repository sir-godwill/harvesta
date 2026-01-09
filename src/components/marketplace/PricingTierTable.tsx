import { cn } from '@/lib/utils';
import type { PricingTier } from '@/types/marketplace';

interface PricingTierTableProps {
  tiers: PricingTier[];
  currentQuantity: number;
  unit: string;
  className?: string;
}

export function PricingTierTable({ tiers, currentQuantity, unit, className }: PricingTierTableProps) {
  const getActiveTier = () => {
    return tiers.find(tier => 
      currentQuantity >= tier.minQuantity && 
      (tier.maxQuantity === null || currentQuantity <= tier.maxQuantity)
    );
  };

  const activeTier = getActiveTier();

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bulk Pricing</p>
      <div className="flex flex-wrap gap-2">
        {tiers.map((tier, index) => {
          const isActive = tier === activeTier;
          return (
            <div
              key={index}
              className={cn(
                'px-3 py-2 rounded-lg border text-sm transition-all',
                isActive 
                  ? 'border-primary bg-primary/5 text-primary font-medium border-2' 
                  : 'border-border bg-muted/50 text-muted-foreground'
              )}
            >
              <span className="font-medium">
                {tier.minQuantity}
                {tier.maxQuantity ? `-${tier.maxQuantity}` : '+'} {unit}
              </span>
              <span className={cn('ml-2', isActive ? 'font-bold' : '')}>
                ${tier.pricePerUnit.toFixed(2)}/{unit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface PricingDisplayProps {
  currentPrice: number;
  originalPrice?: number;
  unit: string;
  quantity: number;
  className?: string;
}

export function PricingDisplay({ currentPrice, originalPrice, unit, quantity, className }: PricingDisplayProps) {
  const totalPrice = currentPrice * quantity;
  const savings = originalPrice ? (originalPrice - currentPrice) * quantity : 0;

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-primary">${currentPrice.toFixed(2)}</span>
        <span className="text-muted-foreground">/{unit}</span>
        {originalPrice && originalPrice > currentPrice && (
          <span className="text-sm text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
        )}
      </div>
      <div className="text-sm text-muted-foreground">
        Total: <span className="font-semibold text-foreground">${totalPrice.toFixed(2)}</span>
        {savings > 0 && (
          <span className="ml-2 text-secondary font-medium">
            Save ${savings.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}

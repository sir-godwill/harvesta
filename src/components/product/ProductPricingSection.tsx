import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, TrendingDown, Globe, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuantityInput } from '@/components/marketplace/QuantityInput';
import { calculateTieredPricing, type ProductPricing } from '@/lib/productApi';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ProductPricingSectionProps {
  pricing: ProductPricing;
  unit: string;
  moq: number;
  maxOrderQuantity: number | null;
  isB2B?: boolean;
  stockAvailable: number;
  onQuantityChange: (quantity: number) => void;
  quantity: number;
  formatPrice: (price: number) => string;
}

export function ProductPricingSection({
  pricing,
  unit,
  moq,
  maxOrderQuantity,
  isB2B = false,
  stockAvailable,
  onQuantityChange,
  quantity,
  formatPrice,
}: ProductPricingSectionProps) {
  const [showInternational, setShowInternational] = useState(false);
  
  const { applicableTier, totalPrice, unitPrice } = calculateTieredPricing(quantity, pricing.tiers);
  
  const basePrice = pricing.tiers[0]?.pricePerUnit || 0;
  const savings = basePrice > unitPrice ? (basePrice - unitPrice) * quantity : 0;
  const savingsPercentage = basePrice > unitPrice 
    ? Math.round(((basePrice - unitPrice) / basePrice) * 100) 
    : 0;

  // Find the best value tier (lowest price per unit)
  const bestValueTier = pricing.tiers.reduce((best, tier) => 
    tier.pricePerUnit < best.pricePerUnit ? tier : best
  , pricing.tiers[0]);

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl p-4 lg:p-6 space-y-4">
      {/* Current Price */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Price:</span>
          <span className="text-3xl font-bold text-primary">
            {formatPrice(unitPrice)}
          </span>
          <span className="text-muted-foreground">/ {unit}</span>
          {savingsPercentage > 0 && (
            <Badge className="bg-green-600 text-white text-xs gap-1">
              <TrendingDown className="w-3 h-3" />
              {savingsPercentage}% OFF
            </Badge>
          )}
        </div>
        
        {pricing.internationalPrice && showInternational && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="w-4 h-4" />
            <span>International: ${pricing.internationalPrice.toFixed(2)} USD</span>
          </div>
        )}
      </div>

      {/* MOQ Notice */}
      <div className="flex items-center gap-2 text-sm">
        <AlertCircle className="w-4 h-4 text-amber-600" />
        <span className="text-amber-700 dark:text-amber-400">
          Minimum Order: <strong>{moq} {unit}</strong>
        </span>
      </div>

      <Separator />

      {/* Pricing Tiers - 1688 Style */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-foreground">Bulk Pricing</h4>
          {isB2B && (
            <Badge variant="outline" className="text-xs">B2B Rates</Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {pricing.tiers.map((tier, index) => {
            const isActive = tier === applicableTier;
            const isBestValue = tier === bestValueTier;
            
            return (
              <Tooltip key={tier.id || index}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'relative bg-white dark:bg-card rounded-lg p-3 text-center border-2 transition-all cursor-pointer',
                      isActive 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-transparent hover:border-muted-foreground/30'
                    )}
                    onClick={() => {
                      if (tier.minQuantity > quantity) {
                        onQuantityChange(tier.minQuantity);
                      }
                    }}
                  >
                    {isBestValue && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <Badge className="bg-green-600 text-white text-[10px] px-1.5">
                          Best Value
                        </Badge>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mb-1">
                      {tier.minQuantity}{tier.maxQuantity ? `-${tier.maxQuantity}` : '+'} {unit}
                    </p>
                    <p className={cn(
                      'font-bold',
                      isActive ? 'text-primary' : 'text-foreground'
                    )}>
                      {formatPrice(tier.pricePerUnit)}
                    </p>
                    {tier.discountPercentage && tier.discountPercentage > 0 && (
                      <p className="text-xs text-green-600">
                        -{tier.discountPercentage}%
                      </p>
                    )}
                    {isActive && (
                      <Check className="absolute top-1 right-1 w-4 h-4 text-primary" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Order {tier.minQuantity}+ {unit} for this price</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Quantity Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-foreground">Quantity</h4>
          <span className="text-sm text-muted-foreground">
            {stockAvailable.toLocaleString()} {unit} available
          </span>
        </div>
        
        <QuantityInput
          value={quantity}
          onChange={onQuantityChange}
          min={1}
          max={maxOrderQuantity || stockAvailable}
          moq={moq}
          unit={unit}
          step={moq > 10 ? 10 : 1}
        />
      </div>

      <Separator />

      {/* Order Summary */}
      <div className="bg-white dark:bg-card rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Unit Price:</span>
          <span className="font-medium">{formatPrice(unitPrice)} / {unit}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Quantity:</span>
          <span className="font-medium">{quantity} {unit}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Savings:</span>
            <span className="font-medium">-{formatPrice(savings)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between">
          <span className="font-semibold text-foreground">Total:</span>
          <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}

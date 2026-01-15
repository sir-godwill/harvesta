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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            Bulk Pricing Breakdown
            {isB2B && (
              <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">B2B Rates</Badge>
            )}
          </h4>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-green-600" />
            Buy more, save more
          </span>
        </div>

        <div className="overflow-hidden rounded-lg border border-primary/10 bg-white dark:bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left border-b">
                <th className="px-4 py-2 font-medium">Quantity ({unit})</th>
                <th className="px-4 py-2 font-medium text-right">Unit Price</th>
                <th className="px-4 py-2 font-medium text-right">Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {pricing.tiers.map((tier, index) => {
                const isActive = tier === applicableTier;
                const savingsPct = basePrice > tier.pricePerUnit
                  ? Math.round(((basePrice - tier.pricePerUnit) / basePrice) * 100)
                  : 0;

                return (
                  <tr
                    key={tier.id || index}
                    className={cn(
                      'transition-colors cursor-pointer',
                      isActive ? 'bg-primary/5' : 'hover:bg-muted/30'
                    )}
                    onClick={() => {
                      if (tier.minQuantity > quantity) {
                        onQuantityChange(tier.minQuantity);
                      }
                    }}
                  >
                    <td className="px-4 py-3 font-medium">
                      {tier.minQuantity}{tier.maxQuantity ? `-${tier.maxQuantity}` : '+'}
                    </td>
                    <td className={cn(
                      'px-4 py-3 text-right font-bold',
                      isActive ? 'text-primary' : 'text-foreground'
                    )}>
                      {formatPrice(tier.pricePerUnit)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {savingsPct > 0 ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                          -{savingsPct}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">Base</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  AlertCircle,
  TrendingDown,
  Info,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface PricingTier {
  id: string;
  minQuantity: number;
  maxQuantity: number | null;
  pricePerUnit: number;
  discountPercent?: number;
}

interface TieredPricingEditorProps {
  tiers: PricingTier[];
  onChange: (tiers: PricingTier[]) => void;
  unit: string;
  currency?: string;
  enableTiered: boolean;
  onEnableChange: (enabled: boolean) => void;
}

const currencies = [
  { code: 'XAF', symbol: 'XAF', name: 'CFA Franc' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
];

export function TieredPricingEditor({
  tiers,
  onChange,
  unit,
  currency = 'XAF',
  enableTiered,
  onEnableChange,
}: TieredPricingEditorProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  const currencySymbol = currencies.find(c => c.code === selectedCurrency)?.symbol || selectedCurrency;

  const addTier = () => {
    const lastTier = tiers[tiers.length - 1];
    const newMinQuantity = lastTier ? (lastTier.maxQuantity || lastTier.minQuantity) + 1 : 1;
    
    const newTier: PricingTier = {
      id: `tier_${Date.now()}`,
      minQuantity: newMinQuantity,
      maxQuantity: null,
      pricePerUnit: lastTier ? Math.round(lastTier.pricePerUnit * 0.95) : 0,
    };
    
    onChange([...tiers, newTier]);
  };

  const updateTier = (id: string, updates: Partial<PricingTier>) => {
    const newTiers = tiers.map(tier => {
      if (tier.id === id) {
        const updated = { ...tier, ...updates };
        // Calculate discount percentage if we have a base price
        if (tiers[0] && updates.pricePerUnit !== undefined) {
          const basePrice = tiers[0].pricePerUnit;
          if (basePrice > 0 && updated.pricePerUnit > 0) {
            updated.discountPercent = Math.round((1 - updated.pricePerUnit / basePrice) * 100);
          }
        }
        return updated;
      }
      return tier;
    });
    onChange(newTiers);
  };

  const removeTier = (id: string) => {
    const newTiers = tiers.filter(tier => tier.id !== id);
    onChange(newTiers);
  };

  const autoGenerateTiers = () => {
    if (tiers.length === 0 || tiers[0].pricePerUnit === 0) return;
    
    const basePrice = tiers[0].pricePerUnit;
    const defaultTiers: PricingTier[] = [
      { id: 'tier_1', minQuantity: 1, maxQuantity: 99, pricePerUnit: basePrice, discountPercent: 0 },
      { id: 'tier_2', minQuantity: 100, maxQuantity: 499, pricePerUnit: Math.round(basePrice * 0.95), discountPercent: 5 },
      { id: 'tier_3', minQuantity: 500, maxQuantity: 999, pricePerUnit: Math.round(basePrice * 0.90), discountPercent: 10 },
      { id: 'tier_4', minQuantity: 1000, maxQuantity: null, pricePerUnit: Math.round(basePrice * 0.85), discountPercent: 15 },
    ];
    onChange(defaultTiers);
  };

  const hasValidation = tiers.some((tier, index) => {
    if (index === 0) return false;
    const prevTier = tiers[index - 1];
    return prevTier.maxQuantity && tier.minQuantity <= prevTier.maxQuantity;
  });

  return (
    <div className="space-y-4">
      {/* Enable Toggle */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Bulk Pricing Tiers</p>
            <p className="text-sm text-muted-foreground">
              Offer discounts for larger orders
            </p>
          </div>
        </div>
        <Switch checked={enableTiered} onCheckedChange={onEnableChange} />
      </div>

      <AnimatePresence>
        {enableTiered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label>Currency:</Label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(c => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.symbol} {c.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={autoGenerateTiers}
                      disabled={!tiers[0]?.pricePerUnit}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Auto-Generate
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Generate standard 5%, 10%, 15% discount tiers</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Tiers Table */}
            <div className="border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 border-b text-sm font-medium">
                <div className="col-span-3">Min Quantity</div>
                <div className="col-span-3">Max Quantity</div>
                <div className="col-span-3">Price / {unit}</div>
                <div className="col-span-2">Discount</div>
                <div className="col-span-1"></div>
              </div>

              {/* Tier Rows */}
              <AnimatePresence mode="popLayout">
                {tiers.map((tier, index) => (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={cn(
                      "grid grid-cols-12 gap-2 p-3 items-center",
                      index % 2 === 0 ? "bg-background" : "bg-muted/20",
                      index === tiers.length - 1 && "border-b-0"
                    )}
                  >
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min={1}
                        value={tier.minQuantity}
                        onChange={(e) => updateTier(tier.id, { minQuantity: parseInt(e.target.value) || 0 })}
                        className="h-9"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min={tier.minQuantity}
                        value={tier.maxQuantity || ''}
                        placeholder="No limit"
                        onChange={(e) => updateTier(tier.id, { 
                          maxQuantity: e.target.value ? parseInt(e.target.value) : null 
                        })}
                        className="h-9"
                      />
                    </div>
                    <div className="col-span-3 relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs pointer-events-none">
                        {currencySymbol}
                      </span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={tier.pricePerUnit || ''}
                        placeholder="0"
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          updateTier(tier.id, { pricePerUnit: value ? parseInt(value) : 0 });
                        }}
                        className="h-9 pl-10"
                      />
                    </div>
                    <div className="col-span-2">
                      {tier.discountPercent && tier.discountPercent > 0 ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          -{tier.discountPercent}%
                        </Badge>
                      ) : index === 0 ? (
                        <Badge variant="outline">Base</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </div>
                    <div className="col-span-1">
                      {tiers.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => removeTier(tier.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Add Tier Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={addTier}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Pricing Tier
            </Button>

            {/* Validation Warning */}
            {hasValidation && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Quantity ranges overlap. Please fix to avoid pricing conflicts.</span>
              </div>
            )}

            {/* Info */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">How Tiered Pricing Works:</p>
                <ul className="list-disc list-inside space-y-0.5 text-xs">
                  <li>Buyers see all tiers when viewing your product</li>
                  <li>The applicable price is automatically applied at checkout</li>
                  <li>Higher quantities = better price per unit for buyers</li>
                  <li>Encourages bulk orders and larger transactions</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

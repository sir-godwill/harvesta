import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Info, TrendingDown } from "lucide-react";
import { formatXAF } from "@/lib/currency";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface TieredPrice {
  id: string;
  minQuantity: number;
  maxQuantity: number | null;
  pricePerUnit: number;
}

interface TieredPricingEditorProps {
  tiers: TieredPrice[];
  onChange: (tiers: TieredPrice[]) => void;
  basePrice: number;
  unit: string;
}

export function TieredPricingEditor({ tiers, onChange, basePrice, unit }: TieredPricingEditorProps) {
  const addTier = () => {
    const lastTier = tiers[tiers.length - 1];
    const newMin = lastTier ? (lastTier.maxQuantity || lastTier.minQuantity) + 1 : 1;
    const newTier: TieredPrice = {
      id: `tier-${Date.now()}`,
      minQuantity: newMin,
      maxQuantity: null,
      pricePerUnit: basePrice * 0.95, // Default 5% discount
    };
    onChange([...tiers, newTier]);
  };

  const updateTier = (id: string, field: keyof TieredPrice, value: number | null) => {
    onChange(tiers.map(tier => 
      tier.id === id ? { ...tier, [field]: value } : tier
    ));
  };

  const removeTier = (id: string) => {
    onChange(tiers.filter(tier => tier.id !== id));
  };

  const getDiscountPercentage = (tierPrice: number) => {
    if (basePrice <= 0) return 0;
    return Math.round(((basePrice - tierPrice) / basePrice) * 100);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-primary" />
          <Label className="text-sm font-medium">Wholesale Price Tiers</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Set different prices for bulk orders. Buyers ordering more get better prices. Great for wholesale and B2B sales.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addTier}
          className="gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Tier
        </Button>
      </div>

      {/* Base Price Reference */}
      <div className="bg-muted/50 rounded-lg p-3 text-sm">
        <span className="text-muted-foreground">Base price: </span>
        <span className="font-semibold">{formatXAF(basePrice)}</span>
        <span className="text-muted-foreground"> per {unit}</span>
      </div>

      {/* Tiers */}
      <AnimatePresence mode="popLayout">
        {tiers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 text-muted-foreground text-sm"
          >
            No price tiers yet. Add tiers to offer bulk discounts.
          </motion.div>
        ) : (
          <div className="space-y-3">
            {tiers.map((tier, index) => {
              const discount = getDiscountPercentage(tier.pricePerUnit);
              return (
                <motion.div
                  key={tier.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-end gap-3 p-4 bg-card border rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        From ({unit})
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        value={tier.minQuantity}
                        onChange={(e) => updateTier(tier.id, 'minQuantity', parseInt(e.target.value) || 1)}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        To ({unit})
                      </Label>
                      <Input
                        type="number"
                        min={tier.minQuantity}
                        value={tier.maxQuantity || ''}
                        onChange={(e) => updateTier(tier.id, 'maxQuantity', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="∞"
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Price/{unit} (XAF)
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          min={0}
                          value={tier.pricePerUnit}
                          onChange={(e) => updateTier(tier.id, 'pricePerUnit', parseInt(e.target.value) || 0)}
                          className="h-9 pr-14"
                        />
                        {discount > 0 && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-success">
                            -{discount}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => removeTier(tier.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Preview */}
      {tiers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20"
        >
          <p className="text-sm font-medium mb-2 text-primary">Buyer will see:</p>
          <div className="space-y-1">
            {tiers.map((tier, index) => (
              <div key={tier.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {tier.minQuantity} - {tier.maxQuantity || '∞'} {unit}
                </span>
                <span className="font-medium">
                  {formatXAF(tier.pricePerUnit)}/{unit}
                  {getDiscountPercentage(tier.pricePerUnit) > 0 && (
                    <span className="text-success ml-2">
                      (Save {getDiscountPercentage(tier.pricePerUnit)}%)
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

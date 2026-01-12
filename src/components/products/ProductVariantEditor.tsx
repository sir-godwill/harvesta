import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Package, Copy, ChevronDown, ChevronUp, Info } from "lucide-react";
import { formatXAF } from "@/lib/currency";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface ProductVariant {
  id: string;
  name: string;
  grade: string;
  packaging: string;
  price: number;
  stock: number;
  sku?: string;
  isActive: boolean;
}

const gradeOptions = [
  { value: 'premium', label: 'Premium Grade' },
  { value: 'grade_a', label: 'Grade A' },
  { value: 'grade_b', label: 'Grade B' },
  { value: 'standard', label: 'Standard' },
  { value: 'export', label: 'Export Quality' },
];

const packagingOptions = [
  { value: '1kg', label: '1 kg bag' },
  { value: '5kg', label: '5 kg bag' },
  { value: '10kg', label: '10 kg bag' },
  { value: '25kg', label: '25 kg bag' },
  { value: '50kg', label: '50 kg bag' },
  { value: 'crate', label: 'Crate (20kg)' },
  { value: 'jerrycan_5l', label: '5L Jerrycan' },
  { value: 'jerrycan_20l', label: '20L Jerrycan' },
  { value: 'custom', label: 'Custom' },
];

interface ProductVariantEditorProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  basePrice: number;
  productName: string;
}

export function ProductVariantEditor({ variants, onChange, basePrice, productName }: ProductVariantEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: `var-${Date.now()}`,
      name: `${productName} - Variant ${variants.length + 1}`,
      grade: 'grade_a',
      packaging: '25kg',
      price: basePrice,
      stock: 0,
      isActive: true,
    };
    onChange([...variants, newVariant]);
    setExpandedId(newVariant.id);
  };

  const duplicateVariant = (variant: ProductVariant) => {
    const newVariant: ProductVariant = {
      ...variant,
      id: `var-${Date.now()}`,
      name: `${variant.name} (Copy)`,
    };
    onChange([...variants, newVariant]);
    setExpandedId(newVariant.id);
  };

  const updateVariant = (id: string, updates: Partial<ProductVariant>) => {
    onChange(variants.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const removeVariant = (id: string) => {
    onChange(variants.filter(v => v.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const toggleActive = (id: string) => {
    onChange(variants.map(v => v.id === id ? { ...v, isActive: !v.isActive } : v));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Product Variants</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Different grades, packaging, or sizes of your product
          </p>
        </div>
        <Button 
          type="button" 
          variant="default" 
          size="sm" 
          onClick={addVariant}
          className="gap-1"
        >
          <Plus className="w-4 h-4" />
          Create Variant
        </Button>
      </div>

      {/* Variants List */}
      <AnimatePresence mode="popLayout">
        {variants.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 border-2 border-dashed rounded-lg bg-muted/20"
          >
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No variants yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              Add variants if you sell this product in different grades, packaging sizes, or qualities
            </p>
            <Button 
              type="button" 
              variant="default" 
              size="sm" 
              onClick={addVariant}
              className="mt-4 gap-1"
            >
              <Plus className="w-4 h-4" />
              Create First Variant
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {variants.map((variant) => {
              const isExpanded = expandedId === variant.id;
              const gradeLabel = gradeOptions.find(g => g.value === variant.grade)?.label || variant.grade;
              const packagingLabel = packagingOptions.find(p => p.value === variant.packaging)?.label || variant.packaging;

              return (
                <motion.div
                  key={variant.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={cn(
                    "border rounded-lg overflow-hidden transition-colors",
                    !variant.isActive && "opacity-60 bg-muted/30"
                  )}
                >
                  <Collapsible open={isExpanded} onOpenChange={() => setExpandedId(isExpanded ? null : variant.id)}>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            variant.isActive ? "bg-primary/10" : "bg-muted"
                          )}>
                            <Package className={cn(
                              "w-5 h-5",
                              variant.isActive ? "text-primary" : "text-muted-foreground"
                            )} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{variant.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs py-0">
                                {gradeLabel}
                              </Badge>
                              <Badge variant="outline" className="text-xs py-0">
                                {packagingLabel}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-sm">{formatXAF(variant.price)}</p>
                            <p className="text-xs text-muted-foreground">{variant.stock} in stock</p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-4 pb-4 pt-2 border-t bg-muted/20">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="col-span-2">
                            <Label className="text-xs text-muted-foreground">Variant Name</Label>
                            <Input
                              value={variant.name}
                              onChange={(e) => updateVariant(variant.id, { name: e.target.value })}
                              className="mt-1 h-9"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">SKU (Optional)</Label>
                            <Input
                              value={variant.sku || ''}
                              onChange={(e) => updateVariant(variant.id, { sku: e.target.value })}
                              placeholder="e.g., COF-A-25KG"
                              className="mt-1 h-9"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Grade</Label>
                            <Select 
                              value={variant.grade} 
                              onValueChange={(v) => updateVariant(variant.id, { grade: v })}
                            >
                              <SelectTrigger className="mt-1 h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {gradeOptions.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Packaging</Label>
                            <Select 
                              value={variant.packaging} 
                              onValueChange={(v) => updateVariant(variant.id, { packaging: v })}
                            >
                              <SelectTrigger className="mt-1 h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {packagingOptions.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Price (XAF)</Label>
                            <Input
                              type="number"
                              min={0}
                              value={variant.price}
                              onChange={(e) => updateVariant(variant.id, { price: parseInt(e.target.value) || 0 })}
                              className="mt-1 h-9"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Stock Quantity</Label>
                            <Input
                              type="number"
                              min={0}
                              value={variant.stock}
                              onChange={(e) => updateVariant(variant.id, { stock: parseInt(e.target.value) || 0 })}
                              className="mt-1 h-9"
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => duplicateVariant(variant)}
                              className="gap-1 text-muted-foreground"
                            >
                              <Copy className="w-4 h-4" />
                              Duplicate
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleActive(variant.id)}
                              className={cn(
                                "gap-1",
                                variant.isActive ? "text-muted-foreground" : "text-primary"
                              )}
                            >
                              {variant.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVariant(variant.id)}
                            className="gap-1 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

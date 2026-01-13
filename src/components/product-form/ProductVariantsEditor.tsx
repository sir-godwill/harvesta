import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Package,
  Layers,
  Star,
  Copy,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  grade?: string;
  quality?: string;
  packaging?: string;
  weight?: number;
  weightUnit?: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isDefault: boolean;
  isActive: boolean;
}

interface ProductVariantsEditorProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  enableVariants: boolean;
  onEnableChange: (enabled: boolean) => void;
}

const gradeOptions = [
  'Grade A (Premium)',
  'Grade B (Standard)',
  'Grade C (Economy)',
  'Export Grade',
  'Organic Certified',
  'Fair Trade',
];

const qualityOptions = [
  'Extra Fresh',
  'Fresh',
  'Processed',
  'Dried',
  'Frozen',
  'Canned',
];

const packagingOptions = [
  'Loose (Bulk)',
  'Bag (Jute)',
  'Bag (Plastic)',
  'Crate (Wooden)',
  'Crate (Plastic)',
  'Carton (Box)',
  'Vacuum Sealed',
  'Retail Pack',
];

const weightUnits = ['kg', 'g', 'ton', 'lb', 'oz'];

export function ProductVariantsEditor({
  variants,
  onChange,
  enableVariants,
  onEnableChange,
}: ProductVariantsEditorProps) {
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedVariants);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedVariants(newExpanded);
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: `var_${Date.now()}`,
      name: `Variant ${variants.length + 1}`,
      sku: '',
      grade: '',
      quality: '',
      packaging: '',
      weight: undefined,
      weightUnit: 'kg',
      stockQuantity: 0,
      lowStockThreshold: 10,
      isDefault: variants.length === 0,
      isActive: true,
    };
    
    onChange([...variants, newVariant]);
    setExpandedVariants(new Set([...expandedVariants, newVariant.id]));
  };

  const updateVariant = (id: string, updates: Partial<ProductVariant>) => {
    const newVariants = variants.map(v => {
      if (v.id === id) {
        const updated = { ...v, ...updates };
        // If setting this as default, unset others
        if (updates.isDefault) {
          return updated;
        }
        return updated;
      }
      // Unset default on others if this one is being set as default
      if (updates.isDefault && v.isDefault) {
        return { ...v, isDefault: false };
      }
      return v;
    });
    onChange(newVariants);
  };

  const removeVariant = (id: string) => {
    const newVariants = variants.filter(v => v.id !== id);
    // If we removed the default, make the first one default
    if (newVariants.length > 0 && !newVariants.some(v => v.isDefault)) {
      newVariants[0].isDefault = true;
    }
    onChange(newVariants);
  };

  const duplicateVariant = (variant: ProductVariant) => {
    const newVariant: ProductVariant = {
      ...variant,
      id: `var_${Date.now()}`,
      name: `${variant.name} (Copy)`,
      sku: '',
      isDefault: false,
    };
    onChange([...variants, newVariant]);
    setExpandedVariants(new Set([...expandedVariants, newVariant.id]));
  };

  return (
    <div className="space-y-4">
      {/* Enable Toggle */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Product Variants</p>
            <p className="text-sm text-muted-foreground">
              Different grades, sizes, or packaging options
            </p>
          </div>
        </div>
        <Switch checked={enableVariants} onCheckedChange={onEnableChange} />
      </div>

      <AnimatePresence>
        {enableVariants && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Variants List */}
            <AnimatePresence mode="popLayout">
              {variants.map((variant, index) => (
                <motion.div
                  key={variant.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <Card className={cn(
                    "border transition-shadow",
                    variant.isDefault && "border-primary shadow-md"
                  )}>
                    <Collapsible
                      open={expandedVariants.has(variant.id)}
                      onOpenChange={() => toggleExpand(variant.id)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                {expandedVariants.has(variant.id) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            <div className="flex items-center gap-2">
                              <Package className="h-5 w-5 text-muted-foreground" />
                              <Input
                                value={variant.name}
                                onChange={(e) => updateVariant(variant.id, { name: e.target.value })}
                                className="h-8 font-medium border-0 bg-transparent p-0 focus-visible:ring-0"
                                placeholder="Variant name"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {variant.isDefault && (
                              <Badge className="bg-primary">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Default
                              </Badge>
                            )}
                            {!variant.isActive && (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => duplicateVariant(variant)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            {variants.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                                onClick={() => removeVariant(variant.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CollapsibleContent>
                        <CardContent className="p-4 pt-0 space-y-4">
                          {/* Basic Info Row */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>SKU (Stock Code)</Label>
                              <Input
                                value={variant.sku}
                                onChange={(e) => updateVariant(variant.id, { sku: e.target.value })}
                                placeholder="e.g., COC-GA-001"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Grade / Quality Level</Label>
                              <Select
                                value={variant.grade}
                                onValueChange={(value) => updateVariant(variant.id, { grade: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                                <SelectContent>
                                  {gradeOptions.map((grade) => (
                                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Product Quality</Label>
                              <Select
                                value={variant.quality}
                                onValueChange={(value) => updateVariant(variant.id, { quality: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select quality" />
                                </SelectTrigger>
                                <SelectContent>
                                  {qualityOptions.map((quality) => (
                                    <SelectItem key={quality} value={quality}>{quality}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Packaging & Weight Row */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Packaging Type</Label>
                              <Select
                                value={variant.packaging}
                                onValueChange={(value) => updateVariant(variant.id, { packaging: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select packaging" />
                                </SelectTrigger>
                                <SelectContent>
                                  {packagingOptions.map((pkg) => (
                                    <SelectItem key={pkg} value={pkg}>{pkg}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Weight per Unit</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  value={variant.weight || ''}
                                  onChange={(e) => updateVariant(variant.id, { 
                                    weight: e.target.value ? parseFloat(e.target.value) : undefined 
                                  })}
                                  placeholder="0"
                                  className="flex-1"
                                />
                                <Select
                                  value={variant.weightUnit || 'kg'}
                                  onValueChange={(value) => updateVariant(variant.id, { weightUnit: value })}
                                >
                                  <SelectTrigger className="w-20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {weightUnits.map((unit) => (
                                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Stock Row */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Stock Quantity</Label>
                              <Input
                                type="number"
                                min={0}
                                value={variant.stockQuantity}
                                onChange={(e) => updateVariant(variant.id, { 
                                  stockQuantity: parseInt(e.target.value) || 0 
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Low Stock Alert</Label>
                              <Input
                                type="number"
                                min={0}
                                value={variant.lowStockThreshold}
                                onChange={(e) => updateVariant(variant.id, { 
                                  lowStockThreshold: parseInt(e.target.value) || 0 
                                })}
                              />
                            </div>
                            <div className="space-y-2 flex items-end gap-4">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={variant.isActive}
                                  onCheckedChange={(checked) => updateVariant(variant.id, { isActive: checked })}
                                />
                                <Label className="text-sm">Active</Label>
                              </div>
                              {!variant.isDefault && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateVariant(variant.id, { isDefault: true })}
                                >
                                  <Star className="h-3 w-3 mr-1" />
                                  Set as Default
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add Variant Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={addVariant}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product Variant
            </Button>

            {/* Help Text */}
            <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              <p className="font-medium mb-1">When to use variants:</p>
              <ul className="list-disc list-inside space-y-0.5 text-xs">
                <li>Different grades (Grade A, Grade B, Export)</li>
                <li>Different packaging sizes (1kg, 10kg, 50kg bags)</li>
                <li>Different processing states (Fresh, Dried, Frozen)</li>
                <li>Each variant can have its own stock and pricing</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

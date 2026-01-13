import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  ShoppingCart,
  Truck,
  Users,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface PurchaseCondition {
  id: string;
  type: 'quantity' | 'delivery' | 'buyer' | 'handling' | 'payment' | 'custom';
  title: string;
  description: string;
  isRequired: boolean;
  isActive: boolean;
}

interface PurchaseConditionsEditorProps {
  conditions: PurchaseCondition[];
  onChange: (conditions: PurchaseCondition[]) => void;
  enableConditions: boolean;
  onEnableChange: (enabled: boolean) => void;
}

const conditionTypes = [
  { 
    value: 'quantity', 
    label: 'Order Quantity', 
    icon: ShoppingCart,
    description: 'Minimum or maximum order requirements',
    example: 'Minimum order: 50kg. Maximum per order: 1 ton.',
  },
  { 
    value: 'delivery', 
    label: 'Delivery Terms', 
    icon: Truck,
    description: 'Shipping and delivery conditions',
    example: 'Available for delivery within Cameroon only. International shipping available for orders over 500kg.',
  },
  { 
    value: 'buyer', 
    label: 'Buyer Requirements', 
    icon: Users,
    description: 'Who can purchase this product',
    example: 'Wholesale buyers only. Business registration required.',
  },
  { 
    value: 'handling', 
    label: 'Handling Instructions', 
    icon: AlertTriangle,
    description: 'Special handling or storage requirements',
    example: 'Refrigerated transport required. Handle with care - fragile packaging.',
  },
  { 
    value: 'payment', 
    label: 'Payment Terms', 
    icon: FileText,
    description: 'Payment conditions and terms',
    example: '50% deposit required. Balance due before shipping.',
  },
  { 
    value: 'custom', 
    label: 'Custom Condition', 
    icon: FileText,
    description: 'Any other purchase condition',
    example: 'Add your own custom terms and conditions.',
  },
];

export function PurchaseConditionsEditor({
  conditions,
  onChange,
  enableConditions,
  onEnableChange,
}: PurchaseConditionsEditorProps) {
  const [expandedConditions, setExpandedConditions] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedConditions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedConditions(newExpanded);
  };

  const addCondition = (type: PurchaseCondition['type']) => {
    const typeInfo = conditionTypes.find(t => t.value === type);
    const newCondition: PurchaseCondition = {
      id: `cond_${Date.now()}`,
      type,
      title: typeInfo?.label || 'Custom Condition',
      description: '',
      isRequired: false,
      isActive: true,
    };
    
    onChange([...conditions, newCondition]);
    setExpandedConditions(new Set([...expandedConditions, newCondition.id]));
  };

  const updateCondition = (id: string, updates: Partial<PurchaseCondition>) => {
    const newConditions = conditions.map(c => 
      c.id === id ? { ...c, ...updates } : c
    );
    onChange(newConditions);
  };

  const removeCondition = (id: string) => {
    onChange(conditions.filter(c => c.id !== id));
  };

  const getConditionIcon = (type: PurchaseCondition['type']) => {
    return conditionTypes.find(t => t.value === type)?.icon || FileText;
  };

  return (
    <div className="space-y-4">
      {/* Enable Toggle */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Purchase Conditions</p>
            <p className="text-sm text-muted-foreground">
              Set rules and requirements for buying this product
            </p>
          </div>
        </div>
        <Switch checked={enableConditions} onCheckedChange={onEnableChange} />
      </div>

      <AnimatePresence>
        {enableConditions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Condition Type Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {conditionTypes.map((type) => {
                const Icon = type.icon;
                const isAdded = conditions.some(c => c.type === type.value);
                return (
                  <Button
                    key={type.value}
                    type="button"
                    variant={isAdded ? "secondary" : "outline"}
                    className={cn(
                      "h-auto py-3 flex flex-col items-center gap-1 text-left",
                      isAdded && "border-primary"
                    )}
                    onClick={() => addCondition(type.value as PurchaseCondition['type'])}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{type.label}</span>
                  </Button>
                );
              })}
            </div>

            {/* Conditions List */}
            <AnimatePresence mode="popLayout">
              {conditions.map((condition) => {
                const Icon = getConditionIcon(condition.type);
                const typeInfo = conditionTypes.find(t => t.value === condition.type);
                
                return (
                  <motion.div
                    key={condition.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <Card className={cn(
                      "border transition-all",
                      !condition.isActive && "opacity-60"
                    )}>
                      <Collapsible
                        open={expandedConditions.has(condition.id)}
                        onOpenChange={() => toggleExpand(condition.id)}
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  {expandedConditions.has(condition.id) ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                              <div className="flex items-center gap-2">
                                <Icon className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{condition.title}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {condition.isRequired && (
                                <Badge variant="destructive" className="text-xs">Required</Badge>
                              )}
                              {!condition.isActive && (
                                <Badge variant="secondary" className="text-xs">Inactive</Badge>
                              )}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                                onClick={() => removeCondition(condition.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        <CollapsibleContent>
                          <CardContent className="p-4 pt-0 space-y-4">
                            <div className="space-y-2">
                              <Label>Condition Title</Label>
                              <Input
                                value={condition.title}
                                onChange={(e) => updateCondition(condition.id, { title: e.target.value })}
                                placeholder="Enter a clear title"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                value={condition.description}
                                onChange={(e) => updateCondition(condition.id, { description: e.target.value })}
                                placeholder={typeInfo?.example || 'Describe this condition...'}
                                rows={3}
                              />
                              <p className="text-xs text-muted-foreground">
                                Write in simple, clear language that buyers can understand easily.
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={condition.isActive}
                                  onCheckedChange={(checked) => updateCondition(condition.id, { isActive: checked })}
                                />
                                <Label className="text-sm">Active</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={condition.isRequired}
                                  onCheckedChange={(checked) => updateCondition(condition.id, { isRequired: checked })}
                                />
                                <Label className="text-sm">Required to accept</Label>
                              </div>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {conditions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No conditions added yet</p>
                <p className="text-sm">Click a condition type above to add one</p>
              </div>
            )}

            {/* Help Text */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Purchase Conditions Tips:</p>
                <ul className="list-disc list-inside space-y-0.5 text-xs">
                  <li>Be clear and specific about requirements</li>
                  <li>Required conditions must be accepted by buyers before purchase</li>
                  <li>Inactive conditions are saved but not shown to buyers</li>
                  <li>Use simple language suitable for all literacy levels</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

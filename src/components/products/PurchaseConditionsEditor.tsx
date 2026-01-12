import { motion, AnimatePresence } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, ShoppingBag, Truck, CreditCard, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface PurchaseConditions {
  minQuantity: number | null;
  maxQuantity: number | null;
  allowNegotiation: boolean;
  requiresDeposit: boolean;
  depositPercentage: number;
  paymentTerms: 'full_upfront' | 'partial' | 'on_delivery' | 'net_30';
  deliveryRestrictions: string;
  specialInstructions: string;
  buyerTypeRestrictions: ('retail' | 'wholesale' | 'exporter' | 'all')[];
}

interface PurchaseConditionsEditorProps {
  conditions: PurchaseConditions;
  onChange: (conditions: PurchaseConditions) => void;
  unit: string;
}

const paymentTermsOptions = [
  { value: 'full_upfront', label: 'Full Payment Upfront', description: 'Buyer pays 100% before shipment' },
  { value: 'partial', label: 'Partial Payment', description: 'Buyer pays deposit, rest on delivery' },
  { value: 'on_delivery', label: 'Cash on Delivery', description: 'Buyer pays when goods arrive' },
  { value: 'net_30', label: 'Net 30 Days', description: 'For verified buyers, pay within 30 days' },
];

export function PurchaseConditionsEditor({ conditions, onChange, unit }: PurchaseConditionsEditorProps) {
  const update = (field: keyof PurchaseConditions, value: any) => {
    onChange({ ...conditions, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Order Quantity Limits */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-primary" />
          <Label className="text-sm font-medium">Order Quantity Limits</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Set minimum and maximum order quantities</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">Minimum Order ({unit})</Label>
            <Input
              type="number"
              min={0}
              value={conditions.minQuantity || ''}
              onChange={(e) => update('minQuantity', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="No minimum"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Maximum Order ({unit})</Label>
            <Input
              type="number"
              min={0}
              value={conditions.maxQuantity || ''}
              onChange={(e) => update('maxQuantity', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="No maximum"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" />
          <Label className="text-sm font-medium">Payment Terms</Label>
        </div>

        <Select 
          value={conditions.paymentTerms} 
          onValueChange={(v) => update('paymentTerms', v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {paymentTermsOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <div>
                  <span className="font-medium">{opt.label}</span>
                  <span className="text-muted-foreground text-xs ml-2">— {opt.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Deposit Settings */}
        <AnimatePresence>
          {conditions.paymentTerms === 'partial' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pl-4 border-l-2 border-primary/20"
            >
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-sm">Require Deposit</Label>
                  <p className="text-xs text-muted-foreground">Buyer pays a percentage upfront</p>
                </div>
                <Switch
                  checked={conditions.requiresDeposit}
                  onCheckedChange={(v) => update('requiresDeposit', v)}
                />
              </div>
              
              <AnimatePresence>
                {conditions.requiresDeposit && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2"
                  >
                    <Label className="text-xs text-muted-foreground">Deposit Percentage</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="number"
                        min={10}
                        max={90}
                        value={conditions.depositPercentage}
                        onChange={(e) => update('depositPercentage', parseInt(e.target.value) || 30)}
                        className="w-24"
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Negotiation */}
      <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50">
        <div>
          <Label className="text-sm">Allow Price Negotiation</Label>
          <p className="text-xs text-muted-foreground">Buyers can send you price offers</p>
        </div>
        <Switch
          checked={conditions.allowNegotiation}
          onCheckedChange={(v) => update('allowNegotiation', v)}
        />
      </div>

      {/* Delivery Restrictions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-primary" />
          <Label className="text-sm font-medium">Delivery Restrictions</Label>
        </div>
        <Textarea
          value={conditions.deliveryRestrictions}
          onChange={(e) => update('deliveryRestrictions', e.target.value)}
          placeholder="e.g., Only deliver to Littoral and Centre regions. No deliveries during rainy season to remote areas."
          className="min-h-[80px]"
        />
      </div>

      {/* Special Instructions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-primary" />
          <Label className="text-sm font-medium">Special Handling Instructions</Label>
        </div>
        <Textarea
          value={conditions.specialInstructions}
          onChange={(e) => update('specialInstructions', e.target.value)}
          placeholder="e.g., Keep in cool, dry place. Handle with care. Product is perishable and should be used within 7 days of delivery."
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
}

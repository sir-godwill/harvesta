import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, Clock, AlertCircle, Globe, Shield, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductConditions } from '@/lib/productApi';

interface ProductDeliveryConditionsProps {
  conditions: ProductConditions;
  unit: string;
  leadTimeDays: number;
  className?: string;
}

export function ProductDeliveryConditions({
  conditions,
  unit,
  leadTimeDays,
  className,
}: ProductDeliveryConditionsProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Truck className="w-5 h-5 text-primary" />
          Delivery & Purchase Conditions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Quantity Limits */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Package className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Minimum Order</p>
              <p className="font-medium text-foreground">
                {conditions.minOrderQuantity} {unit}
              </p>
            </div>
          </div>
          {conditions.maxOrderQuantity && (
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Package className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Maximum Order</p>
                <p className="font-medium text-foreground">
                  {conditions.maxOrderQuantity.toLocaleString()} {unit}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Lead Time */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground">Estimated Lead Time</p>
            <p className="font-medium text-blue-700 dark:text-blue-400">
              {leadTimeDays === 1 ? '1 business day' : `${leadTimeDays} business days`}
            </p>
            <p className="text-xs text-blue-600/70 dark:text-blue-500">
              Ships from seller's warehouse after order confirmation
            </p>
          </div>
        </div>

        {/* Export Ready Badge */}
        {conditions.exportReady && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <Globe className="w-5 h-5 text-green-600 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-green-700 dark:text-green-400">Export Ready</p>
              <p className="text-xs text-green-600 dark:text-green-500">
                This product meets international export standards
              </p>
            </div>
            <Badge className="bg-green-600 text-white text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </div>
        )}

        {/* Handling Instructions */}
        {conditions.handlingInstructions && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Handling Instructions
            </h4>
            <p className="text-sm text-muted-foreground bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
              {conditions.handlingInstructions}
            </p>
          </div>
        )}

        {/* Storage Instructions */}
        {conditions.storageInstructions && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Storage Instructions
            </h4>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              {conditions.storageInstructions}
            </p>
          </div>
        )}

        {/* Buyer Restrictions */}
        {conditions.buyerRestrictions && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
            <Shield className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                Buyer Restrictions
              </p>
              <p className="text-xs text-red-600 dark:text-red-500">
                {conditions.buyerRestrictions}
              </p>
            </div>
          </div>
        )}

        {/* Service Guarantees */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Quality Guaranteed</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Trade Assurance</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Buyer Protection</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

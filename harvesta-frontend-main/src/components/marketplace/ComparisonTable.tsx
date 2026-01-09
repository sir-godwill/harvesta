import { Star, Check, MapPin, Truck, ShoppingCart, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrustBadge } from './TrustBadge';
import type { SupplierPrice } from '@/types/marketplace';

interface ComparisonTableProps {
  suppliers: SupplierPrice[];
  onAddToCart: (supplierIndex: number) => void;
  onRequestQuote: (supplierIndex: number) => void;
  onViewSupplier: (supplierIndex: number) => void;
  className?: string;
}

export function ComparisonTable({
  suppliers,
  onAddToCart,
  onRequestQuote,
  onViewSupplier,
  className
}: ComparisonTableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-4 px-4 font-medium text-muted-foreground">Supplier</th>
            <th className="text-left py-4 px-4 font-medium text-muted-foreground">Grade</th>
            <th className="text-left py-4 px-4 font-medium text-muted-foreground">MOQ</th>
            <th className="text-left py-4 px-4 font-medium text-muted-foreground">Unit Price</th>
            <th className="text-left py-4 px-4 font-medium text-muted-foreground">Bulk Price</th>
            <th className="text-left py-4 px-4 font-medium text-muted-foreground">Delivery</th>
            <th className="text-left py-4 px-4 font-medium text-muted-foreground">Rating</th>
            <th className="text-right py-4 px-4 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((item, index) => (
            <tr
              key={item.supplier.id}
              className={cn(
                'border-b border-border hover:bg-muted/50 transition-colors',
                item.isBestValue && 'bg-secondary/5 border-l-4 border-l-secondary'
              )}
            >
              {/* Supplier */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {item.supplier.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => onViewSupplier(index)}
                      className="font-medium hover:text-primary transition-colors flex items-center gap-2"
                    >
                      {item.supplier.name}
                      {item.isBestValue && (
                        <Badge className="bg-secondary text-secondary-foreground text-xs">
                          Best Value
                        </Badge>
                      )}
                    </button>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.supplier.location}
                      </span>
                      {item.supplier.isVerified && <TrustBadge type="verified" size="sm" />}
                    </div>
                  </div>
                </div>
              </td>

              {/* Grade */}
              <td className="py-4 px-4">
                <Badge variant="outline">{item.grade}</Badge>
              </td>

              {/* MOQ */}
              <td className="py-4 px-4">
                <span className="font-medium">{item.moq}</span>
                <span className="text-muted-foreground text-sm"> units</span>
              </td>

              {/* Unit Price */}
              <td className="py-4 px-4">
                <span className="text-lg font-bold text-primary">
                  ${item.currentPrice.toFixed(2)}
                </span>
              </td>

              {/* Bulk Price */}
              <td className="py-4 px-4">
                {item.pricingTiers.length > 1 ? (
                  <div>
                    <span className="text-sm font-medium text-secondary">
                      From ${item.pricingTiers[item.pricingTiers.length - 1].pricePerUnit.toFixed(2)}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {item.pricingTiers[item.pricingTiers.length - 1].minQuantity}+ units
                    </p>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>

              {/* Delivery */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {item.deliveryEstimate.min}-{item.deliveryEstimate.max} days
                  </span>
                </div>
              </td>

              {/* Rating */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-medium">{item.supplier.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({item.supplier.totalSales.toLocaleString()})
                  </span>
                </div>
              </td>

              {/* Actions */}
              <td className="py-4 px-4">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => onAddToCart(index)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => onRequestQuote(index)}
                  >
                    <FileText className="w-4 h-4" />
                    Quote
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

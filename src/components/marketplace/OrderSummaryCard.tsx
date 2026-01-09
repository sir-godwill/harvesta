import { ShoppingCart, Truck, Receipt, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface OrderSummaryCardProps {
  subtotal: number;
  deliveryTotal: number;
  taxes?: number;
  discount?: number;
  grandTotal: number;
  itemCount: number;
  onCheckout?: () => void;
  onRequestQuotation?: () => void;
  isCheckoutPage?: boolean;
  className?: string;
}

export function OrderSummaryCard({
  subtotal,
  deliveryTotal,
  taxes = 0,
  discount = 0,
  grandTotal,
  itemCount,
  onCheckout,
  onRequestQuotation,
  isCheckoutPage = false,
  className,
}: OrderSummaryCardProps) {
  return (
    <div className={cn(
      'bg-card rounded-xl border shadow-sm p-6 space-y-4 sticky top-4',
      className
    )}>
      <div className="flex items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">Order Summary</h3>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})
          </span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-1">
            <Truck className="w-4 h-4" />
            Delivery
          </span>
          <span className="font-medium">
            {deliveryTotal === 0 ? (
              <span className="text-secondary">FREE</span>
            ) : (
              `$${deliveryTotal.toFixed(2)}`
            )}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-secondary">
            <span className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              Discount
            </span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

        {taxes > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <Receipt className="w-4 h-4" />
              Taxes (8%)
            </span>
            <span className="font-medium">${taxes.toFixed(2)}</span>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">Total</span>
        <span className="text-2xl font-bold text-primary">${grandTotal.toFixed(2)}</span>
      </div>

      {!isCheckoutPage && (
        <div className="space-y-3 pt-2">
          <Button 
            onClick={onCheckout}
            className="w-full"
            size="lg"
          >
            Proceed to Checkout
          </Button>
          
          {onRequestQuotation && (
            <Button
              onClick={onRequestQuotation}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Request Quotation
            </Button>
          )}

          <p className="text-xs text-center text-muted-foreground">
            🔒 Secure checkout • Buyer protection guaranteed
          </p>
        </div>
      )}

      {isCheckoutPage && (
        <div className="pt-2 space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <span>🔒</span>
            <span>Your payment information is encrypted and secure</span>
          </div>
        </div>
      )}
    </div>
  );
}

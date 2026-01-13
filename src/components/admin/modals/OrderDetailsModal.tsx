import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Truck, CreditCard, MapPin, User, Store, Calendar, Clock, DollarSign } from 'lucide-react';
import { Order } from '@/lib/admin-api';

interface OrderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  processing: 'bg-blue-500/10 text-blue-600 border-blue-200',
  shipped: 'bg-purple-500/10 text-purple-600 border-purple-200',
  delivered: 'bg-green-500/10 text-green-600 border-green-200',
  cancelled: 'bg-red-500/10 text-red-600 border-red-200',
  delayed: 'bg-orange-500/10 text-orange-600 border-orange-200',
};

export function OrderDetailsModal({ open, onOpenChange, order }: OrderDetailsModalProps) {
  if (!order) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Order {order.id}</DialogTitle>
            <Badge className={statusColors[order.status]}>
              {order.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Buyer:</span>
                  <span className="font-medium">{order.buyerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Seller:</span>
                  <span className="font-medium">{order.sellerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Region:</span>
                  <span className="font-medium">{order.region}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Payment:</span>
                  <Badge variant="outline" className="text-xs">{order.paymentStatus}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Delivery:</span>
                  <span className="font-medium">{order.deliveryType}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h4 className="font-medium mb-3">Order Items</h4>
            <div className="space-y-2">
              {Array.from({ length: order.itemCount }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Product Item {i + 1}</p>
                      <p className="text-xs text-muted-foreground">SKU: PRD-{1000 + i}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total / order.itemCount)}</p>
                    <p className="text-xs text-muted-foreground">Qty: 1</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Total */}
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(order.total)}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {order.status === 'pending' && (
              <>
                <Button className="flex-1">Confirm Order</Button>
                <Button variant="outline" className="flex-1">Cancel Order</Button>
              </>
            )}
            {order.status === 'processing' && (
              <Button className="flex-1">Mark as Shipped</Button>
            )}
            {order.status === 'shipped' && (
              <Button className="flex-1">Mark as Delivered</Button>
            )}
            <Button variant="outline">Print Invoice</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingCart, Truck, Package, Clock, CheckCircle2, XCircle, 
  AlertTriangle, MapPin, User, Store, CreditCard, MessageSquare,
  RefreshCw, Download, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order } from '@/lib/api';
import { toast } from 'sonner';

interface ViewOrderModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewOrderModal({ order, open, onOpenChange }: ViewOrderModalProps) {
  if (!order) return null;

  const statusConfig = {
    pending: { color: 'bg-warning/10 text-warning', icon: Clock, label: 'Pending', progress: 20 },
    processing: { color: 'bg-info/10 text-info', icon: RefreshCw, label: 'Processing', progress: 40 },
    shipped: { color: 'bg-primary/10 text-primary', icon: Truck, label: 'Shipped', progress: 60 },
    delivered: { color: 'bg-success/10 text-success', icon: CheckCircle2, label: 'Delivered', progress: 100 },
    cancelled: { color: 'bg-destructive/10 text-destructive', icon: XCircle, label: 'Cancelled', progress: 0 },
    delayed: { color: 'bg-destructive/10 text-destructive', icon: AlertTriangle, label: 'Delayed', progress: 50 },
  };

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);

  const handleUpdateStatus = (newStatus: string) => {
    toast.success(`Order status updated to ${newStatus}`);
  };

  const handleCancelOrder = () => {
    toast.error('Order has been cancelled');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', status.color)}>
              <StatusIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Order #{order.id}</h2>
              <p className="text-sm text-muted-foreground font-normal">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Badge className={cn('ml-auto', status.color)}>{status.label}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Order Progress */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Order Progress</span>
                <span className="font-medium">{status.progress}%</span>
              </div>
              <Progress value={status.progress} className="h-2" />
              <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                <span>Placed</span>
                <span>Processing</span>
                <span>Shipped</span>
                <span>Delivered</span>
              </div>
            </CardContent>
          </Card>

          {/* Parties */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Buyer</span>
                </div>
                <p className="font-semibold">{order.buyerName}</p>
                <p className="text-sm text-muted-foreground">{order.region}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Seller</span>
                </div>
                <p className="font-semibold">{order.sellerName}</p>
                <p className="text-sm text-muted-foreground">Verified Seller</p>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Order Items</h3>
              <div className="space-y-3">
                {Array.from({ length: order.itemCount }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Product Item {i + 1}</p>
                      <p className="text-xs text-muted-foreground">Qty: 50 units</p>
                    </div>
                    <p className="font-medium">{formatPrice(order.total / order.itemCount)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.total * 0.9)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatPrice(order.total * 0.08)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(order.total * 0.02)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment & Delivery */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Payment</span>
                </div>
                <Badge variant="outline">{order.paymentStatus}</Badge>
                <p className="text-sm text-muted-foreground mt-2">Bank Transfer</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Delivery</span>
                </div>
                <p className="font-semibold">{order.deliveryType}</p>
                <p className="text-sm text-muted-foreground mt-2">Est. 5-7 business days</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={() => toast.info('Tracking shipment...')}>
            <MapPin className="h-4 w-4 mr-2" /> Track
          </Button>
          <Button variant="outline" onClick={() => toast.info('Opening messenger...')}>
            <MessageSquare className="h-4 w-4 mr-2" /> Message
          </Button>
          <Button variant="outline" onClick={() => toast.success('Invoice downloaded')}>
            <Download className="h-4 w-4 mr-2" /> Invoice
          </Button>
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <Button variant="destructive" onClick={handleCancelOrder}>
              <XCircle className="h-4 w-4 mr-2" /> Cancel
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

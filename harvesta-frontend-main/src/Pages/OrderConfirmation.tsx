import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  FileText, 
  MessageCircle,
  Copy,
  ArrowRight,
  MapPin,
  Clock,
  Phone
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { VendorInfoBadge } from '@/components/marketplace/VendorCard';
import { TrustBadge } from '@/components/marketplace/TrustBadge';
import { toast } from '@/hooks/use-toast';
import { mockOrder } from '@/lib/mockData';

export default function OrderConfirmationPage() {
  const order = mockOrder;

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    toast({
      title: 'Copied!',
      description: 'Order number copied to clipboard',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getEstimatedDelivery = () => {
    const today = new Date();
    const minDays = Math.min(...order.groups.map(g => g.selectedDeliveryOption?.estimatedDays.min || 3));
    const maxDays = Math.max(...order.groups.map(g => g.selectedDeliveryOption?.estimatedDays.max || 7));
    
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + minDays);
    
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + maxDays);

    const formatShort = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    return `${formatShort(minDate)} - ${formatShort(maxDate)}`;
  };

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary/20 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your order. We've sent a confirmation to{' '}
            <span className="text-foreground font-medium">{order.buyer.email}</span>
          </p>
        </div>

        {/* Order Number Card */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 mb-8 border border-primary/20 animate-slide-up">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary font-mono">
                  {order.orderNumber}
                </span>
                <Button variant="ghost" size="icon" onClick={copyOrderNumber} className="h-8 w-8">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                Download Invoice
              </Button>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Package className="w-4 h-4" />
                Track Order
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Order Date */}
          <div className="bg-card rounded-xl p-5 border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="font-medium">Order Date</span>
            </div>
            <p className="text-muted-foreground">{formatDate(order.createdAt)}</p>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-card rounded-xl p-5 border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-secondary" />
              </div>
              <span className="font-medium">Est. Delivery</span>
            </div>
            <p className="text-secondary font-semibold">{getEstimatedDelivery()}</p>
          </div>

          {/* Payment Status */}
          <div className="bg-card rounded-xl p-5 border">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                order.paymentStatus === 'confirmed' 
                  ? 'bg-secondary/20' 
                  : 'bg-warning/20'
              }`}>
                <span className="text-xl">
                  {order.paymentStatus === 'confirmed' ? '✓' : '⏳'}
                </span>
              </div>
              <span className="font-medium">Payment</span>
            </div>
            <p className={`font-semibold capitalize ${
              order.paymentStatus === 'confirmed' 
                ? 'text-secondary' 
                : 'text-warning'
            }`}>
              {order.paymentStatus}
            </p>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-card rounded-xl p-6 border mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-lg">Delivery Address</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium">{order.deliveryAddress.label}</p>
              <p className="text-muted-foreground">
                {order.deliveryAddress.street}<br />
                {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}<br />
                {order.deliveryAddress.country}
              </p>
            </div>
            <div className="text-sm">
              <p className="font-medium">{order.buyer.firstName} {order.buyer.lastName}</p>
              <p className="text-muted-foreground">{order.buyer.phone}</p>
              {order.buyer.companyName && (
                <p className="text-muted-foreground">{order.buyer.companyName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Items by Vendor */}
        <div className="space-y-6 mb-8">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Details
          </h2>

          {order.groups.map((group) => (
            <div key={group.vendor.id} className="bg-card rounded-xl border overflow-hidden">
              <div className="p-4 bg-muted/30 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <VendorInfoBadge vendor={group.vendor} />
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span>{group.selectedDeliveryOption?.name}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-secondary font-medium">
                    {group.selectedDeliveryOption?.estimatedDays.min}-
                    {group.selectedDeliveryOption?.estimatedDays.max} days
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {group.items.map((item) => {
                  const tier = item.product.pricingTiers.find(
                    t => item.quantity >= t.minQuantity && (t.maxQuantity === null || item.quantity <= t.maxQuantity)
                  );
                  const price = tier?.pricePerUnit || item.product.currentPrice;
                  const totalPrice = price * item.quantity;

                  return (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium line-clamp-1">{item.product.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                          <span className="bg-muted px-2 py-0.5 rounded">{item.product.grade}</span>
                          <span>{item.product.origin}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span>
                            Qty: <strong>{item.quantity} {item.product.unit}</strong>
                          </span>
                          <span className="text-muted-foreground">@</span>
                          <span>${price.toFixed(2)}/{item.product.unit}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-muted/30 border-t flex justify-between items-center">
                <span className="text-muted-foreground">Vendor Subtotal</span>
                <span className="font-bold text-lg">${group.subtotal.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-xl border p-6 mb-8">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span>${order.deliveryTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxes (8%)</span>
              <span>${order.taxes.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Grand Total</span>
              <span className="text-2xl font-bold text-primary">${order.grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{order.paymentMethod.icon}</span>
              <span>Paid via {order.paymentMethod.name}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button size="lg" className="w-full sm:w-auto gap-2 bg-secondary hover:bg-secondary/90">
            <MessageCircle className="w-4 h-4" />
            Chat with Support
          </Button>
        </div>

        {/* WhatsApp Support */}
        <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Phone className="w-6 h-6 text-green-600" />
            <span className="font-semibold text-lg">Need Help?</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Our support team is available 24/7 to assist you with your order
          </p>
          <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <TrustBadge type="verified" size="md" />
          <TrustBadge type="quality" size="md" />
          <div className="trust-badge px-3 py-1.5 text-sm bg-muted text-muted-foreground">
            🔒 Secure Transaction
          </div>
          <div className="trust-badge px-3 py-1.5 text-sm bg-muted text-muted-foreground">
            📦 Buyer Protection
          </div>
        </div>
      </div>
    </Layout>
  );
}

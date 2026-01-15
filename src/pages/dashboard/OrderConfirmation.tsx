import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Package,
  Truck,
  Download,
  ArrowRight,
  Copy,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  MapPin,
  ShoppingBag,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/types/marketplace";
import { cn } from "@/lib/utils";

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const order: Order | null = state?.order || null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: order?.currency || 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const copyOrderId = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.orderNumber);
    toast({
      title: "Copied!",
      description: "Order ID copied to clipboard",
    });
  };

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground mb-4">No order details found.</p>
        <Link to="/orders">
          <Button variant="outline">Go to My Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We've received your purchase.
          </p>

          {/* Order ID */}
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-background border rounded-lg">
            <span className="text-sm text-muted-foreground">Order ID:</span>
            <code className="font-mono font-semibold">{order.orderNumber}</code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={copyOrderId}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium">Track Order</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor your shipment in real-time
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Download Invoice</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Get your receipt as PDF
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium">Contact Vendor</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Message {order.groups[0]?.vendor.name || 'Vendor'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Vendor Badge */}
            {order.groups.map((group, gIdx) => (
              <div key={group.vendor.id} className={cn("mb-6", gIdx !== 0 && "pt-6 border-t")}>
                <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {group.vendor.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{group.vendor.name}</p>
                    {group.vendor.isVerified && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified Supplier
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {group.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} {item.product.unit} × {formatCurrency(item.product.currentPrice)}
                        </p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.product.currentPrice * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Separator className="my-4" />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>{formatCurrency(order.deliveryTotal)}</span>
              </div>
              {order.taxes > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes</span>
                  <span>{formatCurrency(order.taxes)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid</span>
                <span className="text-primary">{formatCurrency(order.grandTotal)}</span>
              </div>
            </div>

            {/* Payment Badge */}
            <div className="mt-4 flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Payment Confirmed
              </Badge>
              <span className="text-sm text-muted-foreground">
                via {order.paymentMethod.name}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.deliveryAddress.street}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {order.deliveryAddress.city}, {order.deliveryAddress.state}, {order.deliveryAddress.country}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Estimated Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-primary">January 15, 2026</p>
              <p className="text-sm text-muted-foreground mt-1">
                Standard Shipping
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What's Next */}
        <Card className="bg-blue-50 border-blue-200 mb-8">
          <CardHeader>
            <CardTitle className="text-blue-800">What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Order Processing</p>
                  <p className="text-sm text-blue-600">Vendor prepares your items</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Shipping</p>
                  <p className="text-sm text-blue-600">You'll receive tracking info</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Delivery</p>
                  <p className="text-sm text-blue-600">Receive & confirm your order</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">Need Help with Your Order?</h3>
                <p className="text-sm text-muted-foreground">
                  Our support team is available 24/7
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={`/orders/${order.id}`}>
            <Button size="lg" className="w-full sm:w-auto">
              <Truck className="h-4 w-4 mr-2" />
              Track Your Order
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;

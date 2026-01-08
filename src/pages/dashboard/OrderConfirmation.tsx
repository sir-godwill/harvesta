import { Link } from "react-router-dom";
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
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// Mock confirmed order data
const confirmedOrder = {
  id: "ORD-2026-001235",
  date: "2026-01-08T16:45:00",
  vendor: {
    name: "Green Valley Farms",
    isVerified: true
  },
  items: [
    { 
      name: "Organic Tomatoes (Fresh)", 
      quantity: 500, 
      unit: "kg",
      unitPrice: 250,
      totalPrice: 125000
    },
    { 
      name: "Fresh Bell Peppers (Mixed Colors)", 
      quantity: 200, 
      unit: "kg",
      unitPrice: 300,
      totalPrice: 60000
    }
  ],
  subtotal: 185000,
  deliveryFee: 5000,
  discount: 15000,
  total: 175000,
  currency: "XAF",
  deliveryAddress: {
    label: "Main Warehouse",
    address: "123 Boulevard de la Liberté, Yaoundé, Centre, Cameroon"
  },
  deliveryMethod: "Express Shipping",
  estimatedDelivery: "January 12, 2026",
  paymentMethod: "Mobile Money (MTN)",
  paymentStatus: "paid"
};

const OrderConfirmation = () => {
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: confirmedOrder.currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(confirmedOrder.id);
    toast({
      title: "Copied!",
      description: "Order ID copied to clipboard",
    });
  };

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
            <code className="font-mono font-semibold">{confirmedOrder.id}</code>
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
                Message {confirmedOrder.vendor.name}
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
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {confirmedOrder.vendor.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium">{confirmedOrder.vendor.name}</p>
                {confirmedOrder.vendor.isVerified && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified Supplier
                  </Badge>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {confirmedOrder.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} {item.unit} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(confirmedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>{formatCurrency(confirmedOrder.deliveryFee)}</span>
              </div>
              {confirmedOrder.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount Applied</span>
                  <span>-{formatCurrency(confirmedOrder.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid</span>
                <span className="text-primary">{formatCurrency(confirmedOrder.total)}</span>
              </div>
            </div>

            {/* Payment Badge */}
            <div className="mt-4 flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Payment Confirmed
              </Badge>
              <span className="text-sm text-muted-foreground">
                via {confirmedOrder.paymentMethod}
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
              <p className="font-medium">{confirmedOrder.deliveryAddress.label}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {confirmedOrder.deliveryAddress.address}
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
              <p className="font-medium text-primary">{confirmedOrder.estimatedDelivery}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {confirmedOrder.deliveryMethod}
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
          <Link to={`/orders/${confirmedOrder.id}`}>
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

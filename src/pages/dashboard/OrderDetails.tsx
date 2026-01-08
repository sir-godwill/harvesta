import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Download, 
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  RotateCcw,
  AlertCircle,
  Copy,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { OrderStatusBadge } from "@/components/common/OrderStatusBadge";
import { VendorTrustBadge } from "@/components/common/VendorTrustBadge";
import { useToast } from "@/hooks/use-toast";

// Mock order data
const mockOrderDetails = {
  id: "ORD-2026-001234",
  date: "2026-01-08T14:30:00",
  status: "processing" as const,
  paymentStatus: "paid" as const,
  paymentMethod: "Mobile Money (MTN)",
  vendor: {
    name: "Green Valley Farms",
    rating: 4.8,
    isVerified: true,
    responseTime: "< 2 hours",
    phone: "+237 6XX XXX XXX",
    email: "sales@greenvalleyfarms.cm"
  },
  items: [
    { 
      id: "item-1",
      name: "Organic Tomatoes (Fresh)", 
      quantity: 500, 
      unit: "kg",
      unitPrice: 250,
      totalPrice: 125000,
      image: ""
    },
    { 
      id: "item-2",
      name: "Fresh Bell Peppers (Mixed Colors)", 
      quantity: 200, 
      unit: "kg",
      unitPrice: 300,
      totalPrice: 60000,
      image: ""
    }
  ],
  subtotal: 185000,
  deliveryFee: 5000,
  discount: 15000,
  total: 175000,
  currency: "XAF",
  deliveryAddress: {
    label: "Main Warehouse",
    name: "Jean Dupont",
    address: "123 Boulevard de la Liberté",
    city: "Yaoundé",
    region: "Centre",
    country: "Cameroon",
    phone: "+237 6XX XXX XXX"
  },
  deliveryMethod: "Express Shipping",
  estimatedDelivery: "2026-01-12",
  trackingNumber: "TRK-2026-ABC123",
  timeline: [
    { status: "Order Placed", date: "2026-01-08 14:30", completed: true },
    { status: "Payment Confirmed", date: "2026-01-08 14:35", completed: true },
    { status: "Order Processing", date: "2026-01-08 15:00", completed: true },
    { status: "Shipped", date: "", completed: false },
    { status: "Delivered", date: "", completed: false }
  ],
  notes: "Please ensure the tomatoes are packed in ventilated crates. Delivery at the main gate."
};

const OrderDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const order = mockOrderDetails;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: order.currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/orders">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-foreground">{order.id}</h1>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Invoice
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reorder
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Order Tracking
                </CardTitle>
                {order.trackingNumber && (
                  <CardDescription className="flex items-center gap-2">
                    Tracking: 
                    <code className="bg-muted px-2 py-0.5 rounded text-sm">{order.trackingNumber}</code>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(order.trackingNumber, "Tracking number")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {order.timeline.map((step, index) => (
                    <div key={index} className="flex gap-4 pb-6 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {step.completed ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        {index < order.timeline.length - 1 && (
                          <div className={`w-0.5 flex-1 mt-2 ${
                            step.completed ? 'bg-green-200' : 'bg-muted'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className={`font-medium ${
                          step.completed ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.status}
                        </p>
                        {step.date && (
                          <p className="text-sm text-muted-foreground">{step.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Truck className="h-5 w-5" />
                    <span className="font-medium">Estimated Delivery: {order.estimatedDelivery}</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    {order.deliveryMethod}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
                <CardDescription>{order.items.length} items from {order.vendor.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex gap-4">
                        <div className="h-20 w-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.unitPrice)} × {item.quantity} {item.unit}
                          </p>
                          <p className="font-semibold text-primary mt-1">
                            {formatCurrency(item.totalPrice)}
                          </p>
                        </div>
                      </div>
                      {index < order.items.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>{formatCurrency(order.deliveryFee)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vendor Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Vendor Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {order.vendor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">{order.vendor.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {order.vendor.isVerified && <VendorTrustBadge level="verified" />}
                      <span className="text-sm text-muted-foreground">
                        ⭐ {order.vendor.rating}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Response time: {order.vendor.responseTime}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Vendor
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    {order.vendor.phone}
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    {order.vendor.email}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{order.deliveryAddress.label}</p>
                  <p className="text-sm">{order.deliveryAddress.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.deliveryAddress.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.deliveryAddress.city}, {order.deliveryAddress.region}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.deliveryAddress.country}
                  </p>
                  <p className="text-sm mt-2">
                    <Phone className="h-3 w-3 inline mr-1" />
                    {order.deliveryAddress.phone}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge 
                    variant="default"
                    className="bg-green-100 text-green-700 hover:bg-green-100"
                  >
                    {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Method</span>
                  <span className="text-sm font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-semibold text-primary">{formatCurrency(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Need Help?</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Contact our support team for any issues with your order.
                    </p>
                    <Button variant="link" size="sm" className="h-auto p-0 mt-2">
                      Contact Support
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;

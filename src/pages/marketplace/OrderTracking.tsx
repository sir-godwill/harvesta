import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { StatusTimeline } from '@/components/marketplace/StatusTimeline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, MessageCircle, Download, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { trackOrder, fetchOrderDetails } from '@/lib/api';

export default function OrderTracking() {
  const { orderId } = useParams();

  const { data: tracking, isLoading: isTrackingLoading } = useQuery({
    queryKey: ['tracking', orderId],
    queryFn: () => trackOrder(orderId!),
    enabled: !!orderId
  });

  const { data: order, isLoading: isOrderLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderDetails(orderId!),
    enabled: !!orderId
  });

  if (isTrackingLoading || isOrderLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Header />
        <div className="flex-1 flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tracking || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Link to="/orders">
            <Button>View My Orders</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Track Order</h1>
            <p className="text-muted-foreground">Order #{tracking.orderNumber}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2"><Download className="w-4 h-4" /> Invoice</Button>
            <Button variant="outline" className="gap-2"><MessageCircle className="w-4 h-4" /> Support</Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatusTimeline events={tracking.timeline} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" /> Shipment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.vendors.map(vendor => (
              <div key={vendor.vendorId} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{vendor.vendorName}</p>
                    <p className="text-sm text-muted-foreground">Carrier: Harvestá Express {tracking.trackingNumber && `• ${tracking.trackingNumber}`}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={tracking.currentStatus === 'delivered' ? 'default' : 'secondary'}>{tracking.currentStatus}</Badge>
                  {tracking.estimatedDelivery && (
                    <p className="text-sm text-muted-foreground mt-1">Est. {new Date(tracking.estimatedDelivery).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
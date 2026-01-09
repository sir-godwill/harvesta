import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { StatusTimeline } from '@/components/marketplace/StatusTimeline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, MapPin, MessageCircle, Download, ArrowLeft } from 'lucide-react';
import { mockOrderTracking, mockOrder } from '@/lib/mockData';

export default function OrderTracking() {
  const { orderId } = useParams();
  const tracking = mockOrderTracking;
  const order = mockOrder;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Track Order</h1>
            <p className="text-muted-foreground">Order #{tracking.orderNumber}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Invoice
            </Button>
            <Button variant="outline" className="gap-2">
              <MessageCircle className="w-4 h-4" /> Support
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatusTimeline events={tracking.timeline} />
          </CardContent>
        </Card>

        {/* Vendor Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              Shipment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tracking.vendorTracking.map(vendor => (
              <div key={vendor.vendorId} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{vendor.vendorName}</p>
                    <p className="text-sm text-muted-foreground">
                      {vendor.carrier} {vendor.trackingNumber && `• ${vendor.trackingNumber}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={vendor.status === 'Shipped' ? 'default' : 'secondary'}>
                    {vendor.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Est. {new Date(vendor.estimatedDelivery).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

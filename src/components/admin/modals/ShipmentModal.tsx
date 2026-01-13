import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Truck, Package, MapPin, Calendar, Weight, Clock, Navigation, CheckCircle2 } from 'lucide-react';
import { Shipment } from '@/lib/admin-api';

interface ShipmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment: Shipment | null;
}

const statusColors: Record<string, string> = {
  pending: 'bg-gray-500/10 text-gray-600',
  picked_up: 'bg-blue-500/10 text-blue-600',
  in_transit: 'bg-purple-500/10 text-purple-600',
  out_for_delivery: 'bg-orange-500/10 text-orange-600',
  delivered: 'bg-green-500/10 text-green-600',
  delayed: 'bg-red-500/10 text-red-600',
  exception: 'bg-red-500/10 text-red-600',
};

const statusProgress: Record<string, number> = {
  pending: 10,
  picked_up: 30,
  in_transit: 60,
  out_for_delivery: 85,
  delivered: 100,
  delayed: 60,
  exception: 60,
};

const trackingEvents = [
  { status: 'Package picked up', location: 'Accra Warehouse', time: '2 days ago', completed: true },
  { status: 'In transit to destination', location: 'Tema Port', time: '1 day ago', completed: true },
  { status: 'Customs clearance', location: 'Hamburg Port', time: '12 hours ago', completed: true },
  { status: 'Out for delivery', location: 'Hamburg City', time: 'Expected today', completed: false },
];

export function ShipmentModal({ open, onOpenChange, shipment }: ShipmentModalProps) {
  if (!shipment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Shipment {shipment.trackingNumber}
            </DialogTitle>
            <Badge className={statusColors[shipment.status]}>
              {shipment.status.replace('_', ' ')}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Delivery Progress</span>
              <span className="text-muted-foreground">{statusProgress[shipment.status]}%</span>
            </div>
            <Progress value={statusProgress[shipment.status]} />
          </div>

          {/* Route Info */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Origin</p>
                  <p className="font-medium text-sm">{shipment.origin}</p>
                </div>
                <div className="flex-1 px-4">
                  <div className="border-t-2 border-dashed border-muted-foreground/30 relative">
                    <Truck className="h-4 w-4 text-primary absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-background" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Navigation className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">Destination</p>
                  <p className="font-medium text-sm">{shipment.destination}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Order:</span>
                  <span className="font-medium">{shipment.orderId}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Carrier:</span>
                  <span className="font-medium">{shipment.carrier}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Weight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Weight:</span>
                  <span className="font-medium">{shipment.weight} kg</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Items:</span>
                  <span className="font-medium">{shipment.items} packages</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Shipped:</span>
                  <span className="font-medium">{new Date(shipment.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">ETA:</span>
                  <span className="font-medium">{new Date(shipment.eta).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tracking Timeline */}
          <div>
            <h4 className="font-medium mb-3">Tracking History</h4>
            <div className="space-y-3">
              {trackingEvents.map((event, index) => (
                <div key={index} className="flex gap-3">
                  <div className="relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${event.completed ? 'bg-green-500' : 'bg-muted'}`}>
                      <CheckCircle2 className={`h-4 w-4 ${event.completed ? 'text-white' : 'text-muted-foreground'}`} />
                    </div>
                    {index < trackingEvents.length - 1 && (
                      <div className={`absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-8 ${event.completed ? 'bg-green-500' : 'bg-muted'}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-sm">{event.status}</p>
                    <p className="text-xs text-muted-foreground">{event.location}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1">Contact Carrier</Button>
            <Button variant="outline" className="flex-1">Print Label</Button>
            {shipment.status === 'delayed' && (
              <Button variant="destructive">Report Issue</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

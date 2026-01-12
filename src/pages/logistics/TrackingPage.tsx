import { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  AlertTriangle,
  RefreshCw,
  Navigation,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { fetchShipments, type Shipment } from '@/services/logistics-api';

const statusColors: Record<string, string> = {
  pending: 'bg-gray-500/10 text-gray-600',
  picked_up: 'bg-blue-500/10 text-blue-600',
  in_transit: 'bg-purple-500/10 text-purple-600',
  out_for_delivery: 'bg-cyan-500/10 text-cyan-600',
  delivered: 'bg-emerald-500/10 text-emerald-600',
  delayed: 'bg-orange-500/10 text-orange-600',
  failed: 'bg-red-500/10 text-red-600',
};

export default function TrackingPage() {
  const { toast } = useToast();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchShipments();
        const activeShipments = data.filter((s) =>
          ['in_transit', 'picked_up', 'delayed', 'out_for_delivery'].includes(s.status)
        );
        setShipments(activeShipments);
        if (activeShipments.length > 0) {
          setSelectedShipment(activeShipments[0]);
        }
      } catch (error) {
        console.error('Failed to load shipments:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRecalculateETA = () => {
    toast({
      title: 'ETA Recalculated',
      description: 'ETA updated based on current traffic',
    });
  };

  const handleContactDriver = () => {
    toast({
      title: 'Contacting Driver',
      description: 'Initiating call to driver...',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Live Tracking</h1>
            <p className="text-muted-foreground">Real-time shipment visibility</p>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Active Shipments List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm md:text-base">
                Active ({shipments.length})
              </h3>
            </div>
            <div className="space-y-2 max-h-[300px] lg:max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {shipments.map((shipment) => (
                <Card
                  key={shipment.id}
                  className={`cursor-pointer transition-all ${
                    selectedShipment?.id === shipment.id
                      ? 'ring-2 ring-primary'
                      : 'hover:bg-muted/30'
                  }`}
                  onClick={() => setSelectedShipment(shipment)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        {shipment.trackingNumber || shipment.id.slice(0, 8)}
                      </span>
                      <Badge className={statusColors[shipment.status]} variant="secondary">
                        {shipment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1 truncate">
                      {shipment.partnerName}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{shipment.deliveryLocation.city}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Map Placeholder & Tracking Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Map Placeholder */}
            <Card>
              <CardContent className="p-0 h-[200px] md:h-[300px] bg-muted/20 flex items-center justify-center rounded-lg relative">
                <div className="text-center">
                  <MapPin className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Map view placeholder</p>
                  <p className="text-xs text-muted-foreground">GPS tracking integrated with backend</p>
                </div>
                {selectedShipment && (
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={handleContactDriver}>
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="secondary">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tracking Details */}
            {selectedShipment && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Navigation className="h-5 w-5" />
                      {selectedShipment.trackingNumber || selectedShipment.id.slice(0, 8)} Tracking
                    </CardTitle>
                    <Button size="sm" variant="outline" onClick={handleRecalculateETA}>
                      Recalculate ETA
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current Status */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground mb-1">From</p>
                      <p className="font-medium text-sm">{selectedShipment.pickupLocation.city}</p>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground mb-1">To</p>
                      <p className="font-medium text-sm">{selectedShipment.deliveryLocation.city}</p>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground mb-1">Partner</p>
                      <p className="font-medium text-sm">{selectedShipment.partnerName}</p>
                    </div>
                  </div>

                  {/* Delay Info */}
                  {selectedShipment.status === 'delayed' && (
                    <div className="flex items-center gap-2 rounded-lg bg-orange-500/10 p-3 border border-orange-500/20">
                      <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />
                      <span className="text-sm text-orange-600">Shipment is delayed</span>
                    </div>
                  )}

                  {/* Timeline */}
                  <div>
                    <h4 className="font-medium mb-3 text-sm">Status Timeline</h4>
                    <div className="space-y-3">
                      {selectedShipment.timeline.map((event, idx) => (
                        <div key={event.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div
                              className={`h-3 w-3 rounded-full ${
                                idx === 0 ? 'bg-primary' : 'bg-muted-foreground'
                              }`}
                            />
                            {idx < selectedShipment.timeline.length - 1 && (
                              <div className="w-0.5 h-full bg-muted-foreground/30" />
                            )}
                          </div>
                          <div className="pb-3">
                            <p className="text-sm font-medium">{event.status.replace('_', ' ')}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(event.timestamp).toLocaleString()}
                            </p>
                            {event.location && (
                              <p className="text-xs text-muted-foreground">{event.location}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

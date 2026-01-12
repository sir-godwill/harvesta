import { useState } from "react";
import { MapPin, Clock, AlertTriangle, RefreshCw, Navigation, Phone, MessageSquare } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, RiskBadge } from "@/components/ui/status-badge";
import { mockShipments, mockTrackingUpdates } from "@/data/mock-data";
import { toast } from "sonner";

/**
 * Live Tracking Page - Operational visibility and proactive problem detection
 */
export default function LiveTrackingPage() {
  const [selectedShipment, setSelectedShipment] = useState<string | null>(mockShipments[0]?.id || null);
  
  const activeShipments = mockShipments.filter((s) => ["in-transit", "picked-up", "delayed"].includes(s.status));
  const selectedData = mockShipments.find((s) => s.id === selectedShipment);
  const trackingData = mockTrackingUpdates.find((t) => t.shipmentId === selectedShipment);

  const handleRecalculateETA = () => {
    toast.success("ETA recalculated based on current traffic");
  };

  const handleRefresh = () => {
    toast.info("Refreshing tracking data...");
  };

  const handleContactDriver = () => {
    toast.info("Initiating call to driver...");
  };

  return (
    <DashboardLayout title="Live Tracking" subtitle="Real-time shipment visibility" variant="admin">
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Active Shipments List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm md:text-base">Active ({activeShipments.length})</h3>
            <Button variant="ghost" size="icon" onClick={handleRefresh}><RefreshCw className="h-4 w-4" /></Button>
          </div>
          <div className="space-y-2 max-h-[300px] lg:max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {activeShipments.map((shipment) => (
              <Card
                key={shipment.id}
                className={`cursor-pointer transition-all ${selectedShipment === shipment.id ? "ring-2 ring-primary" : "hover:bg-muted/30"}`}
                onClick={() => setSelectedShipment(shipment.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{shipment.id}</span>
                    <StatusBadge status={shipment.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1 truncate">{shipment.vendorName}</p>
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
              {selectedData?.assignedPartner && (
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={handleContactDriver}>
                    <Phone className="h-4 w-4 mr-1" />Call
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => toast.info("Opening chat...")}>
                    <MessageSquare className="h-4 w-4 mr-1" />Chat
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tracking Details */}
          {selectedData && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Navigation className="h-5 w-5" />
                    {selectedData.id} Tracking
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <RiskBadge level={selectedData.riskLevel} />
                    <Button size="sm" variant="outline" onClick={handleRecalculateETA}>Recalculate ETA</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Status */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Current Location</p>
                    <p className="font-medium text-sm">{trackingData?.location.address || "Updating..."}</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Milestone</p>
                    <p className="font-medium text-sm">{trackingData?.milestone || "En route"}</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground mb-1">ETA</p>
                    <p className="font-medium text-sm">{trackingData ? new Date(trackingData.estimatedArrival).toLocaleString() : "Calculating..."}</p>
                  </div>
                </div>

                {/* Delay Info */}
                {trackingData?.delayReason && (
                  <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3 border border-warning/20">
                    <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                    <span className="text-sm text-warning">Delay: {trackingData.delayReason}</span>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h4 className="font-medium mb-3 text-sm">Status History</h4>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto">
                    {selectedData.timeline.map((event, idx) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`h-3 w-3 rounded-full ${idx === selectedData.timeline.length - 1 ? "bg-primary" : "bg-muted-foreground"}`} />
                          {idx < selectedData.timeline.length - 1 && <div className="w-0.5 h-full bg-muted-foreground/30" />}
                        </div>
                        <div className="pb-3">
                          <p className="text-sm font-medium">{event.description}</p>
                          <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                          {event.location && <p className="text-xs text-muted-foreground">{event.location}</p>}
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
    </DashboardLayout>
  );
}
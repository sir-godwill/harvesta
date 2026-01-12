import { useState } from "react";
import { Package, Truck, MapPin, ChevronDown, ChevronUp, Layers, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, RiskBadge } from "@/components/ui/status-badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Shipment } from "@/services/logistics-api";

interface MultiVendorOrderViewProps {
  orderId: string;
  shipments: Shipment[];
  viewMode?: "split" | "consolidated";
  onViewModeChange?: (mode: "split" | "consolidated") => void;
  onViewShipment?: (shipmentId: string) => void;
}

/**
 * Multi-Vendor Order View Component
 * 
 * Displays multi-vendor orders in two modes:
 * - Split: Each vendor shipment shown separately
 * - Consolidated: Single card with vendor breakdown inside
 */
export function MultiVendorOrderView({
  orderId,
  shipments,
  viewMode = "split",
  onViewModeChange,
  onViewShipment,
}: MultiVendorOrderViewProps) {
  const [expandedVendors, setExpandedVendors] = useState<string[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", minimumFractionDigits: 0 }).format(amount);
  };

  const toggleVendor = (vendorId: string) => {
    setExpandedVendors((prev) =>
      prev.includes(vendorId) ? prev.filter((v) => v !== vendorId) : [...prev, vendorId]
    );
  };

  const totalCost = shipments.reduce((sum, s) => sum + s.costBreakdown.total, 0);
  const totalItems = shipments.reduce((sum, s) => sum + s.items.length, 0);

  // Get overall order status (worst status among shipments)
  const getOverallStatus = () => {
    if (shipments.some((s) => s.status === "delayed")) return "delayed";
    if (shipments.some((s) => s.status === "in-transit")) return "in-transit";
    if (shipments.some((s) => s.status === "picked-up")) return "picked-up";
    if (shipments.every((s) => s.status === "delivered")) return "delivered";
    return "pending";
  };

  if (viewMode === "consolidated") {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Order {orderId}
                <Badge variant="outline">{shipments.length} Vendors</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{totalItems} items • {formatCurrency(totalCost)} total</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={getOverallStatus()} />
              {onViewModeChange && (
                <Button variant="ghost" size="sm" onClick={() => onViewModeChange("split")}>
                  <List className="h-4 w-4 mr-1" />Split View
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {shipments.map((shipment) => (
            <Collapsible key={shipment.id} open={expandedVendors.includes(shipment.vendorId)}>
              <div className="rounded-lg border">
                <CollapsibleTrigger asChild>
                  <button
                    className="w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
                    onClick={() => toggleVendor(shipment.vendorId)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm">{shipment.vendorName}</p>
                        <p className="text-xs text-muted-foreground">{shipment.items.length} items • {shipment.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={shipment.status} />
                      <RiskBadge level={shipment.riskLevel} />
                      {expandedVendors.includes(shipment.vendorId) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t p-3 bg-muted/10 space-y-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="text-sm">
                        <p className="text-xs text-muted-foreground">Pickup</p>
                        <p className="flex items-center gap-1"><MapPin className="h-3 w-3" />{shipment.pickupLocation.city}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-xs text-muted-foreground">Delivery</p>
                        <p className="flex items-center gap-1"><MapPin className="h-3 w-3" />{shipment.deliveryLocation.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Logistics Partner</span>
                      <span>{shipment.assignedPartner?.name || "Unassigned"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Cost</span>
                      <span className="font-semibold">{formatCurrency(shipment.costBreakdown.total)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">ETA</span>
                      <span>{new Date(shipment.estimatedDelivery).toLocaleDateString()}</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => onViewShipment?.(shipment.id)}>
                      View Shipment Details
                    </Button>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Split View
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            Order {orderId}
            <Badge variant="outline">{shipments.length} Shipments</Badge>
          </h3>
          <p className="text-sm text-muted-foreground">{totalItems} items from {shipments.length} vendors</p>
        </div>
        {onViewModeChange && (
          <Button variant="ghost" size="sm" onClick={() => onViewModeChange("consolidated")}>
            <Layers className="h-4 w-4 mr-1" />Consolidated View
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {shipments.map((shipment) => (
          <Card key={shipment.id} className={shipment.status === "delayed" ? "border-warning/50" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{shipment.vendorName}</CardTitle>
                <StatusBadge status={shipment.status} />
              </div>
              <p className="text-xs text-muted-foreground">{shipment.id}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span>{shipment.assignedPartner?.name || "Unassigned"}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">From</p>
                  <p>{shipment.pickupLocation.city}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">To</p>
                  <p>{shipment.deliveryLocation.city}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <RiskBadge level={shipment.riskLevel} />
                <span className="font-semibold text-sm">{formatCurrency(shipment.costBreakdown.total)}</span>
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => onViewShipment?.(shipment.id)}>
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
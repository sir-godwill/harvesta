import { MapPin, Package, Clock, Truck, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge, RiskBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Shipment } from "@/services/logistics-api";

interface ShipmentCardProps {
  shipment: Shipment;
  onViewDetails?: () => void;
  variant?: "default" | "compact";
}

export function ShipmentCard({
  shipment,
  onViewDetails,
  variant = "default",
}: ShipmentCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalWeight = shipment.items.reduce((acc, item) => acc + item.weight, 0);

  if (variant === "compact") {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-elevated">
        <CardContent className="p-3 md:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{shipment.id}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {shipment.vendorName}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 shrink-0">
              <StatusBadge status={shipment.status} />
              <RiskBadge level={shipment.riskLevel} />
            </div>
          </div>
          <div className="mt-2 md:mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0" />
              {shipment.deliveryLocation.city}
            </span>
            <span className="shrink-0 font-medium">{formatCurrency(shipment.costBreakdown.total)}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-elevated">
      <CardHeader className="border-b bg-muted/30 px-3 py-2 md:px-4 md:py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{shipment.id}</p>
              <p className="text-xs text-muted-foreground truncate">
                Order: {shipment.orderId}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 shrink-0">
            <StatusBadge status={shipment.status} />
            <RiskBadge level={shipment.riskLevel} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 md:p-4">
        <div className="space-y-3 md:space-y-4">
          {/* Route */}
          <div className="flex items-start gap-2 md:gap-3">
            <div className="flex flex-col items-center">
              <div className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-primary/10">
                <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary" />
              </div>
              <div className="h-6 md:h-8 w-0.5 bg-border" />
              <div className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-accent/10">
                <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3 text-accent" />
              </div>
            </div>
            <div className="flex-1 space-y-2 md:space-y-3 min-w-0">
              <div>
                <p className="text-[10px] md:text-xs font-medium text-muted-foreground">
                  Pickup
                </p>
                <p className="text-xs md:text-sm truncate">
                  {shipment.pickupLocation.city},{" "}
                  {shipment.pickupLocation.region}
                </p>
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-medium text-muted-foreground">
                  Delivery
                </p>
                <p className="text-xs md:text-sm truncate">
                  {shipment.deliveryLocation.city},{" "}
                  {shipment.deliveryLocation.region}
                </p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 rounded-lg bg-muted/30 p-2 md:p-3">
            <div className="text-center">
              <p className="text-sm md:text-lg font-bold text-foreground">
                {shipment.items.length}
              </p>
              <p className="text-[9px] md:text-[10px] text-muted-foreground">Items</p>
            </div>
            <div className="text-center">
              <p className="text-sm md:text-lg font-bold text-foreground">{totalWeight}kg</p>
              <p className="text-[9px] md:text-[10px] text-muted-foreground">Weight</p>
            </div>
            <div className="text-center">
              <p className="text-sm md:text-lg font-bold text-primary truncate">
                {formatCurrency(shipment.costBreakdown.total)}
              </p>
              <p className="text-[9px] md:text-[10px] text-muted-foreground">Total Cost</p>
            </div>
          </div>

          {/* Partner & Timeline */}
          <div className="flex items-center justify-between border-t pt-2 md:pt-3 gap-2">
            {shipment.assignedPartner ? (
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">
                    {shipment.assignedPartner.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    ⭐ {shipment.assignedPartner.rating}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="text-xs">Awaiting assignment</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="h-3 w-3" />
              <span>
                Est.{" "}
                {new Date(shipment.estimatedDelivery).toLocaleDateString(
                  "en-GB",
                  { day: "2-digit", month: "short" }
                )}
              </span>
            </div>
          </div>
        </div>

        {onViewDetails && (
          <Button
            variant="outline"
            className="mt-3 md:mt-4 w-full h-9 md:h-10 text-sm"
            onClick={onViewDetails}
          >
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
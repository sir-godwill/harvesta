import { MapPin, Package, Clock, AlertTriangle, Banknote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/ui/status-badge";
import type { LogisticsJob } from "@/services/logistics-api";

interface JobCardProps {
  job: LogisticsJob;
  onAccept?: () => void;
  onReject?: () => void;
}

export function JobCard({ job, onAccept, onReject }: JobCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const productTypeLabels: Record<string, string> = {
    perishable: "🥬 Perishable",
    "non-perishable": "📦 Non-Perishable",
    bulk: "🏗️ Bulk",
    fragile: "⚠️ Fragile",
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-elevated">
      <CardContent className="p-0">
        {/* Header with payment */}
        <div className="flex items-center justify-between border-b bg-accent/5 px-3 py-2 md:px-4 md:py-3">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Banknote className="h-4 w-4 md:h-5 md:w-5 text-accent" />
            <span className="text-base md:text-lg font-bold text-accent">
              {formatCurrency(job.payment)}
            </span>
          </div>
          <RiskBadge level={job.riskLevel} />
        </div>

        <div className="space-y-3 md:space-y-4 p-3 md:p-4">
          {/* Route */}
          <div className="flex items-start gap-2 md:gap-3">
            <div className="flex flex-col items-center">
              <div className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-primary/10">
                <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary" />
              </div>
              <div className="h-8 md:h-10 w-0.5 bg-border" />
              <div className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-accent/10">
                <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3 text-accent" />
              </div>
            </div>
            <div className="flex-1 space-y-3 md:space-y-4 min-w-0">
              <div>
                <p className="text-[10px] md:text-xs font-medium text-muted-foreground">
                  Pickup Location
                </p>
                <p className="text-xs md:text-sm font-medium truncate">
                  {job.pickupLocation.street}
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                  {job.pickupLocation.city}, {job.pickupLocation.region}
                </p>
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-medium text-muted-foreground">
                  Delivery Location
                </p>
                <p className="text-xs md:text-sm font-medium truncate">
                  {job.deliveryLocation.street}
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                  {job.deliveryLocation.city}, {job.deliveryLocation.region}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-1.5 md:gap-2 rounded-lg bg-muted/30 p-2 md:p-3">
            <div className="text-center">
              <Package className="mx-auto h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
              <p className="mt-0.5 md:mt-1 text-xs md:text-sm font-semibold">{job.weight}kg</p>
              <p className="text-[9px] md:text-[10px] text-muted-foreground">Weight</p>
            </div>
            <div className="text-center">
              <Package className="mx-auto h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
              <p className="mt-0.5 md:mt-1 text-xs md:text-sm font-semibold">{job.volume}m³</p>
              <p className="text-[9px] md:text-[10px] text-muted-foreground">Volume</p>
            </div>
            <div className="text-center">
              <Clock className="mx-auto h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
              <p className="mt-0.5 md:mt-1 text-xs md:text-sm font-semibold">
                {formatTime(job.deliveryWindow.start)}
              </p>
              <p className="text-[9px] md:text-[10px] text-muted-foreground">Window Start</p>
            </div>
          </div>

          {/* Product Type & Instructions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] md:text-xs font-medium">
                {productTypeLabels[job.productType]}
              </span>
            </div>
            {job.specialInstructions && (
              <div className="flex items-start gap-1.5 md:gap-2 rounded-lg bg-warning/5 p-2 md:p-2.5">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 md:h-4 md:w-4 shrink-0 text-warning" />
                <p className="text-[10px] md:text-xs text-warning">{job.specialInstructions}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-9 md:h-10 text-xs md:text-sm"
              onClick={onReject}
            >
              Decline
            </Button>
            <Button
              className="flex-1 h-9 md:h-10 text-xs md:text-sm bg-gradient-accent text-accent-foreground hover:opacity-90"
              onClick={onAccept}
            >
              Accept Job
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
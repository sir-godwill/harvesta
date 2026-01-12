import { cn } from "@/lib/utils";
import type { ShipmentStatus, RiskLevel } from "@/services/logistics-api";

interface StatusBadgeProps {
  status: ShipmentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles: Record<ShipmentStatus, string> = {
    pending: "bg-muted text-muted-foreground border-muted-foreground/20",
    "picked-up": "bg-primary/10 text-primary border-primary/20",
    "in-transit": "bg-accent/10 text-accent border-accent/20",
    "out-for-delivery": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    delayed: "bg-warning/10 text-warning border-warning/20",
    delivered: "bg-success/10 text-success border-success/20",
    failed: "bg-destructive/10 text-destructive border-destructive/20",
    returned: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  const labels: Record<ShipmentStatus, string> = {
    pending: "Pending",
    "picked-up": "Picked Up",
    "in-transit": "In Transit",
    "out-for-delivery": "Out for Delivery",
    delayed: "Delayed",
    delivered: "Delivered",
    failed: "Failed",
    returned: "Returned",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const styles: Record<RiskLevel, string> = {
    low: "bg-success/10 text-success border-success/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    high: "bg-accent/10 text-accent border-accent/20",
    critical: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const labels: Record<RiskLevel, string> = {
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk",
    critical: "Critical",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[level],
        className
      )}
    >
      {labels[level]}
    </span>
  );
}
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Package, Truck, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";

export type OrderStatus = 
  | "pending" 
  | "confirmed" 
  | "processing" 
  | "shipped" 
  | "delivered" 
  | "cancelled" 
  | "refunded";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<OrderStatus, { 
  label: string; 
  icon: React.ElementType; 
  className: string;
}> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "bg-info/10 text-info border-info/20",
  },
  processing: {
    label: "Processing",
    icon: Package,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    className: "bg-accent/10 text-accent border-accent/20",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border-success/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  refunded: {
    label: "Refunded",
    icon: AlertCircle,
    className: "bg-muted text-muted-foreground border-muted",
  },
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "gap-1.5 font-medium border",
        config.className,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
}

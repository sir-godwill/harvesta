import { Check, Clock, AlertTriangle, Package, Truck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineEvent, ShipmentStatus } from "@/services/logistics-api";

interface DeliveryTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function DeliveryTimeline({ events, className }: DeliveryTimelineProps) {
  const getStatusIcon = (status: ShipmentStatus) => {
    const icons: Record<ShipmentStatus, React.ReactNode> = {
      pending: <Clock className="h-4 w-4" />,
      "picked-up": <Package className="h-4 w-4" />,
      "in-transit": <Truck className="h-4 w-4" />,
      delayed: <AlertTriangle className="h-4 w-4" />,
      delivered: <Check className="h-4 w-4" />,
      cancelled: <AlertTriangle className="h-4 w-4" />,
    };
    return icons[status];
  };

  const getStatusColor = (status: ShipmentStatus) => {
    const colors: Record<ShipmentStatus, string> = {
      pending: "bg-muted text-muted-foreground",
      "picked-up": "bg-primary text-primary-foreground",
      "in-transit": "bg-accent text-accent-foreground",
      delayed: "bg-warning text-warning-foreground",
      delivered: "bg-success text-success-foreground",
      cancelled: "bg-destructive text-destructive-foreground",
    };
    return colors[status];
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      time: date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <div className={cn("space-y-4", className)}>
      {events.map((event, index) => {
        const { date, time } = formatDateTime(event.timestamp);
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="flex gap-4">
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  getStatusColor(event.status)
                )}
              >
                {getStatusIcon(event.status)}
              </div>
              {!isLast && <div className="h-full w-0.5 bg-border" />}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {event.description}
                  </p>
                  {event.location && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </p>
                  )}
                  {event.actor && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      by {event.actor}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-foreground">{time}</p>
                  <p className="text-xs text-muted-foreground">{date}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

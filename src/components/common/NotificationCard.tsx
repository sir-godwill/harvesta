import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, Package, Truck, MessageSquare, AlertCircle, CheckCircle2, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export type NotificationType = "order" | "delivery" | "message" | "alert" | "success";

interface NotificationCardProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  className?: string;
}

const typeConfig: Record<NotificationType, {
  icon: React.ElementType;
  iconClassName: string;
}> = {
  order: {
    icon: Package,
    iconClassName: "bg-primary/10 text-primary",
  },
  delivery: {
    icon: Truck,
    iconClassName: "bg-success/10 text-success",
  },
  message: {
    icon: MessageSquare,
    iconClassName: "bg-info/10 text-info",
  },
  alert: {
    icon: AlertCircle,
    iconClassName: "bg-warning/10 text-warning",
  },
  success: {
    icon: CheckCircle2,
    iconClassName: "bg-success/10 text-success",
  },
};

export function NotificationCard({
  id,
  type,
  title,
  message,
  timestamp,
  isRead = false,
  actionLabel,
  onAction,
  onDismiss,
  className,
}: NotificationCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200",
      !isRead && "border-l-4 border-l-primary",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-full shrink-0",
            config.iconClassName
          )}>
            <Icon className="h-4 w-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <p className={cn(
                  "text-sm font-medium",
                  !isRead && "text-foreground"
                )}>
                  {title}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(timestamp, { addSuffix: true })}
                </p>
              </div>
              
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={onDismiss}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {actionLabel && onAction && (
              <Button
                variant="link"
                className="h-auto p-0 mt-2 text-primary"
                onClick={onAction}
              >
                {actionLabel}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

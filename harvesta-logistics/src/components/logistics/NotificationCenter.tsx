import { useState } from "react";
import { Bell, Check, CheckCheck, Truck, AlertTriangle, Package, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Notification {
  id: string;
  type: "shipment" | "alert" | "dispute" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "N-001",
    type: "alert",
    title: "Shipment Delayed",
    message: "SHP-2024-003 is delayed due to road conditions. ETA updated.",
    timestamp: "2024-01-14T12:30:00Z",
    isRead: false,
    actionUrl: "/order/SHP-2024-003",
  },
  {
    id: "N-002",
    type: "shipment",
    title: "Delivery Completed",
    message: "SHP-2024-004 has been successfully delivered to Port de Douala.",
    timestamp: "2024-01-14T11:00:00Z",
    isRead: false,
    actionUrl: "/order/SHP-2024-004",
  },
  {
    id: "N-003",
    type: "dispute",
    title: "New Dispute Filed",
    message: "Customer filed a dispute for order ORD-2024-4520 regarding damaged goods.",
    timestamp: "2024-01-14T10:00:00Z",
    isRead: true,
    actionUrl: "/admin/disputes",
  },
  {
    id: "N-004",
    type: "system",
    title: "Partner Rating Updated",
    message: "Jean-Pierre Mbarga received a 5-star rating for recent delivery.",
    timestamp: "2024-01-14T09:30:00Z",
    isRead: true,
  },
  {
    id: "N-005",
    type: "shipment",
    title: "Pickup Confirmed",
    message: "SHP-2024-005 has been picked up from Kribi by Trans-Cameroon Express.",
    timestamp: "2024-01-14T09:00:00Z",
    isRead: true,
    actionUrl: "/order/SHP-2024-005",
  },
  {
    id: "N-006",
    type: "alert",
    title: "SLA Breach Warning",
    message: "SHP-2024-007 is at risk of SLA breach. Action required.",
    timestamp: "2024-01-13T16:00:00Z",
    isRead: true,
    actionUrl: "/order/SHP-2024-007",
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "shipment":
        return <Truck className="h-4 w-4 text-primary" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "dispute":
        return <MessageSquare className="h-4 w-4 text-destructive" />;
      default:
        return <Package className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours < 1) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount} new</Badge>
              )}
            </SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/30 transition-colors ${!notification.isRead ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm ${!notification.isRead ? "font-semibold" : "font-medium"}`}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(notification.timestamp)}
                        </span>
                        {notification.actionUrl && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => {
                              markAsRead(notification.id);
                              window.location.href = notification.actionUrl!;
                            }}
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Bell className="h-12 w-12 opacity-50 mb-3" />
              <p>No notifications</p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

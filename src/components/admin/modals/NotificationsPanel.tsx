import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, CheckCircle2, AlertTriangle, Package, Users, 
  ShoppingCart, Truck, CreditCard, X, Check, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'order' | 'seller' | 'product' | 'payment' | 'logistics' | 'alert' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
  priority?: 'low' | 'medium' | 'high';
}

interface NotificationsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialNotifications: Notification[] = [
  { id: '1', type: 'order', title: 'New Order Received', description: 'Order #ORD-4521 from EuroFoods GmbH worth XAF 2,500,000', time: '2 min ago', read: false, priority: 'high' },
  { id: '2', type: 'seller', title: 'New Seller Application', description: 'Kofi Organic Farms has submitted a seller application', time: '15 min ago', read: false },
  { id: '3', type: 'alert', title: 'Dispute Escalated', description: 'Dispute #DSP-001 has been escalated and requires attention', time: '1 hour ago', read: false, priority: 'high' },
  { id: '4', type: 'logistics', title: 'Shipment Delayed', description: 'Shipment #TRK-2341 to Germany is delayed by 2 days', time: '2 hours ago', read: false, priority: 'medium' },
  { id: '5', type: 'payment', title: 'Payout Completed', description: 'XAF 1,800,000 has been paid to Ethiopian Coffee', time: '3 hours ago', read: true },
  { id: '6', type: 'product', title: 'Product Approved', description: 'Premium Cocoa Beans listing has been approved', time: '5 hours ago', read: true },
  { id: '7', type: 'system', title: 'System Maintenance', description: 'Scheduled maintenance on Jan 15, 2024 at 2:00 AM UTC', time: '1 day ago', read: true },
];

export function NotificationsPanel({ open, onOpenChange }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = {
      order: ShoppingCart,
      seller: Users,
      product: Package,
      payment: CreditCard,
      logistics: Truck,
      alert: AlertTriangle,
      system: Bell,
    };
    return icons[type] || Bell;
  };

  const getIconColor = (type: string, priority?: string) => {
    if (priority === 'high') return 'text-destructive bg-destructive/10';
    const colors: Record<string, string> = {
      order: 'text-success bg-success/10',
      seller: 'text-primary bg-primary/10',
      product: 'text-info bg-info/10',
      payment: 'text-accent bg-accent/10',
      logistics: 'text-primary bg-primary/10',
      alert: 'text-warning bg-warning/10',
      system: 'text-muted-foreground bg-muted',
    };
    return colors[type] || 'text-muted-foreground bg-muted';
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </SheetTitle>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  <Check className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="p-4 space-y-2">
            <AnimatePresence>
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification, index) => {
                  const Icon = getIcon(notification.type);
                  const iconColor = getIconColor(notification.type, notification.priority);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'p-3 rounded-lg border transition-colors cursor-pointer group',
                        notification.read ? 'bg-background' : 'bg-muted/50',
                        notification.priority === 'high' && !notification.read && 'border-destructive/30'
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn('p-2 rounded-lg', iconColor)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn(
                              'font-medium text-sm',
                              !notification.read && 'font-semibold'
                            )}>
                              {notification.title}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.description}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={clearAll}>
                Clear All
              </Button>
              <Button variant="outline" size="icon" onClick={() => toast.info('Opening notification settings...')}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

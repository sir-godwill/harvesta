import { useState, useEffect } from 'react';
import { fetchAffiliateNotifications, markNotificationRead } from '@/lib/api';
import { 
  Bell, 
  Wallet, 
  Store, 
  Gift, 
  Trophy,
  ArrowUpRight,
  Loader2,
  Check,
  CheckCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function NotificationsTab() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const data = await fetchAffiliateNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    for (const notification of notifications.filter(n => !n.read)) {
      await handleMarkRead(notification.id);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'commission':
        return <Wallet className="w-5 h-5" />;
      case 'seller':
        return <Store className="w-5 h-5" />;
      case 'campaign':
        return <Gift className="w-5 h-5" />;
      case 'milestone':
        return <Trophy className="w-5 h-5" />;
      case 'payout':
        return <ArrowUpRight className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'commission':
        return 'bg-primary/10 text-primary';
      case 'seller':
        return 'bg-secondary/10 text-secondary';
      case 'campaign':
        return 'bg-purple-100 text-purple-600';
      case 'milestone':
        return 'bg-amber-100 text-amber-600';
      case 'payout':
        return 'bg-accent/10 text-accent';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            Stay updated on your affiliate activity
          </p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="btn-outline"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Unread Count */}
      {unreadCount > 0 && (
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-medium text-foreground">You have {unreadCount} unread notifications</p>
            <p className="text-sm text-muted-foreground">Click on a notification to mark it as read</p>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="section-card divide-y divide-border">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No notifications yet</p>
            <p className="text-sm text-muted-foreground">
              You'll see updates about commissions, sellers, and campaigns here
            </p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div 
              key={notification.id}
              onClick={() => !notification.read && handleMarkRead(notification.id)}
              className={cn(
                'p-4 flex items-start gap-4 transition-colors cursor-pointer animate-fade-in',
                !notification.read && 'bg-primary/5 hover:bg-primary/10',
                notification.read && 'hover:bg-muted/50'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                getNotificationColor(notification.type)
              )}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn(
                    'font-medium text-foreground',
                    !notification.read && 'font-semibold'
                  )}>
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatTimestamp(notification.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

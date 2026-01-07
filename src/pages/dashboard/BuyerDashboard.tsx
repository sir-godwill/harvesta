import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, CreditCard, Store, ArrowRight, Bell, Heart, MessageSquare, HelpCircle, TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/common/StatCard";
import { OrderStatusBadge } from "@/components/common/OrderStatusBadge";
import { NotificationCard } from "@/components/common/NotificationCard";
import { DashboardSkeleton } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { fetchBuyerDashboard, fetchRecentOrders, fetchNotifications, type DashboardStats, type RecentOrder, type Notification } from "@/lib/api";
import { useApp } from "@/contexts/AppContext";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/layout/Header";

export default function BuyerDashboard() {
  const { formatPrice } = useApp();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsData, ordersData, notificationsData] = await Promise.all([
          fetchBuyerDashboard(),
          fetchRecentOrders(),
          fetchNotifications(),
        ]);
        setStats(statsData);
        setOrders(ordersData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  const quickLinks = [
    { label: "My Orders", icon: Package, href: "/orders", color: "bg-primary/10 text-primary" },
    { label: "Saved Items", icon: Heart, href: "/saved-products", color: "bg-destructive/10 text-destructive" },
    { label: "Saved Suppliers", icon: Store, href: "/saved-suppliers", color: "bg-success/10 text-success" },
    { label: "Messages", icon: MessageSquare, href: "/messages", color: "bg-info/10 text-info" },
    { label: "Support", icon: HelpCircle, href: "/support", color: "bg-warning/10 text-warning" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Good morning!</h1>
            <p className="text-muted-foreground">Welcome back to your Harvestá dashboard</p>
          </div>
          <Badge variant="outline" className="w-fit bg-accent/10 text-accent border-accent/30">
            <Store className="h-3 w-3 mr-1" />
            Business Buyer
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon={Package}
            variant="primary"
            onClick={() => {}}
          />
          <StatCard
            title="Active Orders"
            value={stats?.activeOrders || 0}
            icon={TrendingUp}
            variant="info"
            onClick={() => {}}
          />
          <StatCard
            title="Pending Payments"
            value={stats?.pendingPayments || 0}
            icon={CreditCard}
            variant="warning"
            onClick={() => {}}
          />
          <StatCard
            title="Saved Suppliers"
            value={stats?.savedSuppliers || 0}
            icon={Store}
            variant="success"
            onClick={() => {}}
          />
        </div>

        {/* Quick Links */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickLinks.map((link) => (
            <Link key={link.label} to={link.href}>
              <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                <div className={`p-1 rounded ${link.color}`}>
                  <link.icon className="h-4 w-4" />
                </div>
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
              <Link to="/orders">
                <Button variant="ghost" size="sm" className="text-primary">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <EmptyState
                  variant="orders"
                  title="No orders yet"
                  description="Start exploring products and place your first order"
                  actionLabel="Browse Products"
                  onAction={() => {}}
                />
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{order.orderNumber}</span>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{order.vendorName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(order.createdAt, { addSuffix: true })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{formatPrice(order.totalAmount)}</p>
                        <p className="text-xs text-muted-foreground">{order.items} items</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <Badge variant="secondary">{notifications.filter(n => !n.isRead).length} new</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
              ) : (
                notifications.slice(0, 3).map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    {...notification}
                    className="border-0 shadow-none bg-muted/30"
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommended Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <RefreshCw className="h-5 w-5 text-primary" />
                <span className="text-sm">Reorder</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Package className="h-5 w-5 text-info" />
                <span className="text-sm">Track Order</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <CreditCard className="h-5 w-5 text-warning" />
                <span className="text-sm">Pay Now</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <MessageSquare className="h-5 w-5 text-success" />
                <span className="text-sm">Contact Supplier</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

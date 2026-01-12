import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  fetchSellerMetrics,
  fetchRecentOrders,
  fetchStockAlerts,
  fetchSalesChartData,
  fetchCategoryDistribution,
  formatXAFCompact,
  type SellerMetrics,
  type Order,
  type Product,
  type SalesChartData,
  type CategoryData,
} from '@/services/seller-api';
import { Link } from 'react-router-dom';

function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  variant = 'default',
  delay = 0,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number;
  trendLabel?: string;
  variant?: 'primary' | 'accent' | 'warning' | 'success' | 'default';
  delay?: number;
}) {
  const variantStyles = {
    primary: 'border-primary/20 bg-primary/5',
    accent: 'border-accent/20 bg-accent/5',
    warning: 'border-orange-500/20 bg-orange-500/5',
    success: 'border-emerald-500/20 bg-emerald-500/5',
    default: 'border-border bg-card',
  };

  const iconStyles = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    warning: 'bg-orange-500/10 text-orange-500',
    success: 'bg-emerald-500/10 text-emerald-500',
    default: 'bg-muted text-muted-foreground',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className={`${variantStyles[variant]} border`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium">{title}</p>
            <div className={`p-2 rounded-lg ${iconStyles[variant]}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-foreground">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              {trendLabel && (
                <span className="text-xs text-muted-foreground">{trendLabel}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function SellerDashboard() {
  const [metrics, setMetrics] = useState<SellerMetrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stockAlerts, setStockAlerts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [metricsData, ordersData, alertsData] = await Promise.all([
          fetchSellerMetrics(),
          fetchRecentOrders(),
          fetchStockAlerts(),
        ]);
        setMetrics(metricsData);
        setOrders(ordersData);
        setStockAlerts(alertsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-orange-500/10 text-orange-600',
      processing: 'bg-blue-500/10 text-blue-600',
      shipped: 'bg-purple-500/10 text-purple-600',
      delivered: 'bg-emerald-500/10 text-emerald-600',
      cancelled: 'bg-red-500/10 text-red-600',
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/seller/analytics">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/seller/products">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          <MetricCard
            title="Today's Sales"
            value={metrics ? formatXAFCompact(metrics.todaySales) : '—'}
            icon={DollarSign}
            trend={12}
            trendLabel="vs yesterday"
            variant="primary"
            delay={0}
          />
          <MetricCard
            title="Monthly Revenue"
            value={metrics ? formatXAFCompact(metrics.monthlyRevenue) : '—'}
            icon={TrendingUp}
            trend={8}
            trendLabel="vs last month"
            variant="accent"
            delay={0.05}
          />
          <MetricCard
            title="Pending Orders"
            value={metrics?.pendingOrders ?? '—'}
            icon={ShoppingCart}
            variant="warning"
            delay={0.1}
          />
          <MetricCard
            title="Fulfilled"
            value={metrics?.fulfilledOrders ?? '—'}
            icon={Package}
            trend={15}
            variant="success"
            delay={0.15}
          />
          <MetricCard
            title="Stock Alerts"
            value={metrics?.stockAlerts ?? '—'}
            icon={AlertTriangle}
            variant="warning"
            delay={0.2}
          />
          <MetricCard
            title="Inquiries"
            value={metrics?.buyerInquiries ?? '—'}
            icon={MessageSquare}
            variant="default"
            delay={0.25}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/seller/orders">
                    View all <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    orders.slice(0, 4).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">{order.buyerName}</p>
                            <Badge className={getStatusColor(order.status)} variant="secondary">
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {order.productName} • Qty: {order.quantity}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm font-semibold">
                            {new Intl.NumberFormat('fr-CM').format(order.total)} XAF
                          </p>
                          <p className="text-xs text-muted-foreground">{order.orderNumber}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start" asChild>
                  <Link to="/seller/products">
                    <Package className="w-4 h-4 mr-2" />
                    Products
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="justify-start" asChild>
                  <Link to="/seller/orders">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Orders
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="justify-start" asChild>
                  <Link to="/seller/rfq">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    RFQ Inbox
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="justify-start" asChild>
                  <Link to="/seller/messages">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Messages
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Stock Alerts */}
            <Card className="border-orange-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stockAlerts.slice(0, 3).map((product) => (
                    <div key={product.id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate">{product.name}</span>
                        <span className="font-medium text-orange-600">{product.stock} left</span>
                      </div>
                      <Progress 
                        value={(product.stock / product.lowStockThreshold) * 100} 
                        className="h-1.5"
                      />
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
                  <Link to="/seller/products">View all products</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

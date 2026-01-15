import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Eye,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SellerLayout } from '@/components/seller/SellerLayout';
// Remove mock data imports
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { fetchDashboardStats, fetchRecentOrders, fetchHistoricalRevenue, DashboardStats } from '@/lib/dashboardApi';
import { format, subDays, startOfDay } from 'date-fns';

const formatCurrency = (amount: number, currency = 'XAF') => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export default function SellerDashboard() {
  const [loading, setLoading] = useState(true);
  const [supplierName, setSupplierName] = useState('Seller');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get basic profile info
      const { data: supplier } = await supabase
        .from('suppliers')
        .select('id, company_name')
        .eq('user_id', user.id)
        .single();

      if (supplier) {
        setSupplierName(supplier.company_name);

        // Get stats
        const dashboardStats = await fetchDashboardStats(supplier.id);
        setStats(dashboardStats);

        // Get recent orders
        const { data: orders } = await fetchRecentOrders(supplier.id);
        if (orders) setRecentOrders(orders);

        // Get historical revenue
        const historicalData = await fetchHistoricalRevenue(supplier.id);
        setRevenueData(historicalData);
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </SellerLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats ? formatCurrency(stats.revenue.total) : '0 XAF',
      change: stats?.revenue.change || 0,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Total Orders',
      value: stats?.orders.total.toString() || '0',
      change: 0,
      icon: ShoppingCart,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Active Products',
      value: stats?.products.active.toString() || '0',
      change: 0,
      icon: Package,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Store Views',
      value: stats?.views.total.toLocaleString() || '0',
      change: stats?.views.change || 0,
      icon: Eye,
      color: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-6 text-white"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {supplierName}!</h1>
              <p className="text-orange-50 mt-1">
                You have {stats?.orders.pending || 0} pending orders requiring attention.
              </p>
            </div>
            <div className="flex gap-3">
              {/* <SeedDataButton /> */}
              <Button variant="secondary" asChild>
                <Link to="/seller/products/add">Add Product</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color} text-white`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                  {stat.change !== 0 && (
                    <div className="flex items-center mt-4 text-xs">
                      {stat.change > 0 ? (
                        <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
                      )}
                      <span className={stat.change > 0 ? 'text-green-500' : 'text-red-500'}>
                        {Math.abs(stat.change)}%
                      </span>
                      <span className="text-muted-foreground ml-1">vs last month</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Section - Placeholder for now until we have time-series data */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#888' }}
                        tickFormatter={(str) => format(new Date(str), 'MMM d')}
                        minTickGap={30}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#888' }}
                        tickFormatter={(val) => `XAF ${val / 1000}k`}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(val: number) => [formatCurrency(val), 'Revenue']}
                        labelFormatter={(label) => format(new Date(label), 'MMMM d, yyyy')}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg">
                    <p>Not enough historical data for chart</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No orders yet.</p>
                ) : (
                  recentOrders.map((item, i) => (
                    <div key={item.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium truncate">{item.products?.name}</h4>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {format(new Date(item.created_at), 'MMM d')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Order #{item.orders?.order_number}</span>
                          <Badge variant="secondary" className="text-xs">
                            {formatCurrency(item.total_price || 0)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button variant="ghost" className="w-full mt-4" asChild>
                <Link to="/seller/orders">View All Orders</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SellerLayout>
  );
}

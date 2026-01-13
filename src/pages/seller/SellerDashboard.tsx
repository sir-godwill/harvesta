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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SellerLayout } from '@/components/seller/SellerLayout';
import {
  mockSellerProfile,
  mockSellerOrders,
  mockSellerAnalytics,
  mockSellerProducts,
  mockSellerRFQs,
} from '@/services/seller-api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';

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
  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(mockSellerAnalytics.revenue.total),
      change: mockSellerAnalytics.revenue.change,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Total Orders',
      value: mockSellerAnalytics.orders.total.toString(),
      change: mockSellerAnalytics.orders.change,
      icon: ShoppingCart,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Active Products',
      value: mockSellerAnalytics.products.active.toString(),
      change: 5.2,
      icon: Package,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Store Views',
      value: mockSellerAnalytics.views.total.toLocaleString(),
      change: mockSellerAnalytics.views.change,
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
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {mockSellerProfile.companyName}!</h1>
              <p className="text-green-100 mt-1">
                You have {mockSellerOrders.filter(o => o.status === 'pending').length} pending orders and{' '}
                {mockSellerRFQs.filter(r => r.status === 'open').length} new RFQs
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" asChild>
                <Link to="/seller/products/add">Add Product</Link>
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
                <Link to="/seller/orders">View Orders</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {stat.change >= 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        )}
                        <span className={stat.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {Math.abs(stat.change)}%
                        </span>
                        <span className="text-muted-foreground text-xs">vs last month</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockSellerAnalytics.revenue.byMonth}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revenueGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Views Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Store Views This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockSellerAnalytics.views.byDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders & Products Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/seller/orders">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSellerOrders.slice(0, 4).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.buyerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatCurrency(order.totalAmount, order.currency)}</p>
                      <Badge variant="secondary" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Top Products</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/seller/products">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSellerAnalytics.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{product.orders} orders</span>
                        <span>•</span>
                        <span>{formatCurrency(product.revenue)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockSellerAnalytics.orders.byStatus.map((item) => (
                <div key={item.status} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.status}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <Progress value={(item.count / mockSellerAnalytics.orders.total) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockSellerProducts
                  .filter((p) => p.status === 'out_of_stock' || p.stock < 100)
                  .slice(0, 3)
                  .map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-orange-600">{product.stock === 0 ? 'Out of stock' : `${product.stock} ${product.unit} remaining`}</p>
                      </div>
                      <Button size="sm" variant="outline" className="text-orange-600 border-orange-200">
                        Restock
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending RFQs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Pending RFQs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockSellerRFQs
                  .filter((r) => r.status === 'open')
                  .slice(0, 3)
                  .map((rfq) => (
                    <div key={rfq.id} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{rfq.productName}</p>
                          <p className="text-xs text-muted-foreground">{rfq.buyerName} • {rfq.quantity} {rfq.unit}</p>
                        </div>
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          {new Date(rfq.deadline).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/seller/rfqs">View All RFQs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SellerLayout>
  );
}

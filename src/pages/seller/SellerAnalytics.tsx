import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Eye,
  Users,
  MapPin,
  Calendar,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { mockSellerAnalytics } from '@/services/seller-api';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);
};

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function SellerAnalytics() {
  const [period, setPeriod] = useState('30d');
  const analytics = mockSellerAnalytics;

  const conversionData = [
    { name: 'Views', value: analytics.views.total, percentage: 100 },
    { name: 'Product Clicks', value: Math.round(analytics.views.total * 0.45), percentage: 45 },
    { name: 'Add to Cart', value: Math.round(analytics.views.total * 0.12), percentage: 12 },
    { name: 'Checkout', value: Math.round(analytics.views.total * 0.05), percentage: 5 },
    { name: 'Purchase', value: analytics.orders.total, percentage: 1.6 },
  ];

  const geographyData = [
    { country: 'Cameroon', orders: 89, revenue: 12500000, percentage: 35 },
    { country: 'Germany', orders: 45, revenue: 8900000, percentage: 20 },
    { country: 'France', orders: 38, revenue: 7200000, percentage: 16 },
    { country: 'Belgium', orders: 28, revenue: 5400000, percentage: 12 },
    { country: 'Others', orders: 56, revenue: 11600000, percentage: 17 },
  ];

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Track your store performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Total Revenue',
              value: formatCurrency(analytics.revenue.total),
              change: analytics.revenue.change,
              icon: DollarSign,
              color: 'from-green-500 to-emerald-600',
            },
            {
              title: 'Orders',
              value: analytics.orders.total.toString(),
              change: analytics.orders.change,
              icon: ShoppingCart,
              color: 'from-blue-500 to-indigo-600',
            },
            {
              title: 'Active Products',
              value: analytics.products.active.toString(),
              change: 5.2,
              icon: Package,
              color: 'from-purple-500 to-pink-600',
            },
            {
              title: 'Store Views',
              value: analytics.views.total.toLocaleString(),
              change: analytics.views.change,
              icon: Eye,
              color: 'from-orange-500 to-red-600',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {stat.change >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={stat.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {Math.abs(stat.change)}%
                        </span>
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
              <CardTitle className="text-base">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.revenue.byMonth}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
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
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revenueGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Order Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.orders.byStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {analytics.orders.byStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Funnel & Geography */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {conversionData.map((step, index) => (
                <div key={step.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{step.name}</span>
                    <span className="font-medium">{step.value.toLocaleString()} ({step.percentage}%)</span>
                  </div>
                  <div className="relative">
                    <Progress value={step.percentage} className="h-3" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Orders by Region
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geographyData.map((region, index) => (
                  <div key={region.country} className="flex items-center gap-4">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{region.country}</span>
                        <span className="text-sm text-muted-foreground">{region.orders} orders</span>
                      </div>
                      <Progress value={region.percentage} className="h-2" />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">{region.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products & Top Buyers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.orders} orders</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(product.revenue)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-5 h-5" />
                Top Buyers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topBuyers.map((buyer, index) => (
                  <div key={buyer.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{buyer.name}</p>
                      <p className="text-sm text-muted-foreground">{buyer.country} • {buyer.orders} orders</p>
                    </div>
                    <p className="font-semibold">${buyer.totalSpent.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SellerLayout>
  );
}

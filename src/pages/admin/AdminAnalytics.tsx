import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Globe,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchAnalytics, AnalyticsData } from '@/lib/admin-api';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const COLORS = ['hsl(142, 45%, 35%)', 'hsl(42, 85%, 55%)', 'hsl(30, 35%, 35%)', 'hsl(205, 85%, 45%)'];

function MetricCard({ title, value, change, icon: Icon, trend }: {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  trend: 'up' | 'down';
}) {
  return (
    <motion.div variants={itemVariants} whileHover={{ y: -2 }}>
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{value}</p>
              <div className={cn(
                'inline-flex items-center gap-1 text-xs sm:text-sm font-medium',
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              )}>
                {trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                {Math.abs(change)}%
                <span className="text-muted-foreground font-normal">vs last period</span>
              </div>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RegionCard({ region, revenue, orders, growth }: {
  region: string;
  revenue: number;
  orders: number;
  growth: number;
}) {
  const formatRevenue = (val: number) =>
    new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(val);

  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{region}</span>
            </div>
            <Badge variant={growth >= 0 ? 'default' : 'destructive'} className={growth >= 0 ? 'bg-green-600' : ''}>
              {growth >= 0 ? '+' : ''}{growth}%
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="font-bold">${formatRevenue(revenue)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Orders</p>
              <p className="font-bold">{orders.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchAnalytics().then((data) => {
      setAnalytics(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', notation: 'compact', maximumFractionDigits: 1 }).format(val);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4 sm:space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Analytics & Insights
          </h1>
          <p className="text-sm text-muted-foreground">Track performance, trends, and AI-powered insights</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[130px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(analytics.revenue.total)}
          change={analytics.revenue.change}
          icon={DollarSign}
          trend={analytics.revenue.change >= 0 ? 'up' : 'down'}
        />
        <MetricCard
          title="Total Orders"
          value={analytics.orders.total.toLocaleString()}
          change={analytics.orders.change}
          icon={ShoppingCart}
          trend={analytics.orders.change >= 0 ? 'up' : 'down'}
        />
        <MetricCard
          title="Active Sellers"
          value={analytics.sellers.active.toLocaleString()}
          change={analytics.sellers.change}
          icon={Users}
          trend={analytics.sellers.change >= 0 ? 'up' : 'down'}
        />
        <MetricCard
          title="Products Sold"
          value={analytics.products.sold.toLocaleString()}
          change={analytics.products.change}
          icon={Package}
          trend={analytics.products.change >= 0 ? 'up' : 'down'}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Revenue Trend</CardTitle>
              <CardDescription>Daily revenue over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.revenueChart}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(142, 45%, 35%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(142, 45%, 35%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(142, 45%, 35%)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories Pie */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {analytics.categoryBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {analytics.categoryBreakdown.map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs truncate">{cat.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Regional Performance & AI Insights */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Regional */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Globe className="h-5 w-5" /> Regional Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {analytics.regionalData.map((region) => (
                  <RegionCard key={region.region} {...region} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Insights */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-primary/5 to-orange-500/5">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-500" /> AI Insights
              </CardTitle>
              <CardDescription>AI-powered recommendations and predictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.aiInsights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 rounded-lg bg-background border"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'p-1.5 rounded-lg',
                      insight.type === 'opportunity' ? 'bg-green-100' : 
                      insight.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                    )}>
                      {insight.type === 'opportunity' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : insight.type === 'warning' ? (
                        <TrendingDown className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{insight.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Performers */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Top Performing Sellers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topSellers.map((seller, i) => (
                <div key={seller.name} className="flex items-center gap-4">
                  <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{seller.name}</span>
                      <span className="text-sm text-muted-foreground">{formatCurrency(seller.revenue)}</span>
                    </div>
                    <Progress value={seller.percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

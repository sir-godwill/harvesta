import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Truck,
  AlertTriangle,
  Activity,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { fetchDashboardStats, fetchLiveFeed, DashboardStats, LiveFeedItem } from '@/lib/api';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function formatCurrency(amount: number, currency = 'XAF') {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

function formatNumber(num: number) {
  return new Intl.NumberFormat('en').format(num);
}

function KPICard({ title, value, subtitle, trend, icon: Icon, iconColor, delay = 0 }: {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  icon: React.ElementType;
  iconColor: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="kpi-card cursor-pointer overflow-hidden relative group">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
              <motion.p 
                className="text-xl sm:text-2xl font-bold"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay * 0.1 + 0.3 }}
              >
                {value}
              </motion.p>
              {subtitle && <p className="text-[10px] sm:text-xs text-muted-foreground">{subtitle}</p>}
              {trend !== undefined && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: delay * 0.1 + 0.5 }}
                  className={cn('flex items-center gap-1 text-xs sm:text-sm', trend >= 0 ? 'text-success' : 'text-destructive')}
                >
                  {trend >= 0 ? <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />}
                  <span>{Math.abs(trend)}%</span>
                </motion.div>
              )}
            </div>
            <motion.div 
              className={cn('rounded-xl p-2 sm:p-3 transition-transform group-hover:scale-110', iconColor)}
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LiveFeedCard({ items }: { items: LiveFeedItem[] }) {
  const getIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = { order: ShoppingCart, seller: Users, buyer: Users, logistics: Truck, alert: AlertTriangle, system: Activity };
    return icons[type] || Activity;
  };

  const getSeverityColor = (severity?: string) => {
    const colors: Record<string, string> = { success: 'text-success', warning: 'text-warning', error: 'text-destructive', info: 'text-info' };
    return colors[severity || ''] || 'text-muted-foreground';
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base sm:text-lg">Live Activity</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Real-time platform activity</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-success">
            <motion.span 
              className="h-2 w-2 rounded-full bg-success"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            Live
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.map((item, index) => {
            const Icon = getIcon(item.type);
            return (
              <motion.div 
                key={item.id} 
                className="feed-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={cn('rounded-lg p-2', getSeverityColor(item.severity), 'bg-muted')}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate">{item.title}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{item.description}</p>
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            );
          })}
          <Button variant="ghost" className="w-full mt-2 text-xs sm:text-sm">
            View All <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [feed, setFeed] = useState<LiveFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboardStats(), fetchLiveFeed()]).then(([s, f]) => {
      setStats(s);
      setFeed(f);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-8 w-8 border-b-2 border-primary"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4 sm:space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
            Command Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Welcome back! Here's what's happening on Harvestá.</p>
        </div>
        <Badge variant="outline" className="w-fit text-xs sm:text-sm">
          <span className="h-2 w-2 rounded-full bg-success mr-2" />
          All Systems Operational
        </Badge>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard title="Today's Revenue" value={formatCurrency(stats.revenue.today)} trend={stats.revenue.trend} icon={DollarSign} iconColor="bg-primary" delay={0} />
        <KPICard title="Total Orders" value={formatNumber(stats.orders.total)} subtitle={`${stats.orders.pending} pending`} icon={ShoppingCart} iconColor="bg-accent" delay={1} />
        <KPICard title="Active Sellers" value={formatNumber(stats.users.activeSellers)} subtitle={`${stats.users.newToday} new today`} icon={Users} iconColor="bg-secondary" delay={2} />
        <KPICard title="In Transit" value={formatNumber(stats.logistics.inTransit)} subtitle={`${stats.logistics.exceptions} exceptions`} icon={Truck} iconColor="bg-info" delay={3} />
      </div>

      {/* Orders & Health */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'Pending', value: stats.orders.pending, icon: Clock, color: 'text-warning bg-warning/10' },
                  { label: 'Shipped', value: stats.orders.shipped, icon: Package, color: 'text-info bg-info/10' },
                  { label: 'Delayed', value: stats.orders.delayed, icon: AlertTriangle, color: 'text-destructive bg-destructive/10' },
                  { label: 'Cancelled', value: stats.orders.cancelled, icon: XCircle, color: 'text-muted-foreground bg-muted' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className={cn('text-center p-3 sm:p-4 rounded-xl', item.color.split(' ')[1])}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <item.icon className={cn('h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2', item.color.split(' ')[0])} />
                    <p className="text-lg sm:text-2xl font-bold">{item.value}</p>
                    <p className="text-[10px] sm:text-sm text-muted-foreground">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Platform Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'API Status', status: stats.platformHealth.apiStatus },
                { label: 'Database', status: stats.platformHealth.dbStatus },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                >
                  <span className="text-xs sm:text-sm">{item.label}</span>
                  <Badge variant="default" className="bg-success text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {item.status}
                  </Badge>
                </motion.div>
              ))}
              <div className="pt-2">
                <div className="flex justify-between text-xs sm:text-sm mb-1">
                  <span>Uptime</span>
                  <span className="font-medium">{stats.platformHealth.uptime}%</span>
                </div>
                <Progress value={stats.platformHealth.uptime} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Live Feed & Disputes */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <LiveFeedCard items={feed} />
        
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Disputes & Escalations</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Requires attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                {[
                  { label: 'Open', value: stats.disputes.open, color: 'bg-warning/10 text-warning' },
                  { label: 'Escalated', value: stats.disputes.escalated, color: 'bg-destructive/10 text-destructive' },
                  { label: 'Resolved', value: stats.disputes.resolved, color: 'bg-success/10 text-success' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className={cn('p-3 sm:p-4 rounded-xl', item.color.split(' ')[0])}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                  >
                    <p className={cn('text-2xl sm:text-3xl font-bold', item.color.split(' ')[1])}>{item.value}</p>
                    <p className="text-[10px] sm:text-sm text-muted-foreground">{item.label}</p>
                  </motion.div>
                ))}
              </div>
              <Button className="w-full mt-4 text-xs sm:text-sm" variant="outline">
                View All Disputes
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

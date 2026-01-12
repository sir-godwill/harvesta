import { useState, useEffect } from 'react';
import { fetchAffiliateAnalytics, exportAnalyticsCSV } from '@/lib/api';
import { formatCurrency, simulatedData } from '@/lib/mockData';
import { 
  TrendingUp, 
  Download, 
  Calendar,
  Loader2,
  BarChart3,
  PieChart,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartPieChart,
  Pie,
  Cell,
} from 'recharts';
import { ExportModal } from '@/components/ui/ExportModal';
import { toast } from 'sonner';

const COLORS = ['#2F8F46', '#F97316', '#7A5C3E', '#3B82F6', '#8B5CF6'];

export function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState('week');
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const data = await fetchAffiliateAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
    toast.success('Analytics refreshed');
  };

  const handleExport = async (format: 'csv' | 'pdf', dateRange: { start: string; end: string }) => {
    try {
      await exportAnalyticsCSV();
      toast.success(`Analytics exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export analytics');
    }
  };

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
          <h2 className="text-xl font-bold text-foreground">Analytics</h2>
          <p className="text-sm text-muted-foreground">Track your performance and optimize your strategy</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={cn("w-4 h-4 text-muted-foreground", refreshing && "animate-spin")} />
          </button>
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            {['week', 'month', 'quarter'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-md transition-all capitalize',
                  timeframe === period 
                    ? 'bg-card text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {period}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowExportModal(true)}
            className="btn-outline py-1.5"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card-green">
          <p className="text-sm text-muted-foreground">Total Clicks</p>
          <p className="text-2xl font-bold text-foreground">
            {analytics?.dailyClicks?.reduce((acc: number, d: any) => acc + d.clicks, 0) || 1599}
          </p>
          <p className="text-xs text-emerald-600">+12% vs last {timeframe}</p>
        </div>
        <div className="stat-card-orange">
          <p className="text-sm text-muted-foreground">Total Signups</p>
          <p className="text-2xl font-bold text-foreground">
            {analytics?.dailyClicks?.reduce((acc: number, d: any) => acc + d.signups, 0) || 98}
          </p>
          <p className="text-xs text-accent">+8% vs last {timeframe}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(analytics?.dailyClicks?.reduce((acc: number, d: any) => acc + d.revenue, 0) || 1531000)}
          </p>
          <p className="text-xs text-primary">+15% vs last {timeframe}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Conversion Rate</p>
          <p className="text-2xl font-bold text-foreground">5.48%</p>
          <p className="text-xs text-emerald-600">+0.8% vs last {timeframe}</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="section-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Performance Trends
            </h3>
            <p className="text-sm text-muted-foreground">Clicks, signups, and revenue over time</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              Clicks
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent" />
              Revenue
            </span>
          </div>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics?.dailyClicks || simulatedData.analytics.dailyClicks}>
              <defs>
                <linearGradient id="colorClicksAnalytics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2F8F46" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2F8F46" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRevenueAnalytics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? formatCurrency(value) : value,
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="clicks" 
                stroke="#2F8F46" 
                fillOpacity={1} 
                fill="url(#colorClicksAnalytics)" 
                strokeWidth={2}
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="revenue" 
                stroke="#F97316" 
                fillOpacity={1} 
                fill="url(#colorRevenueAnalytics)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="section-card p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Top Performing Products
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.topProducts || simulatedData.analytics.topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="referrals" fill="#2F8F46" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Product List */}
          <div className="mt-4 space-y-2">
            {(analytics?.topProducts || simulatedData.analytics.topProducts).map((product: any, index: number) => (
              <div key={product.name} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">{product.name}</span>
                </div>
                <span className="text-sm text-primary font-medium">{formatCurrency(product.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversions by Country */}
        <div className="section-card p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Conversions by Country
          </h3>
          <div className="flex items-center gap-4">
            <div className="h-[180px] w-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartPieChart>
                  <Pie
                    data={analytics?.conversionsByCountry || simulatedData.analytics.conversionsByCountry}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="conversions"
                  >
                    {(analytics?.conversionsByCountry || simulatedData.analytics.conversionsByCountry).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </RechartPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {(analytics?.conversionsByCountry || simulatedData.analytics.conversionsByCountry).map((country: any, index: number) => (
                <div key={country.country} className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm flex-1 text-foreground">{country.country}</span>
                  <span className="text-sm font-medium text-muted-foreground">{country.conversions}</span>
                  <span className="text-sm font-medium text-primary">{country.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Rate Card */}
      <div className="section-card p-6 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Overall Conversion Rate</h3>
            <p className="text-sm text-muted-foreground">Visitors who completed a purchase or signup</p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-4xl font-bold text-primary">5.48%</p>
            <p className="text-sm text-emerald-600 flex items-center gap-1 justify-center sm:justify-end">
              <TrendingUp className="w-4 h-4" />
              +0.8% from last week
            </p>
          </div>
        </div>
        <div className="mt-4 bg-muted rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-1000"
            style={{ width: '54.8%' }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Industry average: 3.2% • You're performing 71% above average!
        </p>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Analytics"
        dataType="analytics"
      />
    </div>
  );
}

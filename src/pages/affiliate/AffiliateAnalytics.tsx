import { useState } from 'react';
import { AffiliateLayout } from '@/components/affiliate/AffiliateLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  TrendingUp, 
  Download, 
  BarChart3,
  Globe,
  RefreshCw,
} from 'lucide-react';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const dailyData = [
  { date: 'Mon', clicks: 245, signups: 12, revenue: 185000 },
  { date: 'Tue', clicks: 312, signups: 18, revenue: 225000 },
  { date: 'Wed', clicks: 289, signups: 15, revenue: 198000 },
  { date: 'Thu', clicks: 356, signups: 22, revenue: 287000 },
  { date: 'Fri', clicks: 398, signups: 28, revenue: 342000 },
  { date: 'Sat', clicks: 267, signups: 14, revenue: 176000 },
  { date: 'Sun', clicks: 189, signups: 9, revenue: 118000 },
];

const topProducts = [
  { name: 'Organic Cocoa Beans', referrals: 45, revenue: 425000 },
  { name: 'Raw Shea Butter', referrals: 38, revenue: 312000 },
  { name: 'Arabica Coffee', referrals: 32, revenue: 289000 },
  { name: 'Palm Oil', referrals: 28, revenue: 256000 },
  { name: 'Cashew Nuts', referrals: 24, revenue: 198000 },
];

const countryData = [
  { country: 'Cameroon', conversions: 45, percentage: 38 },
  { country: 'Ghana', conversions: 32, percentage: 27 },
  { country: 'Nigeria', conversions: 24, percentage: 20 },
  { country: 'Ivory Coast', conversions: 12, percentage: 10 },
  { country: 'Others', conversions: 6, percentage: 5 },
];

const COLORS = ['#2F8F46', '#F97316', '#7A5C3E', '#3B82F6', '#8B5CF6'];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AffiliateAnalytics() {
  const [timeframe, setTimeframe] = useState('week');

  const totalClicks = dailyData.reduce((acc, d) => acc + d.clicks, 0);
  const totalSignups = dailyData.reduce((acc, d) => acc + d.signups, 0);
  const totalRevenue = dailyData.reduce((acc, d) => acc + d.revenue, 0);
  const conversionRate = ((totalSignups / totalClicks) * 100).toFixed(2);

  return (
    <AffiliateLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Analytics</h2>
            <p className="text-sm text-muted-foreground">Track your performance and optimize your strategy</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              {['week', 'month', 'quarter'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-all capitalize ${
                    timeframe === period 
                      ? 'bg-card text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-transparent">
            <p className="text-sm text-muted-foreground">Total Clicks</p>
            <p className="text-2xl font-bold text-foreground">{totalClicks.toLocaleString()}</p>
            <p className="text-xs text-emerald-600">+12% vs last {timeframe}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-accent/10 to-transparent">
            <p className="text-sm text-muted-foreground">Total Signups</p>
            <p className="text-2xl font-bold text-foreground">{totalSignups}</p>
            <p className="text-xs text-accent">+8% vs last {timeframe}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-primary">+15% vs last {timeframe}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-2xl font-bold text-foreground">{conversionRate}%</p>
            <p className="text-xs text-emerald-600">+0.8% vs last {timeframe}</p>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="p-4">
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
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F8F46" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2F8F46" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#2F8F46" 
                  fillOpacity={1} 
                  fill="url(#colorClicks)" 
                  strokeWidth={2}
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#F97316" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Top Performing Products
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={120}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} 
                  />
                  <Tooltip />
                  <Bar dataKey="referrals" fill="#2F8F46" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {topProducts.map((product, index) => (
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
          </Card>

          {/* Conversions by Country */}
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Conversions by Country
            </h3>
            <div className="flex items-center gap-4">
              <div className="h-[180px] w-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="conversions"
                    >
                      {countryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {countryData.map((country, index) => (
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
          </Card>
        </div>

        {/* Conversion Rate Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Overall Conversion Rate</h3>
              <p className="text-sm text-muted-foreground">Visitors who completed a purchase or signup</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-4xl font-bold text-primary">{conversionRate}%</p>
              <p className="text-sm text-emerald-600 flex items-center gap-1 justify-center sm:justify-end">
                <TrendingUp className="w-4 h-4" />
                +0.8% from last week
              </p>
            </div>
          </div>
          <div className="mt-4 bg-muted rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-1000"
              style={{ width: `${parseFloat(conversionRate) * 10}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Industry average: 3.2% • You're performing 71% above average!
          </p>
        </Card>
      </div>
    </AffiliateLayout>
  );
}
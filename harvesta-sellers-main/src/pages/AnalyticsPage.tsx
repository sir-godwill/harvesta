import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Package,
  Users,
  Target,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { fetchProductAnalytics, fetchBuyerAnalytics, fetchInventoryAnalytics } from "@/services/api";
import { formatXAFCompact } from "@/lib/currency";

export default function AnalyticsPage() {
  const [productData, setProductData] = useState<{ topProducts: { name: string; sales: number }[]; trends: { month: string; revenue: number }[] } | null>(null);
  const [buyerData, setBuyerData] = useState<{ repeatBuyers: number; rfqResponseRate: number; negotiationSuccess: number } | null>(null);
  const [inventoryData, setInventoryData] = useState<{ stockCoverage: number; overstockRisk: number; lowStockItems: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [productAnalytics, buyerAnalytics, inventoryAnalytics] = await Promise.all([
          fetchProductAnalytics(),
          fetchBuyerAnalytics(),
          fetchInventoryAnalytics(),
        ]);
        setProductData(productAnalytics);
        setBuyerData(buyerAnalytics);
        setInventoryData(inventoryAnalytics);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const buyerPieData = buyerData ? [
    { name: "Repeat", value: buyerData.repeatBuyers, fill: "hsl(var(--chart-1))" },
    { name: "New", value: 100 - buyerData.repeatBuyers, fill: "hsl(var(--chart-3))" },
  ] : [];

  return (
    <div className="min-h-screen bg-background">
      <Header title="Analytics" subtitle="Data-driven insights for your business" />

      <div className="p-4 md:p-6">
        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6"
        >
          <Card className="shadow-soft">
            <CardContent className="p-4 md:pt-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground truncate">RFQ Response</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">
                    {buyerData?.rfqResponseRate ?? "—"}%
                  </p>
                </div>
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-success/10 shrink-0">
                  <Target className="w-4 h-4 md:w-6 md:h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 md:pt-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Repeat Buyers</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">
                    {buyerData?.repeatBuyers ?? "—"}%
                  </p>
                </div>
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-primary/10 shrink-0">
                  <RefreshCw className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 md:pt-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Stock Coverage</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">
                    {inventoryData?.stockCoverage ?? "—"} <span className="text-sm font-normal">days</span>
                  </p>
                </div>
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-accent/10 shrink-0">
                  <Package className="w-4 h-4 md:w-6 md:h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 md:pt-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Negotiation Win</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">
                    {buyerData?.negotiationSuccess ?? "—"}%
                  </p>
                </div>
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-secondary/10 shrink-0">
                  <Users className="w-4 h-4 md:w-6 md:h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Revenue Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="shadow-soft h-full">
              <CardHeader className="p-4 md:p-6 pb-2">
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                {isLoading ? (
                  <div className="h-[200px] md:h-[280px] bg-muted animate-pulse rounded-lg" />
                ) : (
                  <div className="h-[200px] md:h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={productData?.trends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                          tickFormatter={(v) => formatXAFCompact(v)}
                          width={50}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                          formatter={(value: number) => [formatXAFCompact(value), 'Revenue']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                          activeDot={{ r: 5, fill: 'hsl(var(--primary))' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Card className="shadow-soft h-full">
              <CardHeader className="p-4 md:p-6 pb-2">
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                  Top Selling Products
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                {isLoading ? (
                  <div className="h-[200px] md:h-[280px] bg-muted animate-pulse rounded-lg" />
                ) : (
                  <div className="h-[200px] md:h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productData?.topProducts} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                        <XAxis 
                          type="number" 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                          tickFormatter={(v) => formatXAFCompact(v)}
                        />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                          width={80}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                          formatter={(value: number) => [formatXAFCompact(value), 'Sales']}
                        />
                        <Bar dataKey="sales" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Buyer Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="shadow-soft">
              <CardHeader className="p-4 md:p-6 pb-2">
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  Buyer Retention
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                {isLoading ? (
                  <div className="h-[160px] md:h-[200px] flex items-center justify-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted animate-pulse" />
                  </div>
                ) : (
                  <div className="h-[160px] md:h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={buyerPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={65}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {buyerPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="flex justify-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-1))' }} />
                    <span className="text-xs text-muted-foreground">Repeat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-3))' }} />
                    <span className="text-xs text-muted-foreground">New</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Inventory Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-soft">
              <CardHeader className="p-4 md:p-6 pb-2">
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <Package className="w-4 h-4 md:w-5 md:h-5 text-warning" />
                  Inventory Health
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  <div className="p-3 md:p-4 rounded-xl bg-success/10 text-center">
                    <p className="text-xl md:text-3xl font-bold text-success">{inventoryData?.stockCoverage ?? "—"}</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">Days Coverage</p>
                  </div>
                  <div className="p-3 md:p-4 rounded-xl bg-warning/10 text-center">
                    <p className="text-xl md:text-3xl font-bold text-warning">{inventoryData?.lowStockItems ?? "—"}</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">Low Stock</p>
                  </div>
                  <div className="p-3 md:p-4 rounded-xl bg-destructive/10 text-center">
                    <p className="text-xl md:text-3xl font-bold text-destructive">{inventoryData?.overstockRisk ?? "—"}%</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">Overstock Risk</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

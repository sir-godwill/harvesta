import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { StockAlerts } from "@/components/dashboard/StockAlerts";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { formatXAF, formatXAFCompact } from "@/lib/currency";
import {
  fetchSellerMetrics,
  fetchRecentOrders,
  fetchStockAlerts,
  fetchSalesChartData,
  fetchCategoryDistribution,
  type SellerMetrics,
  type Order,
  type Product,
} from "@/services/api";

export default function DashboardHome() {
  const [metrics, setMetrics] = useState<SellerMetrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stockAlerts, setStockAlerts] = useState<Product[]>([]);
  const [salesData, setSalesData] = useState<{ name: string; sales: number; orders: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ category: string; value: number; fill: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [metricsData, ordersData, alertsData, salesChartData, categoryChartData] = await Promise.all([
          fetchSellerMetrics(),
          fetchRecentOrders(),
          fetchStockAlerts(),
          fetchSalesChartData(),
          fetchCategoryDistribution(),
        ]);
        setMetrics(metricsData);
        setOrders(ordersData);
        setStockAlerts(alertsData);
        setSalesData(salesChartData);
        setCategoryData(categoryChartData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header title="Dashboard" subtitle="Welcome back! Here's your business overview." />
      
      <div className="p-4 md:p-6">
        {/* Metrics Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
          <MetricCard
            title="Today's Sales"
            value={metrics ? formatXAFCompact(metrics.todaySales) : "—"}
            icon={DollarSign}
            trend={12}
            trendLabel="vs yesterday"
            variant="primary"
            delay={0}
          />
          <MetricCard
            title="Monthly Revenue"
            value={metrics ? formatXAFCompact(metrics.monthlyRevenue) : "—"}
            icon={TrendingUp}
            trend={8}
            trendLabel="vs last month"
            variant="accent"
            delay={0.05}
          />
          <MetricCard
            title="Pending Orders"
            value={metrics?.pendingOrders ?? "—"}
            icon={ShoppingCart}
            variant="warning"
            delay={0.1}
          />
          <MetricCard
            title="Fulfilled"
            value={metrics?.fulfilledOrders ?? "—"}
            icon={Package}
            trend={15}
            variant="success"
            delay={0.15}
          />
          <MetricCard
            title="Stock Alerts"
            value={metrics?.stockAlerts ?? "—"}
            icon={AlertTriangle}
            variant="warning"
            delay={0.2}
          />
          <MetricCard
            title="Inquiries"
            value={metrics?.buyerInquiries ?? "—"}
            icon={MessageSquare}
            variant="default"
            delay={0.25}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          <div className="lg:col-span-2">
            <SalesChart data={salesData} isLoading={isLoading} />
          </div>
          <div>
            <CategoryChart data={categoryData} isLoading={isLoading} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <RecentOrders orders={orders} isLoading={isLoading} />
          </div>
          <div className="space-y-4 md:space-y-6">
            <QuickActions />
            <StockAlerts products={stockAlerts} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

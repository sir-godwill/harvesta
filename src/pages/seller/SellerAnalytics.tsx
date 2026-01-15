import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Eye,
  Loader2,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { fetchDashboardStats, DashboardStats } from '@/lib/dashboardApi';
import { supabase } from '@/integrations/supabase/client';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);
};

export default function SellerAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: supplier } = await supabase.from('suppliers').select('id').eq('user_id', user.id).single();
      if (supplier) {
        const data = await fetchDashboardStats(supplier.id);
        setStats(data);
      }
    } catch (e) {
      console.error(e);
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
            <Button variant="outline" disabled>
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 Days
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Total Revenue',
              value: stats ? formatCurrency(stats.revenue.total) : '0',
              change: stats?.revenue.change || 0,
              icon: DollarSign,
              color: 'from-green-500 to-emerald-600',
            },
            {
              title: 'Orders',
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
                        {stat.change !== 0 && (
                          <>
                            {stat.change >= 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            )}
                            <span className={stat.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {Math.abs(stat.change)}%
                            </span>
                          </>
                        )}
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

        {/* Placeholder for future charts */}
        <Card className="p-12 text-center text-muted-foreground bg-muted/20 border-dashed">
          <p>Detailed historical analytics and charts will appear here as you accumulate more data.</p>
        </Card>

      </div>
    </SellerLayout>
  );
}

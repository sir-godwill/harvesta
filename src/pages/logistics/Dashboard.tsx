import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Truck,
  AlertTriangle,
  Clock,
  MapPin,
  Users,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  fetchLogisticsMetrics,
  fetchShipments,
  fetchPartners,
  type LogisticsMetrics,
  type Shipment,
  type LogisticsPartner,
} from '@/services/logistics-api';
import { Link } from 'react-router-dom';

function StatCard({
  title,
  value,
  icon: Icon,
  variant = 'default',
  trend,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  variant?: 'primary' | 'accent' | 'warning' | 'success' | 'default';
  trend?: { value: number; label: string; isPositive: boolean };
}) {
  const variantStyles = {
    primary: 'border-primary/20 bg-primary/5',
    accent: 'border-secondary/20 bg-secondary/5',
    warning: 'border-orange-500/20 bg-orange-500/5',
    success: 'border-emerald-500/20 bg-emerald-500/5',
    default: 'border-border bg-card',
  };

  const iconStyles = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-secondary/10 text-secondary',
    warning: 'bg-orange-500/10 text-orange-500',
    success: 'bg-emerald-500/10 text-emerald-500',
    default: 'bg-muted text-muted-foreground',
  };

  return (
    <Card className={`${variantStyles[variant]} border`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <p className="text-xs text-muted-foreground font-medium">{title}</p>
          <div className={`p-2 rounded-lg ${iconStyles[variant]}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            <span className={`text-xs font-medium ${trend.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function LogisticsDashboard() {
  const [metrics, setMetrics] = useState<LogisticsMetrics | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [partners, setPartners] = useState<LogisticsPartner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [metricsData, shipmentsData, partnersData] = await Promise.all([
          fetchLogisticsMetrics(),
          fetchShipments(),
          fetchPartners(),
        ]);
        setMetrics(metricsData);
        setShipments(shipmentsData);
        setPartners(partnersData);
      } catch (error) {
        console.error('Failed to load logistics data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatusBadge = (status: Shipment['status']) => {
    const styles = {
      pending: 'bg-gray-500/10 text-gray-600',
      picked_up: 'bg-blue-500/10 text-blue-600',
      in_transit: 'bg-purple-500/10 text-purple-600',
      out_for_delivery: 'bg-cyan-500/10 text-cyan-600',
      delivered: 'bg-emerald-500/10 text-emerald-600',
      delayed: 'bg-orange-500/10 text-orange-600',
      failed: 'bg-red-500/10 text-red-600',
    };
    return styles[status] || styles.pending;
  };

  const delayedShipments = shipments.filter((s) => s.status === 'delayed');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Logistics Control Center</h1>
            <p className="text-muted-foreground">Real-time overview of all operations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/logistics/tracking">
                <MapPin className="w-4 h-4 mr-2" />
                Live Tracking
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/logistics/shipments">
                View All Shipments
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Shipments"
            value={metrics?.totalActiveShipments ?? '—'}
            icon={Package}
            variant="primary"
            trend={{ value: 5, label: 'vs yesterday', isPositive: true }}
          />
          <StatCard
            title="In Transit"
            value={metrics?.inTransit ?? '—'}
            icon={Truck}
            variant="accent"
          />
          <StatCard
            title="Delayed"
            value={metrics?.delayed ?? '—'}
            icon={AlertTriangle}
            variant="warning"
          />
          <StatCard
            title="On-Time Rate"
            value={metrics ? `${metrics.onTimeRate}%` : '—'}
            icon={Clock}
            variant="success"
            trend={{ value: 2.3, label: 'vs last week', isPositive: true }}
          />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delayed Shipments Alert */}
            {delayedShipments.length > 0 && (
              <Card className="border-orange-500/50 bg-orange-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base text-orange-600">
                    <AlertTriangle className="h-5 w-5" />
                    Delayed Shipments ({delayedShipments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {delayedShipments.map((shipment) => (
                    <div
                      key={shipment.id}
                      className="flex items-center justify-between rounded-lg bg-card p-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{shipment.trackingNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {shipment.deliveryLocation.city} • {shipment.notes[0]}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/logistics/shipments/${shipment.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Recent Shipments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Recent Shipments</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/logistics/shipments">
                    View all <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {shipments.slice(0, 4).map((shipment) => (
                    <div
                      key={shipment.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{shipment.trackingNumber}</p>
                          <Badge className={getStatusBadge(shipment.status)} variant="secondary">
                            {shipment.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {shipment.pickupLocation.city} → {shipment.deliveryLocation.city}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{shipment.partnerName}</p>
                        <p className="text-xs text-muted-foreground">{shipment.weight}kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Top Delay Reasons */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Top Delay Reasons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {metrics?.topDelayReasons.map((reason, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{reason.reason}</span>
                      <span className="font-medium">{reason.count}</span>
                    </div>
                    <Progress
                      value={(reason.count / (metrics?.delayed || 1)) * 100}
                      className="h-1.5"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Regional Overview */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Regional Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {metrics?.regionBreakdown.slice(0, 4).map((region, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{region.region}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{region.active} active</span>
                      {region.delayed > 0 && (
                        <span className="flex items-center gap-1 text-xs text-orange-500">
                          <AlertTriangle className="h-3 w-3" />
                          {region.delayed}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Partners */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Top Partners</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {partners.slice(0, 3).map((partner) => (
                  <div
                    key={partner.id}
                    className="flex items-center gap-3 rounded-lg bg-muted/30 p-2.5"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{partner.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>⭐ {partner.rating}</span>
                        <span>•</span>
                        <span>{partner.onTimeRate}% on-time</span>
                      </div>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${partner.isActive ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

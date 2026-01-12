import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Eye,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'acknowledged' | 'investigating' | 'resolved';
  type: string;
  shipmentId?: string;
  region?: string;
  createdAt: string;
}

const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    title: 'Delayed Shipment - Critical',
    description: 'Shipment SHP-234 is 4 hours behind schedule due to traffic',
    severity: 'critical',
    status: 'active',
    type: 'delay',
    shipmentId: 'SHP-234',
    region: 'Centre',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ALT-002',
    title: 'Partner Vehicle Issue',
    description: 'Partner Express Logistics reporting vehicle breakdown',
    severity: 'warning',
    status: 'investigating',
    type: 'vehicle',
    region: 'Littoral',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'ALT-003',
    title: 'Weather Advisory',
    description: 'Heavy rain expected in West region, possible delays',
    severity: 'info',
    status: 'acknowledged',
    type: 'weather',
    region: 'West',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

const severityColors = {
  critical: 'bg-red-500/10 text-red-600 border-red-500/20',
  warning: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  info: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

const statusColors = {
  active: 'bg-red-500/10 text-red-600',
  acknowledged: 'bg-yellow-500/10 text-yellow-600',
  investigating: 'bg-blue-500/10 text-blue-600',
  resolved: 'bg-emerald-500/10 text-emerald-600',
};

export default function AlertsPage() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const activeAlerts = alerts.filter((a) => a.status !== 'resolved');
  const criticalCount = alerts.filter(
    (a) => a.severity === 'critical' && a.status !== 'resolved'
  ).length;

  const filteredAlerts =
    statusFilter === 'all'
      ? alerts
      : alerts.filter((a) => a.status === statusFilter);

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'acknowledged' as const } : a))
    );
    toast({ title: 'Alert acknowledged' });
  };

  const handleInvestigate = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'investigating' as const } : a))
    );
    toast({ title: 'Investigation started' });
  };

  const handleResolve = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' as const } : a))
    );
    toast({ title: 'Alert resolved' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts & Incidents</h1>
          <p className="text-muted-foreground">Proactive problem detection</p>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {/* Stats */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <Card className="border-destructive/30">
            <CardContent className="p-3 md:p-4 flex items-center gap-3">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold">{criticalCount}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">Critical</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 flex items-center gap-3">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Bell className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold">{activeAlerts.length}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 flex items-center gap-3">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Eye className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold">
                  {alerts.filter((a) => a.status === 'investigating').length}
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground">Investigating</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 flex items-center gap-3">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold">
                  {alerts.filter((a) => a.status === 'resolved').length}
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground">Resolved</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2">
          {['all', 'active', 'acknowledged', 'investigating', 'resolved'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize text-xs"
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`border-l-4 ${
                  alert.severity === 'critical'
                    ? 'border-l-destructive'
                    : alert.severity === 'warning'
                    ? 'border-l-orange-500'
                    : 'border-l-blue-500'
                }`}
              >
                <CardContent className="p-3 md:p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <Badge className={severityColors[alert.severity]}>{alert.severity}</Badge>
                        <Badge className={statusColors[alert.status]}>{alert.status}</Badge>
                        <Badge variant="outline" className="text-xs">
                          {alert.type}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground mb-2">
                        {alert.description}
                      </p>
                      <div className="flex flex-wrap gap-2 md:gap-3 text-[10px] md:text-xs text-muted-foreground">
                        {alert.shipmentId && <span>Shipment: {alert.shipmentId}</span>}
                        {alert.region && <span>Region: {alert.region}</span>}
                        <span>{new Date(alert.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {alert.status === 'active' && (
                        <Button size="sm" variant="outline" onClick={() => handleAcknowledge(alert.id)}>
                          Acknowledge
                        </Button>
                      )}
                      {alert.status !== 'resolved' && alert.status !== 'investigating' && (
                        <Button size="sm" variant="outline" onClick={() => handleInvestigate(alert.id)}>
                          Investigate
                        </Button>
                      )}
                      {alert.status !== 'resolved' && (
                        <Button size="sm" onClick={() => handleResolve(alert.id)}>
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

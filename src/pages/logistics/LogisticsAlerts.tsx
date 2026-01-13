import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  Bell, 
  Check, 
  Clock, 
  Filter,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  CloudRain,
  Truck,
  Package,
  AlertCircle
} from 'lucide-react';
import { Alert } from '@/services/logistics-api';
import { mockAlerts } from '@/data/logistics-mock-data';

const LogisticsAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [resolution, setResolution] = useState('');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500/20 text-red-400';
      case 'acknowledged': return 'bg-yellow-500/20 text-yellow-400';
      case 'investigating': return 'bg-blue-500/20 text-blue-400';
      case 'resolved': return 'bg-green-500/20 text-green-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delay': return <Clock className="h-5 w-5" />;
      case 'risk': return <AlertTriangle className="h-5 w-5" />;
      case 'sla-breach': return <XCircle className="h-5 w-5" />;
      case 'incident': return <AlertCircle className="h-5 w-5" />;
      case 'weather': return <CloudRain className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, status: 'acknowledged' as const, acknowledgedAt: new Date().toISOString() } : a
    ));
  };

  const handleResolve = () => {
    if (selectedAlert) {
      setAlerts(prev => prev.map(a => 
        a.id === selectedAlert.id ? { ...a, status: 'resolved' as const, resolvedAt: new Date().toISOString() } : a
      ));
      setIsDetailsOpen(false);
      setResolution('');
    }
  };

  const stats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    critical: alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length,
    resolved: alerts.filter(a => a.status === 'resolved').length
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Alerts & Notifications</h1>
            <p className="text-muted-foreground">Monitor and respond to logistics alerts</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Bell className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <XCircle className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.critical}</p>
                  <p className="text-sm text-muted-foreground">Critical</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.resolved}</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full md:w-40 bg-background border-border">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40 bg-background border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <Card key={alert.id} className={`bg-card border-l-4 ${getSeverityColor(alert.severity)}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                      {getTypeIcon(alert.type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{alert.title}</h3>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{new Date(alert.createdAt).toLocaleString()}</span>
                        {alert.shipmentId && <span>Shipment: {alert.shipmentId}</span>}
                        {alert.region && <span>Region: {alert.region}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcknowledge(alert.id)}
                        className="border-border"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Acknowledge
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedAlert(alert);
                        setIsDetailsOpen(true);
                      }}
                      className="border-border"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alert Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Alert Details</DialogTitle>
            </DialogHeader>
            {selectedAlert && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(selectedAlert.severity)}>
                    {selectedAlert.severity}
                  </Badge>
                  <Badge className={getStatusColor(selectedAlert.status)}>
                    {selectedAlert.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedAlert.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedAlert.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="text-foreground capitalize">{selectedAlert.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="text-foreground">{new Date(selectedAlert.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedAlert.shipmentId && (
                    <div>
                      <p className="text-muted-foreground">Shipment ID</p>
                      <p className="text-foreground">{selectedAlert.shipmentId}</p>
                    </div>
                  )}
                  {selectedAlert.region && (
                    <div>
                      <p className="text-muted-foreground">Region</p>
                      <p className="text-foreground">{selectedAlert.region}</p>
                    </div>
                  )}
                </div>
                {selectedAlert.status !== 'resolved' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Resolution Notes</label>
                    <Textarea
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      placeholder="Enter resolution details..."
                      className="bg-background border-border"
                    />
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="border-border">
                Close
              </Button>
              {selectedAlert?.status !== 'resolved' && (
                <Button onClick={handleResolve} className="bg-primary text-primary-foreground">
                  Mark Resolved
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default LogisticsAlerts;

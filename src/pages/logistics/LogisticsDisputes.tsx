import React, { useState } from 'react';
import { LogisticsLayout } from '@/components/logistics/LogisticsLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  FileText, 
  Search,
  Eye,
  MessageSquare,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Truck,
  Camera
} from 'lucide-react';
import { Incident } from '@/services/logistics-api';
import { mockIncidents } from '@/data/logistics-mock-data';

const LogisticsDisputes = () => {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
  const [resolution, setResolution] = useState('');

  const [newIncident, setNewIncident] = useState({
    shipmentId: '',
    type: 'damage' as const,
    severity: 'warning' as const,
    description: ''
  });

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || incident.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'damage': return <Package className="h-5 w-5" />;
      case 'theft': return <AlertTriangle className="h-5 w-5" />;
      case 'accident': return <Truck className="h-5 w-5" />;
      case 'delay': return <Clock className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const handleResolve = () => {
    if (selectedIncident && resolution) {
      setIncidents(prev => prev.map(i => 
        i.id === selectedIncident.id 
          ? { ...i, resolution, resolvedAt: new Date().toISOString() } 
          : i
      ));
      setIsDetailsOpen(false);
      setResolution('');
    }
  };

  const handleCreateIncident = () => {
    const incident: Incident = {
      id: `INC-${Date.now()}`,
      ...newIncident,
      evidenceUrls: [],
      createdAt: new Date().toISOString()
    };
    setIncidents(prev => [incident, ...prev]);
    setIsNewIncidentOpen(false);
    setNewIncident({
      shipmentId: '',
      type: 'damage',
      severity: 'warning',
      description: ''
    });
  };

  const stats = {
    total: incidents.length,
    open: incidents.filter(i => !i.resolvedAt).length,
    critical: incidents.filter(i => i.severity === 'critical' && !i.resolvedAt).length,
    resolved: incidents.filter(i => i.resolvedAt).length
  };

  return (
    <LogisticsLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Disputes & Incidents</h1>
            <p className="text-muted-foreground">Manage delivery disputes and incident reports</p>
          </div>
          <Button onClick={() => setIsNewIncidentOpen(true)} className="bg-primary text-primary-foreground">
            <FileText className="h-4 w-4 mr-2" />
            Report Incident
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <FileText className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Incidents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Clock className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.open}</p>
                  <p className="text-sm text-muted-foreground">Open</p>
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
                  placeholder="Search incidents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-40 bg-background border-border">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="damage">Damage</SelectItem>
                  <SelectItem value="theft">Theft</SelectItem>
                  <SelectItem value="accident">Accident</SelectItem>
                  <SelectItem value="delay">Delay</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Incidents List */}
        <Tabs defaultValue="open" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="open">Open ({stats.open})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({stats.resolved})</TabsTrigger>
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="space-y-3">
            {filteredIncidents.filter(i => !i.resolvedAt).map((incident) => (
              <IncidentCard 
                key={incident.id} 
                incident={incident}
                onView={() => {
                  setSelectedIncident(incident);
                  setIsDetailsOpen(true);
                }}
                getSeverityColor={getSeverityColor}
                getTypeIcon={getTypeIcon}
              />
            ))}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-3">
            {filteredIncidents.filter(i => i.resolvedAt).map((incident) => (
              <IncidentCard 
                key={incident.id} 
                incident={incident}
                onView={() => {
                  setSelectedIncident(incident);
                  setIsDetailsOpen(true);
                }}
                getSeverityColor={getSeverityColor}
                getTypeIcon={getTypeIcon}
              />
            ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-3">
            {filteredIncidents.map((incident) => (
              <IncidentCard 
                key={incident.id} 
                incident={incident}
                onView={() => {
                  setSelectedIncident(incident);
                  setIsDetailsOpen(true);
                }}
                getSeverityColor={getSeverityColor}
                getTypeIcon={getTypeIcon}
              />
            ))}
          </TabsContent>
        </Tabs>

        {/* New Incident Modal */}
        <Dialog open={isNewIncidentOpen} onOpenChange={setIsNewIncidentOpen}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Report New Incident</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Shipment ID</label>
                <Input
                  value={newIncident.shipmentId}
                  onChange={(e) => setNewIncident(prev => ({ ...prev, shipmentId: e.target.value }))}
                  placeholder="Enter shipment ID"
                  className="bg-background border-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Type</label>
                  <Select 
                    value={newIncident.type} 
                    onValueChange={(value: any) => setNewIncident(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="damage">Damage</SelectItem>
                      <SelectItem value="theft">Theft</SelectItem>
                      <SelectItem value="accident">Accident</SelectItem>
                      <SelectItem value="delay">Delay</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Severity</label>
                  <Select 
                    value={newIncident.severity} 
                    onValueChange={(value: any) => setNewIncident(prev => ({ ...prev, severity: value }))}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  value={newIncident.description}
                  onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the incident..."
                  className="bg-background border-border"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Evidence</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop files or click to upload
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 border-border">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewIncidentOpen(false)} className="border-border">
                Cancel
              </Button>
              <Button onClick={handleCreateIncident} className="bg-primary text-primary-foreground">
                Submit Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Incident Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Incident Details</DialogTitle>
            </DialogHeader>
            {selectedIncident && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(selectedIncident.severity)}>
                    {selectedIncident.severity}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {selectedIncident.type}
                  </Badge>
                  {selectedIncident.resolvedAt && (
                    <Badge className="bg-green-500/20 text-green-400">Resolved</Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Shipment ID</p>
                  <p className="text-foreground font-medium">{selectedIncident.shipmentId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-foreground">{selectedIncident.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Reported</p>
                    <p className="text-foreground">{new Date(selectedIncident.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedIncident.resolvedAt && (
                    <div>
                      <p className="text-muted-foreground">Resolved</p>
                      <p className="text-foreground">{new Date(selectedIncident.resolvedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
                {selectedIncident.resolution && (
                  <div>
                    <p className="text-sm text-muted-foreground">Resolution</p>
                    <p className="text-foreground">{selectedIncident.resolution}</p>
                  </div>
                )}
                {!selectedIncident.resolvedAt && (
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
              {selectedIncident && !selectedIncident.resolvedAt && (
                <Button onClick={handleResolve} className="bg-primary text-primary-foreground">
                  Mark Resolved
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </LogisticsLayout>
  );
};

interface IncidentCardProps {
  incident: Incident;
  onView: () => void;
  getSeverityColor: (severity: string) => string;
  getTypeIcon: (type: string) => React.ReactNode;
}

const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onView, getSeverityColor, getTypeIcon }) => (
  <Card className="bg-card border-border">
    <CardContent className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${getSeverityColor(incident.severity)}`}>
            {getTypeIcon(incident.type)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{incident.id}</h3>
              <Badge className={getSeverityColor(incident.severity)}>
                {incident.severity}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {incident.type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{incident.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Shipment: {incident.shipmentId}</span>
              <span>{new Date(incident.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={onView} className="border-border">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default LogisticsDisputes;

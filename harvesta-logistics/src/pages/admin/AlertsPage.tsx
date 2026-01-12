import { useState } from "react";
import { AlertTriangle, Bell, CheckCircle, Eye } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAlerts, mockIncidents, getAlertSeverityColor, getAlertStatusColor } from "@/data/mock-data";
import { toast } from "sonner";

/**
 * Alerts & Incidents Page - Detect and manage problems before they escalate
 */
export default function AlertsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [alerts, setAlerts] = useState(mockAlerts);

  const activeAlerts = alerts.filter((a) => a.status !== "resolved");
  const criticalCount = alerts.filter((a) => a.severity === "critical" && a.status !== "resolved").length;

  const filteredAlerts = statusFilter === "all" 
    ? alerts 
    : alerts.filter((a) => a.status === statusFilter);

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: "acknowledged" as const } : a));
    toast.info("Alert acknowledged");
  };

  const handleInvestigate = (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: "investigating" as const } : a));
    toast.info("Investigation started");
  };

  const handleResolve = (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: "resolved" as const } : a));
    toast.success("Alert resolved");
  };

  return (
    <DashboardLayout title="Alerts & Incidents" subtitle="Proactive problem detection" variant="admin">
      <div className="space-y-4">
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
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Bell className="h-4 w-4 md:h-5 md:w-5 text-warning" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold">{activeAlerts.length}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 flex items-center gap-3">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Eye className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold">{alerts.filter((a) => a.status === "investigating").length}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">Investigating</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 flex items-center gap-3">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-success" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold">{alerts.filter((a) => a.status === "resolved").length}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">Resolved</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="alerts" className="flex-1 sm:flex-none">Alerts</TabsTrigger>
            <TabsTrigger value="incidents" className="flex-1 sm:flex-none">Incidents</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-3">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2">
              {["all", "active", "acknowledged", "investigating", "resolved"].map((status) => (
                <Button key={status} variant={statusFilter === status ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(status)} className="capitalize text-xs">
                  {status}
                </Button>
              ))}
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <Card key={alert.id} className={`border-l-4 ${alert.severity === "critical" ? "border-l-destructive" : alert.severity === "warning" ? "border-l-warning" : "border-l-blue-500"}`}>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <Badge className={getAlertSeverityColor(alert.severity)} >{alert.severity}</Badge>
                          <Badge className={getAlertStatusColor(alert.status)}>{alert.status}</Badge>
                          <Badge variant="outline" className="text-xs">{alert.type}</Badge>
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
                        <p className="text-xs md:text-sm text-muted-foreground mb-2">{alert.description}</p>
                        <div className="flex flex-wrap gap-2 md:gap-3 text-[10px] md:text-xs text-muted-foreground">
                          {alert.shipmentId && <span>Shipment: {alert.shipmentId}</span>}
                          {alert.region && <span>Region: {alert.region}</span>}
                          <span>{new Date(alert.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {alert.status === "active" && <Button size="sm" variant="outline" onClick={() => handleAcknowledge(alert.id)}>Acknowledge</Button>}
                        {alert.status !== "resolved" && alert.status !== "investigating" && <Button size="sm" variant="outline" onClick={() => handleInvestigate(alert.id)}>Investigate</Button>}
                        {alert.status !== "resolved" && <Button size="sm" onClick={() => handleResolve(alert.id)}>Resolve</Button>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-3">
            {mockIncidents.map((incident) => (
              <Card key={incident.id}>
                <CardContent className="p-3 md:p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <Badge className={getAlertSeverityColor(incident.severity)}>{incident.severity}</Badge>
                        <Badge variant="outline">{incident.type}</Badge>
                        {incident.resolvedAt && <Badge className="bg-success/10 text-success">Resolved</Badge>}
                      </div>
                      <h4 className="font-semibold text-sm mb-1">Incident {incident.id}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground mb-2">{incident.description}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">Shipment: {incident.shipmentId} • {new Date(incident.createdAt).toLocaleString()}</p>
                      {incident.resolution && <p className="text-xs md:text-sm mt-2 text-success">Resolution: {incident.resolution}</p>}
                    </div>
                    {!incident.resolvedAt && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => toast.info("Adding evidence...")}>Add Evidence</Button>
                        <Button size="sm" onClick={() => toast.success("Incident resolved")}>Resolve</Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
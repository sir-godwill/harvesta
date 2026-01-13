import { Truck, Package, AlertTriangle, Clock, MapPin, Users } from "lucide-react";
import { StatCard } from "@/components/logistics/StatCard";
import { ShipmentCard } from "@/components/logistics/ShipmentCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockShipments, mockAdminMetrics, mockPartners } from "@/data/logistics-mock-data";
import { useNavigate } from "react-router-dom";

export default function LogisticsDashboard() {
  const navigate = useNavigate();
  const metrics = mockAdminMetrics;
  const delayedShipments = mockShipments.filter((s) => s.status === "delayed");
  const recentShipments = mockShipments.slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Logistics Control Center</h1>
        <p className="text-muted-foreground">Real-time overview of all operations</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Shipments" value={metrics.totalActiveShipments} icon={Package} variant="primary" trend={{ value: 5, label: "vs yesterday", isPositive: true }} />
        <StatCard title="In Transit" value={metrics.inTransit} icon={Truck} variant="accent" />
        <StatCard title="Delayed" value={metrics.delayed} icon={AlertTriangle} variant="warning" />
        <StatCard title="On-Time Rate" value={`${metrics.onTimeRate}%`} icon={Clock} variant="success" trend={{ value: 2.3, label: "vs last week", isPositive: true }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {delayedShipments.length > 0 && (
            <Card className="border-warning/50 bg-warning/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-warning"><AlertTriangle className="h-5 w-5" />Delayed Shipments ({delayedShipments.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {delayedShipments.map((shipment) => (
                  <div key={shipment.id} className="flex items-center justify-between rounded-lg bg-card p-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10"><AlertTriangle className="h-5 w-5 text-warning" /></div>
                      <div><p className="text-sm font-medium">{shipment.id}</p><p className="text-xs text-muted-foreground">{shipment.deliveryLocation.city} • {shipment.notes[0]}</p></div>
                    </div>
                    <button className="text-sm font-medium text-primary hover:underline" onClick={() => navigate(`/logistics/shipments`)}>View</button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Recent Shipments</h2><button className="text-sm text-primary hover:underline" onClick={() => navigate("/logistics/shipments")}>View all</button></div>
            <div className="grid gap-4 sm:grid-cols-2">{recentShipments.map((shipment) => (<ShipmentCard key={shipment.id} shipment={shipment} variant="compact" onViewDetails={() => navigate(`/logistics/shipments`)} />))}</div>
          </div>
        </div>

        <div className="space-y-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-base">Top Delay Reasons</CardTitle></CardHeader><CardContent className="space-y-3">{metrics.topDelayReasons.map((reason, index) => (<div key={index} className="space-y-1"><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{reason.reason}</span><span className="font-medium">{reason.count}</span></div><Progress value={(reason.count / metrics.delayed) * 100} className="h-1.5" /></div>))}</CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-base">Regional Overview</CardTitle></CardHeader><CardContent className="space-y-3">{metrics.regionBreakdown.slice(0, 4).map((region, index) => (<div key={index} className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5"><div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-medium">{region.region}</span></div><div className="flex items-center gap-3"><span className="text-sm text-muted-foreground">{region.active} active</span>{region.delayed > 0 && <span className="flex items-center gap-1 text-xs text-warning"><AlertTriangle className="h-3 w-3" />{region.delayed}</span>}</div></div>))}</CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-base">Top Partners</CardTitle></CardHeader><CardContent className="space-y-3">{mockPartners.slice(0, 3).map((partner) => (<div key={partner.id} className="flex items-center gap-3 rounded-lg bg-muted/30 p-2.5"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10"><Users className="h-4 w-4 text-primary" /></div><div className="flex-1"><p className="text-sm font-medium">{partner.name}</p><div className="flex items-center gap-2 text-xs text-muted-foreground"><span>⭐ {partner.rating}</span><span>•</span><span>{partner.onTimeRate}% on-time</span></div></div><div className={`h-2 w-2 rounded-full ${partner.isActive ? "bg-green-500" : "bg-muted-foreground"}`} /></div>))}</CardContent></Card>
        </div>
      </div>
    </div>
  );
}

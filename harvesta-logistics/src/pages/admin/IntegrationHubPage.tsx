import { useState } from "react";
import { Webhook, Code, Link2, RefreshCw, CheckCircle, XCircle, Copy, Plus, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  lastTriggered?: string;
  status: "healthy" | "failing" | "pending";
}

/**
 * Integration Hub Page - Webhooks, API reference, vendor sync settings
 * 
 * Dormant APIs: configureWebhook(), testWebhook(), syncVendorData()
 */
export default function IntegrationHubPage() {
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: "WH-001",
      name: "Order System Sync",
      url: "https://api.harvesta.com/webhooks/orders",
      events: ["shipment.created", "shipment.updated", "shipment.delivered"],
      isActive: true,
      lastTriggered: "2024-01-14T12:30:00Z",
      status: "healthy",
    },
    {
      id: "WH-002",
      name: "Vendor Notification",
      url: "https://vendor-api.example.com/notifications",
      events: ["shipment.picked-up", "shipment.delayed"],
      isActive: true,
      lastTriggered: "2024-01-14T10:15:00Z",
      status: "healthy",
    },
    {
      id: "WH-003",
      name: "Analytics Pipeline",
      url: "https://analytics.harvesta.com/ingest",
      events: ["shipment.delivered", "incident.created"],
      isActive: false,
      status: "pending",
    },
  ]);

  const availableEvents = [
    { id: "shipment.created", label: "Shipment Created", description: "When a new shipment is created" },
    { id: "shipment.updated", label: "Shipment Updated", description: "When shipment status changes" },
    { id: "shipment.picked-up", label: "Shipment Picked Up", description: "When goods are picked up" },
    { id: "shipment.in-transit", label: "In Transit", description: "When shipment starts transit" },
    { id: "shipment.delayed", label: "Shipment Delayed", description: "When delay is detected" },
    { id: "shipment.delivered", label: "Shipment Delivered", description: "When delivery is confirmed" },
    { id: "incident.created", label: "Incident Created", description: "When an incident is reported" },
    { id: "alert.triggered", label: "Alert Triggered", description: "When an alert is created" },
    { id: "partner.assigned", label: "Partner Assigned", description: "When a partner is assigned" },
  ];

  const apiEndpoints = [
    { method: "GET", path: "/api/v1/shipments", description: "List all shipments with filters" },
    { method: "POST", path: "/api/v1/shipments", description: "Create a new shipment" },
    { method: "GET", path: "/api/v1/shipments/:id", description: "Get shipment details" },
    { method: "PATCH", path: "/api/v1/shipments/:id/status", description: "Update shipment status" },
    { method: "POST", path: "/api/v1/shipments/:id/assign", description: "Assign logistics partner" },
    { method: "GET", path: "/api/v1/partners", description: "List logistics partners" },
    { method: "GET", path: "/api/v1/partners/:id/metrics", description: "Get partner performance" },
    { method: "POST", path: "/api/v1/estimates", description: "Get delivery cost estimate" },
    { method: "GET", path: "/api/v1/tracking/:id", description: "Get live tracking data" },
    { method: "POST", path: "/api/v1/incidents", description: "Report an incident" },
  ];

  const toggleWebhook = (id: string) => {
    setWebhooks((prev) => prev.map((wh) => wh.id === id ? { ...wh, isActive: !wh.isActive } : wh));
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-success/10 text-success",
      POST: "bg-primary/10 text-primary",
      PATCH: "bg-warning/10 text-warning",
      DELETE: "bg-destructive/10 text-destructive",
    };
    return colors[method] || "bg-muted";
  };

  return (
    <DashboardLayout title="Integration Hub" subtitle="Webhooks, APIs, and vendor sync" variant="admin">
      <Tabs defaultValue="webhooks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="webhooks"><Webhook className="h-4 w-4 mr-1" />Webhooks</TabsTrigger>
          <TabsTrigger value="api"><Code className="h-4 w-4 mr-1" />API Reference</TabsTrigger>
          <TabsTrigger value="vendors"><Link2 className="h-4 w-4 mr-1" />Vendor Sync</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Receive real-time notifications when events occur</p>
            <Button onClick={() => setShowWebhookModal(true)}><Plus className="h-4 w-4 mr-1" />Add Webhook</Button>
          </div>

          <div className="space-y-3">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{webhook.name}</h4>
                        <Badge className={webhook.status === "healthy" ? "bg-success/10 text-success" : webhook.status === "failing" ? "bg-destructive/10 text-destructive" : "bg-muted"}>
                          {webhook.status === "healthy" ? <CheckCircle className="h-3 w-3 mr-1" /> : webhook.status === "failing" ? <XCircle className="h-3 w-3 mr-1" /> : null}
                          {webhook.status}
                        </Badge>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{webhook.url}</code>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="outline" className="text-[10px]">{event}</Badge>
                        ))}
                      </div>
                      {webhook.lastTriggered && (
                        <p className="text-xs text-muted-foreground mt-2">Last triggered: {new Date(webhook.lastTriggered).toLocaleString()}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch checked={webhook.isActive} onCheckedChange={() => toggleWebhook(webhook.id)} />
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Available Events */}
          <Card>
            <CardHeader><CardTitle className="text-base">Available Events</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {availableEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border p-3">
                    <code className="text-xs font-semibold text-primary">{event.id}</code>
                    <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">API Endpoints</CardTitle>
                <Button variant="outline" size="sm"><Copy className="h-4 w-4 mr-1" />Copy Base URL</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted/30 p-3 mb-4">
                <p className="text-xs text-muted-foreground mb-1">Base URL</p>
                <code className="text-sm font-semibold">https://api.harvesta-logistics.com</code>
              </div>
              <div className="space-y-2">
                {apiEndpoints.map((endpoint, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/20">
                    <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
                    <code className="text-sm flex-1">{endpoint.path}</code>
                    <span className="text-xs text-muted-foreground">{endpoint.description}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Authentication</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">All API requests require an API key in the header:</p>
              <div className="rounded-lg bg-muted/30 p-3">
                <code className="text-xs">Authorization: Bearer YOUR_API_KEY</code>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Generate API Key</Button>
                <Button variant="outline">View Documentation</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Vendor Sync Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h4 className="font-medium">E-Commerce Platform Sync</h4>
                  <p className="text-sm text-muted-foreground">Sync orders from main Harvestá platform</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-success/10 text-success">Connected</Badge>
                  <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-1" />Sync Now</Button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h4 className="font-medium">Vendor Inventory Updates</h4>
                  <p className="text-sm text-muted-foreground">Receive stock level changes from vendors</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-success/10 text-success">Active</Badge>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h4 className="font-medium">Buyer Location Services</h4>
                  <p className="text-sm text-muted-foreground">Geocoding and address validation</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-warning/10 text-warning">Limited</Badge>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Sync Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Sync Frequency</Label>
                  <Select defaultValue="5min">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="1min">Every 1 minute</SelectItem>
                      <SelectItem value="5min">Every 5 minutes</SelectItem>
                      <SelectItem value="15min">Every 15 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Conflict Resolution</Label>
                  <Select defaultValue="latest">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Use Latest</SelectItem>
                      <SelectItem value="platform">Platform Priority</SelectItem>
                      <SelectItem value="manual">Manual Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Webhook Modal */}
      <Dialog open={showWebhookModal} onOpenChange={setShowWebhookModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Webhook</DialogTitle>
            <DialogDescription>Configure a new webhook endpoint</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input placeholder="My Webhook" />
            </div>
            <div className="space-y-2">
              <Label>Endpoint URL</Label>
              <Input placeholder="https://your-api.com/webhook" />
            </div>
            <div className="space-y-2">
              <Label>Events</Label>
              <p className="text-xs text-muted-foreground">Select events to trigger this webhook</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableEvents.slice(0, 5).map((event) => (
                  <Badge key={event.id} variant="outline" className="cursor-pointer hover:bg-primary/10">{event.id}</Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWebhookModal(false)}>Cancel</Button>
            <Button onClick={() => { console.log("[DORMANT] configureWebhook"); setShowWebhookModal(false); }}>Create Webhook</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
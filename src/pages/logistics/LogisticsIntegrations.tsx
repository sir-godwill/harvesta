import React, { useState } from 'react';
import { LogisticsLayout } from '@/components/logistics/LogisticsLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plug, 
  Plus,
  Settings,
  CheckCircle,
  XCircle,
  ExternalLink,
  Key,
  RefreshCw,
  Truck,
  MapPin,
  MessageSquare,
  CreditCard,
  Package,
  Globe
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'logistics' | 'tracking' | 'communication' | 'payment' | 'mapping';
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'pending';
  lastSync?: string;
  apiKey?: string;
  webhookUrl?: string;
  isActive: boolean;
}

const availableIntegrations: Integration[] = [
  {
    id: 'dhl',
    name: 'DHL Express',
    description: 'International shipping and express delivery services',
    category: 'logistics',
    icon: <Truck className="h-6 w-6" />,
    status: 'connected',
    lastSync: '2024-01-15T10:30:00Z',
    isActive: true
  },
  {
    id: 'fedex',
    name: 'FedEx',
    description: 'Global shipping and logistics solutions',
    category: 'logistics',
    icon: <Truck className="h-6 w-6" />,
    status: 'disconnected',
    isActive: false
  },
  {
    id: 'google-maps',
    name: 'Google Maps',
    description: 'Route optimization and real-time tracking',
    category: 'mapping',
    icon: <MapPin className="h-6 w-6" />,
    status: 'connected',
    lastSync: '2024-01-15T12:00:00Z',
    isActive: true
  },
  {
    id: 'here-maps',
    name: 'HERE Maps',
    description: 'Advanced fleet tracking and route planning',
    category: 'mapping',
    icon: <Globe className="h-6 w-6" />,
    status: 'pending',
    isActive: false
  },
  {
    id: 'twilio',
    name: 'Twilio SMS',
    description: 'SMS notifications for delivery updates',
    category: 'communication',
    icon: <MessageSquare className="h-6 w-6" />,
    status: 'connected',
    lastSync: '2024-01-15T11:45:00Z',
    isActive: true
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'WhatsApp notifications and customer support',
    category: 'communication',
    icon: <MessageSquare className="h-6 w-6" />,
    status: 'disconnected',
    isActive: false
  },
  {
    id: 'paystack',
    name: 'Paystack',
    description: 'COD and delivery payment collection',
    category: 'payment',
    icon: <CreditCard className="h-6 w-6" />,
    status: 'connected',
    lastSync: '2024-01-15T09:00:00Z',
    isActive: true
  },
  {
    id: 'aftership',
    name: 'AfterShip',
    description: 'Multi-carrier shipment tracking',
    category: 'tracking',
    icon: <Package className="h-6 w-6" />,
    status: 'disconnected',
    isActive: false
  }
];

const LogisticsIntegrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(availableIntegrations);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'disconnected': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'logistics': return <Truck className="h-4 w-4" />;
      case 'tracking': return <Package className="h-4 w-4" />;
      case 'communication': return <MessageSquare className="h-4 w-4" />;
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'mapping': return <MapPin className="h-4 w-4" />;
      default: return <Plug className="h-4 w-4" />;
    }
  };

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setApiKey(integration.apiKey || '');
    setWebhookUrl(integration.webhookUrl || '');
    setIsConfigOpen(true);
  };

  const handleSaveConfig = () => {
    if (selectedIntegration) {
      setIntegrations(prev => prev.map(i => 
        i.id === selectedIntegration.id 
          ? { 
              ...i, 
              status: 'connected' as const, 
              isActive: true, 
              apiKey, 
              webhookUrl,
              lastSync: new Date().toISOString()
            } 
          : i
      ));
      setIsConfigOpen(false);
      setApiKey('');
      setWebhookUrl('');
    }
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(i => 
      i.id === integrationId 
        ? { ...i, status: 'disconnected' as const, isActive: false, apiKey: undefined, webhookUrl: undefined } 
        : i
    ));
  };

  const handleToggle = (integrationId: string, isActive: boolean) => {
    setIntegrations(prev => prev.map(i => 
      i.id === integrationId ? { ...i, isActive } : i
    ));
  };

  const handleSync = (integrationId: string) => {
    setIntegrations(prev => prev.map(i => 
      i.id === integrationId ? { ...i, lastSync: new Date().toISOString() } : i
    ));
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  return (
    <LogisticsLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Integrations Hub</h1>
            <p className="text-muted-foreground">Connect third-party services to enhance logistics operations</p>
          </div>
          <Badge className="bg-green-500/20 text-green-400 self-start">
            {connectedCount} Connected
          </Badge>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="all">All ({integrations.length})</TabsTrigger>
            <TabsTrigger value="logistics">Logistics</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="mapping">Mapping</TabsTrigger>
          </TabsList>

          {['all', 'logistics', 'tracking', 'communication', 'payment', 'mapping'].map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations
                  .filter(i => category === 'all' || i.category === category)
                  .map((integration) => (
                    <Card key={integration.id} className="bg-card border-border">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-muted">
                              {integration.icon}
                            </div>
                            <div>
                              <CardTitle className="text-base text-foreground">{integration.name}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                {getCategoryIcon(integration.category)}
                                <span className="text-xs text-muted-foreground capitalize">{integration.category}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                        
                        {integration.status === 'connected' && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Active</span>
                            <Switch
                              checked={integration.isActive}
                              onCheckedChange={(checked) => handleToggle(integration.id, checked)}
                            />
                          </div>
                        )}

                        {integration.lastSync && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Last synced</span>
                            <span className="text-foreground">
                              {new Date(integration.lastSync).toLocaleString()}
                            </span>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {integration.status === 'connected' ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSync(integration.id)}
                                className="flex-1 border-border"
                              >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Sync
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleConnect(integration)}
                                className="border-border"
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDisconnect(integration.id)}
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleConnect(integration)}
                              className="flex-1 bg-primary text-primary-foreground"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Connect
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Configuration Modal */}
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground">
                {selectedIntegration?.icon}
                Configure {selectedIntegration?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  API Key
                </Label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Webhook URL (Optional)
                </Label>
                <Input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-webhook-endpoint.com"
                  className="bg-background border-border"
                />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm text-muted-foreground">
                  Your API credentials are encrypted and stored securely. 
                  We never share your credentials with third parties.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfigOpen(false)} className="border-border">
                Cancel
              </Button>
              <Button onClick={handleSaveConfig} className="bg-primary text-primary-foreground">
                <CheckCircle className="h-4 w-4 mr-1" />
                Save & Connect
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* API Documentation */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Developer Resources</CardTitle>
            <CardDescription>Access API documentation and developer tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 border-border justify-start">
                <div className="text-left">
                  <p className="font-medium text-foreground">API Documentation</p>
                  <p className="text-xs text-muted-foreground">View complete API reference</p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
              <Button variant="outline" className="h-auto p-4 border-border justify-start">
                <div className="text-left">
                  <p className="font-medium text-foreground">Webhook Events</p>
                  <p className="text-xs text-muted-foreground">Configure event notifications</p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
              <Button variant="outline" className="h-auto p-4 border-border justify-start">
                <div className="text-left">
                  <p className="font-medium text-foreground">SDK Downloads</p>
                  <p className="text-xs text-muted-foreground">Get client libraries</p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </LogisticsLayout>
  );
};

export default LogisticsIntegrations;

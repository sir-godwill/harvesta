import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Users, Key, Link2, Bell, Globe, Shield, Database, Save, Plus, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const mockTeamMembers = [
  { id: '1', name: 'Amadou Diallo', email: 'amadou@harvesta.com', role: 'Super Admin', status: 'active', lastActive: '2 min ago' },
  { id: '2', name: 'Fatou Sow', email: 'fatou@harvesta.com', role: 'Admin', status: 'active', lastActive: '1 hour ago' },
  { id: '3', name: 'Kofi Mensah', email: 'kofi@harvesta.com', role: 'Support', status: 'active', lastActive: '3 hours ago' },
  { id: '4', name: 'Aisha Bello', email: 'aisha@harvesta.com', role: 'Finance', status: 'inactive', lastActive: '2 days ago' },
];

const mockRoles = [
  { id: '1', name: 'Super Admin', permissions: ['All'], users: 1 },
  { id: '2', name: 'Admin', permissions: ['sellers', 'products', 'orders', 'analytics'], users: 2 },
  { id: '3', name: 'Support', permissions: ['orders', 'disputes', 'buyers'], users: 3 },
  { id: '4', name: 'Finance', permissions: ['payments', 'analytics'], users: 1 },
];

const mockIntegrations = [
  { id: '1', name: 'Stripe', category: 'Payment', status: 'connected', icon: '💳' },
  { id: '2', name: 'Mobile Money', category: 'Payment', status: 'connected', icon: '📱' },
  { id: '3', name: 'DHL Africa', category: 'Logistics', status: 'connected', icon: '🚚' },
  { id: '4', name: 'Mailchimp', category: 'Marketing', status: 'disconnected', icon: '📧' },
  { id: '5', name: 'Google Analytics', category: 'Analytics', status: 'connected', icon: '📊' },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Harvestá',
    supportEmail: 'support@harvesta.com',
    defaultCurrency: 'XAF',
    defaultLanguage: 'en',
    maintenanceMode: false,
    twoFactorRequired: true,
    autoApproveOrders: false,
    emailNotifications: true,
    pushNotifications: true,
    orderAlerts: true,
    disputeAlerts: true,
    lowStockAlerts: true,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage platform settings, team, and integrations</p>
      </motion.div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Configure basic platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Site Name</Label>
                  <Input value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input type="email" value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select value={settings.defaultCurrency} onValueChange={(v) => setSettings({ ...settings, defaultCurrency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XAF">XAF (CFA Franc)</SelectItem>
                      <SelectItem value="USD">USD (US Dollar)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <Select value={settings.defaultLanguage} onValueChange={(v) => setSettings({ ...settings, defaultLanguage: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Put the platform in maintenance mode</p>
                  </div>
                  <Switch checked={settings.maintenanceMode} onCheckedChange={(v) => setSettings({ ...settings, maintenanceMode: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require 2FA for Admins</p>
                    <p className="text-sm text-muted-foreground">Enforce two-factor authentication</p>
                  </div>
                  <Switch checked={settings.twoFactorRequired} onCheckedChange={(v) => setSettings({ ...settings, twoFactorRequired: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-approve Orders</p>
                    <p className="text-sm text-muted-foreground">Automatically confirm orders after payment</p>
                  </div>
                  <Switch checked={settings.autoApproveOrders} onCheckedChange={(v) => setSettings({ ...settings, autoApproveOrders: v })} />
                </div>
              </div>

              <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Members */}
        <TabsContent value="team">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members
                </CardTitle>
                <CardDescription>Manage admin team access</CardDescription>
              </div>
              <Button><Plus className="mr-2 h-4 w-4" />Invite Member</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTeamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {member.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{member.role}</Badge></TableCell>
                      <TableCell>
                        <Badge className={member.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-gray-500/10 text-gray-600'}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{member.lastActive}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles */}
        <TabsContent value="roles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Roles & Permissions
                </CardTitle>
                <CardDescription>Configure access levels</CardDescription>
              </div>
              <Button><Plus className="mr-2 h-4 w-4" />Create Role</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((p) => (
                            <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{role.users} users</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Integrations
              </CardTitle>
              <CardDescription>Connect third-party services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockIntegrations.map((integration) => (
                  <Card key={integration.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-xl">
                            {integration.icon}
                          </div>
                          <div>
                            <p className="font-medium">{integration.name}</p>
                            <p className="text-xs text-muted-foreground">{integration.category}</p>
                          </div>
                        </div>
                        <Badge className={integration.status === 'connected' ? 'bg-green-500/10 text-green-600' : 'bg-gray-500/10 text-gray-600'}>
                          {integration.status}
                        </Badge>
                      </div>
                      <Button 
                        variant={integration.status === 'connected' ? 'outline' : 'default'} 
                        size="sm" 
                        className="w-full mt-4"
                        onClick={() => toast.success(integration.status === 'connected' ? 'Disconnected' : 'Connected')}
                      >
                        {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure alert preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Channels</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                  </div>
                  <Switch checked={settings.emailNotifications} onCheckedChange={(v) => setSettings({ ...settings, emailNotifications: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch checked={settings.pushNotifications} onCheckedChange={(v) => setSettings({ ...settings, pushNotifications: v })} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Alert Types</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Orders</p>
                    <p className="text-sm text-muted-foreground">Get notified for new orders</p>
                  </div>
                  <Switch checked={settings.orderAlerts} onCheckedChange={(v) => setSettings({ ...settings, orderAlerts: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Disputes</p>
                    <p className="text-sm text-muted-foreground">Get notified for new disputes</p>
                  </div>
                  <Switch checked={settings.disputeAlerts} onCheckedChange={(v) => setSettings({ ...settings, disputeAlerts: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Low Stock Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when products run low</p>
                  </div>
                  <Switch checked={settings.lowStockAlerts} onCheckedChange={(v) => setSettings({ ...settings, lowStockAlerts: v })} />
                </div>
              </div>

              <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

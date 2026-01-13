import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Store, Bell, Shield, CreditCard, Globe, Palette, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { toast } from 'sonner';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function SellerSettings() {
  const [settings, setSettings] = useState({
    storeName: 'Organic Farm Fresh',
    email: 'contact@organicfarmfresh.cm',
    phone: '+237 6XX XXX XXX',
    description: 'Premium organic produce from the highlands of Cameroon.',
    address: 'Buea, South West Region',
    currency: 'XAF',
    language: 'en',
    notifications: {
      orders: true,
      messages: true,
      rfqs: true,
      marketing: false,
    },
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <SellerLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your store preferences</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="store" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="store"><Store className="h-4 w-4 mr-2" />Store</TabsTrigger>
              <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" />Profile</TabsTrigger>
              <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" />Notifications</TabsTrigger>
              <TabsTrigger value="payments"><CreditCard className="h-4 w-4 mr-2" />Payments</TabsTrigger>
              <TabsTrigger value="security"><Shield className="h-4 w-4 mr-2" />Security</TabsTrigger>
            </TabsList>

            <TabsContent value="store">
              <Card>
                <CardHeader>
                  <CardTitle>Store Information</CardTitle>
                  <CardDescription>Update your store details visible to buyers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input 
                        id="storeName" 
                        value={settings.storeName}
                        onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Business Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({...settings, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={settings.phone}
                        onChange={(e) => setSettings({...settings, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Business Address</Label>
                      <Input 
                        id="address" 
                        value={settings.address}
                        onChange={(e) => setSettings({...settings, address: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Store Description</Label>
                    <Textarea 
                      id="description" 
                      rows={4}
                      value={settings.description}
                      onChange={(e) => setSettings({...settings, description: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" defaultValue="Jean-Pierre Kamga" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" defaultValue="Store Owner" disabled />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={settings.language} onValueChange={(v) => setSettings({...settings, language: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={settings.currency} onValueChange={(v) => setSettings({...settings, currency: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="XAF">XAF (CFA Franc)</SelectItem>
                          <SelectItem value="USD">USD (US Dollar)</SelectItem>
                          <SelectItem value="EUR">EUR (Euro)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what notifications you receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order Notifications</p>
                      <p className="text-sm text-muted-foreground">Get notified about new orders</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.orders}
                      onCheckedChange={(checked) => setSettings({
                        ...settings, 
                        notifications: {...settings.notifications, orders: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Message Notifications</p>
                      <p className="text-sm text-muted-foreground">Get notified about new messages</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.messages}
                      onCheckedChange={(checked) => setSettings({
                        ...settings, 
                        notifications: {...settings.notifications, messages: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">RFQ Notifications</p>
                      <p className="text-sm text-muted-foreground">Get notified about new RFQs</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.rfqs}
                      onCheckedChange={(checked) => setSettings({
                        ...settings, 
                        notifications: {...settings.notifications, rfqs: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">Receive tips and promotional offers</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.marketing}
                      onCheckedChange={(checked) => setSettings({
                        ...settings, 
                        notifications: {...settings.notifications, marketing: checked}
                      })}
                    />
                  </div>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Settings</CardTitle>
                  <CardDescription>Manage your payout methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <CreditCard className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">MTN Mobile Money</p>
                        <p className="text-sm text-muted-foreground">+237 6XX XXX XXX</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <Button variant="outline">+ Add Payment Method</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Protect your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  <Button onClick={handleSave}>Update Password</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </SellerLayout>
  );
}

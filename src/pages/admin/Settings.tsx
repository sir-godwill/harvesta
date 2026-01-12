import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Globe,
  DollarSign,
  Bell,
  Shield,
  Users,
  Palette,
  Database,
  Save,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  
  // General settings
  const [platformName, setPlatformName] = useState('Harvestá');
  const [supportEmail, setSupportEmail] = useState('support@harvesta.com');
  const [defaultCurrency, setDefaultCurrency] = useState('XAF');
  const [defaultLanguage, setDefaultLanguage] = useState('en');
  
  // Commission settings
  const [defaultCommission, setDefaultCommission] = useState([8]);
  const [minCommission, setMinCommission] = useState([5]);
  const [maxCommission, setMaxCommission] = useState([15]);
  
  // International pricing
  const [eurMarkup, setEurMarkup] = useState([12]);
  const [usdMarkup, setUsdMarkup] = useState([10]);
  const [enableInternational, setEnableInternational] = useState(true);
  
  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Settings saved successfully');
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4 sm:space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Platform Settings
          </h1>
          <p className="text-sm text-muted-foreground">Configure global platform settings and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </motion.div>

      {/* Settings Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="h-auto p-1 flex-wrap justify-start w-full sm:w-auto">
            <TabsTrigger value="general" className="text-xs sm:text-sm gap-2">
              <Globe className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs sm:text-sm gap-2">
              <DollarSign className="h-4 w-4" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Platform Configuration</CardTitle>
                <CardDescription>Basic platform settings and defaults</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input
                      id="platform-name"
                      value={platformName}
                      onChange={(e) => setPlatformName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input
                      id="support-email"
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-currency">Default Currency</Label>
                    <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XAF">XAF (CFA Franc)</SelectItem>
                        <SelectItem value="USD">USD (US Dollar)</SelectItem>
                        <SelectItem value="EUR">EUR (Euro)</SelectItem>
                        <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-language">Default Language</Label>
                    <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Settings */}
          <TabsContent value="pricing" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Commission Settings</CardTitle>
                <CardDescription>Configure seller commission rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Default Commission Rate</Label>
                      <span className="text-sm font-bold text-primary">{defaultCommission[0]}%</span>
                    </div>
                    <Slider
                      value={defaultCommission}
                      onValueChange={setDefaultCommission}
                      min={1}
                      max={25}
                      step={1}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Minimum Commission</Label>
                        <span className="text-sm font-medium">{minCommission[0]}%</span>
                      </div>
                      <Slider
                        value={minCommission}
                        onValueChange={setMinCommission}
                        min={1}
                        max={15}
                        step={1}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Maximum Commission</Label>
                        <span className="text-sm font-medium">{maxCommission[0]}%</span>
                      </div>
                      <Slider
                        value={maxCommission}
                        onValueChange={setMaxCommission}
                        min={10}
                        max={30}
                        step={1}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">International Pricing</CardTitle>
                <CardDescription>Configure currency conversion markups for international buyers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable International Sales</Label>
                    <p className="text-sm text-muted-foreground">Allow sellers to accept international orders</p>
                  </div>
                  <Switch checked={enableInternational} onCheckedChange={setEnableInternational} />
                </div>
                
                {enableInternational && (
                  <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>EUR Markup</Label>
                        <span className="text-sm font-medium">{eurMarkup[0]}%</span>
                      </div>
                      <Slider
                        value={eurMarkup}
                        onValueChange={setEurMarkup}
                        min={0}
                        max={30}
                        step={1}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>USD Markup</Label>
                        <span className="text-sm font-medium">{usdMarkup[0]}%</span>
                      </div>
                      <Slider
                        value={usdMarkup}
                        onValueChange={setUsdMarkup}
                        min={0}
                        max={30}
                        step={1}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notification Preferences</CardTitle>
                <CardDescription>Configure how the platform sends notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send order updates and alerts via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between py-2 border-t">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send urgent alerts via SMS</p>
                  </div>
                  <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>
                <div className="flex items-center justify-between py-2 border-t">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Enable browser push notifications</p>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security Configuration</CardTitle>
                <CardDescription>Platform security and access control settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-2 border-t">
                  <div>
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between py-2 border-t">
                  <div>
                    <Label>IP Allowlist</Label>
                    <p className="text-sm text-muted-foreground">Restrict admin access by IP</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

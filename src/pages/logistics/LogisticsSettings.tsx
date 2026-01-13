import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Bell,
  Shield,
  Truck,
  DollarSign,
  MapPin,
  Clock,
  Save,
  Upload,
  User,
  Building,
  Phone,
  Mail,
  Globe,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

const LogisticsSettings = () => {
  // Company Profile
  const [companyName, setCompanyName] = useState('Harvestá Logistics');
  const [companyEmail, setCompanyEmail] = useState('logistics@harvesta.com');
  const [companyPhone, setCompanyPhone] = useState('+233 30 123 4567');
  const [companyAddress, setCompanyAddress] = useState('Accra Industrial Area, Ghana');
  const [taxId, setTaxId] = useState('GH123456789');

  // Delivery Settings
  const [defaultDeliveryModel, setDefaultDeliveryModel] = useState('harvesta');
  const [maxDeliveryRadius, setMaxDeliveryRadius] = useState('150');
  const [defaultLeadTime, setDefaultLeadTime] = useState('2');
  const [allowWeekendDelivery, setAllowWeekendDelivery] = useState(true);
  const [allowHolidayDelivery, setAllowHolidayDelivery] = useState(false);

  // Pricing Settings
  const [baseFee, setBaseFee] = useState('15');
  const [perKmRate, setPerKmRate] = useState('0.5');
  const [perKgRate, setPerKgRate] = useState('0.3');
  const [platformFee, setPlatformFee] = useState('5');
  const [fuelSurcharge, setFuelSurcharge] = useState('10');

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notifyOnPickup, setNotifyOnPickup] = useState(true);
  const [notifyOnDelivery, setNotifyOnDelivery] = useState(true);
  const [notifyOnDelay, setNotifyOnDelay] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  // SLA Settings
  const [urbanSla, setUrbanSla] = useState('24');
  const [semiUrbanSla, setSemiUrbanSla] = useState('48');
  const [ruralSla, setRuralSla] = useState('72');
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [escalationThreshold, setEscalationThreshold] = useState('4');

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully`);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure logistics operations and preferences</p>
        </div>

        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="bg-muted flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Company
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Delivery
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="sla" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              SLA
            </TabsTrigger>
          </TabsList>

          {/* Company Profile */}
          <TabsContent value="company">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Company Profile</CardTitle>
                <CardDescription>Update your logistics company information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center">
                    <Building className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <Button variant="outline" className="border-border">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Company Name</Label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Tax ID / Registration</Label>
                    <Input
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                    <Input
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </Label>
                  <Textarea
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="bg-background border-border"
                    rows={2}
                  />
                </div>

                <Button onClick={() => handleSave('Company')} className="bg-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Settings */}
          <TabsContent value="delivery">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Delivery Configuration</CardTitle>
                <CardDescription>Configure delivery options and operational parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Default Delivery Model</Label>
                    <Select value={defaultDeliveryModel} onValueChange={setDefaultDeliveryModel}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="harvesta">Harvestá Fleet</SelectItem>
                        <SelectItem value="supplier">Supplier Delivery</SelectItem>
                        <SelectItem value="third-party">Third-Party Partner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Maximum Delivery Radius (km)</Label>
                    <Input
                      type="number"
                      value={maxDeliveryRadius}
                      onChange={(e) => setMaxDeliveryRadius(e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Default Lead Time (days)</Label>
                  <Input
                    type="number"
                    value={defaultLeadTime}
                    onChange={(e) => setDefaultLeadTime(e.target.value)}
                    className="bg-background border-border w-32"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Delivery Schedule</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground">Weekend Delivery</p>
                      <p className="text-sm text-muted-foreground">Allow deliveries on Saturdays and Sundays</p>
                    </div>
                    <Switch checked={allowWeekendDelivery} onCheckedChange={setAllowWeekendDelivery} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground">Holiday Delivery</p>
                      <p className="text-sm text-muted-foreground">Allow deliveries on public holidays</p>
                    </div>
                    <Switch checked={allowHolidayDelivery} onCheckedChange={setAllowHolidayDelivery} />
                  </div>
                </div>

                <Button onClick={() => handleSave('Delivery')} className="bg-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Settings */}
          <TabsContent value="pricing">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Pricing Configuration</CardTitle>
                <CardDescription>Set base rates and multipliers for cost calculation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Base Handling Fee (GHS)</Label>
                    <Input
                      type="number"
                      value={baseFee}
                      onChange={(e) => setBaseFee(e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Per KM Rate (GHS)</Label>
                    <Input
                      type="number"
                      value={perKmRate}
                      onChange={(e) => setPerKmRate(e.target.value)}
                      step="0.1"
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Per KG Rate (GHS)</Label>
                    <Input
                      type="number"
                      value={perKgRate}
                      onChange={(e) => setPerKgRate(e.target.value)}
                      step="0.1"
                      className="bg-background border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Platform Fee (%)</Label>
                    <Input
                      type="number"
                      value={platformFee}
                      onChange={(e) => setPlatformFee(e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Fuel Surcharge (%)</Label>
                    <Input
                      type="number"
                      value={fuelSurcharge}
                      onChange={(e) => setFuelSurcharge(e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                </div>

                <Separator />

                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-3">Zone Multipliers</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Urban</p>
                      <p className="text-foreground font-medium">1.0x</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Semi-Urban</p>
                      <p className="text-foreground font-medium">1.2x</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rural (Accessible)</p>
                      <p className="text-foreground font-medium">1.5x</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rural (Difficult)</p>
                      <p className="text-foreground font-medium">2.0x</p>
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('Pricing')} className="bg-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Notification Preferences</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Channels</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive in-app push notifications</p>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Events</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground">Pickup Confirmation</p>
                      <p className="text-sm text-muted-foreground">When a shipment is picked up</p>
                    </div>
                    <Switch checked={notifyOnPickup} onCheckedChange={setNotifyOnPickup} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground">Delivery Confirmation</p>
                      <p className="text-sm text-muted-foreground">When a shipment is delivered</p>
                    </div>
                    <Switch checked={notifyOnDelivery} onCheckedChange={setNotifyOnDelivery} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground">Delay Alerts</p>
                      <p className="text-sm text-muted-foreground">When a shipment is delayed</p>
                    </div>
                    <Switch checked={notifyOnDelay} onCheckedChange={setNotifyOnDelay} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground">Daily Digest</p>
                      <p className="text-sm text-muted-foreground">Receive a daily summary email</p>
                    </div>
                    <Switch checked={dailyDigest} onCheckedChange={setDailyDigest} />
                  </div>
                </div>

                <Button onClick={() => handleSave('Notifications')} className="bg-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SLA Settings */}
          <TabsContent value="sla">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">SLA Configuration</CardTitle>
                <CardDescription>Set service level agreements and escalation rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Delivery Time Targets (hours)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Urban Zones</Label>
                      <Input
                        type="number"
                        value={urbanSla}
                        onChange={(e) => setUrbanSla(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Semi-Urban Zones</Label>
                      <Input
                        type="number"
                        value={semiUrbanSla}
                        onChange={(e) => setSemiUrbanSla(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Rural Zones</Label>
                      <Input
                        type="number"
                        value={ruralSla}
                        onChange={(e) => setRuralSla(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Escalation Rules</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground">Auto-Escalation</p>
                      <p className="text-sm text-muted-foreground">Automatically escalate overdue shipments</p>
                    </div>
                    <Switch checked={autoEscalate} onCheckedChange={setAutoEscalate} />
                  </div>
                  {autoEscalate && (
                    <div className="space-y-2">
                      <Label className="text-foreground">Escalation Threshold (hours after SLA)</Label>
                      <Input
                        type="number"
                        value={escalationThreshold}
                        onChange={(e) => setEscalationThreshold(e.target.value)}
                        className="bg-background border-border w-32"
                      />
                    </div>
                  )}
                </div>

                <Button onClick={() => handleSave('SLA')} className="bg-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default LogisticsSettings;

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Globe,
  Users,
  Shield,
  Bell,
  Palette,
  Link,
  Database,
  Save,
  Plus,
  Edit,
  Trash2,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'invited' | 'disabled';
}

const mockTeam: TeamMember[] = [
  { id: '1', name: 'Amadou Diallo', email: 'amadou@harvesta.com', role: 'Super Admin', status: 'active' },
  { id: '2', name: 'Marie Konaté', email: 'marie@harvesta.com', role: 'Operations Admin', status: 'active' },
  { id: '3', name: 'Jean-Pierre Mbeki', email: 'jp@harvesta.com', role: 'Finance Admin', status: 'active' },
  { id: '4', name: 'Fatou Ndiaye', email: 'fatou@harvesta.com', role: 'Seller Manager', status: 'invited' },
];

function SettingCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {children}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  const statusColors = {
    active: 'bg-success/10 text-success',
    invited: 'bg-warning/10 text-warning',
    disabled: 'bg-muted text-muted-foreground',
  };

  return (
    <motion.div variants={itemVariants} whileHover={{ y: -2 }}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {member.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm">{member.name}</h3>
                <Badge className={statusColors[member.status]}>{member.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">{member.email}</p>
              <p className="text-xs text-primary">{member.role}</p>
            </div>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

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
          <h1 className="text-xl sm:text-2xl font-display font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">Configure platform settings and preferences</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="h-auto p-1 flex-wrap justify-start">
            <TabsTrigger value="general" className="text-xs sm:text-sm">
              <Globe className="h-4 w-4 mr-2" /> General
            </TabsTrigger>
            <TabsTrigger value="team" className="text-xs sm:text-sm">
              <Users className="h-4 w-4 mr-2" /> Team
            </TabsTrigger>
            <TabsTrigger value="roles" className="text-xs sm:text-sm">
              <Shield className="h-4 w-4 mr-2" /> Roles
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm">
              <Bell className="h-4 w-4 mr-2" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="integrations" className="text-xs sm:text-sm">
              <Link className="h-4 w-4 mr-2" /> Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4 space-y-4">
            <SettingCard title="Default Currency" description="Primary currency for the marketplace">
              <Select defaultValue="XAF">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XAF">XAF (CFA Franc)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                </SelectContent>
              </Select>
            </SettingCard>

            <SettingCard title="Default Language" description="Primary language for the platform">
              <Select defaultValue="en">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                  <SelectItem value="sw">Swahili</SelectItem>
                </SelectContent>
              </Select>
            </SettingCard>

            <SettingCard title="Marketplace Mode" description="Enable B2B, B2C, or both">
              <Select defaultValue="both">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="b2b">B2B Only</SelectItem>
                  <SelectItem value="b2c">B2C Only</SelectItem>
                  <SelectItem value="both">B2B & B2C</SelectItem>
                </SelectContent>
              </Select>
            </SettingCard>

            <SettingCard title="Maintenance Mode" description="Disable public access during updates">
              <Switch />
            </SettingCard>

            <SettingCard title="New Seller Registration" description="Allow new sellers to register">
              <Switch defaultChecked />
            </SettingCard>
          </TabsContent>

          <TabsContent value="team" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium">Team Members ({mockTeam.length})</h2>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Invite Member
              </Button>
            </div>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid sm:grid-cols-2 gap-4">
              {mockTeam.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="roles" className="mt-4">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
              {['Super Admin', 'Operations Admin', 'Finance Admin', 'Seller Manager', 'Buyer Support', 'Logistics Admin', 'Marketing Admin'].map((role) => (
                <motion.div key={role} variants={itemVariants}>
                  <Card className="hover:bg-muted/30 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{role}</p>
                          <p className="text-xs text-muted-foreground">Manage permissions for this role</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4 space-y-4">
            <SettingCard title="Email Notifications" description="Receive email alerts for important events">
              <Switch defaultChecked />
            </SettingCard>
            <SettingCard title="SMS Alerts" description="Critical alerts via SMS">
              <Switch defaultChecked />
            </SettingCard>
            <SettingCard title="Push Notifications" description="Browser push notifications">
              <Switch defaultChecked />
            </SettingCard>
            <SettingCard title="Daily Digest" description="Receive daily summary email">
              <Switch />
            </SettingCard>
          </TabsContent>

          <TabsContent value="integrations" className="mt-4">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid sm:grid-cols-2 gap-4">
              {[
                { name: 'Payment Gateway', provider: 'Stripe / Paystack', connected: true },
                { name: 'Email Service', provider: 'SendGrid', connected: true },
                { name: 'SMS Provider', provider: 'Twilio', connected: true },
                { name: 'Analytics', provider: 'Google Analytics', connected: false },
                { name: 'Shipping API', provider: 'DHL / FedEx', connected: true },
                { name: 'CRM', provider: 'Salesforce', connected: false },
              ].map((integration) => (
                <motion.div key={integration.name} variants={itemVariants}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{integration.name}</h3>
                          <p className="text-xs text-muted-foreground">{integration.provider}</p>
                        </div>
                        {integration.connected ? (
                          <Badge className="bg-success/10 text-success">
                            <Check className="h-3 w-3 mr-1" /> Connected
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline">Connect</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

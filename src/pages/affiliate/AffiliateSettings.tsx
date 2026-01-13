import { useState } from 'react';
import { AffiliateLayout } from '@/components/affiliate/AffiliateLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard,
  Bell,
  Shield,
  Save,
  Copy,
  Check,
  QrCode,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AffiliateSettings() {
  const [activeSection, setActiveSection] = useState<'personal' | 'payment' | 'notifications' | 'security'>('personal');
  const [copied, setCopied] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: 'Kwame Asante',
    email: 'kwame@example.com',
    phone: '+233 24 555 1234',
    country: 'Ghana',
    preferredCurrency: 'XAF',
    paymentMethod: 'Mobile Money (MTN)',
    momoNumber: '+233 24 555 1234',
  });

  const [notifications, setNotifications] = useState({
    commissions: true,
    sellers: true,
    campaigns: true,
    payouts: true,
    emailDigest: false,
    smsAlerts: false,
  });

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved successfully!');
    }, 1000);
  };

  return (
    <AffiliateLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your profile, payment methods, and preferences</p>
        </div>

        {/* Agent ID Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">KA</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{formData.name}</h3>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Gold Agent</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Member since Jan 2025</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Agent ID</p>
                <code className="text-sm font-mono font-medium">KWAME01</code>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard('KWAME01', 'id')}
              >
                {copied === 'id' ? <Check className="w-5 h-5 text-primary" /> : <Copy className="w-5 h-5" />}
              </Button>
              <Button variant="outline" size="sm">
                <QrCode className="w-4 h-4 mr-2" />
                View QR
              </Button>
            </div>
          </div>

          {/* Quick Copy Links */}
          <div className="mt-4 pt-4 border-t border-primary/20">
            <p className="text-xs text-muted-foreground mb-2">Your Referral Link</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm font-mono bg-background/50 p-2 rounded border border-border truncate">
                https://harvesta.app/ref/KWAME01
              </code>
              <Button
                onClick={() => copyToClipboard('https://harvesta.app/ref/KWAME01', 'link')}
              >
                {copied === 'link' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                Copy
              </Button>
            </div>
          </div>
        </Card>

        {/* Section Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: 'personal', label: 'Personal Info', icon: User },
            { key: 'payment', label: 'Payment', icon: CreditCard },
            { key: 'notifications', label: 'Notifications', icon: Bell },
            { key: 'security', label: 'Security', icon: Shield },
          ].map((section) => (
            <Button
              key={section.key}
              variant={activeSection === section.key ? 'default' : 'outline'}
              onClick={() => setActiveSection(section.key as any)}
              className="whitespace-nowrap"
            >
              <section.icon className="w-4 h-4 mr-2" />
              {section.label}
            </Button>
          ))}
        </div>

        {/* Personal Information */}
        {activeSection === 'personal' && (
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  <option>Ghana</option>
                  <option>Cameroon</option>
                  <option>Nigeria</option>
                  <option>Ivory Coast</option>
                </select>
              </div>
            </div>
          </Card>
        )}

        {/* Payment Preferences */}
        {activeSection === 'payment' && (
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent" />
              Payment Preferences
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Preferred Currency</label>
                <select
                  value={formData.preferredCurrency}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredCurrency: e.target.value }))}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  <option value="XAF">XAF (Central African CFA Franc)</option>
                  <option value="GHS">GHS (Ghana Cedis)</option>
                  <option value="NGN">NGN (Nigerian Naira)</option>
                  <option value="USD">USD (US Dollar)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  <option>Mobile Money (MTN)</option>
                  <option>Mobile Money (Orange)</option>
                  <option>Bank Transfer</option>
                  <option>PayPal</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Mobile Money Number</label>
                <Input
                  value={formData.momoNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, momoNumber: e.target.value }))}
                  placeholder="+233 XX XXX XXXX"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Notification Settings */}
        {activeSection === 'notifications' && (
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notification Settings
            </h3>
            <div className="space-y-4">
              {[
                { key: 'commissions', label: 'Commission Alerts', desc: 'Get notified when you earn a commission' },
                { key: 'sellers', label: 'Seller Updates', desc: 'Updates about referred sellers' },
                { key: 'campaigns', label: 'Campaign Notifications', desc: 'New campaigns and expiry reminders' },
                { key: 'payouts', label: 'Payout Alerts', desc: 'Payout processing and completion' },
                { key: 'emailDigest', label: 'Weekly Email Digest', desc: 'Summary of your weekly performance' },
                { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Important updates via SMS' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [item.key]: checked }))}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Security Settings */}
        {activeSection === 'security' && (
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security Settings
            </h3>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Enable Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive">
                Delete Account
              </Button>
            </div>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </AffiliateLayout>
  );
}
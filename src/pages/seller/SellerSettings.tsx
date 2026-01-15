import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Store, Bell, Shield, CreditCard, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function SellerSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [supplierId, setSupplierId] = useState('');

  const [storeSettings, setStoreSettings] = useState({
    company_name: '',
    email: '',
    phone: '',
    description: '',
    address: '',
    city: '',
    country: '',
    website: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: supplier, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (supplier) {
        setSupplierId(supplier.id);
        setStoreSettings({
          company_name: supplier.company_name,
          email: supplier.email || '',
          phone: supplier.phone || '',
          description: supplier.description || '',
          address: supplier.address || '',
          city: supplier.city || '',
          country: supplier.country || '',
          website: supplier.website || ''
        });
      }

    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStore = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('suppliers')
        .update({
          company_name: storeSettings.company_name,
          email: storeSettings.email,
          phone: storeSettings.phone,
          description: storeSettings.description,
          address: storeSettings.address,
          city: storeSettings.city,
          country: storeSettings.country,
          website: storeSettings.website
        })
        .eq('id', supplierId);

      if (error) throw error;
      toast.success('Store settings saved!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </SellerLayout>
    );
  }

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
              <TabsTrigger value="profile" disabled><User className="h-4 w-4 mr-2" />Profile</TabsTrigger>
              <TabsTrigger value="notifications" disabled><Bell className="h-4 w-4 mr-2" />Notifications</TabsTrigger>
              <TabsTrigger value="payments" disabled><CreditCard className="h-4 w-4 mr-2" />Payments</TabsTrigger>
              <TabsTrigger value="security" disabled><Shield className="h-4 w-4 mr-2" />Security</TabsTrigger>
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
                        value={storeSettings.company_name}
                        onChange={(e) => setStoreSettings({ ...storeSettings, company_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Business Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={storeSettings.email}
                        onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={storeSettings.phone}
                        onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={storeSettings.website}
                        onChange={(e) => setStoreSettings({ ...storeSettings, website: e.target.value })}
                        placeholder="https://"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={storeSettings.address}
                        onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={storeSettings.city}
                        onChange={(e) => setStoreSettings({ ...storeSettings, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={storeSettings.country}
                        onChange={(e) => setStoreSettings({ ...storeSettings, country: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Store Description</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={storeSettings.description}
                      onChange={(e) => setStoreSettings({ ...storeSettings, description: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleSaveStore} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </motion.div>
      </motion.div>
    </SellerLayout>
  );
}

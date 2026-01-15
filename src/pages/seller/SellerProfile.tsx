import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  Star,
  Award,
  Save,
  Edit,
  User,
  Package,
  TrendingUp,
  Loader2,
  Copy,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProfileImageUploader } from '@/components/seller/ProfileImageUploader';
import { Database } from '@/integrations/supabase/types';

type Supplier = Database['public']['Tables']['suppliers']['Row'];

export default function SellerProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Supplier | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    company_name: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    country: '',
    region: '',
    city: '',
    address: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          company_name: data.company_name || '',
          description: data.description || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          country: data.country || '',
          region: data.region || '',
          city: data.city || '',
          address: data.address || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCreateLogoPath = (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    return `${userId}/logo_${Date.now()}.${fileExt}`;
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    try {
      let logo_url = profile.logo_url;

      // Upload new logo if selected
      if (logoFile) {
        const filePath = handleCreateLogoPath(profile.user_id || 'unknown', logoFile);
        const { error: uploadError } = await supabase.storage
          .from('public')
          .upload(filePath, logoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('public')
          .getPublicUrl(filePath);

        logo_url = publicUrl;
      }

      const { error } = await supabase
        .from('suppliers')
        .update({
          ...formData,
          logo_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      fetchProfile(); // Refresh data
      setLogoFile(null); // Reset file input
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('ID copied to clipboard');
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

  if (!profile) {
    return (
      <SellerLayout>
        <div className="text-center py-12">
          <p>Profile not found.</p>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Seller Profile</h1>
            <p className="text-muted-foreground">Manage your public store profile</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="pt-6">
                {/* Profile Image View */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    {profile.logo_url ? (
                      <img
                        src={profile.logo_url}
                        alt={profile.company_name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-primary/20"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-3xl font-bold text-primary-foreground">
                        {profile.company_name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mt-4">{profile.company_name}</h3>

                  {/* Seller ID Display */}
                  <div className="flex items-center justify-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>ID: {profile.id.substring(0, 8)}...</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(profile.id)}
                      title="Copy full ID"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-2">
                    {profile.verification_status === 'verified' && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1">
                        <Shield className="w-3 h-3" />
                        Verified Seller
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Rating (Read only for now) */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  <Star className="w-5 h-5 text-warning fill-warning" />
                  <span className="ml-2 text-sm font-medium text-foreground">{profile.rating || 0}</span>
                  <span className="text-sm text-muted-foreground">({profile.total_reviews || 0} reviews)</span>
                </div>

                {/* Contact Info Preview */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {profile.city}, {profile.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profile.email}</span>
                  </div>
                  {profile.website && (
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{profile.website}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Package className="w-5 h-5 mx-auto text-primary mb-1" />
                    <p className="text-lg font-bold">{profile.total_products || 0}</p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                  <div>
                    <TrendingUp className="w-5 h-5 mx-auto text-primary mb-1" />
                    <p className="text-lg font-bold">{profile.total_orders || 0}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div>
                    <Star className="w-5 h-5 mx-auto text-primary mb-1" />
                    <p className="text-lg font-bold">{profile.rating || 0}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Edit Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-primary" />
                  Edit Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Logo Editor */}
                <div>
                  <Label className="mb-2 block">Logo</Label>
                  <div className="max-w-xs">
                    <ProfileImageUploader
                      image={logoFile ? URL.createObjectURL(logoFile) : profile.logo_url}
                      onImageChange={setLogoFile}
                      label="Change Logo"
                    />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Farm/Company Name</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">About Your Farm</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      className="pl-9"
                      placeholder="https://..."
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => fetchProfile()}>Reset Changes</Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </SellerLayout>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Bell,
    Lock,
    Eye,
    EyeOff,
    Save,
    Loader2,
    Camera,
    Award,
    TrendingUp,
    Package,
    ShoppingCart,
    Settings,
    LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserPreferences, updateUserPreferences } from '@/lib/gamification-api';
import { toast } from 'sonner';

export default function ProfilePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [preferences, setPreferences] = useState<any>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    // Form states
    const [personalInfo, setPersonalInfo] = useState({
        full_name: '',
        email: '',
        phone: '',
        bio: '',
        location: '',
        country: ''
    });

    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                navigate('/login');
                return;
            }

            setUser(authUser);

            // Load user profile
            const { data: profileData } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (profileData) {
                setProfile(profileData);
                setPersonalInfo({
                    full_name: profileData.full_name || '',
                    email: profileData.email || authUser.email || '',
                    phone: profileData.phone || '',
                    bio: profileData.bio || '',
                    location: profileData.location || '',
                    country: profileData.country || ''
                });
            }

            // Load preferences
            const { data: prefsData } = await fetchUserPreferences();
            if (prefsData) {
                setPreferences(prefsData);
            }

        } catch (error) {
            console.error('Error loading user data:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePersonalInfoChange = (field: string, value: string) => {
        setPersonalInfo(prev => ({ ...prev, [field]: value }));
        // Auto-save after 1 second of no typing
        setTimeout(() => savePersonalInfo(), 1000);
    };

    const savePersonalInfo = async () => {
        if (!user) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('user_profiles')
                .upsert({
                    id: user.id,
                    ...personalInfo,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            toast.success('Profile updated');
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/avatar_${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            const { error: updateError } = await supabase
                .from('user_profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setProfile((prev: any) => ({ ...prev, avatar_url: publicUrl }));
            toast.success('Avatar updated');
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast.error('Failed to upload avatar');
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.new !== passwordData.confirm) {
            toast.error('Passwords do not match');
            return;
        }

        if (passwordData.new.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordData.new
            });

            if (error) throw error;

            toast.success('Password updated successfully');
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error('Failed to update password');
        }
    };

    const handlePreferenceChange = async (key: string, value: any) => {
        if (!preferences) return;

        const updated = { ...preferences, [key]: value };
        setPreferences(updated);

        try {
            await updateUserPreferences({ [key]: value });
            toast.success('Preference updated');
        } catch (error) {
            console.error('Error updating preference:', error);
            toast.error('Failed to update preference');
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (!profile) return '/';

        switch (profile.app_role) {
            case 'admin':
            case 'super_admin':
                return '/admin';
            case 'seller':
                return '/seller';
            case 'logistics':
                return '/logistics';
            case 'buyer':
            default:
                return '/buyer';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Profile Settings</h1>
                            <p className="text-muted-foreground mt-1">
                                Manage your account settings and preferences
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => navigate(getDashboardLink())}>
                                Go to Dashboard
                            </Button>
                            <Button variant="ghost" onClick={handleSignOut}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Profile Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                {/* Avatar */}
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={profile?.avatar_url} />
                                        <AvatarFallback className="text-2xl">
                                            {personalInfo.full_name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                                    >
                                        <Camera className="h-4 w-4" />
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarUpload}
                                        />
                                    </label>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 text-center sm:text-left">
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                        <h2 className="text-2xl font-bold">{personalInfo.full_name || 'User'}</h2>
                                        {profile?.verification_status === 'verified' && (
                                            <VerificationBadge verified={true} size="md" />
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <Badge variant="secondary" className="capitalize">
                                            {profile?.app_role || 'buyer'}
                                        </Badge>
                                        {profile?.email && (
                                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {profile.email}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-primary">0</div>
                                        <div className="text-xs text-muted-foreground">Orders</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-primary">0</div>
                                        <div className="text-xs text-muted-foreground">Reviews</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-primary">1</div>
                                        <div className="text-xs text-muted-foreground">Level</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Tabs */}
                <Tabs defaultValue="personal" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                        <TabsTrigger value="personal">Personal Info</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="privacy">Privacy</TabsTrigger>
                    </TabsList>

                    {/* Personal Information */}
                    <TabsContent value="personal">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>
                                    Update your personal details. Changes are saved automatically.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="full_name">Full Name</Label>
                                        <Input
                                            id="full_name"
                                            value={personalInfo.full_name}
                                            onChange={(e) => handlePersonalInfoChange('full_name', e.target.value)}
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={personalInfo.email}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            value={personalInfo.phone}
                                            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                                            placeholder="+237 XXX XXX XXX"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={personalInfo.location}
                                            onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                                            placeholder="City"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            value={personalInfo.country}
                                            onChange={(e) => handlePersonalInfoChange('country', e.target.value)}
                                            placeholder="Country"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={personalInfo.bio}
                                        onChange={(e) => handlePersonalInfoChange('bio', e.target.value)}
                                        placeholder="Tell us about yourself..."
                                        rows={4}
                                    />
                                </div>

                                {saving && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security */}
                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Settings</CardTitle>
                                <CardDescription>
                                    Manage your password and security preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Change Password</h3>

                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="new-password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={passwordData.new}
                                                onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                                                placeholder="Enter new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirm Password</Label>
                                        <Input
                                            id="confirm-password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={passwordData.confirm}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                                            placeholder="Confirm new password"
                                        />
                                    </div>

                                    <Button onClick={handlePasswordChange}>
                                        <Lock className="h-4 w-4 mr-2" />
                                        Update Password
                                    </Button>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="font-semibold">Two-Factor Authentication</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Add an extra layer of security to your account
                                    </p>
                                    <Button variant="outline" disabled>
                                        Enable 2FA (Coming Soon)
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications */}
                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>
                                    Choose how you want to be notified
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {preferences && (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Email Notifications</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive notifications via email
                                                </p>
                                            </div>
                                            <Switch
                                                checked={preferences.email_notifications}
                                                onCheckedChange={(checked) => handlePreferenceChange('email_notifications', checked)}
                                            />
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Push Notifications</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive push notifications in browser
                                                </p>
                                            </div>
                                            <Switch
                                                checked={preferences.push_notifications}
                                                onCheckedChange={(checked) => handlePreferenceChange('push_notifications', checked)}
                                            />
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Order Updates</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Get notified about order status changes
                                                </p>
                                            </div>
                                            <Switch
                                                checked={preferences.order_updates}
                                                onCheckedChange={(checked) => handlePreferenceChange('order_updates', checked)}
                                            />
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Message Notifications</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Get notified about new messages
                                                </p>
                                            </div>
                                            <Switch
                                                checked={preferences.message_notifications}
                                                onCheckedChange={(checked) => handlePreferenceChange('message_notifications', checked)}
                                            />
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Marketing Emails</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive promotional emails and updates
                                                </p>
                                            </div>
                                            <Switch
                                                checked={preferences.marketing_emails}
                                                onCheckedChange={(checked) => handlePreferenceChange('marketing_emails', checked)}
                                            />
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Privacy */}
                    <TabsContent value="privacy">
                        <Card>
                            <CardHeader>
                                <CardTitle>Privacy Settings</CardTitle>
                                <CardDescription>
                                    Control your privacy and data sharing preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {preferences && (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Profile Visibility</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Make your profile visible to other users
                                                </p>
                                            </div>
                                            <Switch
                                                checked={preferences.privacy_profile_visible}
                                                onCheckedChange={(checked) => handlePreferenceChange('privacy_profile_visible', checked)}
                                            />
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Show Online Status</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Let others see when you're online
                                                </p>
                                            </div>
                                            <Switch
                                                checked={preferences.privacy_show_online_status}
                                                onCheckedChange={(checked) => handlePreferenceChange('privacy_show_online_status', checked)}
                                            />
                                        </div>

                                        <Separator />

                                        <div className="space-y-2">
                                            <Label>Who can message you?</Label>
                                            <select
                                                className="w-full px-3 py-2 border rounded-md"
                                                value={preferences.privacy_allow_messages_from}
                                                onChange={(e) => handlePreferenceChange('privacy_allow_messages_from', e.target.value)}
                                            >
                                                <option value="everyone">Everyone</option>
                                                <option value="verified">Verified users only</option>
                                                <option value="none">No one</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

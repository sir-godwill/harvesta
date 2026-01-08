import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Building2, 
  MapPin, 
  Bell, 
  Shield, 
  Camera,
  ChevronRight,
  Globe,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Save,
  Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockProfile = {
  id: "buyer-001",
  firstName: "Jean",
  lastName: "Dupont",
  email: "jean.dupont@business.com",
  phone: "+237 6XX XXX XXX",
  avatar: "",
  accountType: "business" as const,
  isVerified: true,
  company: {
    name: "Dupont Agro Enterprises",
    registrationNumber: "RC/YAO/2024/B/1234",
    address: "123 Boulevard de la Liberté, Yaoundé",
    website: "www.dupontagro.cm"
  },
  addresses: [
    {
      id: "addr-1",
      label: "Main Warehouse",
      address: "123 Boulevard de la Liberté",
      city: "Yaoundé",
      region: "Centre",
      country: "Cameroon",
      isDefault: true
    },
    {
      id: "addr-2",
      label: "Branch Office",
      address: "45 Rue des Commerces",
      city: "Douala",
      region: "Littoral",
      country: "Cameroon",
      isDefault: false
    }
  ],
  preferences: {
    language: "en",
    currency: "XAF",
    notifications: {
      email: true,
      sms: true,
      orderUpdates: true,
      promotions: false,
      newsletter: true
    }
  },
  recentLogins: [
    { date: "2026-01-08 14:30", device: "Chrome on Windows", location: "Yaoundé, CM" },
    { date: "2026-01-07 09:15", device: "Safari on iPhone", location: "Yaoundé, CM" },
    { date: "2026-01-05 16:45", device: "Chrome on Windows", location: "Douala, CM" }
  ]
};

const BuyerProfile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">My Profile</h1>
                <p className="text-sm text-muted-foreground">Manage your account settings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                        {profile.firstName[0]}{profile.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-md"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <h2 className="mt-4 font-semibold text-lg">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant={profile.accountType === "business" ? "default" : "secondary"}>
                      <Building2 className="h-3 w-3 mr-1" />
                      {profile.accountType === "business" ? "Business" : "Individual"}
                    </Badge>
                    {profile.isVerified && (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  {profile.accountType === "business" && (
                    <div className="mt-4 w-full text-left p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Company</p>
                      <p className="font-medium text-sm">{profile.company.name}</p>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Member since</span>
                    <span className="font-medium">Jan 2024</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Orders</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Saved Suppliers</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="w-full justify-start bg-background border-b rounded-none h-auto p-0 mb-6">
                <TabsTrigger 
                  value="personal" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-4"
                >
                  <User className="h-4 w-4 mr-2" />
                  Personal Info
                </TabsTrigger>
                {profile.accountType === "business" && (
                  <TabsTrigger 
                    value="business"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-4"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Business Details
                  </TabsTrigger>
                )}
                <TabsTrigger 
                  value="addresses"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-4"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Addresses
                </TabsTrigger>
                <TabsTrigger 
                  value="preferences"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-4"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Preferences
                </TabsTrigger>
                <TabsTrigger 
                  value="security"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-4"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="personal" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={profile.firstName}
                          disabled={!isEditing}
                          onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={profile.lastName}
                          disabled={!isEditing}
                          onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Input 
                            id="email" 
                            type="email"
                            value={profile.email}
                            disabled={!isEditing}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                          />
                          {profile.isVerified && (
                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={profile.phone}
                          disabled={!isEditing}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Business Details Tab */}
              <TabsContent value="business" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                    <CardDescription>Manage your company details for B2B transactions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input 
                          id="companyName" 
                          value={profile.company.name}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="regNumber">Registration Number</Label>
                        <Input 
                          id="regNumber" 
                          value={profile.company.registrationNumber}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyAddress">Business Address</Label>
                      <Input 
                        id="companyAddress" 
                        value={profile.company.address}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input 
                        id="website" 
                        value={profile.company.website}
                        disabled={!isEditing}
                        placeholder="www.yourcompany.com"
                      />
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-amber-800">Business Verification</p>
                          <p className="text-sm text-amber-700 mt-1">
                            Complete business verification to unlock bulk pricing, trade assurance, and priority support.
                          </p>
                          <Button variant="outline" size="sm" className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100">
                            Start Verification
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses" className="mt-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Delivery Addresses</CardTitle>
                      <CardDescription>Manage your shipping and delivery locations</CardDescription>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.addresses.map((address) => (
                        <div 
                          key={address.id}
                          className={`p-4 border rounded-lg ${address.isDefault ? 'border-primary bg-primary/5' : 'border-border'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <MapPin className={`h-5 w-5 mt-0.5 ${address.isDefault ? 'text-primary' : 'text-muted-foreground'}`} />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{address.label}</span>
                                  {address.isDefault && (
                                    <Badge variant="secondary" className="text-xs">Default</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {address.address}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {address.city}, {address.region}, {address.country}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              {!address.isDefault && (
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          {!address.isDefault && (
                            <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-primary">
                              Set as default
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Regional Settings</CardTitle>
                    <CardDescription>Customize your language and currency preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Language</Label>
                        <Select defaultValue={profile.preferences.language} disabled={!isEditing}>
                          <SelectTrigger>
                            <Globe className="h-4 w-4 mr-2" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select defaultValue={profile.preferences.currency} disabled={!isEditing}>
                          <SelectTrigger>
                            <DollarSign className="h-4 w-4 mr-2" />
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
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to receive updates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch 
                        checked={profile.preferences.notifications.email}
                        disabled={!isEditing}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via text message</p>
                      </div>
                      <Switch 
                        checked={profile.preferences.notifications.sms}
                        disabled={!isEditing}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Order Updates</p>
                        <p className="text-sm text-muted-foreground">Get notified about order status changes</p>
                      </div>
                      <Switch 
                        checked={profile.preferences.notifications.orderUpdates}
                        disabled={!isEditing}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Promotions & Deals</p>
                        <p className="text-sm text-muted-foreground">Receive special offers and discounts</p>
                      </div>
                      <Switch 
                        checked={profile.preferences.notifications.promotions}
                        disabled={!isEditing}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Newsletter</p>
                        <p className="text-sm text-muted-foreground">Weekly updates about new products and suppliers</p>
                      </div>
                      <Switch 
                        checked={profile.preferences.notifications.newsletter}
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Login Activity</CardTitle>
                    <CardDescription>Monitor your account access for security</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.recentLogins.map((login, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <Shield className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{login.device}</p>
                              <p className="text-xs text-muted-foreground">{login.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">{login.date}</p>
                            {index === 0 && (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                                Current Session
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions for your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
                      <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all associated data
                        </p>
                      </div>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuyerProfile;

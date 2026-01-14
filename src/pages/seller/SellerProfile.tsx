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
  Instagram,
  Facebook,
  Camera,
  Edit,
  Shield,
  Star,
  Award,
  Save,
  Building2,
  User,
  Calendar,
  Package,
  TrendingUp,
} from 'lucide-react';

// Mock profile data
const mockProfile = {
  companyName: 'Golden Harvest Farms',
  ownerName: 'Kwame Asante',
  initials: 'GH',
  verified: true,
  rating: 4.8,
  reviewCount: 156,
  memberSince: 'January 2024',
  about: 'Golden Harvest Farms is a family-owned agricultural enterprise specializing in premium cocoa, coffee, and organic produce. Established in 2010, we are committed to sustainable farming practices and fair trade principles.',
  location: {
    region: 'Ashanti Region',
    city: 'Kumasi',
    country: 'Ghana',
  },
  contact: {
    phone: '+233 24 123 4567',
    email: 'contact@goldenharvestfarms.com',
    website: 'www.goldenharvestfarms.com',
  },
  social: {
    instagram: '@goldenharvestgh',
    facebook: 'GoldenHarvestFarms',
  },
  certifications: ['Organic Certified', 'Fair Trade', 'Ghana COCOBOD'],
  stats: {
    products: 24,
    orders: 342,
    revenue: '45.2M XAF',
  },
};

export default function SellerProfile() {
  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Seller Profile</h1>
            <p className="text-muted-foreground">Manage your public store profile</p>
          </div>
          <Button>
            <Save className="w-4 h-4 mr-2" />
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
                {/* Profile Image */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-3xl font-bold text-primary-foreground">
                      {mockProfile.initials}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 rounded-full bg-accent text-accent-foreground shadow-md hover:bg-accent/90 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mt-4">{mockProfile.companyName}</h3>
                  <p className="text-sm text-muted-foreground">{mockProfile.ownerName}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {mockProfile.verified && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1">
                        <Shield className="w-3 h-3" />
                        Verified Seller
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= Math.floor(mockProfile.rating) ? 'text-warning fill-warning' : 'text-muted'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-foreground">{mockProfile.rating}</span>
                  <span className="text-sm text-muted-foreground">({mockProfile.reviewCount} reviews)</span>
                </div>

                {/* Certifications */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Certifications</p>
                  <div className="flex flex-wrap gap-2">
                    {mockProfile.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="bg-success/10 text-success border-success/20 gap-1">
                        <Award className="w-3 h-3" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {mockProfile.location.city}, {mockProfile.location.region}, {mockProfile.location.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{mockProfile.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{mockProfile.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Member since {mockProfile.memberSince}</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-6 flex items-center justify-center gap-3">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Globe className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Instagram className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Facebook className="w-4 h-4" />
                  </Button>
                </div>

                <Separator className="my-6" />

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Package className="w-5 h-5 mx-auto text-primary mb-1" />
                    <p className="text-lg font-bold">{mockProfile.stats.products}</p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                  <div>
                    <TrendingUp className="w-5 h-5 mx-auto text-primary mb-1" />
                    <p className="text-lg font-bold">{mockProfile.stats.orders}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div>
                    <Star className="w-5 h-5 mx-auto text-primary mb-1" />
                    <p className="text-lg font-bold">{mockProfile.rating}</p>
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
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmName">Farm/Company Name</Label>
                    <Input id="farmName" defaultValue={mockProfile.companyName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input id="ownerName" defaultValue={mockProfile.ownerName} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">About Your Farm</Label>
                  <Textarea
                    id="about"
                    rows={4}
                    defaultValue={mockProfile.about}
                  />
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Input id="region" defaultValue={mockProfile.location.region} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue={mockProfile.location.city} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" defaultValue={mockProfile.location.country} />
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue={mockProfile.contact.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={mockProfile.contact.email} />
                  </div>
                </div>

                {/* Social Media */}
                <div className="space-y-4">
                  <Label>Social Media Links</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                      <Input placeholder="Website URL" defaultValue={mockProfile.contact.website} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-muted-foreground shrink-0" />
                      <Input placeholder="Instagram handle" defaultValue={mockProfile.social.instagram} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Facebook className="w-4 h-4 text-muted-foreground shrink-0" />
                      <Input placeholder="Facebook page" defaultValue={mockProfile.social.facebook} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
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

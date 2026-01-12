import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Seller Profile" subtitle="Manage your public store profile" />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                {/* Profile Image */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-3xl font-bold text-primary-foreground">
                      GH
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 rounded-full bg-accent text-accent-foreground shadow-md hover:bg-accent/90 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mt-4">Golden Harvest Farms</h3>
                  <p className="text-sm text-muted-foreground">Kwame Asante</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1">
                      <Shield className="w-3 h-3" />
                      Verified Seller
                    </Badge>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= 4 ? 'text-warning fill-warning' : 'text-muted'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-foreground">4.8</span>
                  <span className="text-sm text-muted-foreground">(156 reviews)</span>
                </div>

                {/* Certifications */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Certifications</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20 gap-1">
                      <Award className="w-3 h-3" />
                      Organic Certified
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1">
                      <Award className="w-3 h-3" />
                      Fair Trade
                    </Badge>
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 gap-1">
                      <Award className="w-3 h-3" />
                      Ghana COCOBOD
                    </Badge>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Kumasi, Ashanti Region, Ghana</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">+233 24 123 4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">contact@goldenharvestfarms.com</span>
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
              </CardContent>
            </Card>
          </motion.div>

          {/* Edit Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-soft">
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
                    <Input id="farmName" defaultValue="Golden Harvest Farms" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input id="ownerName" defaultValue="Kwame Asante" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">About Your Farm</Label>
                  <Textarea
                    id="about"
                    rows={4}
                    defaultValue="Golden Harvest Farms is a family-owned agricultural enterprise specializing in premium cocoa, coffee, and organic produce. Established in 2010, we are committed to sustainable farming practices and fair trade principles."
                  />
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Input id="region" defaultValue="Ashanti Region" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="Kumasi" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" defaultValue="Ghana" />
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+233 24 123 4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="contact@goldenharvestfarms.com" />
                  </div>
                </div>

                {/* Social Media */}
                <div className="space-y-4">
                  <Label>Social Media Links</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Website URL" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Instagram handle" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Facebook className="w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Facebook page" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

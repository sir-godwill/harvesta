import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone,
  Search,
  Plus,
  Tag,
  Percent,
  Star,
  TrendingUp,
  Calendar,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Zap,
  Gift,
  Target,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

interface Campaign {
  id: string;
  name: string;
  type: 'discount' | 'flash_sale' | 'featured' | 'sponsored';
  status: 'active' | 'scheduled' | 'ended' | 'draft';
  startDate: string;
  endDate: string;
  budget?: number;
  spent?: number;
  impressions: number;
  conversions: number;
  roi: number;
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  usageLimit: number;
  usageCount: number;
  status: 'active' | 'expired' | 'disabled';
  expiresAt: string;
}

const mockCampaigns: Campaign[] = [
  { id: 'c1', name: 'African Coffee Week', type: 'flash_sale', status: 'active', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 604800000).toISOString(), budget: 5000000, spent: 2300000, impressions: 45000, conversions: 1250, roi: 280 },
  { id: 'c2', name: 'Top Seller Spotlight', type: 'featured', status: 'active', startDate: new Date(Date.now() - 604800000).toISOString(), endDate: new Date(Date.now() + 1209600000).toISOString(), impressions: 32000, conversions: 890, roi: 150 },
  { id: 'c3', name: 'New Buyer Welcome', type: 'discount', status: 'scheduled', startDate: new Date(Date.now() + 86400000).toISOString(), endDate: new Date(Date.now() + 2592000000).toISOString(), budget: 10000000, spent: 0, impressions: 0, conversions: 0, roi: 0 },
];

const mockCoupons: Coupon[] = [
  { id: 'cp1', code: 'WELCOME20', discount: 20, type: 'percentage', usageLimit: 1000, usageCount: 456, status: 'active', expiresAt: new Date(Date.now() + 2592000000).toISOString() },
  { id: 'cp2', code: 'HARVEST50K', discount: 50000, type: 'fixed', usageLimit: 500, usageCount: 500, status: 'expired', expiresAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'cp3', code: 'B2BDEAL15', discount: 15, type: 'percentage', usageLimit: 200, usageCount: 89, status: 'active', expiresAt: new Date(Date.now() + 5184000000).toISOString() },
];

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const statusColors = {
    active: 'bg-success/10 text-success',
    scheduled: 'bg-info/10 text-info',
    ended: 'bg-muted text-muted-foreground',
    draft: 'bg-warning/10 text-warning',
  };

  const typeIcons = {
    discount: Percent,
    flash_sale: Zap,
    featured: Star,
    sponsored: Target,
  };

  const TypeIcon = typeIcons[campaign.type];

  return (
    <motion.div variants={itemVariants} whileHover={{ y: -2 }}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TypeIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{campaign.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{campaign.type.replace('_', ' ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[campaign.status]}>{campaign.status}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                      <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Impressions</p>
                  <p className="font-bold">{campaign.impressions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Conversions</p>
                  <p className="font-bold">{campaign.conversions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">ROI</p>
                  <p className={cn('font-bold', campaign.roi > 100 ? 'text-success' : 'text-warning')}>
                    {campaign.roi}%
                  </p>
                </div>
              </div>

              {campaign.budget && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Budget Used</span>
                    <span>{Math.round((campaign.spent! / campaign.budget) * 100)}%</span>
                  </div>
                  <Progress value={(campaign.spent! / campaign.budget) * 100} className="h-2" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CouponCard({ coupon }: { coupon: Coupon }) {
  const statusColors = {
    active: 'bg-success/10 text-success',
    expired: 'bg-muted text-muted-foreground',
    disabled: 'bg-destructive/10 text-destructive',
  };

  return (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <code className="font-mono font-bold text-lg">{coupon.code}</code>
            </div>
            <Badge className={statusColors[coupon.status]}>{coupon.status}</Badge>
          </div>
          <div className="text-2xl font-bold text-primary mb-3">
            {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `${coupon.discount.toLocaleString()} XAF OFF`}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Usage</span>
              <span>{coupon.usageCount} / {coupon.usageLimit}</span>
            </div>
            <Progress value={(coupon.usageCount / coupon.usageLimit) * 100} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Marketing() {
  const [activeTab, setActiveTab] = useState('campaigns');

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
            <Megaphone className="h-6 w-6 text-primary" />
            Marketing & Growth
          </h1>
          <p className="text-sm text-muted-foreground">Manage campaigns, coupons, and promotions</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Create Campaign
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Active Campaigns', value: '3', icon: Target, color: 'bg-primary/10 text-primary' },
          { label: 'Total Impressions', value: '77K', icon: Eye, color: 'bg-info/10 text-info' },
          { label: 'Conversions', value: '2.1K', icon: TrendingUp, color: 'bg-success/10 text-success' },
          { label: 'Avg. ROI', value: '185%', icon: BarChart3, color: 'bg-accent/10 text-accent' },
        ].map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={cn('p-2 rounded-lg', stat.color.split(' ')[0])}>
                    <stat.icon className={cn('h-4 w-4', stat.color.split(' ')[1])} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="h-auto p-1">
            <TabsTrigger value="campaigns" className="text-xs sm:text-sm">
              <Target className="h-4 w-4 mr-2" /> Campaigns
            </TabsTrigger>
            <TabsTrigger value="coupons" className="text-xs sm:text-sm">
              <Tag className="h-4 w-4 mr-2" /> Coupons
            </TabsTrigger>
            <TabsTrigger value="featured" className="text-xs sm:text-sm">
              <Star className="h-4 w-4 mr-2" /> Featured
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="mt-4">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
              {mockCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="coupons" className="mt-4">
            <div className="flex justify-end mb-4">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Create Coupon
              </Button>
            </div>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="featured" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Featured Sellers & Products</CardTitle>
                <CardDescription>Manage homepage placements and spotlights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Featured Sellers</h3>
                      <Button size="sm" variant="outline">Manage</Button>
                    </div>
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-xs text-muted-foreground">Active spotlights</p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Featured Products</h3>
                      <Button size="sm" variant="outline">Manage</Button>
                    </div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Homepage products</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

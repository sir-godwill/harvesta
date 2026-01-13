import { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Plus, Search, Filter, MoreHorizontal, Eye, Pause, Play, Copy, Trash2, Gift, Tag, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'push' | 'banner';
  status: 'active' | 'paused' | 'ended' | 'scheduled';
  reach: number;
  clicks: number;
  conversions: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
}

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  usageLimit: number;
  usageCount: number;
  status: 'active' | 'expired' | 'exhausted';
  expiresAt: string;
}

const mockCampaigns: Campaign[] = [
  { id: 'c1', name: 'Holiday Season Sale', type: 'email', status: 'active', reach: 15000, clicks: 2340, conversions: 189, budget: 500000, spent: 320000, startDate: '2024-01-01', endDate: '2024-01-31' },
  { id: 'c2', name: 'New User Welcome', type: 'push', status: 'active', reach: 8500, clicks: 1200, conversions: 95, budget: 200000, spent: 150000, startDate: '2024-01-10', endDate: '2024-02-10' },
  { id: 'c3', name: 'Flash Sale Banner', type: 'banner', status: 'paused', reach: 25000, clicks: 3400, conversions: 245, budget: 300000, spent: 180000, startDate: '2024-01-05', endDate: '2024-01-15' },
];

const mockCoupons: Coupon[] = [
  { id: 'cp1', code: 'HARVEST20', type: 'percentage', value: 20, minOrder: 100000, usageLimit: 500, usageCount: 234, status: 'active', expiresAt: '2024-02-28' },
  { id: 'cp2', code: 'WELCOME50K', type: 'fixed', value: 50000, minOrder: 250000, usageLimit: 100, usageCount: 100, status: 'exhausted', expiresAt: '2024-01-31' },
  { id: 'cp3', code: 'FREESHIP', type: 'percentage', value: 100, minOrder: 150000, usageLimit: 1000, usageCount: 567, status: 'active', expiresAt: '2024-03-31' },
];

const mockFeatured = [
  { id: 'f1', name: 'Organic Arabica Coffee', seller: 'Ethiopian Coffee', featured: true, position: 1, views: 12500, clicks: 890 },
  { id: 'f2', name: 'Raw Cocoa Beans', seller: 'Kofi Organic Farms', featured: true, position: 2, views: 9800, clicks: 654 },
  { id: 'f3', name: 'Dried Hibiscus Flowers', seller: 'Senegal Groundnuts', featured: true, position: 3, views: 7600, clicks: 432 },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-500/10 text-green-600',
  paused: 'bg-yellow-500/10 text-yellow-600',
  ended: 'bg-gray-500/10 text-gray-600',
  scheduled: 'bg-blue-500/10 text-blue-600',
  expired: 'bg-gray-500/10 text-gray-600',
  exhausted: 'bg-red-500/10 text-red-600',
};

export default function AdminMarketing() {
  const [addCampaignOpen, setAddCampaignOpen] = useState(false);
  const [addCouponOpen, setAddCouponOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold">Marketing Hub</h1>
        <p className="text-muted-foreground">Manage campaigns, coupons, and featured products</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Megaphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{mockCampaigns.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Tag className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Coupons</p>
                <p className="text-2xl font-bold">{mockCoupons.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Featured Products</p>
                <p className="text-2xl font-bold">{mockFeatured.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Gift className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coupons Used</p>
                <p className="text-2xl font-bold">{mockCoupons.reduce((sum, c) => sum + c.usageCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="featured">Featured Products</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Marketing Campaigns</CardTitle>
              <Button onClick={() => setAddCampaignOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reach</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell className="capitalize">{campaign.type}</TableCell>
                      <TableCell>{campaign.reach.toLocaleString()}</TableCell>
                      <TableCell>{campaign.clicks.toLocaleString()}</TableCell>
                      <TableCell>{campaign.conversions}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{formatCurrency(campaign.spent)}</p>
                          <p className="text-muted-foreground">of {formatCurrency(campaign.budget)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[campaign.status]}>{campaign.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Details</DropdownMenuItem>
                            {campaign.status === 'active' ? (
                              <DropdownMenuItem onClick={() => toast.success('Campaign paused')}>
                                <Pause className="mr-2 h-4 w-4" />Pause
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => toast.success('Campaign resumed')}>
                                <Play className="mr-2 h-4 w-4" />Resume
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coupons">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Discount Coupons</CardTitle>
              <Button onClick={() => setAddCouponOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Coupon
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Min Order</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCoupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                      <TableCell>
                        {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                      </TableCell>
                      <TableCell>{formatCurrency(coupon.minOrder)}</TableCell>
                      <TableCell>{coupon.usageCount} / {coupon.usageLimit}</TableCell>
                      <TableCell>{new Date(coupon.expiresAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[coupon.status]}>{coupon.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(coupon.code); toast.success('Code copied'); }}>
                              <Copy className="mr-2 h-4 w-4" />Copy Code
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Featured Products</CardTitle>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Featured
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFeatured.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Badge variant="outline">#{product.position}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.seller}</TableCell>
                      <TableCell>{product.views.toLocaleString()}</TableCell>
                      <TableCell>{product.clicks.toLocaleString()}</TableCell>
                      <TableCell>{((product.clicks / product.views) * 100).toFixed(1)}%</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => toast.success('Product removed from featured')}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Campaign Modal */}
      <Dialog open={addCampaignOpen} onOpenChange={setAddCampaignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input placeholder="e.g., Holiday Sale 2024" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Budget (XAF)</Label>
                <Input type="number" placeholder="500000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Campaign description..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCampaignOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success('Campaign created'); setAddCampaignOpen(false); }}>Create Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Coupon Modal */}
      <Dialog open={addCouponOpen} onOpenChange={setAddCouponOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Coupon</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Coupon Code</Label>
              <Input placeholder="e.g., SUMMER25" className="font-mono" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input type="number" placeholder="20" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Order (XAF)</Label>
                <Input type="number" placeholder="100000" />
              </div>
              <div className="space-y-2">
                <Label>Usage Limit</Label>
                <Input type="number" placeholder="500" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCouponOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success('Coupon created'); setAddCouponOpen(false); }}>Create Coupon</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

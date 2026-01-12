import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Star, MapPin, Phone, Mail, Calendar, Package, ShoppingCart, 
  DollarSign, AlertTriangle, CheckCircle2, Ban, Edit, MessageSquare 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Seller } from '@/lib/admin-api';
import { toast } from 'sonner';

interface ViewSellerModalProps {
  seller: Seller | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (seller: Seller) => void;
}

export function ViewSellerModal({ seller, open, onOpenChange, onEdit }: ViewSellerModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!seller) return null;

  const statusColors = {
    active: 'bg-success/10 text-success',
    pending: 'bg-warning/10 text-warning',
    suspended: 'bg-destructive/10 text-destructive',
    rejected: 'bg-muted text-muted-foreground',
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);

  const handleSuspend = () => {
    toast.success(`Seller ${seller.businessName} has been suspended`);
    onOpenChange(false);
  };

  const handleContact = () => {
    toast.info(`Opening email to ${seller.ownerName}...`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded-xl">
              <AvatarImage src={seller.avatar} />
              <AvatarFallback className="rounded-xl bg-primary/10 text-primary">
                {seller.businessName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{seller.businessName}</h2>
              <p className="text-sm text-muted-foreground font-normal">{seller.ownerName}</p>
            </div>
            <Badge className={cn('ml-auto', statusColors[seller.status])}>{seller.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Trust Score */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Trust Score</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-warning fill-warning" />
                    <span className="font-bold">{seller.trustScore}%</span>
                  </div>
                </div>
                <Progress value={seller.trustScore} className="h-2" />
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <Package className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-xl font-bold">{seller.totalProducts}</p>
                  <p className="text-xs text-muted-foreground">Products</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <ShoppingCart className="h-5 w-5 mx-auto text-success mb-1" />
                  <p className="text-xl font-bold">{seller.totalOrders}</p>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <DollarSign className="h-5 w-5 mx-auto text-accent mb-1" />
                  <p className="text-xl font-bold">{seller.commissionRate}%</p>
                  <p className="text-xs text-muted-foreground">Commission</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <AlertTriangle className="h-5 w-5 mx-auto text-warning mb-1" />
                  <p className="text-xl font-bold">2</p>
                  <p className="text-xs text-muted-foreground">Disputes</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-medium">Contact Information</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{seller.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>+237 6XX XXX XXX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{seller.businessName.toLowerCase().replace(/\s/g, '')}@email.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined Jan 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="mt-4">
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>View {seller.totalProducts} products from this seller</p>
                <Button variant="outline" className="mt-3" onClick={() => toast.info('Navigating to seller products...')}>
                  View Products
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>View {seller.totalOrders} orders from this seller</p>
                <Button variant="outline" className="mt-3" onClick={() => toast.info('Navigating to seller orders...')}>
                  View Orders
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance" className="mt-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                  <span className="font-bold">{formatCurrency(seller.totalOrders * 150000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Commission Rate</span>
                  <span className="font-bold">{seller.commissionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pending Payout</span>
                  <span className="font-bold text-warning">{formatCurrency(250000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Paid Out</span>
                  <span className="font-bold text-success">{formatCurrency(seller.totalOrders * 120000)}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={handleContact}>
            <MessageSquare className="h-4 w-4 mr-2" /> Contact
          </Button>
          <Button variant="outline" onClick={() => onEdit?.(seller)}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          {seller.status === 'active' ? (
            <Button variant="destructive" onClick={handleSuspend}>
              <Ban className="h-4 w-4 mr-2" /> Suspend
            </Button>
          ) : (
            <Button variant="default" onClick={() => toast.success('Seller reactivated')}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Activate
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

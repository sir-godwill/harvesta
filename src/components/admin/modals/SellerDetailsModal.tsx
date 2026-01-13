import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Store, Mail, Phone, MapPin, TrendingUp, Package, ShoppingCart, DollarSign, Shield, Calendar, Star } from 'lucide-react';
import { Seller } from '@/lib/admin-api';

interface SellerDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seller: Seller | null;
  onApprove?: () => void;
  onSuspend?: () => void;
}

const statusColors: Record<string, string> = {
  active: 'bg-green-500/10 text-green-600 border-green-200',
  pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  suspended: 'bg-red-500/10 text-red-600 border-red-200',
  rejected: 'bg-gray-500/10 text-gray-600 border-gray-200',
};

export function SellerDetailsModal({ open, onOpenChange, seller, onApprove, onSuspend }: SellerDetailsModalProps) {
  if (!seller) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Seller Details</DialogTitle>
        </DialogHeader>
        
        {/* Header Info */}
        <div className="flex items-start gap-4 pb-4 border-b">
          <Avatar className="h-16 w-16">
            <AvatarImage src={seller.avatar} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {seller.businessName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">{seller.businessName}</h3>
              <Badge className={statusColors[seller.status]}>
                {seller.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{seller.ownerName}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {seller.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {seller.phone}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {seller.status === 'pending' && (
              <Button size="sm" onClick={onApprove}>Approve</Button>
            )}
            {seller.status === 'active' && (
              <Button size="sm" variant="destructive" onClick={onSuspend}>Suspend</Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-3">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="font-semibold">{formatCurrency(seller.totalRevenue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <ShoppingCart className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Orders</p>
                      <p className="font-semibold">{seller.totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Package className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Products</p>
                      <p className="font-semibold">{seller.totalProducts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Trust Score</p>
                      <p className="font-semibold">{seller.trustScore}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Region</span>
                    <span>{seller.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Commission Rate</span>
                    <span>{seller.commissionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verification</span>
                    <Badge variant="outline" className="text-xs">{seller.verificationStatus}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Joined</span>
                    <span>{new Date(seller.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {seller.certifications.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {seller.certifications.map((cert) => (
                        <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No certifications</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="mt-4">
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Products list will load from database</p>
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="mt-4">
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Orders history will load from database</p>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-4">
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Verification documents will load from storage</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

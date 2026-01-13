import { useState } from 'react';
import { AffiliateLayout } from '@/components/affiliate/AffiliateLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  UserPlus, 
  MapPin,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  MoreVertical,
  Eye,
  RefreshCw,
} from 'lucide-react';

const mockSellers = [
  {
    id: '1',
    name: 'Golden Harvest Farms',
    owner: 'Kofi Mensah',
    country: 'Ghana',
    status: 'active',
    productsListed: 24,
    totalRevenue: 2450000,
    commission: 171500,
    joinedAt: '2025-10-15',
  },
  {
    id: '2',
    name: 'Cameroon Cocoa Co.',
    owner: 'Marie Dupont',
    country: 'Cameroon',
    status: 'pending',
    productsListed: 0,
    totalRevenue: 0,
    commission: 0,
    joinedAt: '2026-01-08',
  },
  {
    id: '3',
    name: 'Niger Farms Ltd',
    owner: 'Ibrahim Suleiman',
    country: 'Nigeria',
    status: 'active',
    productsListed: 18,
    totalRevenue: 1820000,
    commission: 127400,
    joinedAt: '2025-11-22',
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AffiliateSellers() {
  const [sellers] = useState(mockSellers);

  const activeCount = sellers.filter(s => s.status === 'active').length;
  const pendingCount = sellers.filter(s => s.status === 'pending').length;
  const totalRevenue = sellers.reduce((acc, s) => acc + s.totalRevenue, 0);
  const totalCommission = sellers.reduce((acc, s) => acc + s.commission, 0);

  return (
    <AffiliateLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Seller Onboarding</h2>
            <p className="text-sm text-muted-foreground">Manage sellers you've referred to Harvestá</p>
          </div>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite New Seller
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Store className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{sellers.length}</p>
                <p className="text-sm text-muted-foreground">Total Sellers</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalCommission)}</p>
                <p className="text-sm text-muted-foreground">Your Commission</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Pending Approvals Alert */}
        {pendingCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800">
              <strong>{pendingCount} seller(s)</strong> awaiting verification. Review and approve to start earning commissions!
            </p>
          </div>
        )}

        {/* Sellers List */}
        <Card>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Referred Sellers</h3>
            <Button variant="ghost" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <div className="divide-y divide-border">
            {sellers.map((seller) => (
              <div key={seller.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Seller Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-semibold text-primary">
                        {seller.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground truncate">{seller.name}</p>
                        <Badge
                          variant={seller.status === 'active' ? 'default' : 'secondary'}
                          className={seller.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
                        >
                          {seller.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                          {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{seller.owner}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        {seller.country}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 lg:gap-6 text-center lg:text-right">
                    <div>
                      <p className="text-lg font-semibold text-foreground">{seller.productsListed}</p>
                      <p className="text-xs text-muted-foreground">Products</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{formatCurrency(seller.totalRevenue)}</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-primary">{formatCurrency(seller.commission)}</p>
                      <p className="text-xs text-muted-foreground">Your Earn</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AffiliateLayout>
  );
}
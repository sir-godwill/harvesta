import { useState } from 'react';
import { AffiliateLayout } from '@/components/affiliate/AffiliateLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Store,
  Users,
  Gift,
  Download,
  Eye,
} from 'lucide-react';

const mockCommissions = [
  { id: 'COM-001', type: 'seller_referral', description: 'Golden Harvest Farms - Order #4521', amount: 15000, date: '2026-01-10', status: 'paid' },
  { id: 'COM-002', type: 'buyer_referral', description: 'New buyer signup - Jean Pierre', amount: 5000, date: '2026-01-09', status: 'approved' },
  { id: 'COM-003', type: 'campaign_bonus', description: 'Cocoa Season Campaign Bonus', amount: 25000, date: '2026-01-08', status: 'pending' },
  { id: 'COM-004', type: 'seller_referral', description: 'Cameroon Cocoa Co. - Order #4498', amount: 12500, date: '2026-01-07', status: 'paid' },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AffiliateCommissions() {
  const [filter, setFilter] = useState<string>('all');
  const [commissions] = useState(mockCommissions);

  const filteredCommissions = filter === 'all' 
    ? commissions 
    : commissions.filter(c => c.status === filter);

  const totalEarned = commissions.reduce((acc, c) => acc + c.amount, 0);
  const thisMonth = commissions.filter(c => new Date(c.date).getMonth() === new Date().getMonth()).reduce((acc, c) => acc + c.amount, 0);
  const pending = commissions.filter(c => c.status === 'pending').reduce((acc, c) => acc + c.amount, 0);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'seller_referral': return <Store className="w-5 h-5" />;
      case 'buyer_referral': return <Users className="w-5 h-5" />;
      case 'campaign_bonus': return <Gift className="w-5 h-5" />;
      default: return <Wallet className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'seller_referral': return 'bg-primary/10 text-primary';
      case 'buyer_referral': return 'bg-accent/10 text-accent';
      case 'campaign_bonus': return 'bg-purple-100 text-purple-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <AffiliateLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Commissions</h2>
          <p className="text-sm text-muted-foreground">Track your earnings and commission history</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-transparent">
            <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(totalEarned)}</p>
            <div className="flex items-center gap-1 mt-1 text-emerald-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+18% this month</span>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-accent/10 to-transparent">
            <p className="text-sm text-muted-foreground mb-1">This Month</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(thisMonth)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Available</p>
            <p className="text-xl font-bold text-primary">{formatCurrency(totalEarned - pending)}</p>
            <p className="text-xs text-muted-foreground mt-1">Ready to withdraw</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-xl font-bold text-amber-600">{formatCurrency(pending)}</p>
            <p className="text-xs text-muted-foreground mt-1">Processing...</p>
          </Card>
        </div>

        {/* Commission Types Legend */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Commission Types</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Store className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Seller Referrals</p>
                <p className="text-xs text-muted-foreground">7% of seller revenue</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">Buyer Referrals</p>
                <p className="text-xs text-muted-foreground">5% of order value</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Gift className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Campaign Bonuses</p>
                <p className="text-xs text-muted-foreground">Special promotions</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Transactions */}
        <Card>
          <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-semibold text-foreground">Commission History</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                {['all', 'paid', 'approved', 'pending'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                      filter === status 
                        ? 'bg-card text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="divide-y divide-border">
            {filteredCommissions.map((commission) => (
              <div key={commission.id} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(commission.type)}`}>
                    {getTypeIcon(commission.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{commission.description}</p>
                    <p className="text-sm text-muted-foreground">{new Date(commission.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-primary">+{formatCurrency(commission.amount)}</p>
                      <Badge
                        variant={commission.status === 'paid' ? 'default' : 'secondary'}
                        className={`text-xs ${
                          commission.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                          commission.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {commission.status === 'paid' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {commission.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                      </Badge>
                    </div>
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AffiliateLayout>
  );
}
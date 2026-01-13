import { useState } from 'react';
import { AffiliateLayout } from '@/components/affiliate/AffiliateLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  CheckCircle,
  AlertCircle,
  CreditCard,
  Smartphone,
  Building2,
  Eye,
} from 'lucide-react';

const paymentMethods = [
  { id: 'momo_mtn', name: 'MTN Mobile Money', icon: Smartphone, fee: '200 XAF' },
  { id: 'momo_orange', name: 'Orange Money', icon: Smartphone, fee: '200 XAF' },
  { id: 'bank', name: 'Bank Transfer', icon: Building2, fee: '500 XAF' },
  { id: 'paypal', name: 'PayPal', icon: CreditCard, fee: '2.5%' },
];

const mockPayouts = [
  { id: 'PAY-001', amount: 150000, method: 'MTN Mobile Money', requestDate: '2026-01-05', processedDate: '2026-01-06', status: 'completed' },
  { id: 'PAY-002', amount: 85000, method: 'Bank Transfer', requestDate: '2026-01-08', processedDate: null, status: 'processing' },
  { id: 'PAY-003', amount: 120000, method: 'Orange Money', requestDate: '2025-12-28', processedDate: '2025-12-29', status: 'completed' },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AffiliatePayouts() {
  const [payouts] = useState(mockPayouts);
  
  const available = 245000;
  const pending = 85000;
  const withdrawn = 270000;
  const minPayout = 10000;
  const canWithdraw = available >= minPayout;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <AffiliateLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Payouts</h2>
            <p className="text-sm text-muted-foreground">Withdraw your earnings and track payment history</p>
          </div>
          <Button disabled={!canWithdraw}>
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Withdraw Funds
          </Button>
        </div>

        {/* Balance Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Available Balance</p>
          </div>
          <p className="text-4xl font-bold text-foreground mb-2">
            {formatCurrency(available)}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-muted-foreground">Pending:</span>
              <span className="font-medium">{formatCurrency(pending)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-muted-foreground">Withdrawn:</span>
              <span className="font-medium">{formatCurrency(withdrawn)}</span>
            </div>
          </div>
          {!canWithdraw && (
            <p className="mt-4 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              💡 Minimum withdrawal amount is {formatCurrency(minPayout)}. 
              Keep earning to unlock withdrawals!
            </p>
          )}
        </Card>

        {/* Payment Methods Info */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Available Payment Methods</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="p-2 bg-card rounded-lg">
                  <method.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{method.name}</p>
                  <p className="text-xs text-muted-foreground">Fee: {method.fee}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Payout History */}
        <Card>
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Payout History</h3>
          </div>
          <div className="divide-y divide-border">
            {payouts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No payouts yet. Start earning and withdraw your commissions!
              </div>
            ) : (
              payouts.map((payout) => (
                <div key={payout.id} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(payout.status)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{payout.method}</p>
                      <p className="text-sm text-muted-foreground">
                        Requested: {new Date(payout.requestDate).toLocaleDateString()}
                        {payout.processedDate && ` • Processed: ${new Date(payout.processedDate).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{formatCurrency(payout.amount)}</p>
                        <Badge
                          variant={payout.status === 'completed' ? 'default' : 'secondary'}
                          className={`text-xs ${
                            payout.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                            payout.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}
                        >
                          {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                        </Badge>
                      </div>
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </AffiliateLayout>
  );
}
import { useState, useEffect } from 'react';
import { fetchPayoutHistory, requestPayout, calculateAffiliateCommission } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/mockData';
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Loader2,
  CreditCard,
  Smartphone,
  Building2,
  X,
  Eye,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const paymentMethods = [
  { id: 'momo_mtn', name: 'MTN Mobile Money', icon: Smartphone, fee: '200 XAF', placeholder: 'Enter MTN number (e.g., 670 XXX XXX)' },
  { id: 'momo_orange', name: 'Orange Money', icon: Smartphone, fee: '200 XAF', placeholder: 'Enter Orange number (e.g., 690 XXX XXX)' },
  { id: 'bank', name: 'Bank Transfer', icon: Building2, fee: '500 XAF', placeholder: 'Enter account number' },
  { id: 'paypal', name: 'PayPal', icon: CreditCard, fee: '2.5%', placeholder: 'Enter PayPal email' },
];

export function PayoutsTab() {
  const [history, setHistory] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState('momo_mtn');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [historyData, summaryData] = await Promise.all([
        fetchPayoutHistory(),
        calculateAffiliateCommission(),
      ]);
      setHistory(historyData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to load payouts:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountNumber.trim()) {
      toast.error('Please enter your account/phone number');
      return;
    }
    
    setSubmitting(true);
    try {
      await requestPayout(Number(withdrawAmount), selectedMethod);
      toast.success('Payout request submitted successfully!');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setAccountNumber('');
      loadData();
    } catch (error) {
      toast.error('Failed to request payout');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = (payout: any) => {
    setSelectedPayout(payout);
    setShowDetailModal(true);
  };

  const copyTransactionId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    setCopied(true);
    toast.success('Transaction ID copied');
    setTimeout(() => setCopied(false), 2000);
  };

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

  const selectedMethodInfo = paymentMethods.find(m => m.id === selectedMethod);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const minPayout = 10000; // Minimum payout threshold
  const canWithdraw = (summary?.available || 0) >= minPayout;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Payouts</h2>
          <p className="text-sm text-muted-foreground">Withdraw your earnings and track payment history</p>
        </div>
        <button 
          onClick={() => setShowWithdrawModal(true)}
          disabled={!canWithdraw}
          className={cn(
            'btn-action',
            !canWithdraw && 'opacity-50 cursor-not-allowed'
          )}
        >
          <ArrowUpRight className="w-4 h-4" />
          Withdraw Funds
        </button>
      </div>

      {/* Balance Card */}
      <div className="section-card p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Available Balance</p>
        </div>
        <p className="text-4xl font-bold text-foreground mb-2">
          {formatCurrency(summary?.available || 0)}
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-muted-foreground">Pending:</span>
            <span className="font-medium">{formatCurrency(summary?.pending || 0)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-muted-foreground">Withdrawn:</span>
            <span className="font-medium">{formatCurrency(summary?.withdrawn || 0)}</span>
          </div>
        </div>
        {!canWithdraw && (
          <p className="mt-4 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            💡 Minimum withdrawal amount is {formatCurrency(minPayout)}. 
            Keep earning to unlock withdrawals!
          </p>
        )}
      </div>

      {/* Payment Methods Info */}
      <div className="section-card p-4">
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
      </div>

      {/* Payout History */}
      <div className="section-card">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Payout History</h3>
        </div>
        <div className="divide-y divide-border">
          {history.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No payouts yet. Start earning and withdraw your commissions!
            </div>
          ) : (
            history.map((payout, index) => (
              <div 
                key={payout.id} 
                className="p-4 hover:bg-muted/30 transition-colors animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleViewDetails(payout)}
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(payout.status)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{payout.method}</p>
                    <p className="text-sm text-muted-foreground">
                      Requested: {formatDate(payout.requestDate)}
                      {payout.processedDate && ` • Processed: ${formatDate(payout.processedDate)}`}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{formatCurrency(payout.amount)}</p>
                      <span className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded-full',
                        payout.status === 'completed' && 'bg-emerald-100 text-emerald-700',
                        payout.status === 'processing' && 'bg-amber-100 text-amber-700',
                        payout.status === 'failed' && 'bg-red-100 text-red-700',
                      )}>
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </span>
                    </div>
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-elevated max-w-md w-full animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h3 className="font-semibold text-foreground">Withdraw Funds</h3>
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleWithdraw} className="p-6 space-y-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(summary?.available || 0)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount to Withdraw
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    min={minPayout}
                    max={summary?.available}
                    required
                    className="w-full p-3 pr-16 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">XAF</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum: {formatCurrency(minPayout)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        'flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all',
                        selectedMethod === method.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <input
                        type="radio"
                        name="method"
                        value={method.id}
                        checked={selectedMethod === method.id}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="sr-only"
                      />
                      <method.icon className={cn(
                        'w-5 h-5',
                        selectedMethod === method.id ? 'text-primary' : 'text-muted-foreground'
                      )} />
                      <span className="flex-1 font-medium text-sm">{method.name}</span>
                      <span className="text-xs text-muted-foreground">Fee: {method.fee}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {selectedMethodInfo?.id.includes('momo') ? 'Phone Number' : 
                   selectedMethodInfo?.id === 'bank' ? 'Account Number' : 'PayPal Email'}
                </label>
                <input
                  type={selectedMethodInfo?.id === 'paypal' ? 'email' : 'text'}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={selectedMethodInfo?.placeholder}
                  required
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="bg-muted p-3 rounded-lg text-sm">
                <p className="text-muted-foreground">
                  <strong>Processing Time:</strong> 
                  {selectedMethodInfo?.id.includes('momo') ? ' 1-2 hours' :
                   selectedMethodInfo?.id === 'bank' ? ' 2-3 business days' : ' 1-2 business days'}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !withdrawAmount || !accountNumber}
                  className="btn-action flex-1 justify-center"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                  Withdraw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payout Detail Modal */}
      {showDetailModal && selectedPayout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDetailModal(false)}>
          <div 
            className="bg-card rounded-2xl shadow-elevated max-w-md w-full animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Payout Details</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(selectedPayout.status)}
                <div>
                  <p className="font-semibold text-lg">{selectedPayout.method}</p>
                  <span className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    selectedPayout.status === 'completed' && 'bg-emerald-100 text-emerald-700',
                    selectedPayout.status === 'processing' && 'bg-amber-100 text-amber-700',
                    selectedPayout.status === 'failed' && 'bg-red-100 text-red-700',
                  )}>
                    {selectedPayout.status.charAt(0).toUpperCase() + selectedPayout.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-3xl font-bold text-foreground">{formatCurrency(selectedPayout.amount)}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{selectedPayout.id}</code>
                    <button
                      onClick={() => copyTransactionId(selectedPayout.id)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Requested</span>
                  <span className="font-medium">{formatDate(selectedPayout.requestDate)}</span>
                </div>
                {selectedPayout.processedDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processed</span>
                    <span className="font-medium">{formatDate(selectedPayout.processedDate)}</span>
                  </div>
                )}
              </div>

              {selectedPayout.status === 'processing' && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                  <p className="text-sm text-amber-800">
                    Your payout is being processed. You'll receive a notification once it's completed.
                  </p>
                </div>
              )}

              <button
                onClick={() => setShowDetailModal(false)}
                className="btn-outline w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

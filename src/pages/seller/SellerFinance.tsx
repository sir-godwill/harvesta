import { useState } from 'react';
import { motion } from 'framer-motion';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Wallet,
  Send,
  History,
  Download,
  Eye,
  EyeOff,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Percent,
  Info,
  CreditCard,
  Smartphone,
  Building2,
  FileText,
} from 'lucide-react';

// Mock data for wallet
const mockWalletData = {
  availableBalance: 8750000,
  pendingBalance: 3500000,
  processingBalance: 5500000,
  totalEarnings: 17800000,
  currency: 'XAF',
};

const mockTransactions = [
  { id: '1', type: 'credit', description: 'Order #HRV-20260112-00042 payment', amount: 450000, status: 'completed', date: '2026-01-13 14:30', orderId: 'HRV-20260112-00042' },
  { id: '2', type: 'debit', description: 'Withdrawal to MTN MoMo', amount: 500000, status: 'completed', date: '2026-01-12 09:15', reference: 'WD-2026011200001' },
  { id: '3', type: 'credit', description: 'Order #HRV-20260111-00039 payment', amount: 780000, status: 'pending', date: '2026-01-11 16:45', orderId: 'HRV-20260111-00039' },
  { id: '4', type: 'debit', description: 'Platform commission (7%)', amount: 35000, status: 'completed', date: '2026-01-11 16:45', orderId: 'HRV-20260111-00039' },
  { id: '5', type: 'credit', description: 'Order #HRV-20260110-00035 payment', amount: 1250000, status: 'completed', date: '2026-01-10 11:20', orderId: 'HRV-20260110-00035' },
  { id: '6', type: 'debit', description: 'Withdrawal to Bank Account', amount: 2000000, status: 'processing', date: '2026-01-09 08:00', reference: 'WD-2026010900001' },
];

const mockWithdrawalHistory = [
  { id: '1', amount: 500000, method: 'MTN MoMo', account: '237 *** *** 456', status: 'completed', date: '2026-01-12', fee: 200, reference: 'WD-2026011200001' },
  { id: '2', amount: 2000000, method: 'Bank Transfer', account: 'BGFI ***4521', status: 'processing', date: '2026-01-09', fee: 500, reference: 'WD-2026010900001' },
  { id: '3', amount: 750000, method: 'Orange Money', account: '237 *** *** 789', status: 'completed', date: '2026-01-05', fee: 200, reference: 'WD-2026010500001' },
];

const formatXAF = (amount: number) => {
  return new Intl.NumberFormat('fr-CM', { 
    style: 'decimal',
    maximumFractionDigits: 0 
  }).format(amount) + ' XAF';
};

export default function SellerFinance() {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [withdrawAccount, setWithdrawAccount] = useState('');

  const handleWithdraw = () => {
    // API placeholder: processWithdrawal()
    console.log('Processing withdrawal:', { withdrawAmount, withdrawMethod, withdrawAccount });
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Finance</h1>
            <p className="text-muted-foreground">Earnings & withdrawals</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Statement
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Tax Report
            </Button>
          </div>
        </div>

        {/* Quick Action Tabs - Mobile Friendly */}
        <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveTab('overview')}
            className="shrink-0"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Wallet
          </Button>
          <Button 
            variant={activeTab === 'history' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveTab('history')}
            className="shrink-0"
          >
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button 
            variant={activeTab === 'withdrawals' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveTab('withdrawals')}
            className="shrink-0"
          >
            <Send className="w-4 h-4 mr-2" />
            Withdrawals
          </Button>
          <Button 
            variant={activeTab === 'reports' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveTab('reports')}
            className="shrink-0"
          >
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </Button>
        </div>

        {/* Wallet Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  <span className="font-medium">Your Wallet</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                >
                  {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>

              <div className="space-y-1 mb-6">
                <p className="text-sm opacity-80">Available Balance</p>
                <p className="text-3xl sm:text-4xl font-bold">
                  {showBalance ? formatXAF(mockWalletData.availableBalance) : '••••••••'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs opacity-80">Pending</p>
                    <p className="font-semibold text-sm">
                      {showBalance ? formatXAF(mockWalletData.pendingBalance).replace(' XAF', '') : '••••'} FCFA
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs opacity-80">Processing</p>
                    <p className="font-semibold text-sm">
                      {showBalance ? formatXAF(mockWalletData.processingBalance).replace(' XAF', '') : '••••'} FCFA
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs opacity-80">Total</p>
                    <p className="font-semibold text-sm">
                      {showBalance ? formatXAF(mockWalletData.totalEarnings).replace(' XAF', '') : '••••'} FCFA
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => setShowWithdrawModal(true)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Withdraw Funds
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Statement
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Platform Fee Info */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Platform Fee Structure</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong className="text-foreground">7% commission</strong> on all sales + <strong className="text-foreground">~2% payment processing fee</strong>. 
                  Withdrawal fees vary by method: Bank transfer (500 XAF), MTN MoMo (200 XAF), Orange Money (200 XAF).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">This Month</p>
                  <p className="font-bold text-lg text-foreground">2.4M</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Percent className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Commission</p>
                  <p className="font-bold text-lg text-foreground">168K</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Withdrawn</p>
                  <p className="font-bold text-lg text-foreground">3.2M</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Orders Paid</p>
                  <p className="font-bold text-lg text-foreground">42</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Recent Transactions
              </CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTransactions.slice(0, 5).map((tx) => (
                <div 
                  key={tx.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'credit' ? 'bg-success/10' : 'bg-destructive/10'
                    }`}>
                      {tx.type === 'credit' ? (
                        <ArrowDownLeft className={`w-5 h-5 text-success`} />
                      ) : (
                        <ArrowUpRight className={`w-5 h-5 text-destructive`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${tx.type === 'credit' ? 'text-success' : 'text-foreground'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{formatXAF(tx.amount)}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        tx.status === 'completed' ? 'bg-success/10 text-success' :
                        tx.status === 'pending' ? 'bg-warning/10 text-warning' :
                        'bg-info/10 text-info'
                      }`}
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Withdrawal History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockWithdrawalHistory.map((withdrawal) => (
                <div 
                  key={withdrawal.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      {withdrawal.method === 'MTN MoMo' && <Smartphone className="w-5 h-5 text-yellow-600" />}
                      {withdrawal.method === 'Orange Money' && <Smartphone className="w-5 h-5 text-orange-600" />}
                      {withdrawal.method === 'Bank Transfer' && <Building2 className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{withdrawal.method}</p>
                      <p className="text-xs text-muted-foreground">{withdrawal.account} • {withdrawal.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatXAF(withdrawal.amount)}</p>
                    <p className="text-xs text-muted-foreground">Fee: {withdrawal.fee} XAF</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Withdraw Modal */}
        <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
              <DialogDescription>
                Available balance: {formatXAF(mockWalletData.availableBalance)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Amount (XAF)</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Minimum: 5,000 XAF</p>
              </div>
              <div className="space-y-2">
                <Label>Withdrawal Method</Label>
                <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mtn">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-yellow-600" />
                        MTN MoMo (Fee: 200 XAF)
                      </div>
                    </SelectItem>
                    <SelectItem value="orange">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-orange-600" />
                        Orange Money (Fee: 200 XAF)
                      </div>
                    </SelectItem>
                    <SelectItem value="bank">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        Bank Transfer (Fee: 500 XAF)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {withdrawMethod && (
                <div className="space-y-2">
                  <Label>
                    {withdrawMethod === 'bank' ? 'Account Number' : 'Phone Number'}
                  </Label>
                  <Input
                    placeholder={withdrawMethod === 'bank' ? 'Enter account number' : 'e.g., 237 6XX XXX XXX'}
                    value={withdrawAccount}
                    onChange={(e) => setWithdrawAccount(e.target.value)}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowWithdrawModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleWithdraw} disabled={!withdrawAmount || !withdrawMethod || !withdrawAccount}>
                Withdraw
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SellerLayout>
  );
}

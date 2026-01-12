import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Search,
  Filter,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  MoreHorizontal,
  Wallet,
  TrendingUp,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

interface Transaction {
  id: string;
  type: 'payment' | 'payout' | 'refund' | 'escrow';
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  from: string;
  to: string;
  date: string;
  method: string;
}

const mockTransactions: Transaction[] = [
  { id: 'TXN-001', type: 'payment', amount: 2500000, status: 'completed', from: 'EuroFoods GmbH', to: 'Kofi Organic Farms', date: new Date().toISOString(), method: 'Bank Transfer' },
  { id: 'TXN-002', type: 'payout', amount: 1800000, status: 'processing', from: 'Harvestá Escrow', to: 'Ethiopian Coffee', date: new Date(Date.now() - 3600000).toISOString(), method: 'Mobile Money' },
  { id: 'TXN-003', type: 'escrow', amount: 4200000, status: 'pending', from: 'AsiaSpice Ltd', to: 'Harvestá Escrow', date: new Date(Date.now() - 7200000).toISOString(), method: 'Wire Transfer' },
  { id: 'TXN-004', type: 'refund', amount: 350000, status: 'completed', from: 'Harvestá', to: 'Global Organics', date: new Date(Date.now() - 86400000).toISOString(), method: 'Original Method' },
  { id: 'TXN-005', type: 'payment', amount: 5600000, status: 'failed', from: 'Fresh Imports Co', to: 'Lagos Agro Export', date: new Date(Date.now() - 172800000).toISOString(), method: 'Card Payment' },
];

function TransactionCard({ transaction }: { transaction: Transaction }) {
  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);

  const statusConfig = {
    completed: { color: 'bg-success/10 text-success', icon: CheckCircle2 },
    pending: { color: 'bg-warning/10 text-warning', icon: Clock },
    failed: { color: 'bg-destructive/10 text-destructive', icon: XCircle },
    processing: { color: 'bg-info/10 text-info', icon: RefreshCw },
  };

  const typeConfig = {
    payment: { color: 'text-success', icon: ArrowDownRight, label: 'Payment' },
    payout: { color: 'text-primary', icon: ArrowUpRight, label: 'Payout' },
    refund: { color: 'text-warning', icon: ArrowUpRight, label: 'Refund' },
    escrow: { color: 'text-info', icon: Wallet, label: 'Escrow' },
  };

  const status = statusConfig[transaction.status];
  const type = typeConfig[transaction.type];
  const StatusIcon = status.icon;
  const TypeIcon = type.icon;

  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className={cn('p-2 rounded-lg', type.color === 'text-success' ? 'bg-success/10' : type.color === 'text-primary' ? 'bg-primary/10' : type.color === 'text-warning' ? 'bg-warning/10' : 'bg-info/10')}>
              <TypeIcon className={cn('h-5 w-5', type.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">{type.label}</p>
                  <p className="text-xs text-muted-foreground">{transaction.id}</p>
                </div>
                <div className="text-right">
                  <p className={cn('font-bold', transaction.type === 'payment' || transaction.type === 'escrow' ? 'text-success' : '')}>
                    {transaction.type === 'payment' || transaction.type === 'escrow' ? '+' : '-'}{formatPrice(transaction.amount)}
                  </p>
                  <Badge className={cn('text-[10px]', status.color)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {transaction.status}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>{transaction.from}</span>
                <ArrowDownRight className="h-3 w-3" />
                <span>{transaction.to}</span>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{transaction.method}</span>
                <span>{new Date(transaction.date).toLocaleString()}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                <DropdownMenuItem>Report Issue</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Payments() {
  const [activeTab, setActiveTab] = useState('transactions');

  const stats = {
    totalVolume: 450000000,
    escrowHeld: 125000000,
    pendingPayouts: 45000000,
    failedTransactions: 12,
  };

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', notation: 'compact', maximumFractionDigits: 1 }).format(amount);

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
            <CreditCard className="h-6 w-6 text-primary" />
            Payments & Finance
          </h1>
          <p className="text-sm text-muted-foreground">Manage transactions, escrow, and payouts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button size="sm">
            <DollarSign className="h-4 w-4 mr-2" /> Process Payouts
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Volume', value: formatPrice(stats.totalVolume), icon: TrendingUp, color: 'bg-primary/10 text-primary', trend: '+18%' },
          { label: 'Escrow Held', value: formatPrice(stats.escrowHeld), icon: Wallet, color: 'bg-info/10 text-info' },
          { label: 'Pending Payouts', value: formatPrice(stats.pendingPayouts), icon: Clock, color: 'bg-warning/10 text-warning' },
          { label: 'Failed (24h)', value: stats.failedTransactions.toString(), icon: AlertTriangle, color: 'bg-destructive/10 text-destructive' },
        ].map((stat, i) => (
          <motion.div key={stat.label} variants={itemVariants} whileHover={{ y: -2 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-lg sm:text-xl font-bold mt-1">{stat.value}</p>
                    {stat.trend && <span className="text-xs text-success">{stat.trend}</span>}
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
          <div className="flex flex-col sm:flex-row gap-3">
            <TabsList className="h-auto p-1 flex-wrap justify-start">
              <TabsTrigger value="transactions" className="text-xs sm:text-sm">Transactions</TabsTrigger>
              <TabsTrigger value="escrow" className="text-xs sm:text-sm">Escrow</TabsTrigger>
              <TabsTrigger value="payouts" className="text-xs sm:text-sm">Payouts</TabsTrigger>
            </TabsList>
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search transactions..." className="pl-9" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="transactions" className="mt-4">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
              {mockTransactions.map((txn) => (
                <TransactionCard key={txn.id} transaction={txn} />
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="escrow" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wallet className="h-5 w-5" /> Escrow Management
                </CardTitle>
                <CardDescription>Funds held until delivery confirmation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">Total Escrow Balance</p>
                      <p className="text-2xl font-bold text-primary">{formatPrice(stats.escrowHeld)}</p>
                    </div>
                    <Wallet className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground">Pending Release</p>
                      <p className="font-bold">23 orders</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground">Disputed</p>
                      <p className="font-bold">3 orders</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground">Auto-release Today</p>
                      <p className="font-bold">8 orders</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" /> Seller Payouts
                </CardTitle>
                <CardDescription>Scheduled and pending payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-warning">Next Payout Batch</p>
                        <p className="text-sm text-muted-foreground">Scheduled for tomorrow at 9:00 AM</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{formatPrice(stats.pendingPayouts)}</p>
                        <p className="text-xs text-muted-foreground">45 sellers</p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">Process Payouts Now</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Search, Filter, MoreHorizontal, Eye, DollarSign, Clock, CheckCircle, XCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

interface Transaction {
  id: string;
  orderId: string;
  type: 'payment' | 'payout' | 'refund';
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  party: string;
  date: string;
}

const statusColors: Record<string, string> = {
  completed: 'bg-green-500/10 text-green-600 border-green-200',
  pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  failed: 'bg-red-500/10 text-red-600 border-red-200',
};

const typeIcons: Record<string, typeof ArrowUpRight> = {
  payment: ArrowDownRight,
  payout: ArrowUpRight,
  refund: ArrowUpRight,
};

// Mock data
const mockTransactions: Transaction[] = [
  { id: 'TXN-001', orderId: 'ORD-4521', type: 'payment', amount: 2500000, method: 'Mobile Money', status: 'completed', party: 'EuroFoods GmbH', date: '2024-01-15T10:30:00Z' },
  { id: 'TXN-002', orderId: 'ORD-4522', type: 'payout', amount: 1800000, method: 'Bank Transfer', status: 'pending', party: 'Kofi Organic Farms', date: '2024-01-15T09:00:00Z' },
  { id: 'TXN-003', orderId: 'ORD-4520', type: 'refund', amount: 350000, method: 'Original Method', status: 'completed', party: 'AsiaSpice Ltd', date: '2024-01-14T15:20:00Z' },
  { id: 'TXN-004', orderId: 'ORD-4519', type: 'payment', amount: 5600000, method: 'Credit Card', status: 'completed', party: 'Global Organics', date: '2024-01-14T11:00:00Z' },
  { id: 'TXN-005', orderId: 'ORD-4518', type: 'payout', amount: 4200000, method: 'Bank Transfer', status: 'failed', party: 'Ethiopian Coffee', date: '2024-01-13T16:45:00Z' },
];

const mockEscrow = [
  { id: 'ESC-001', orderId: 'ORD-4521', amount: 2500000, buyer: 'EuroFoods GmbH', seller: 'Kofi Organic', status: 'held', releaseDate: '2024-01-20' },
  { id: 'ESC-002', orderId: 'ORD-4522', amount: 1800000, buyer: 'AsiaSpice Ltd', seller: 'Lagos Agro', status: 'held', releaseDate: '2024-01-22' },
  { id: 'ESC-003', orderId: 'ORD-4519', amount: 5600000, buyer: 'Global Organics', seller: 'Ethiopian Coffee', status: 'pending_release', releaseDate: '2024-01-18' },
];

export default function AdminPayments() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    totalVolume: transactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.amount, 0),
    pendingPayouts: transactions.filter(t => t.type === 'payout' && t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
    escrowHeld: mockEscrow.reduce((sum, e) => sum + e.amount, 0),
    refunded: transactions.filter(t => t.type === 'refund').reduce((sum, t) => sum + t.amount, 0),
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold">Payment Management</h1>
        <p className="text-muted-foreground">Manage transactions, escrow, and payouts</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalVolume)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Payouts</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.pendingPayouts)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Escrow</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.escrowHeld)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Refunded</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.refunded)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="escrow">Escrow</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          {/* Filters */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="payout">Payouts</SelectItem>
                <SelectItem value="refund">Refunds</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((txn) => {
                    const TypeIcon = typeIcons[txn.type];
                    return (
                      <TableRow key={txn.id}>
                        <TableCell className="font-medium">{txn.id}</TableCell>
                        <TableCell>{txn.orderId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TypeIcon className={`h-4 w-4 ${txn.type === 'payment' ? 'text-green-500' : 'text-red-500'}`} />
                            <span className="capitalize">{txn.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{txn.party}</TableCell>
                        <TableCell>{txn.method}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(txn.amount)}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[txn.status]}>{txn.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                              {txn.status === 'failed' && (
                                <DropdownMenuItem onClick={() => toast.success('Retry initiated')}>
                                  Retry Payment
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escrow">
          <Card>
            <CardHeader>
              <CardTitle>Escrow Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Escrow ID</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEscrow.map((escrow) => (
                    <TableRow key={escrow.id}>
                      <TableCell className="font-medium">{escrow.id}</TableCell>
                      <TableCell>{escrow.orderId}</TableCell>
                      <TableCell>{escrow.buyer}</TableCell>
                      <TableCell>{escrow.seller}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(escrow.amount)}</TableCell>
                      <TableCell>{new Date(escrow.releaseDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={escrow.status === 'held' ? 'bg-blue-500/10 text-blue-600' : 'bg-yellow-500/10 text-yellow-600'}>
                          {escrow.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => toast.success('Escrow released')}>
                          Release
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Payouts</CardTitle>
              <Button onClick={() => toast.success('All payouts processed')}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Process All
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seller</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.filter(t => t.type === 'payout').map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">{payout.party}</TableCell>
                      <TableCell>3 orders</TableCell>
                      <TableCell className="font-medium">{formatCurrency(payout.amount)}</TableCell>
                      <TableCell>{payout.method}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[payout.status]}>{payout.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {payout.status === 'pending' && (
                          <Button size="sm" onClick={() => toast.success('Payout processed')}>
                            Pay Now
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

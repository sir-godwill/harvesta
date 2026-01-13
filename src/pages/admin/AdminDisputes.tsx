import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Search, Filter, MoreHorizontal, Eye, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { fetchDisputes, Dispute } from '@/lib/admin-api';
import { DisputeModal } from '@/components/admin/modals/DisputeModal';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const statusColors: Record<string, string> = {
  open: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  under_review: 'bg-blue-500/10 text-blue-600 border-blue-200',
  resolved: 'bg-green-500/10 text-green-600 border-green-200',
  escalated: 'bg-red-500/10 text-red-600 border-red-200',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-500/10 text-gray-600',
  medium: 'bg-yellow-500/10 text-yellow-600',
  high: 'bg-red-500/10 text-red-600',
};

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    setLoading(true);
    const data = await fetchDisputes();
    setDisputes(data);
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const filteredDisputes = disputes.filter(d => {
    const matchesSearch = d.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         d.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         d.sellerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: disputes.length,
    open: disputes.filter(d => d.status === 'open').length,
    escalated: disputes.filter(d => d.status === 'escalated').length,
    resolved: disputes.filter(d => d.status === 'resolved').length,
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold">Dispute Management</h1>
        <p className="text-muted-foreground">Handle buyer and seller disputes</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Disputes</p>
                <p className="text-2xl font-bold">{stats.total}</p>
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
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-2xl font-bold">{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Escalated</p>
                <p className="text-2xl font-bold">{stats.escalated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search disputes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dispute ID</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Parties</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDisputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-medium">{dispute.id}</TableCell>
                      <TableCell>{dispute.orderId}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{dispute.buyerName}</p>
                          <p className="text-muted-foreground">vs {dispute.sellerName}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{dispute.reason}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-medium">
                          <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                          {formatCurrency(dispute.amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityColors[dispute.priority]}>{dispute.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[dispute.status]}>
                          {dispute.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setSelectedDispute(dispute); setModalOpen(true); }}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>Assign Agent</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Escalate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Dispute Modal */}
      <DisputeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        dispute={selectedDispute}
        onResolved={loadDisputes}
      />
    </motion.div>
  );
}

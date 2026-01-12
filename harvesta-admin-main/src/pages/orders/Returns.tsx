import { motion } from 'framer-motion';
import { RotateCcw, Package, DollarSign, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const mockReturns = [
  { id: 'RET-001', orderId: 'ORD-2389', product: 'Organic Cassava Flour', reason: 'Quality issue', amount: 450, status: 'pending' },
  { id: 'RET-002', orderId: 'ORD-2345', product: 'Premium Cocoa Beans', reason: 'Wrong quantity', amount: 1200, status: 'approved' },
  { id: 'RET-003', orderId: 'ORD-2301', product: 'Dried Hibiscus', reason: 'Damaged in transit', amount: 350, status: 'refunded' },
];

const statusConfig: Record<string, { color: string; icon: typeof Clock }> = {
  pending: { color: 'bg-warning/10 text-warning', icon: Clock },
  approved: { color: 'bg-info/10 text-info', icon: CheckCircle },
  refunded: { color: 'bg-success/10 text-success', icon: DollarSign },
  rejected: { color: 'bg-destructive/10 text-destructive', icon: XCircle },
};

export default function Returns() {
  const handleApprove = (id: string) => toast.success('Return approved, refund initiated.');
  const handleReject = (id: string) => toast.error('Return request rejected.');

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold">Returns & Refunds</h1>
        <p className="text-muted-foreground">Manage product returns and process refunds</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4"><p className="text-sm text-muted-foreground">Total Returns</p><p className="text-2xl font-bold">23</p></Card>
        <Card className="p-4"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-warning">8</p></Card>
        <Card className="p-4"><p className="text-sm text-muted-foreground">Approved</p><p className="text-2xl font-bold text-success">12</p></Card>
        <Card className="p-4"><p className="text-sm text-muted-foreground">Refunded</p><p className="text-2xl font-bold text-info">$4,250</p></Card>
      </motion.div>

      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search returns..." className="pl-10" />
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        {mockReturns.map((ret) => {
          const StatusIcon = statusConfig[ret.status].icon;
          return (
            <Card key={ret.id}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="p-3 bg-muted rounded-xl shrink-0"><RotateCcw className="h-6 w-6" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{ret.id}</h3>
                    <Badge className={statusConfig[ret.status].color}><StatusIcon className="mr-1 h-3 w-3" />{ret.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{ret.product} • {ret.reason}</p>
                  <p className="text-sm">Order: {ret.orderId} • Refund: ${ret.amount}</p>
                </div>
                {ret.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button variant="destructive" size="sm" onClick={() => handleReject(ret.id)}>Reject</Button>
                    <Button size="sm" onClick={() => handleApprove(ret.id)}>Approve Refund</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
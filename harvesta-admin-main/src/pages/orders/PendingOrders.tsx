import { motion } from 'framer-motion';
import { Clock, Package, Truck, CheckCircle, Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const mockOrders = [
  { id: 'ORD-2401', buyer: 'Global Foods Ltd', items: 3, total: 4500, status: 'pending', date: '2024-01-10' },
  { id: 'ORD-2402', buyer: 'Fresh Markets Inc', items: 5, total: 8200, status: 'pending', date: '2024-01-10' },
  { id: 'ORD-2403', buyer: 'Euro Imports', items: 2, total: 3100, status: 'pending', date: '2024-01-09' },
];

export default function PendingOrders() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold">Pending Orders</h1>
        <p className="text-muted-foreground">Orders awaiting processing</p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-10" />
        </div>
        <Button variant="outline"><Filter className="mr-2 h-4 w-4" />Filter</Button>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        {mockOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-warning/10 rounded-xl">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold">{order.id}</h3>
                  <p className="text-sm text-muted-foreground">{order.buyer} • {order.items} items</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg font-bold">${order.total.toLocaleString()}</p>
                <Button size="sm"><Truck className="mr-1 h-4 w-4" />Process</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </motion.div>
  );
}
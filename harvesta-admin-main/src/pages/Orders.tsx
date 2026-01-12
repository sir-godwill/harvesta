import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Search,
  Filter,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchOrders, Order } from '@/lib/api';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function OrderCard({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    pending: { color: 'bg-warning/10 text-warning', icon: Clock, label: 'Pending' },
    processing: { color: 'bg-info/10 text-info', icon: RefreshCw, label: 'Processing' },
    shipped: { color: 'bg-primary/10 text-primary', icon: Truck, label: 'Shipped' },
    delivered: { color: 'bg-success/10 text-success', icon: CheckCircle2, label: 'Delivered' },
    cancelled: { color: 'bg-destructive/10 text-destructive', icon: XCircle, label: 'Cancelled' },
    delayed: { color: 'bg-destructive/10 text-destructive', icon: AlertTriangle, label: 'Delayed' },
  };

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);

  return (
    <motion.div variants={itemVariants} layout>
      <Card className={cn('overflow-hidden transition-shadow', isExpanded && 'shadow-lg')}>
        <CardContent className="p-0">
          {/* Main Row */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-4 text-left flex items-center gap-3 hover:bg-muted/30 transition-colors"
          >
            <div className={cn('p-2 rounded-lg', status.color)}>
              <StatusIcon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-medium text-sm">#{order.id}</span>
                <Badge variant="outline" className="text-[10px]">
                  {order.itemCount} items
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">{order.buyerName}</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="font-bold">{formatPrice(order.total)}</p>
              <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <Badge className={status.color}>{status.label}</Badge>
            <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </button>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 pt-0 border-t bg-muted/20">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Seller</p>
                      <p className="font-medium text-sm">{order.sellerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Region</p>
                      <p className="font-medium text-sm">{order.region}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Payment</p>
                      <Badge variant="outline" className="text-xs">{order.paymentStatus}</Badge>
                    </div>
                    <div className="sm:hidden">
                      <p className="text-xs text-muted-foreground mb-1">Total</p>
                      <p className="font-bold">{formatPrice(order.total)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Delivery</p>
                      <p className="text-sm">{order.deliveryType}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" /> View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Truck className="h-4 w-4 mr-1" /> Track Shipment
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                        <DropdownMenuItem>Contact Buyer</DropdownMenuItem>
                        <DropdownMenuItem>Contact Seller</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchOrders().then((data) => {
      setOrders(data);
      setIsLoading(false);
    });
  }, []);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    delayed: orders.filter((o) => o.status === 'delayed').length,
  };

  const filteredOrders = activeTab === 'all' ? orders : orders.filter((o) => o.status === activeTab);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

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
            <ShoppingCart className="h-6 w-6 text-primary" />
            Order Management
          </h1>
          <p className="text-sm text-muted-foreground">Track and manage all marketplace orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Calendar className="mr-2 h-4 w-4" /> Date Range
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-foreground' },
          { label: 'Pending', value: stats.pending, color: 'text-warning' },
          { label: 'Shipped', value: stats.shipped, color: 'text-primary' },
          { label: 'Delivered', value: stats.delivered, color: 'text-success' },
          { label: 'Delayed', value: stats.delayed, color: 'text-destructive' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className={cn('text-2xl sm:text-3xl font-bold', stat.color)}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Tabs & Filters */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row gap-3">
            <TabsList className="h-auto p-1 flex-wrap justify-start">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All Orders</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs sm:text-sm">Pending</TabsTrigger>
              <TabsTrigger value="shipped" className="text-xs sm:text-sm">Shipped</TabsTrigger>
              <TabsTrigger value="delivered" className="text-xs sm:text-sm">Delivered</TabsTrigger>
              <TabsTrigger value="delayed" className="text-xs sm:text-sm">Delayed</TabsTrigger>
            </TabsList>
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search orders..." className="pl-9" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {filteredOrders.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>No orders found</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  Printer,
  Clock,
  Package,
  Truck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchAllOrders, formatXAF, type Order } from '@/services/seller-api';

const statusConfig: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: 'Pending', icon: Clock, className: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
  processing: { label: 'Processing', icon: Package, className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  shipped: { label: 'Shipped', icon: Truck, className: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  delivered: { label: 'Delivered', icon: CheckCircle2, className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  cancelled: { label: 'Cancelled', icon: XCircle, className: 'bg-red-500/10 text-red-600 border-red-500/20' },
};

export default function SellerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      try {
        const data = await fetchAllOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && order.status === 'pending';
    if (activeTab === 'active') return matchesSearch && ['processing', 'shipped'].includes(order.status);
    if (activeTab === 'completed') return matchesSearch && order.status === 'delivered';
    return matchesSearch;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short',
    });
  };

  const tabCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    active: orders.filter(o => ['processing', 'shipped'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground">Track and manage all your orders</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {/* Tabs and Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 mb-6"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="all" className="gap-1.5 text-xs sm:text-sm">
                All
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{tabCounts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-1.5 text-xs sm:text-sm">
                Pending
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-orange-500/20 text-orange-600">{tabCounts.pending}</Badge>
              </TabsTrigger>
              <TabsTrigger value="active" className="gap-1.5 text-xs sm:text-sm">
                Active
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-primary/20 text-primary">{tabCounts.active}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-1.5 text-xs sm:text-sm">
                Done
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-emerald-500/20 text-emerald-600">{tabCounts.completed}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </motion.div>

        {/* Orders Table - Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="hidden md:block"
        >
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[140px]">Order ID</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order, index) => {
                      const status = statusConfig[order.status] || statusConfig.pending;
                      const StatusIcon = status.icon;

                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 + index * 0.02 }}
                          className="group hover:bg-muted/30 transition-colors"
                        >
                          <TableCell>
                            <span className="font-mono font-medium text-primary text-sm">{order.orderNumber}</span>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-foreground text-sm">{order.buyerName}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                              {order.productName}
                            </p>
                          </TableCell>
                          <TableCell className="text-center text-sm">
                            {order.quantity}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-sm">
                            {formatXAF(order.total)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn('gap-1 text-xs', status.className)}>
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatDate(order.createdAt)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="gap-2">
                                  <Eye className="w-4 h-4" /> View Details
                                </DropdownMenuItem>
                                {order.status === 'pending' && (
                                  <>
                                    <DropdownMenuItem className="gap-2 text-emerald-600">
                                      <CheckCircle2 className="w-4 h-4" /> Accept
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2 text-red-600">
                                      <XCircle className="w-4 h-4" /> Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuItem className="gap-2">
                                  <Printer className="w-4 h-4" /> Print Invoice
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders Cards - Mobile */}
        <div className="md:hidden space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            filteredOrders.map((order, index) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.03 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="font-mono font-medium text-primary text-sm">{order.orderNumber}</span>
                          <p className="font-medium text-foreground mt-0.5">{order.buyerName}</p>
                        </div>
                        <Badge variant="outline" className={cn('gap-1 text-xs', status.className)}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                        {order.productName} × {order.quantity}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
                        <span className="font-semibold text-sm">{formatXAF(order.total)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Empty State */}
        {!isLoading && filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Try adjusting your search' : 'Orders will appear here once received'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

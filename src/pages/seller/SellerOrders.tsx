import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Clock,
  ChevronDown,
  MoreVertical,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { mockSellerOrders, SellerOrder } from '@/services/seller-api';
import { format } from 'date-fns';

const formatCurrency = (amount: number, currency = 'XAF') => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);
};

const getStatusConfig = (status: SellerOrder['status']) => {
  const config: Record<SellerOrder['status'], { color: string; icon: React.ElementType }> = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    processing: { color: 'bg-purple-100 text-purple-800', icon: Package },
    shipped: { color: 'bg-indigo-100 text-indigo-800', icon: Truck },
    delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
  };
  return config[status];
};

const getPaymentBadge = (status: SellerOrder['paymentStatus']) => {
  const styles: Record<SellerOrder['paymentStatus'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    refunded: 'bg-red-100 text-red-800',
  };
  return styles[status];
};

export default function SellerOrders() {
  const [orders] = useState(mockSellerOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Manage and track your orders</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Orders
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('all')}>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('pending')}>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('processing')}>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">{stats.processing}</p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('shipped')}>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-indigo-600">{stats.shipped}</p>
              <p className="text-sm text-muted-foreground">Shipped</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('delivered')}>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order number or buyer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    const StatusIcon = statusConfig.icon;
                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium font-mono text-sm">{order.orderNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.buyerName}</p>
                            <p className="text-xs text-muted-foreground">{order.buyerCountry}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.items.slice(0, 2).map((item, i) => (
                              <p key={i} className="text-sm">
                                {item.quantity}x {item.productName.substring(0, 20)}...
                              </p>
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-xs text-muted-foreground">+{order.items.length - 2} more</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(order.totalAmount, order.currency)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getPaymentBadge(order.paymentStatus)}>
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${statusConfig.color} flex items-center gap-1 w-fit`}>
                            <StatusIcon className="w-3 h-3" />
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Contact Buyer
                              </DropdownMenuItem>
                              {order.status === 'pending' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-green-600">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Confirm Order
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancel Order
                                  </DropdownMenuItem>
                                </>
                              )}
                              {order.status === 'processing' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-indigo-600">
                                    <Truck className="w-4 h-4 mr-2" />
                                    Mark as Shipped
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SellerLayout>
  );
}

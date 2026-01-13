import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Eye,
  MoreVertical,
  ExternalLink,
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
import { mockSellerDeliveries, mockSellerCarriers, SellerDelivery } from '@/services/seller-api';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const getStatusConfig = (status: SellerDelivery['status']) => {
  const config: Record<SellerDelivery['status'], { color: string; icon: React.ElementType }> = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    picked_up: { color: 'bg-blue-100 text-blue-800', icon: Package },
    in_transit: { color: 'bg-purple-100 text-purple-800', icon: Truck },
    delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    failed: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  };
  return config[status];
};

export default function SellerLogistics() {
  const [deliveries] = useState(mockSellerDeliveries);
  const [carriers] = useState(mockSellerCarriers);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('shipments');

  const stats = {
    total: deliveries.length,
    inTransit: deliveries.filter((d) => d.status === 'in_transit').length,
    delivered: deliveries.filter((d) => d.status === 'delivered').length,
    pending: deliveries.filter((d) => d.status === 'pending').length,
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Logistics</h1>
            <p className="text-muted-foreground">Manage shipments and carriers</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/seller/logistics/carriers">
                <Truck className="w-4 h-4 mr-2" />
                Manage Carriers
              </Link>
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Shipment
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Shipments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.inTransit}</p>
                  <p className="text-sm text-muted-foreground">In Transit</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.delivered}</p>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="shipments" className="mt-4">
            {/* Filters */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by tracking number or order..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="picked_up">Picked Up</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Carrier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Carriers</SelectItem>
                      {carriers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Shipments Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tracking #</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Carrier</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Est. Delivery</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deliveries.map((delivery) => {
                        const statusConfig = getStatusConfig(delivery.status);
                        const StatusIcon = statusConfig.icon;
                        return (
                          <TableRow key={delivery.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm">{delivery.trackingNumber}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">{delivery.orderNumber}</p>
                              <p className="text-xs text-muted-foreground">{delivery.buyerName}</p>
                            </TableCell>
                            <TableCell>{delivery.carrier}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                {delivery.destination}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={`${statusConfig.color} flex items-center gap-1 w-fit`}>
                                <StatusIcon className="w-3 h-3" />
                                {delivery.status.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {format(new Date(delivery.estimatedDelivery), 'MMM dd, yyyy')}
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
                                    Track Shipment
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Package className="w-4 h-4 mr-2" />
                                    View Order
                                  </DropdownMenuItem>
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
          </TabsContent>

          <TabsContent value="tracking" className="mt-4">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Live Tracking</h3>
                  <p className="text-muted-foreground mb-4">
                    Enter a tracking number to view real-time shipment location and status updates.
                  </p>
                  <div className="flex gap-2">
                    <Input placeholder="Enter tracking number..." className="flex-1" />
                    <Button className="bg-green-600 hover:bg-green-700">Track</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Active Carriers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Active Carriers</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/seller/logistics/carriers">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {carriers.filter((c) => c.isActive).slice(0, 3).map((carrier) => (
                <div key={carrier.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {carrier.code.substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{carrier.name}</p>
                        <p className="text-xs text-muted-foreground">{carrier.serviceTypes.join(', ')}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600">Active</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Rating</p>
                      <p className="font-medium">{carrier.rating}/5.0</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">On-time</p>
                      <p className="font-medium">{carrier.onTimeRate}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SellerLayout>
  );
}

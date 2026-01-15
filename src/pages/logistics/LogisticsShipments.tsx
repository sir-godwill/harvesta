import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Search,
  Filter,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  AlertTriangle,
  ChevronRight,
  MoreVertical,
  Download,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  getAssignedDeliveries,
  updateDeliveryStatus,
  getLogisticsProfile
} from '@/lib/logistics-api';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function LogisticsShipments() {
  const [loading, setLoading] = useState(true);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      const { data, error } = await getAssignedDeliveries();
      if (error) throw error;
      setDeliveries(data || []);
    } catch (error) {
      toast.error('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: any) => {
    try {
      const { error } = await updateDeliveryStatus(id, newStatus, `Status updated to ${newStatus}`);
      if (error) throw error;
      toast.success(`Shipment marked as ${newStatus.replace('_', ' ')}`);
      loadDeliveries();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const filteredDeliveries = deliveries.filter(d => {
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesSearch = d.tracking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.delivery_address?.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipment Management</h1>
          <p className="text-muted-foreground text-lg">Track, update and manage all your assigned deliveries.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by tracking number or city..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              {['all', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="whitespace-nowrap capitalize"
                >
                  {status.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDeliveries.length > 0 ? filteredDeliveries.map((delivery) => (
              <div key={delivery.id} className="border rounded-2xl p-6 transition-all hover:border-primary/30 hover:shadow-sm bg-white">
                <div className="grid md:grid-cols-4 gap-6 items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Package className="h-6 w-6 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">#{delivery.tracking_number}</h3>
                      <p className="text-xs text-muted-foreground">Order: {delivery.order_id.split('-')[0]}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      Destination
                    </div>
                    <p className="text-sm font-bold truncate">{delivery.delivery_address?.city}, {delivery.delivery_address?.street || 'N/A'}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Status
                    </div>
                    <Badge className={`${delivery.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        delivery.status === 'in_transit' ? 'bg-blue-100 text-blue-700' :
                          delivery.status === 'failed' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                      } border-none`}>
                      {delivery.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    {delivery.status === 'assigned' && (
                      <Button size="sm" onClick={() => handleUpdateStatus(delivery.id, 'picked_up')}>Mark Picked Up</Button>
                    )}
                    {delivery.status === 'picked_up' && (
                      <Button size="sm" onClick={() => handleUpdateStatus(delivery.id, 'in_transit')}>Ship Transit</Button>
                    )}
                    {delivery.status === 'in_transit' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleUpdateStatus(delivery.id, 'delivered')}>Complete Delivery</Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center space-y-4 grayscale opacity-40 border-2 border-dashed rounded-2xl">
                <Truck className="h-12 w-12 mx-auto" />
                <p className="font-bold text-slate-600">No matching shipments found</p>
                <Button variant="outline" size="sm" onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}>Reset Filters</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

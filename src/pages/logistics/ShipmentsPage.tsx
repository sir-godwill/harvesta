import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Search,
  MoreHorizontal,
  RefreshCw,
  Plus,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { fetchShipments, type Shipment } from '@/services/logistics-api';
import { useEffect } from 'react';

const statusColors: Record<string, string> = {
  pending: 'bg-gray-500/10 text-gray-600',
  picked_up: 'bg-blue-500/10 text-blue-600',
  in_transit: 'bg-purple-500/10 text-purple-600',
  out_for_delivery: 'bg-cyan-500/10 text-cyan-600',
  delivered: 'bg-emerald-500/10 text-emerald-600',
  delayed: 'bg-orange-500/10 text-orange-600',
  failed: 'bg-red-500/10 text-red-600',
};

export default function ShipmentsPage() {
  const { toast } = useToast();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchShipments();
        setShipments(data);
      } catch (error) {
        console.error('Failed to load shipments:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedShipments.length === filteredShipments.length) {
      setSelectedShipments([]);
    } else {
      setSelectedShipments(filteredShipments.map((s) => s.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedShipments((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: `${action} ${selectedShipments.length} shipments`,
      description: 'Action completed successfully',
    });
    setSelectedShipments([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">All Shipments</h1>
            <p className="text-muted-foreground">Central control of all shipments</p>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Shipment
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {/* Filters Bar */}
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search shipments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="picked_up">Picked Up</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedShipments.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 md:gap-3 rounded-lg bg-primary/5 p-3">
            <span className="text-sm font-medium">{selectedShipments.length} selected</span>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction('Reassigned')}>
              Reassign
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction('Flagged')}>
              Flag
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleBulkAction('Escalated')}>
              Escalate
            </Button>
          </div>
        )}

        {/* Shipments List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Shipments ({filteredShipments.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredShipments.map((shipment) => (
                <motion.div
                  key={shipment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedShipments.includes(shipment.id)}
                      onCheckedChange={() => toggleSelect(shipment.id)}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{shipment.trackingNumber || shipment.id}</p>
                        <Badge className={statusColors[shipment.status]} variant="secondary">
                          {shipment.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {shipment.pickupLocation.city} → {shipment.deliveryLocation.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{shipment.partnerName}</p>
                      <p className="text-xs text-muted-foreground">{shipment.weight}kg</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/logistics/tracking`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: 'Partner reassigned' })}>
                          Reassign Partner
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Escalate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

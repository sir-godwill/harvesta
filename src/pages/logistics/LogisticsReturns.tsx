import React, { useState } from 'react';
import { LogisticsLayout } from '@/components/logistics/LogisticsLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RotateCcw, 
  Package, 
  Search,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Calendar
} from 'lucide-react';

interface ReturnRequest {
  id: string;
  orderId: string;
  shipmentId: string;
  customerName: string;
  customerPhone: string;
  reason: string;
  status: 'pending' | 'approved' | 'pickup-scheduled' | 'in-transit' | 'received' | 'refunded' | 'rejected';
  items: { name: string; quantity: number; price: number }[];
  pickupAddress: string;
  requestedAt: string;
  scheduledPickup?: string;
  receivedAt?: string;
  notes?: string;
}

const mockReturns: ReturnRequest[] = [
  {
    id: 'RET-001',
    orderId: 'ORD-1234',
    shipmentId: 'SHP-001',
    customerName: 'John Mensah',
    customerPhone: '+233 24 123 4567',
    reason: 'Product damaged during delivery',
    status: 'pending',
    items: [{ name: 'Fresh Tomatoes - 50kg', quantity: 2, price: 150 }],
    pickupAddress: 'Accra Mall, Ring Road, Accra',
    requestedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'RET-002',
    orderId: 'ORD-1235',
    shipmentId: 'SHP-002',
    customerName: 'Kwame Asante',
    customerPhone: '+233 20 987 6543',
    reason: 'Wrong product delivered',
    status: 'pickup-scheduled',
    items: [{ name: 'Organic Plantains - 25kg', quantity: 1, price: 80 }],
    pickupAddress: 'East Legon, Accra',
    requestedAt: '2024-01-14T08:00:00Z',
    scheduledPickup: '2024-01-16T09:00:00Z'
  },
  {
    id: 'RET-003',
    orderId: 'ORD-1236',
    shipmentId: 'SHP-003',
    customerName: 'Ama Serwaa',
    customerPhone: '+233 27 555 1234',
    reason: 'Quality not as expected',
    status: 'in-transit',
    items: [{ name: 'Fresh Cassava - 100kg', quantity: 1, price: 200 }],
    pickupAddress: 'Kumasi Central Market',
    requestedAt: '2024-01-13T14:00:00Z',
    scheduledPickup: '2024-01-15T10:00:00Z'
  },
  {
    id: 'RET-004',
    orderId: 'ORD-1237',
    shipmentId: 'SHP-004',
    customerName: 'Kofi Boateng',
    customerPhone: '+233 23 777 8899',
    reason: 'Expired products',
    status: 'received',
    items: [{ name: 'Palm Oil - 20L', quantity: 3, price: 120 }],
    pickupAddress: 'Takoradi Market Circle',
    requestedAt: '2024-01-12T09:00:00Z',
    scheduledPickup: '2024-01-13T11:00:00Z',
    receivedAt: '2024-01-13T15:30:00Z'
  },
  {
    id: 'RET-005',
    orderId: 'ORD-1238',
    shipmentId: 'SHP-005',
    customerName: 'Akua Mensah',
    customerPhone: '+233 26 444 5566',
    reason: 'Changed mind',
    status: 'rejected',
    items: [{ name: 'Fresh Eggs - 30 crates', quantity: 2, price: 180 }],
    pickupAddress: 'Tema Community 5',
    requestedAt: '2024-01-11T16:00:00Z',
    notes: 'Perishable items cannot be returned after delivery confirmation'
  }
];

const LogisticsReturns = () => {
  const [returns, setReturns] = useState<ReturnRequest[]>(mockReturns);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleNotes, setScheduleNotes] = useState('');

  const filteredReturns = returns.filter(ret => {
    const matchesSearch = ret.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ret.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ret.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ret.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'approved': return 'bg-blue-500/20 text-blue-400';
      case 'pickup-scheduled': return 'bg-purple-500/20 text-purple-400';
      case 'in-transit': return 'bg-orange-500/20 text-orange-400';
      case 'received': return 'bg-green-500/20 text-green-400';
      case 'refunded': return 'bg-green-600/20 text-green-500';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleApprove = (returnId: string) => {
    setReturns(prev => prev.map(r => 
      r.id === returnId ? { ...r, status: 'approved' as const } : r
    ));
  };

  const handleReject = (returnId: string) => {
    setReturns(prev => prev.map(r => 
      r.id === returnId ? { ...r, status: 'rejected' as const } : r
    ));
  };

  const handleSchedulePickup = () => {
    if (selectedReturn && scheduleDate) {
      setReturns(prev => prev.map(r => 
        r.id === selectedReturn.id 
          ? { ...r, status: 'pickup-scheduled' as const, scheduledPickup: scheduleDate, notes: scheduleNotes || r.notes } 
          : r
      ));
      setIsScheduleOpen(false);
      setScheduleDate('');
      setScheduleNotes('');
    }
  };

  const handleMarkReceived = (returnId: string) => {
    setReturns(prev => prev.map(r => 
      r.id === returnId ? { ...r, status: 'received' as const, receivedAt: new Date().toISOString() } : r
    ));
  };

  const stats = {
    total: returns.length,
    pending: returns.filter(r => r.status === 'pending').length,
    inProgress: returns.filter(r => ['approved', 'pickup-scheduled', 'in-transit'].includes(r.status)).length,
    completed: returns.filter(r => ['received', 'refunded'].includes(r.status)).length
  };

  return (
    <LogisticsLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Returns Management</h1>
            <p className="text-muted-foreground">Process and track return requests</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <RotateCcw className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Returns</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Clock className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <Truck className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search returns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-background border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pickup-scheduled">Pickup Scheduled</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Returns List */}
        <div className="space-y-3">
          {filteredReturns.map((ret) => (
            <Card key={ret.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{ret.id}</h3>
                        <Badge className={getStatusColor(ret.status)}>
                          {ret.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground">{ret.customerName}</p>
                      <p className="text-sm text-muted-foreground">{ret.reason}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Order: {ret.orderId}</span>
                        <span>{ret.items.map(i => i.name).join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ret.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(ret.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(ret.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </>
                    )}
                    {ret.status === 'approved' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedReturn(ret);
                          setIsScheduleOpen(true);
                        }}
                        className="bg-primary text-primary-foreground"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule Pickup
                      </Button>
                    )}
                    {ret.status === 'in-transit' && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkReceived(ret.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Received
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedReturn(ret);
                        setIsDetailsOpen(true);
                      }}
                      className="border-border"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Schedule Pickup Modal */}
        <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">Schedule Pickup</DialogTitle>
            </DialogHeader>
            {selectedReturn && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Return ID</p>
                  <p className="text-foreground font-medium">{selectedReturn.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pickup Address</p>
                  <p className="text-foreground">{selectedReturn.pickupAddress}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Pickup Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Notes (Optional)</label>
                  <Textarea
                    value={scheduleNotes}
                    onChange={(e) => setScheduleNotes(e.target.value)}
                    placeholder="Any special instructions..."
                    className="bg-background border-border"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsScheduleOpen(false)} className="border-border">
                Cancel
              </Button>
              <Button onClick={handleSchedulePickup} className="bg-primary text-primary-foreground">
                Confirm Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Return Details</DialogTitle>
            </DialogHeader>
            {selectedReturn && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedReturn.status)}>
                    {selectedReturn.status.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Return ID</p>
                    <p className="text-foreground font-medium">{selectedReturn.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="text-foreground">{selectedReturn.orderId}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="text-foreground">{selectedReturn.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedReturn.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pickup Address</p>
                  <p className="text-foreground">{selectedReturn.pickupAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reason</p>
                  <p className="text-foreground">{selectedReturn.reason}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Items</p>
                  <div className="space-y-1">
                    {selectedReturn.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-foreground">{item.name} x{item.quantity}</span>
                        <span className="text-foreground">GHS {item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Requested</p>
                    <p className="text-foreground">{new Date(selectedReturn.requestedAt).toLocaleString()}</p>
                  </div>
                  {selectedReturn.scheduledPickup && (
                    <div>
                      <p className="text-muted-foreground">Scheduled Pickup</p>
                      <p className="text-foreground">{new Date(selectedReturn.scheduledPickup).toLocaleString()}</p>
                    </div>
                  )}
                </div>
                {selectedReturn.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-foreground">{selectedReturn.notes}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="border-border">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </LogisticsLayout>
  );
};

export default LogisticsReturns;

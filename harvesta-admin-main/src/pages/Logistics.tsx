import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Package,
  ArrowRight,
  MoreHorizontal,
  Navigation,
  Timer,
  ChevronRight,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchShipments, Shipment } from '@/lib/api';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

function ShipmentCard({ shipment }: { shipment: Shipment }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    pending: { color: 'bg-warning/10 text-warning border-warning/30', icon: Clock, label: 'Pending Pickup' },
    picked_up: { color: 'bg-info/10 text-info border-info/30', icon: Package, label: 'Picked Up' },
    in_transit: { color: 'bg-primary/10 text-primary border-primary/30', icon: Truck, label: 'In Transit' },
    out_for_delivery: { color: 'bg-accent/10 text-accent border-accent/30', icon: Navigation, label: 'Out for Delivery' },
    delivered: { color: 'bg-success/10 text-success border-success/30', icon: CheckCircle2, label: 'Delivered' },
    delayed: { color: 'bg-destructive/10 text-destructive border-destructive/30', icon: AlertTriangle, label: 'Delayed' },
    exception: { color: 'bg-destructive/10 text-destructive border-destructive/30', icon: AlertTriangle, label: 'Exception' },
  };

  const status = statusConfig[shipment.status];
  const StatusIcon = status.icon;

  const milestoneSteps = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
  const currentStep = milestoneSteps.indexOf(shipment.status);
  const progress = shipment.status === 'delivered' ? 100 : 
    shipment.status === 'delayed' || shipment.status === 'exception' ? (currentStep / (milestoneSteps.length - 1)) * 100 :
    ((currentStep + 0.5) / (milestoneSteps.length - 1)) * 100;

  return (
    <motion.div variants={itemVariants} layout>
      <Card className={cn(
        'overflow-hidden border-l-4 transition-all duration-200',
        status.color.split(' ')[2],
        isExpanded && 'shadow-lg'
      )}>
        <CardContent className="p-0">
          {/* Header */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-4 text-left flex items-start sm:items-center gap-3 sm:gap-4 hover:bg-muted/30 transition-colors"
          >
            <div className={cn('p-2 rounded-lg flex-shrink-0', status.color.split(' ').slice(0, 2).join(' '))}>
              <StatusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-medium text-sm">#{shipment.trackingNumber}</span>
                <Badge className={cn('text-[10px]', status.color)}>{status.label}</Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="h-3 w-3 flex-shrink-0" /> {shipment.origin}
                </span>
                <ArrowRight className="h-3 w-3 hidden sm:block flex-shrink-0" />
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="h-3 w-3 flex-shrink-0" /> {shipment.destination}
                </span>
              </div>
            </div>
            <div className="hidden sm:block text-right flex-shrink-0">
              <p className="font-medium text-sm">{shipment.carrier}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                <Timer className="h-3 w-3" />
                ETA: {new Date(shipment.eta).toLocaleDateString()}
              </p>
            </div>
            <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} className="flex-shrink-0">
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
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
                  {/* Progress Bar */}
                  <div className="py-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Delivery Progress</span>
                      <span className="text-xs font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between mt-2">
                      {milestoneSteps.map((step, i) => (
                        <div
                          key={step}
                          className={cn(
                            'text-[10px] text-center',
                            i <= currentStep ? 'text-primary font-medium' : 'text-muted-foreground'
                          )}
                        >
                          {step === 'pending' && 'Pending'}
                          {step === 'picked_up' && 'Picked'}
                          {step === 'in_transit' && 'Transit'}
                          {step === 'out_for_delivery' && 'Out'}
                          {step === 'delivered' && 'Done'}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Order ID</p>
                      <p className="font-medium text-sm">#{shipment.orderId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Carrier</p>
                      <p className="font-medium text-sm">{shipment.carrier}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Weight</p>
                      <p className="font-medium text-sm">{shipment.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Items</p>
                      <p className="font-medium text-sm">{shipment.items} items</p>
                    </div>
                    <div className="sm:hidden">
                      <p className="text-xs text-muted-foreground mb-1">ETA</p>
                      <p className="font-medium text-sm">{new Date(shipment.eta).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap pt-3 border-t">
                    <Button size="sm" variant="outline">
                      <Navigation className="h-4 w-4 mr-1" /> Track Live
                    </Button>
                    <Button size="sm" variant="outline">
                      <Package className="h-4 w-4 mr-1" /> View Order
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                        <DropdownMenuItem>Contact Carrier</DropdownMenuItem>
                        <DropdownMenuItem>Report Issue</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Cancel Shipment</DropdownMenuItem>
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

export default function Logistics() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchShipments().then((data) => {
      setShipments(data);
      setIsLoading(false);
    });
  }, []);

  const stats = {
    total: shipments.length,
    in_transit: shipments.filter((s) => s.status === 'in_transit').length,
    out_for_delivery: shipments.filter((s) => s.status === 'out_for_delivery').length,
    delivered: shipments.filter((s) => s.status === 'delivered').length,
    delayed: shipments.filter((s) => s.status === 'delayed' || s.status === 'exception').length,
  };

  const filteredShipments = activeTab === 'all' ? shipments :
    activeTab === 'issues' ? shipments.filter((s) => s.status === 'delayed' || s.status === 'exception') :
    shipments.filter((s) => s.status === activeTab);

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
            <Truck className="h-6 w-6 text-primary" />
            Logistics Command Center
          </h1>
          <p className="text-sm text-muted-foreground">Track shipments, manage carriers, and resolve exceptions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button>
            <Truck className="mr-2 h-4 w-4" /> New Shipment
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, icon: Package, color: 'text-foreground' },
          { label: 'In Transit', value: stats.in_transit, icon: Truck, color: 'text-primary' },
          { label: 'Out for Delivery', value: stats.out_for_delivery, icon: Navigation, color: 'text-accent' },
          { label: 'Delivered', value: stats.delivered, icon: CheckCircle2, color: 'text-success' },
          { label: 'Issues', value: stats.delayed, icon: AlertTriangle, color: 'text-destructive' },
        ].map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <stat.icon className={cn('h-5 w-5', stat.color)} />
                <div>
                  <p className={cn('text-xl sm:text-2xl font-bold', stat.color)}>{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Tabs & Search */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row gap-3">
            <TabsList className="h-auto p-1 flex-wrap justify-start">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
              <TabsTrigger value="in_transit" className="text-xs sm:text-sm">In Transit</TabsTrigger>
              <TabsTrigger value="out_for_delivery" className="text-xs sm:text-sm">Out for Delivery</TabsTrigger>
              <TabsTrigger value="delivered" className="text-xs sm:text-sm">Delivered</TabsTrigger>
              <TabsTrigger value="issues" className="text-xs sm:text-sm">
                Issues
                {stats.delayed > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 px-1.5">{stats.delayed}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search tracking number..." className="pl-9" />
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
              {filteredShipments.map((shipment) => (
                <ShipmentCard key={shipment.id} shipment={shipment} />
              ))}
              {filteredShipments.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Truck className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>No shipments found</p>
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

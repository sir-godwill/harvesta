import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Truck,
  Package,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Phone,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchDeliveries, fetchSellerOrders, type Delivery, type Order } from "@/services/api";

const statusConfig = {
  pending_pickup: { label: "Pending", progress: 20, className: "bg-warning/10 text-warning" },
  picked_up: { label: "Picked Up", progress: 40, className: "bg-primary/10 text-primary" },
  in_transit: { label: "In Transit", progress: 70, className: "bg-accent/10 text-accent" },
  delayed: { label: "Delayed", progress: 50, className: "bg-destructive/10 text-destructive" },
  delivered: { label: "Delivered", progress: 100, className: "bg-success/10 text-success" },
};

const deliveryTypeConfig = {
  harvesta: { label: "Harvestá", icon: Truck, className: "text-primary" },
  self: { label: "Self", icon: User, className: "text-secondary" },
  third_party: { label: "3rd Party", icon: Navigation, className: "text-accent" },
};

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [deliveriesData, ordersData] = await Promise.all([
          fetchDeliveries(),
          fetchSellerOrders(),
        ]);
        setDeliveries(deliveriesData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to load deliveries:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const getOrderForDelivery = (orderId: string) => {
    return orders.find(o => o.id === orderId);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stats = {
    total: deliveries.length,
    inTransit: deliveries.filter(d => d.status === 'in_transit').length,
    pending: deliveries.filter(d => d.status === 'pending_pickup').length,
    delayed: deliveries.filter(d => d.status === 'delayed').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Deliveries" subtitle="Track and manage your shipments" />

      <div className="p-4 md:p-6">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6"
        >
          <Card className="shadow-soft">
            <CardContent className="p-4 md:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Total</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-primary/10">
                  <Package className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 md:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">In Transit</p>
                  <p className="text-xl md:text-2xl font-bold text-accent">{stats.inTransit}</p>
                </div>
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-accent/10">
                  <Truck className="w-4 h-4 md:w-6 md:h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 md:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Pending</p>
                  <p className="text-xl md:text-2xl font-bold text-warning">{stats.pending}</p>
                </div>
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-warning/10">
                  <Clock className="w-4 h-4 md:w-6 md:h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 md:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Delayed</p>
                  <p className="text-xl md:text-2xl font-bold text-destructive">{stats.delayed}</p>
                </div>
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-destructive/10">
                  <AlertTriangle className="w-4 h-4 md:w-6 md:h-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Deliveries List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-3 md:space-y-4"
        >
          {isLoading ? (
            <>
              {[1, 2].map((i) => (
                <div key={i} className="h-36 md:h-40 bg-card border rounded-xl animate-pulse" />
              ))}
            </>
          ) : deliveries.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="py-12 md:py-16 text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-7 h-7 md:w-8 md:h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Active Deliveries</h3>
                <p className="text-sm text-muted-foreground">
                  Deliveries will appear here once orders are ready
                </p>
              </CardContent>
            </Card>
          ) : (
            deliveries.map((delivery, index) => {
              const order = getOrderForDelivery(delivery.orderId);
              const status = statusConfig[delivery.status];
              const deliveryType = deliveryTypeConfig[delivery.deliveryType];
              const DeliveryIcon = deliveryType.icon;

              return (
                <motion.div
                  key={delivery.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <Card className="shadow-soft hover:shadow-medium transition-shadow">
                    <CardContent className="p-4 md:p-5">
                      <div className="flex flex-col gap-4">
                        {/* Top Row */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={cn("p-2 md:p-3 rounded-lg md:rounded-xl shrink-0", status.className)}>
                              <Truck className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-mono font-medium text-primary text-sm">{delivery.id}</span>
                                <Badge variant="outline" className={cn("text-xs", status.className)}>
                                  {status.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Order: <span className="font-medium text-foreground">{delivery.orderId}</span>
                                {order && <span className="hidden sm:inline"> • {order.buyerName}</span>}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm mt-2">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <DeliveryIcon className={cn("w-3 h-3 md:w-4 md:h-4", deliveryType.className)} />
                                  <span>{deliveryType.label}</span>
                                </div>
                                {delivery.driver && (
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <User className="w-3 h-3 md:w-4 md:h-4" />
                                    <span className="truncate max-w-[100px]">{delivery.driver}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-muted-foreground">Progress</span>
                              <span className="text-xs font-medium">{status.progress}%</span>
                            </div>
                            <Progress value={status.progress} className="h-2" />
                            <div className="flex items-center gap-1 mt-2 text-xs md:text-sm">
                              <Clock className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">ETA:</span>
                              <span className="font-medium">{formatDateTime(delivery.eta)}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs md:text-sm h-8 md:h-9">
                              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              <span className="hidden sm:inline">Track</span>
                            </Button>
                            {delivery.driver && (
                              <Button variant="outline" size="sm" className="gap-1.5 text-xs md:text-sm h-8 md:h-9">
                                <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                <span className="hidden sm:inline">Contact</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}

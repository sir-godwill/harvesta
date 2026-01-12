import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchSellerOrders, type Order } from "@/services/api";
import { formatXAF } from "@/lib/currency";

const statusConfig = {
  new: { label: "New", icon: Clock, className: "bg-accent/10 text-accent border-accent/20" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, className: "bg-primary/10 text-primary border-primary/20" },
  preparing: { label: "Preparing", icon: Package, className: "bg-warning/10 text-warning border-warning/20" },
  ready: { label: "Ready", icon: Package, className: "bg-success/10 text-success border-success/20" },
  in_transit: { label: "In Transit", icon: Truck, className: "bg-secondary/10 text-secondary border-secondary/20" },
  delivered: { label: "Delivered", icon: CheckCircle2, className: "bg-success/10 text-success border-success/20" },
  completed: { label: "Completed", icon: CheckCircle2, className: "bg-success/10 text-success border-success/20" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const orderTypeConfig = {
  instant: { label: "Instant", className: "bg-muted text-foreground" },
  bulk: { label: "Bulk", className: "bg-primary/10 text-primary" },
  contract: { label: "Contract", className: "bg-secondary/10 text-secondary" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      try {
        const data = await fetchSellerOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && ["new", "confirmed", "preparing"].includes(order.status);
    if (activeTab === "active") return matchesSearch && ["ready", "in_transit"].includes(order.status);
    if (activeTab === "completed") return matchesSearch && ["delivered", "completed"].includes(order.status);
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short',
    });
  };

  const tabCounts = {
    all: orders.length,
    pending: orders.filter(o => ["new", "confirmed", "preparing"].includes(o.status)).length,
    active: orders.filter(o => ["ready", "in_transit"].includes(o.status)).length,
    completed: orders.filter(o => ["delivered", "completed"].includes(o.status)).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Orders" subtitle="Track and manage all your orders" />

      <div className="p-4 md:p-6">
        {/* Tabs and Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 mb-6"
        >
          {/* Tabs - Scrollable on mobile */}
          <ScrollArea className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-muted/50 p-1 inline-flex">
                <TabsTrigger value="all" className="gap-1.5 text-xs sm:text-sm">
                  All
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{tabCounts.all}</Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="gap-1.5 text-xs sm:text-sm">
                  Pending
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-warning/20 text-warning">{tabCounts.pending}</Badge>
                </TabsTrigger>
                <TabsTrigger value="active" className="gap-1.5 text-xs sm:text-sm">
                  Active
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-primary/20 text-primary">{tabCounts.active}</Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="gap-1.5 text-xs sm:text-sm">
                  Done
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-success/20 text-success">{tabCounts.completed}</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Search */}
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
          className="bg-card rounded-xl border shadow-soft overflow-hidden hidden md:block"
        >
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
                  <TableHead className="w-[120px]">Order ID</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order, index) => {
                  const status = statusConfig[order.status];
                  const StatusIcon = status.icon;
                  const orderType = orderTypeConfig[order.type];

                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.02 }}
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <span className="font-mono font-medium text-primary text-sm">{order.id}</span>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-foreground text-sm">{order.buyerName}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                          {order.products.map(p => p.name).join(", ")}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-xs", orderType.className)}>
                          {orderType.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-sm">
                        {formatXAF(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("gap-1 text-xs", status.className)}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(order.deliveryDate)}
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
                            {order.status === 'new' && (
                              <>
                                <DropdownMenuItem className="gap-2 text-success">
                                  <CheckCircle2 className="w-4 h-4" /> Accept
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 text-destructive">
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
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              const orderType = orderTypeConfig[order.type];

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.03 }}
                  className="bg-card rounded-xl border p-4 shadow-soft"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="font-mono font-medium text-primary text-sm">{order.id}</span>
                      <p className="font-medium text-foreground mt-0.5">{order.buyerName}</p>
                    </div>
                    <Badge variant="outline" className={cn("gap-1 text-xs", status.className)}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                    {order.products.map(p => `${p.name} x${p.quantity}`).join(", ")}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={cn("text-xs", orderType.className)}>
                        {orderType.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(order.deliveryDate)}</span>
                    </div>
                    <span className="font-semibold text-sm">{formatXAF(order.total)}</span>
                  </div>
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
              <ShoppingCart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "Try adjusting your search" : "Orders will appear here once received"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Add missing import
import { ShoppingCart } from "lucide-react";

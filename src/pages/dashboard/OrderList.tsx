import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  ChevronDown,
  ArrowLeft,
  Eye,
  Truck,
  RotateCcw,
  Download,
  MoreHorizontal,
  Calendar,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderStatusBadge } from "@/components/common/OrderStatusBadge";

// Mock data
const mockOrders = [
  {
    id: "ORD-2026-001234",
    date: "2026-01-08",
    vendor: "Green Valley Farms",
    vendorLogo: "",
    items: [
      { name: "Organic Tomatoes", quantity: 500, unit: "kg" },
      { name: "Fresh Peppers", quantity: 200, unit: "kg" }
    ],
    totalAmount: 175000,
    currency: "XAF",
    status: "processing" as const,
    paymentStatus: "paid" as const,
    deliveryMethod: "Express Shipping",
    estimatedDelivery: "2026-01-12"
  },
  {
    id: "ORD-2026-001233",
    date: "2026-01-07",
    vendor: "AgroPlus Supplies",
    vendorLogo: "",
    items: [
      { name: "Rice Bags (50kg)", quantity: 100, unit: "bags" }
    ],
    totalAmount: 450000,
    currency: "XAF",
    status: "shipped" as const,
    paymentStatus: "paid" as const,
    deliveryMethod: "Standard Shipping",
    estimatedDelivery: "2026-01-15"
  },
  {
    id: "ORD-2026-001232",
    date: "2026-01-05",
    vendor: "Farm Fresh Co.",
    vendorLogo: "",
    items: [
      { name: "Maize Seeds", quantity: 50, unit: "kg" },
      { name: "Fertilizer NPK", quantity: 20, unit: "bags" }
    ],
    totalAmount: 280000,
    currency: "XAF",
    status: "delivered" as const,
    paymentStatus: "paid" as const,
    deliveryMethod: "Standard Shipping",
    estimatedDelivery: "2026-01-10"
  },
  {
    id: "ORD-2026-001231",
    date: "2026-01-03",
    vendor: "Tropical Harvest",
    vendorLogo: "",
    items: [
      { name: "Plantain Bunches", quantity: 200, unit: "pieces" }
    ],
    totalAmount: 120000,
    currency: "XAF",
    status: "pending" as const,
    paymentStatus: "pending" as const,
    deliveryMethod: "Pickup",
    estimatedDelivery: "2026-01-08"
  },
  {
    id: "ORD-2026-001230",
    date: "2026-01-01",
    vendor: "Green Valley Farms",
    vendorLogo: "",
    items: [
      { name: "Cassava", quantity: 1000, unit: "kg" }
    ],
    totalAmount: 350000,
    currency: "XAF",
    status: "cancelled" as const,
    paymentStatus: "refunded" as const,
    deliveryMethod: "Standard Shipping",
    estimatedDelivery: "-"
  }
];

const statusTabs = [
  { value: "all", label: "All Orders", count: 47 },
  { value: "pending", label: "Pending", count: 3 },
  { value: "processing", label: "Processing", count: 5 },
  { value: "shipped", label: "Shipped", count: 8 },
  { value: "delivered", label: "Delivered", count: 28 },
  { value: "cancelled", label: "Cancelled", count: 3 }
];

const OrderList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedTab === "all" || order.status === selectedTab;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">My Orders</h1>
                <p className="text-sm text-muted-foreground">Track and manage your orders</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">47</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Transit</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">2.4M</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-sm">XAF</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Order ID or Vendor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">Last 3 Months</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="w-full justify-start bg-background border rounded-lg h-auto p-1 overflow-x-auto">
            {statusTabs.map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
              >
                {tab.label}
                <Badge variant="secondary" className="ml-2 h-5 min-w-[20px] px-1.5">
                  {tab.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">{order.id}</span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 md:mt-0">
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Truck className="h-4 w-4 mr-2" />
                          Track Order
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reorder
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download Invoice
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Vendor & Items */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold text-sm">
                            {order.vendor.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{order.vendor}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, index) => (
                          <Badge key={index} variant="secondary" className="font-normal">
                            {item.name} × {item.quantity} {item.unit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="flex flex-col md:items-end gap-1">
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(order.totalAmount, order.currency)}
                      </p>
                      <Badge 
                        variant={order.paymentStatus === "paid" ? "default" : "outline"}
                        className={order.paymentStatus === "paid" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                      >
                        {order.paymentStatus === "paid" ? "Paid" : 
                         order.paymentStatus === "pending" ? "Payment Pending" : "Refunded"}
                      </Badge>
                      {order.status !== "cancelled" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {order.status === "delivered" ? "Delivered on" : "Est. Delivery:"} {order.estimatedDelivery}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search or filters" : "You haven't placed any orders yet"}
              </p>
              <Link to="/">
                <Button>Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing 1-{filteredOrders.length} of {filteredOrders.length} orders
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderList;

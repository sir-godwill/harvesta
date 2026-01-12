import { useState } from "react";
import { RotateCcw, Package, Clock, CheckCircle, XCircle, Truck, Plus, Search } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";

type ReturnStatus = "pending" | "approved" | "in-transit" | "received" | "processed" | "rejected";
type ReturnReason = "damaged" | "wrong-item" | "quality-issue" | "customer-request" | "excess-stock";

interface ReturnRequest {
  id: string;
  originalOrderId: string;
  originalShipmentId: string;
  buyerName: string;
  vendorName: string;
  status: ReturnStatus;
  reason: ReturnReason;
  description: string;
  items: { name: string; quantity: number }[];
  refundAmount: number;
  createdAt: string;
  updatedAt: string;
}

const mockReturns: ReturnRequest[] = [
  {
    id: "RET-001",
    originalOrderId: "ORD-2024-4520",
    originalShipmentId: "SHP-2024-010",
    buyerName: "Restaurant Le Jardin",
    vendorName: "Plantation Mbalmayo",
    status: "pending",
    reason: "damaged",
    description: "20% of plantains arrived damaged during transit",
    items: [{ name: "Fresh Plantains", quantity: 40 }],
    refundAmount: 28000,
    createdAt: "2024-01-14T10:00:00Z",
    updatedAt: "2024-01-14T10:00:00Z",
  },
  {
    id: "RET-002",
    originalOrderId: "ORD-2024-4518",
    originalShipmentId: "SHP-2024-008",
    buyerName: "SuperMarché Central",
    vendorName: "Pineapple Farms Kribi",
    status: "approved",
    reason: "wrong-item",
    description: "Received Grade B pineapples instead of Grade A",
    items: [{ name: "Fresh Pineapples (Grade B)", quantity: 100 }],
    refundAmount: 45000,
    createdAt: "2024-01-13T14:00:00Z",
    updatedAt: "2024-01-14T08:00:00Z",
  },
  {
    id: "RET-003",
    originalOrderId: "ORD-2024-4515",
    originalShipmentId: "SHP-2024-005",
    buyerName: "Tropical Fruits Export",
    vendorName: "Ferme Bio Douala",
    status: "in-transit",
    reason: "quality-issue",
    description: "Vegetables not meeting export quality standards",
    items: [{ name: "Mixed Vegetables", quantity: 50 }],
    refundAmount: 18000,
    createdAt: "2024-01-12T08:00:00Z",
    updatedAt: "2024-01-13T12:00:00Z",
  },
  {
    id: "RET-004",
    originalOrderId: "ORD-2024-4510",
    originalShipmentId: "SHP-2024-003",
    buyerName: "Grossiste Alimentaire SA",
    vendorName: "Café Arabica Foumban",
    status: "processed",
    reason: "customer-request",
    description: "Customer cancelled order after dispatch",
    items: [{ name: "Coffee Beans", quantity: 20 }],
    refundAmount: 12000,
    createdAt: "2024-01-11T11:00:00Z",
    updatedAt: "2024-01-14T09:00:00Z",
  },
];

export default function ReturnsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);

  const filteredReturns = mockReturns.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.originalOrderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: ReturnStatus) => {
    const colors: Record<ReturnStatus, string> = {
      pending: "bg-warning/10 text-warning",
      approved: "bg-primary/10 text-primary",
      "in-transit": "bg-accent/10 text-accent",
      received: "bg-blue-500/10 text-blue-500",
      processed: "bg-success/10 text-success",
      rejected: "bg-destructive/10 text-destructive",
    };
    return colors[status];
  };

  const getReasonLabel = (reason: ReturnReason) => {
    const labels: Record<ReturnReason, string> = {
      damaged: "Damaged Goods",
      "wrong-item": "Wrong Items",
      "quality-issue": "Quality Issue",
      "customer-request": "Customer Request",
      "excess-stock": "Excess Stock",
    };
    return labels[reason];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <DashboardLayout title="Returns & Reverse Logistics" subtitle="Manage product returns and refunds" variant="admin">
      <div className="space-y-4">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="border-warning/30">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{mockReturns.filter((r) => r.status === "pending").length}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Truck className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">{mockReturns.filter((r) => r.status === "in-transit").length}</p>
                <p className="text-xs text-muted-foreground">In Transit</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{mockReturns.filter((r) => r.status === "processed").length}</p>
                <p className="text-xs text-muted-foreground">Processed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <RotateCcw className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(mockReturns.reduce((acc, r) => acc + r.refundAmount, 0))}</p>
                <p className="text-xs text-muted-foreground">Total Refunds</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search returns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />Create Return
          </Button>
        </div>

        {/* Returns List */}
        <div className="space-y-3">
          {filteredReturns.map((returnReq) => (
            <Card key={returnReq.id} className={returnReq.status === "pending" ? "border-warning/50" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{returnReq.id}</span>
                      <Badge className={getStatusColor(returnReq.status)}>{returnReq.status}</Badge>
                      <Badge variant="outline">{getReasonLabel(returnReq.reason)}</Badge>
                    </div>
                    <p className="text-sm mb-2">{returnReq.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>Order: {returnReq.originalOrderId}</span>
                      <span>Buyer: {returnReq.buyerName}</span>
                      <span>Vendor: {returnReq.vendorName}</span>
                      <span>Refund: {formatCurrency(returnReq.refundAmount)}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {returnReq.items.map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {item.name} x{item.quantity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {returnReq.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => console.log("[DORMANT] approveReturn", returnReq.id)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => console.log("[DORMANT] rejectReturn", returnReq.id)}>
                          Reject
                        </Button>
                      </>
                    )}
                    {returnReq.status === "approved" && (
                      <Button size="sm" onClick={() => console.log("[DORMANT] schedulePickup", returnReq.id)}>
                        Schedule Pickup
                      </Button>
                    )}
                    {returnReq.status === "received" && (
                      <Button size="sm" onClick={() => console.log("[DORMANT] processRefund", returnReq.id)}>
                        Process Refund
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => setSelectedReturn(returnReq)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Return Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Return Request</DialogTitle>
            <DialogDescription>Initiate a new return for an existing order</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Original Order ID</Label>
              <Input placeholder="ORD-2024-XXXX" />
            </div>
            <div className="space-y-2">
              <Label>Return Reason</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="damaged">Damaged Goods</SelectItem>
                  <SelectItem value="wrong-item">Wrong Items</SelectItem>
                  <SelectItem value="quality-issue">Quality Issue</SelectItem>
                  <SelectItem value="customer-request">Customer Request</SelectItem>
                  <SelectItem value="excess-stock">Excess Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe the reason for return..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={() => { console.log("[DORMANT] createReturn"); setShowCreateModal(false); }}>
              Create Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Details Modal */}
      <Dialog open={!!selectedReturn} onOpenChange={() => setSelectedReturn(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Return Details - {selectedReturn?.id}</DialogTitle>
          </DialogHeader>
          {selectedReturn && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(selectedReturn.status)}>{selectedReturn.status}</Badge>
                <Badge variant="outline">{getReasonLabel(selectedReturn.reason)}</Badge>
              </div>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original Order</span>
                  <span className="font-medium">{selectedReturn.originalOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipment</span>
                  <span className="font-medium">{selectedReturn.originalShipmentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buyer</span>
                  <span>{selectedReturn.buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vendor</span>
                  <span>{selectedReturn.vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Refund Amount</span>
                  <span className="font-semibold text-success">{formatCurrency(selectedReturn.refundAmount)}</span>
                </div>
              </div>
              <div className="rounded-lg bg-muted/30 p-3">
                <p className="text-sm font-medium mb-1">Description</p>
                <p className="text-sm text-muted-foreground">{selectedReturn.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Items</p>
                <div className="space-y-2">
                  {selectedReturn.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg border p-2">
                      <span className="text-sm">{item.name}</span>
                      <Badge variant="secondary">Qty: {item.quantity}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReturn(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

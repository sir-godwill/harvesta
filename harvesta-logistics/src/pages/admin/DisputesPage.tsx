import { useState } from "react";
import { AlertTriangle, MessageSquare, Clock, CheckCircle, FileText, User } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type DisputeStatus = "open" | "investigating" | "resolved" | "escalated";
type DisputeType = "delivery-damage" | "non-delivery" | "wrong-items" | "late-delivery" | "pricing" | "misconduct";

interface Dispute {
  id: string;
  orderId: string;
  shipmentId: string;
  type: DisputeType;
  status: DisputeStatus;
  buyerName: string;
  vendorName: string;
  partnerName?: string;
  description: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  evidence: string[];
  resolution?: string;
}

/**
 * Disputes Page - Manage delivery disputes and resolutions
 */
export default function DisputesPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [resolution, setResolution] = useState("");
  const [resolutionType, setResolutionType] = useState("");

  const [disputes, setDisputes] = useState<Dispute[]>([
    {
      id: "DSP-001",
      orderId: "ORD-2024-4520",
      shipmentId: "SHP-2024-010",
      type: "delivery-damage",
      status: "open",
      buyerName: "Restaurant Le Jardin",
      vendorName: "Plantation Mbalmayo",
      partnerName: "Jean-Pierre Mbarga",
      description: "20% of plantains arrived damaged due to rough handling during transit",
      amount: 35000,
      createdAt: "2024-01-14T10:00:00Z",
      updatedAt: "2024-01-14T10:00:00Z",
      evidence: ["photo_damage_001.jpg", "delivery_receipt.pdf"],
    },
    {
      id: "DSP-002",
      orderId: "ORD-2024-4518",
      shipmentId: "SHP-2024-008",
      type: "late-delivery",
      status: "investigating",
      buyerName: "SuperMarché Central",
      vendorName: "Ferme Bio Douala",
      partnerName: "Cameroon Agro Logistics",
      description: "Delivery arrived 8 hours late, causing stock shortage",
      amount: 15000,
      createdAt: "2024-01-13T14:00:00Z",
      updatedAt: "2024-01-14T09:00:00Z",
      evidence: ["tracking_history.pdf"],
    },
    {
      id: "DSP-003",
      orderId: "ORD-2024-4515",
      shipmentId: "SHP-2024-005",
      type: "wrong-items",
      status: "resolved",
      buyerName: "Tropical Fruits Export",
      vendorName: "Pineapple Farms Kribi",
      description: "Received Grade B pineapples instead of Grade A as ordered",
      amount: 22000,
      createdAt: "2024-01-12T08:00:00Z",
      updatedAt: "2024-01-13T16:00:00Z",
      evidence: ["photo_items_001.jpg", "order_confirmation.pdf"],
      resolution: "Full refund issued. Vendor penalized.",
    },
    {
      id: "DSP-004",
      orderId: "ORD-2024-4510",
      shipmentId: "SHP-2024-003",
      type: "pricing",
      status: "escalated",
      buyerName: "Grossiste Alimentaire SA",
      vendorName: "Plantation Mbalmayo",
      description: "Final delivery cost 40% higher than quoted estimate",
      amount: 45000,
      createdAt: "2024-01-11T11:00:00Z",
      updatedAt: "2024-01-14T08:00:00Z",
      evidence: ["original_quote.pdf", "final_invoice.pdf"],
    },
  ]);

  const filteredDisputes = statusFilter === "all" ? disputes : disputes.filter((d) => d.status === statusFilter);

  const getStatusColor = (status: DisputeStatus) => {
    const colors = {
      open: "bg-warning/10 text-warning",
      investigating: "bg-accent/10 text-accent",
      resolved: "bg-success/10 text-success",
      escalated: "bg-destructive/10 text-destructive",
    };
    return colors[status];
  };

  const getTypeLabel = (type: DisputeType) => {
    const labels = {
      "delivery-damage": "Delivery Damage",
      "non-delivery": "Non-Delivery",
      "wrong-items": "Wrong Items",
      "late-delivery": "Late Delivery",
      "pricing": "Pricing Dispute",
      "misconduct": "Driver Misconduct",
    };
    return labels[type];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", minimumFractionDigits: 0 }).format(amount);
  };

  const handleResolve = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setShowResolveModal(true);
  };

  const handleViewDetails = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setShowDetailsModal(true);
  };

  const handleEscalate = (id: string) => {
    setDisputes((prev) => prev.map((d) => d.id === id ? { ...d, status: "escalated" as const } : d));
    toast.error("Dispute escalated to management");
  };

  const confirmResolve = () => {
    if (selectedDispute) {
      setDisputes((prev) => prev.map((d) => d.id === selectedDispute.id ? { ...d, status: "resolved" as const, resolution } : d));
      toast.success("Dispute resolved successfully");
    }
    setShowResolveModal(false);
    setResolution("");
    setResolutionType("");
  };

  return (
    <DashboardLayout title="Dispute Management" subtitle="Handle delivery disputes and resolutions" variant="admin">
      <div className="space-y-4">
        {/* Stats */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <Card className="border-warning/30">
            <CardContent className="p-3 md:p-4 flex items-center gap-3">
              <AlertTriangle className="h-7 w-7 md:h-8 md:w-8 text-warning" />
              <div>
                <p className="text-xl md:text-2xl font-bold">{disputes.filter((d) => d.status === "open").length}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">Open</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 flex items-center gap-3">
              <MessageSquare className="h-7 w-7 md:h-8 md:w-8 text-accent" />
              <div>
                <p className="text-xl md:text-2xl font-bold">{disputes.filter((d) => d.status === "investigating").length}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">Investigating</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-destructive/30">
            <CardContent className="p-3 md:p-4 flex items-center gap-3">
              <Clock className="h-7 w-7 md:h-8 md:w-8 text-destructive" />
              <div>
                <p className="text-xl md:text-2xl font-bold">{disputes.filter((d) => d.status === "escalated").length}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">Escalated</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 flex items-center gap-3">
              <CheckCircle className="h-7 w-7 md:h-8 md:w-8 text-success" />
              <div>
                <p className="text-xl md:text-2xl font-bold">{disputes.filter((d) => d.status === "resolved").length}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">Resolved</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          {["all", "open", "investigating", "escalated", "resolved"].map((status) => (
            <Button key={status} variant={statusFilter === status ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(status)} className="capitalize text-xs">
              {status}
            </Button>
          ))}
        </div>

        {/* Disputes List */}
        <div className="space-y-3">
          {filteredDisputes.map((dispute) => (
            <Card key={dispute.id} className={dispute.status === "escalated" ? "border-destructive/50" : ""}>
              <CardContent className="p-3 md:p-4">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className="font-semibold text-sm">{dispute.id}</span>
                      <Badge className={getStatusColor(dispute.status)}>{dispute.status}</Badge>
                      <Badge variant="outline" className="text-xs">{getTypeLabel(dispute.type)}</Badge>
                    </div>
                    <p className="text-xs md:text-sm mb-2 line-clamp-2">{dispute.description}</p>
                    <div className="flex flex-wrap gap-2 md:gap-4 text-[10px] md:text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" />{dispute.buyerName}</span>
                      <span>Vendor: {dispute.vendorName}</span>
                      <span>{formatCurrency(dispute.amount)}</span>
                    </div>
                    {dispute.evidence.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] md:text-xs text-muted-foreground">{dispute.evidence.length} files</span>
                      </div>
                    )}
                    {dispute.resolution && (
                      <div className="mt-2 rounded bg-success/5 border border-success/20 p-2">
                        <p className="text-[10px] md:text-xs text-success">Resolution: {dispute.resolution}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dispute.status !== "resolved" && (
                      <>
                        <Button size="sm" onClick={() => handleResolve(dispute)}>Resolve</Button>
                        {dispute.status !== "escalated" && <Button size="sm" variant="destructive" onClick={() => handleEscalate(dispute.id)}>Escalate</Button>}
                      </>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(dispute)}>Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Resolve Modal */}
      <Dialog open={showResolveModal} onOpenChange={setShowResolveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>Provide resolution for {selectedDispute?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={resolutionType} onValueChange={setResolutionType}>
              <SelectTrigger><SelectValue placeholder="Resolution type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="refund-full">Full Refund</SelectItem>
                <SelectItem value="refund-partial">Partial Refund</SelectItem>
                <SelectItem value="credit">Store Credit</SelectItem>
                <SelectItem value="replacement">Replacement Order</SelectItem>
                <SelectItem value="dismissed">Dismissed - No Action</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="Resolution notes..." value={resolution} onChange={(e) => setResolution(e.target.value)} rows={4} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveModal(false)}>Cancel</Button>
            <Button onClick={confirmResolve}>Confirm Resolution</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Dispute Details - {selectedDispute?.id}</DialogTitle>
          </DialogHeader>
          {selectedDispute && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(selectedDispute.status)}>{selectedDispute.status}</Badge>
                <Badge variant="outline">{getTypeLabel(selectedDispute.type)}</Badge>
              </div>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Order</span><span>{selectedDispute.orderId}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipment</span><span>{selectedDispute.shipmentId}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Buyer</span><span>{selectedDispute.buyerName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Vendor</span><span>{selectedDispute.vendorName}</span></div>
                {selectedDispute.partnerName && <div className="flex justify-between"><span className="text-muted-foreground">Partner</span><span>{selectedDispute.partnerName}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-semibold">{formatCurrency(selectedDispute.amount)}</span></div>
              </div>
              <div className="rounded-lg bg-muted/30 p-3">
                <p className="text-sm font-medium mb-1">Description</p>
                <p className="text-sm text-muted-foreground">{selectedDispute.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Evidence Files</p>
                <div className="flex flex-wrap gap-2">
                  {selectedDispute.evidence.map((file, idx) => (
                    <Badge key={idx} variant="secondary" className="cursor-pointer" onClick={() => toast.info(`Opening ${file}...`)}>
                      <FileText className="h-3 w-3 mr-1" />{file}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
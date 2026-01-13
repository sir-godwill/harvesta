import { useState } from "react";
import { Package, Search, MoreHorizontal, RefreshCw, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge, RiskBadge } from "@/components/logistics/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateShipmentModal } from "@/components/logistics/CreateShipmentModal";
import { mockShipments } from "@/data/logistics-mock-data";
import { toast } from "sonner";

export default function LogisticsShipments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredShipments = mockShipments.filter((shipment) => {
    const matchesSearch = shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) || shipment.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (id: string) => setSelectedShipments((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold">All Shipments</h1><p className="text-muted-foreground">Central control of all shipments</p></div>
      
      <Card><CardContent className="p-3 md:p-4"><div className="flex flex-col sm:flex-row gap-3"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search shipments..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" /></div><div className="flex flex-wrap gap-2"><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[120px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="picked-up">Picked Up</SelectItem><SelectItem value="in-transit">In Transit</SelectItem><SelectItem value="delayed">Delayed</SelectItem><SelectItem value="delivered">Delivered</SelectItem></SelectContent></Select><Button variant="outline" size="icon"><RefreshCw className="h-4 w-4" /></Button><Button onClick={() => setShowCreateModal(true)}><Plus className="h-4 w-4 mr-2" /><span className="hidden sm:inline">New Shipment</span></Button></div></div></CardContent></Card>

      {selectedShipments.length > 0 && (<div className="flex flex-wrap items-center gap-2 md:gap-3 rounded-lg bg-primary/5 p-3"><span className="text-sm font-medium">{selectedShipments.length} selected</span><Button size="sm" variant="outline" onClick={() => { toast.success("Reassigning..."); setSelectedShipments([]); }}>Reassign</Button><Button size="sm" variant="destructive" onClick={() => { toast.error("Escalated"); setSelectedShipments([]); }}>Escalate</Button></div>)}

      <div className="space-y-3">{filteredShipments.map((shipment) => (<Card key={shipment.id} className="cursor-pointer hover:bg-muted/20"><CardContent className="p-4"><div className="flex items-start justify-between mb-2"><div className="flex items-center gap-2"><Checkbox checked={selectedShipments.includes(shipment.id)} onCheckedChange={() => toggleSelect(shipment.id)} onClick={(e) => e.stopPropagation()} /><span className="font-semibold text-sm">{shipment.id}</span></div><StatusBadge status={shipment.status} /></div><p className="text-sm font-medium mb-1">{shipment.vendorName}</p><p className="text-xs text-muted-foreground mb-2">{shipment.deliveryLocation.city}</p><div className="flex flex-wrap gap-2"><RiskBadge level={shipment.riskLevel} /><Badge variant="outline" className="capitalize text-xs">{shipment.deliveryModel}</Badge><span className="text-xs text-muted-foreground">{shipment.assignedPartner?.name || "Unassigned"}</span></div></CardContent></Card>))}</div>

      <CreateShipmentModal open={showCreateModal} onOpenChange={setShowCreateModal} onSubmit={() => toast.success("Shipment created!")} />
    </div>
  );
}

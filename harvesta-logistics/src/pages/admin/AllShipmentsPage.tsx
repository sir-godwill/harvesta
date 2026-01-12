import { useState } from "react";
import { Package, Search, MoreHorizontal, RefreshCw, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge, RiskBadge } from "@/components/ui/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateShipmentModal } from "@/components/logistics/CreateShipmentModal";
import { mockShipments } from "@/data/mock-data";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * All Shipments Page - Central control of every shipment in the system
 */
export default function AllShipmentsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredShipments = mockShipments.filter((shipment) => {
    const matchesSearch = shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;
    const matchesRisk = riskFilter === "all" || shipment.riskLevel === riskFilter;
    const matchesModel = modelFilter === "all" || shipment.deliveryModel === modelFilter;
    return matchesSearch && matchesStatus && matchesRisk && matchesModel;
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

  const handleBulkReassign = () => {
    toast.success(`Reassigning ${selectedShipments.length} shipments...`);
    setSelectedShipments([]);
  };

  const handleBulkFlag = () => {
    toast.warning(`Flagged ${selectedShipments.length} shipments for review`);
    setSelectedShipments([]);
  };

  const handleBulkEscalate = () => {
    toast.error(`Escalated ${selectedShipments.length} shipments`);
    setSelectedShipments([]);
  };

  const handleCreateShipment = (data: any) => {
    toast.success("Shipment created successfully!");
    console.log("[API] createShipment:", data);
  };

  return (
    <DashboardLayout title="All Shipments" subtitle="Central control of all shipments" variant="admin">
      <div className="space-y-4">
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
                  <SelectTrigger className="w-[120px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="picked-up">Picked Up</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="w-[100px]"><SelectValue placeholder="Risk" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={modelFilter} onValueChange={setModelFilter}>
                  <SelectTrigger className="w-[120px]"><SelectValue placeholder="Model" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Models</SelectItem>
                    <SelectItem value="harvesta">Harvestá</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="third-party">Third Party</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon"><RefreshCw className="h-4 w-4" /></Button>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">New Shipment</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedShipments.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 md:gap-3 rounded-lg bg-primary/5 p-3">
            <span className="text-sm font-medium">{selectedShipments.length} selected</span>
            <Button size="sm" variant="outline" onClick={handleBulkReassign}>Reassign</Button>
            <Button size="sm" variant="outline" onClick={handleBulkFlag}>Flag</Button>
            <Button size="sm" variant="destructive" onClick={handleBulkEscalate}>Escalate</Button>
          </div>
        )}

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-3">
          {filteredShipments.map((shipment) => (
            <Card key={shipment.id} className="cursor-pointer" onClick={() => navigate(`/order/${shipment.id}`)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={selectedShipments.includes(shipment.id)} 
                      onCheckedChange={() => toggleSelect(shipment.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="font-semibold text-sm">{shipment.id}</span>
                  </div>
                  <StatusBadge status={shipment.status} />
                </div>
                <p className="text-sm font-medium mb-1">{shipment.vendorName}</p>
                <p className="text-xs text-muted-foreground mb-2">{shipment.deliveryLocation.city}</p>
                <div className="flex flex-wrap gap-2">
                  <RiskBadge level={shipment.riskLevel} />
                  <Badge variant="outline" className="capitalize text-xs">{shipment.deliveryModel}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {shipment.assignedPartner?.name || "Unassigned"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop Table View */}
        <Card className="hidden lg:block">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Shipments ({filteredShipments.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left">
                      <Checkbox checked={selectedShipments.length === filteredShipments.length && filteredShipments.length > 0} onCheckedChange={toggleSelectAll} />
                    </th>
                    <th className="p-3 text-left font-medium">Shipment ID</th>
                    <th className="p-3 text-left font-medium">Vendor</th>
                    <th className="p-3 text-left font-medium">Destination</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-left font-medium">Risk</th>
                    <th className="p-3 text-left font-medium">Model</th>
                    <th className="p-3 text-left font-medium">Partner</th>
                    <th className="p-3 text-left font-medium">ETA</th>
                    <th className="p-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="border-b hover:bg-muted/30 cursor-pointer" onClick={() => navigate(`/order/${shipment.id}`)}>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selectedShipments.includes(shipment.id)} onCheckedChange={() => toggleSelect(shipment.id)} />
                      </td>
                      <td className="p-3 font-medium">{shipment.id}</td>
                      <td className="p-3">{shipment.vendorName}</td>
                      <td className="p-3">{shipment.deliveryLocation.city}</td>
                      <td className="p-3"><StatusBadge status={shipment.status} /></td>
                      <td className="p-3"><RiskBadge level={shipment.riskLevel} /></td>
                      <td className="p-3"><Badge variant="outline" className="capitalize">{shipment.deliveryModel}</Badge></td>
                      <td className="p-3">{shipment.assignedPartner?.name || "Unassigned"}</td>
                      <td className="p-3 text-muted-foreground">{new Date(shipment.estimatedDelivery).toLocaleDateString()}</td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/order/${shipment.id}`)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info("Reassigning partner...")}>Reassign Partner</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.warning("Shipment flagged")}>Flag Shipment</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => toast.error("Escalated to management")}>Escalate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateShipmentModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreateShipment}
      />
    </DashboardLayout>
  );
}
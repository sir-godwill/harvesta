import { useState } from "react";
import { Users, Star, Search, MoreHorizontal, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddPartnerModal } from "@/components/logistics/AddPartnerModal";
import { mockPartners, mockPartnerAnalytics } from "@/data/mock-data";
import { toast } from "sonner";

/**
 * Partners Page - Manage drivers, transporters, and logistics companies
 */
export default function PartnersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredPartners = mockPartners.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedData = mockPartners.find((p) => p.id === selectedPartner);
  const selectedAnalytics = mockPartnerAnalytics.find((a) => a.partnerId === selectedPartner);

  const handleAddPartner = (data: any) => {
    toast.success("Partner added successfully!");
    console.log("[API] addPartner:", data);
  };

  const handleAssignJob = () => {
    toast.success("Job assigned to partner");
  };

  const handleToggleStatus = () => {
    toast.info(selectedData?.isActive ? "Partner suspended" : "Partner activated");
  };

  return (
    <DashboardLayout title="Logistics Partners" subtitle="Partner management and performance" variant="admin">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search partners..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />Add Partner
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Partners List */}
          <div className="lg:col-span-2 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredPartners.map((partner) => (
                <Card
                  key={partner.id}
                  className={`cursor-pointer transition-all ${selectedPartner === partner.id ? "ring-2 ring-primary" : "hover:bg-muted/30"}`}
                  onClick={() => setSelectedPartner(partner.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{partner.name}</h4>
                          <p className="text-xs text-muted-foreground capitalize">{partner.type}</p>
                        </div>
                      </div>
                      <div className={`h-2.5 w-2.5 rounded-full ${partner.isActive ? "bg-success" : "bg-muted-foreground"}`} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded bg-muted/30 p-2">
                        <p className="text-sm font-semibold">{partner.rating}</p>
                        <p className="text-[10px] text-muted-foreground">Rating</p>
                      </div>
                      <div className="rounded bg-muted/30 p-2">
                        <p className="text-sm font-semibold">{partner.onTimeRate}%</p>
                        <p className="text-[10px] text-muted-foreground">On-Time</p>
                      </div>
                      <div className="rounded bg-muted/30 p-2">
                        <p className="text-sm font-semibold">{partner.totalDeliveries}</p>
                        <p className="text-[10px] text-muted-foreground">Deliveries</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {partner.zones.slice(0, 2).map((zone) => (
                        <Badge key={zone} variant="outline" className="text-[10px]">{zone}</Badge>
                      ))}
                      {partner.zones.length > 2 && <Badge variant="outline" className="text-[10px]">+{partner.zones.length - 2}</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Partner Detail */}
          <div>
            {selectedData ? (
              <Card className="sticky top-4">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Partner Details</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleAssignJob}>Assign Job Manually</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleToggleStatus}>{selectedData.isActive ? "Suspend Partner" : "Enable Partner"}</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => toast.error("Partner removed")}>Remove Partner</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedData.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={selectedData.isActive ? "default" : "secondary"}>{selectedData.isActive ? "Active" : "Inactive"}</Badge>
                        <span className="text-xs text-muted-foreground capitalize">{selectedData.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Rating</span>
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning fill-warning" />{selectedData.rating}</span>
                      </div>
                      <Progress value={selectedData.rating * 20} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>On-Time Rate</span>
                        <span>{selectedData.onTimeRate}%</span>
                      </div>
                      <Progress value={selectedData.onTimeRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Success Rate</span>
                        <span>{selectedData.successRate}%</span>
                      </div>
                      <Progress value={selectedData.successRate} className="h-2" />
                    </div>
                  </div>

                  <div className="pt-3 border-t space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Vehicle</span><span>{selectedData.vehicleType}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Total Deliveries</span><span>{selectedData.totalDeliveries}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">License</span><span className="text-xs">{selectedData.licenseNumber}</span></div>
                    {selectedAnalytics && <div className="flex justify-between"><span className="text-muted-foreground">Revenue</span><span>{selectedAnalytics.revenue.toLocaleString()} XAF</span></div>}
                  </div>

                  <div className="flex gap-2 pt-3">
                    <Button className="flex-1" variant="outline" onClick={() => toast.info("Opening partner history...")}>View History</Button>
                    <Button className="flex-1" onClick={handleAssignJob}>Assign Job</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Select a partner to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <AddPartnerModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
        onSubmit={handleAddPartner}
      />
    </DashboardLayout>
  );
}
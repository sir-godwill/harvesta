import { useState } from "react";
import { Users, Star, Search, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AddPartnerModal } from "@/components/logistics/AddPartnerModal";
import { mockPartners } from "@/data/logistics-mock-data";
import { toast } from "sonner";

export default function LogisticsPartners() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredPartners = mockPartners.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold">Logistics Partners</h1><p className="text-muted-foreground">Partner management and performance</p></div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search partners..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" /></div>
        <Button onClick={() => setShowAddModal(true)}><Plus className="h-4 w-4 mr-2" />Add Partner</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPartners.map((partner) => (
          <Card key={partner.id} className="cursor-pointer hover:bg-muted/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><Users className="h-5 w-5 text-primary" /></div>
                  <div><h4 className="font-semibold text-sm">{partner.name}</h4><p className="text-xs text-muted-foreground capitalize">{partner.type}</p></div>
                </div>
                <div className={`h-2.5 w-2.5 rounded-full ${partner.isActive ? "bg-green-500" : "bg-muted-foreground"}`} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="rounded bg-muted/30 p-2"><p className="text-sm font-semibold">{partner.rating}</p><p className="text-[10px] text-muted-foreground">Rating</p></div>
                <div className="rounded bg-muted/30 p-2"><p className="text-sm font-semibold">{partner.onTimeRate}%</p><p className="text-[10px] text-muted-foreground">On-Time</p></div>
                <div className="rounded bg-muted/30 p-2"><p className="text-sm font-semibold">{partner.totalDeliveries}</p><p className="text-[10px] text-muted-foreground">Deliveries</p></div>
              </div>
              <div className="flex flex-wrap gap-1">{partner.zones.slice(0, 2).map((zone) => (<Badge key={zone} variant="outline" className="text-[10px]">{zone}</Badge>))}{partner.zones.length > 2 && <Badge variant="outline" className="text-[10px]">+{partner.zones.length - 2}</Badge>}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddPartnerModal open={showAddModal} onOpenChange={setShowAddModal} onSubmit={() => toast.success("Partner added!")} />
    </div>
  );
}

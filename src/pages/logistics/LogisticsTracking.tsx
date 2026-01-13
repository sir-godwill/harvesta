import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function LogisticsTracking() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Live Tracking</h1><p className="text-muted-foreground">Real-time shipment visibility</p></div>
      <Card><CardContent className="p-12 h-[400px] flex items-center justify-center"><div className="text-center"><MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" /><h3 className="font-semibold mb-1">Live Map View</h3><p className="text-sm text-muted-foreground">GPS tracking integrated with backend</p></div></CardContent></Card>
    </div>
  );
}

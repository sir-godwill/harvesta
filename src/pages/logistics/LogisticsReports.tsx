import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAnalyticsData, mockRegionalAnalytics, mockPartnerAnalytics } from "@/data/logistics-mock-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Download, Filter } from "lucide-react";

export default function LogisticsReports() {
  const latestData = mockAnalyticsData[mockAnalyticsData.length - 1];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">Reports & Analytics</h1><p className="text-muted-foreground">Strategic insights and optimization</p></div><div className="flex gap-2"><Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button></div></div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">On-Time Rate</p><p className="text-2xl font-bold text-green-600">{latestData.onTimeRate}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Avg Delivery Time</p><p className="text-2xl font-bold">{latestData.averageDeliveryTime}h</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Cost Per Delivery</p><p className="text-2xl font-bold">{latestData.costPerDelivery.toLocaleString()} XAF</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Failure Rate</p><p className="text-2xl font-bold text-destructive">{latestData.failureRate}%</p></CardContent></Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList><TabsTrigger value="trends">Trends</TabsTrigger><TabsTrigger value="regional">By Region</TabsTrigger><TabsTrigger value="partners">By Partner</TabsTrigger></TabsList>
        <TabsContent value="trends"><Card><CardHeader><CardTitle className="text-base">Delivery Performance</CardTitle></CardHeader><CardContent><div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={mockAnalyticsData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="period" tickFormatter={(v) => v.slice(5)} /><YAxis /><Tooltip /><Line type="monotone" dataKey="onTimeRate" stroke="hsl(var(--primary))" strokeWidth={2} name="On-Time %" /></LineChart></ResponsiveContainer></div></CardContent></Card></TabsContent>
        <TabsContent value="regional"><Card><CardHeader><CardTitle className="text-base">Regional Performance</CardTitle></CardHeader><CardContent><div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={mockRegionalAnalytics}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="region" /><YAxis /><Tooltip /><Bar dataKey="deliveries" fill="hsl(var(--primary))" /></BarChart></ResponsiveContainer></div></CardContent></Card></TabsContent>
        <TabsContent value="partners"><Card><CardHeader><CardTitle className="text-base">Partner Performance</CardTitle></CardHeader><CardContent><table className="w-full text-sm"><thead><tr className="border-b"><th className="p-2 text-left">Partner</th><th className="p-2 text-left">Deliveries</th><th className="p-2 text-left">On-Time %</th><th className="p-2 text-left">Rating</th></tr></thead><tbody>{mockPartnerAnalytics.map((p) => (<tr key={p.partnerId} className="border-b"><td className="p-2 font-medium">{p.partnerName}</td><td className="p-2">{p.deliveries}</td><td className="p-2">{p.onTimeRate}%</td><td className="p-2">⭐ {p.rating}</td></tr>))}</tbody></table></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}

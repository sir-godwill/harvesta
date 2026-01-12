import { useState } from "react";
import { BarChart3, TrendingUp, Download, Calendar, Filter } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAnalyticsData, mockRegionalAnalytics, mockPartnerAnalytics } from "@/data/mock-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

/**
 * Reports & Analytics Page - Strategic insight and optimization
 * 
 * Features:
 * - KPIs: On-time rate, avg delivery time, cost per delivery, failure rate
 * - Filters by region, partner, time range
 * - Export placeholders (CSV, PDF)
 * 
 * Dormant APIs: fetchLogisticsReports(), generateAnalytics(), exportReport()
 */
export default function ReportsPage() {
  const [period, setPeriod] = useState("week");

  const latestData = mockAnalyticsData[mockAnalyticsData.length - 1];

  return (
    <DashboardLayout title="Reports & Analytics" subtitle="Strategic insights and optimization" variant="admin">
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filters</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export CSV</Button>
            <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export PDF</Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">On-Time Delivery Rate</p>
              <p className="text-2xl font-bold text-success">{latestData.onTimeRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">+2.1% vs last period</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Avg Delivery Time</p>
              <p className="text-2xl font-bold">{latestData.averageDeliveryTime}h</p>
              <p className="text-xs text-muted-foreground mt-1">-1.2h vs last period</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Cost Per Delivery</p>
              <p className="text-2xl font-bold">{latestData.costPerDelivery.toLocaleString()} XAF</p>
              <p className="text-xs text-muted-foreground mt-1">-3.2% vs last period</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Failure Rate</p>
              <p className="text-2xl font-bold text-destructive">{latestData.failureRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">-0.5% vs last period</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="regional">By Region</TabsTrigger>
            <TabsTrigger value="partners">By Partner</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <Card>
              <CardHeader><CardTitle className="text-base">Delivery Performance Trend</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockAnalyticsData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="period" className="text-xs" tickFormatter={(v) => v.slice(5)} />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Line type="monotone" dataKey="onTimeRate" stroke="hsl(var(--primary))" strokeWidth={2} name="On-Time %" />
                      <Line type="monotone" dataKey="totalDeliveries" stroke="hsl(var(--accent))" strokeWidth={2} name="Deliveries" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional">
            <Card>
              <CardHeader><CardTitle className="text-base">Regional Performance</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockRegionalAnalytics}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="region" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="deliveries" fill="hsl(var(--primary))" name="Deliveries" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">Region</th>
                        <th className="p-2 text-left">Deliveries</th>
                        <th className="p-2 text-left">On-Time %</th>
                        <th className="p-2 text-left">Avg Cost</th>
                        <th className="p-2 text-left">Top Partner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockRegionalAnalytics.map((r) => (
                        <tr key={r.region} className="border-b">
                          <td className="p-2 font-medium">{r.region}</td>
                          <td className="p-2">{r.deliveries}</td>
                          <td className="p-2">{r.onTimeRate}%</td>
                          <td className="p-2">{r.avgCost.toLocaleString()} XAF</td>
                          <td className="p-2 text-muted-foreground">{r.topPartner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partners">
            <Card>
              <CardHeader><CardTitle className="text-base">Partner Performance</CardTitle></CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Partner</th>
                      <th className="p-2 text-left">Deliveries</th>
                      <th className="p-2 text-left">On-Time %</th>
                      <th className="p-2 text-left">Rating</th>
                      <th className="p-2 text-left">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPartnerAnalytics.map((p) => (
                      <tr key={p.partnerId} className="border-b">
                        <td className="p-2 font-medium">{p.partnerName}</td>
                        <td className="p-2">{p.deliveries}</td>
                        <td className="p-2">{p.onTimeRate}%</td>
                        <td className="p-2">⭐ {p.rating}</td>
                        <td className="p-2">{p.revenue.toLocaleString()} XAF</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
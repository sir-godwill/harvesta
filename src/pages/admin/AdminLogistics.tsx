import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Truck,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  MoreVertical,
  Star,
  Package,
  ShieldCheck,
  Briefcase,
  Eye,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getAllLogisticsPartners,
  approveLogisticsPartner,
  rejectLogisticsPartner,
  getLogisticsAnalytics
} from '@/lib/logistics-api';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AdminLogistics() {
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('applications');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [partnersRes, analyticsRes] = await Promise.all([
        getAllLogisticsPartners(),
        getLogisticsAnalytics()
      ]);

      if (partnersRes.error) throw partnersRes.error;
      setPartners(partnersRes.data || []);
      setStats(analyticsRes.data);
    } catch (error) {
      toast.error('Failed to load logistics data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await approveLogisticsPartner(id);
      if (error) throw error;
      toast.success('Partner approved successfully');
      loadData();
    } catch (error) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please enter a reason for rejection:');
    if (reason === null) return;

    try {
      const { error } = await rejectLogisticsPartner(id, reason);
      if (error) throw error;
      toast.success('Application rejected');
      loadData();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const filteredPartners = partners.filter(p =>
    p.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contact_person.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const applications = filteredPartners.filter(p => p.status === 'pending');
  const activePartners = filteredPartners.filter(p => p.status === 'approved');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logistics Management</h1>
          <p className="text-muted-foreground">Manage service providers, approve applications, and monitor delivery performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filter
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Config
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-amber-700 uppercase">Pending</p>
              <h3 className="text-xl font-bold">{stats?.pendingApplications || 0} Apps</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <Truck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-green-700 uppercase">Active Fleet</p>
              <h3 className="text-xl font-bold">{stats?.activePartners || 0} Partners</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-700 uppercase">Deliveries</p>
              <h3 className="text-xl font-bold">{stats?.totalDeliveries || 0} Total</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-red-700 uppercase">Issues</p>
              <h3 className="text-xl font-bold">{stats?.openDisputes || 0} Open</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="bg-slate-100">
                <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
                <TabsTrigger value="partners">Partner Network ({activePartners.length})</TabsTrigger>
                <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search partners..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <TabsContent value="applications" className="m-0 space-y-4">
            {applications.length > 0 ? applications.map((partner) => (
              <div key={partner.id} className="group relative border rounded-2xl p-4 transition-all hover:bg-slate-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Briefcase className="h-7 w-7 text-slate-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{partner.company_name}</h3>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-none">Review</Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 text-slate-900 font-medium">{partner.contact_person}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {partner.operating_regions.join(', ')}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Applied {format(new Date(partner.created_at), 'MMM dd, HH:mm')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" className="text-slate-500 hover:text-slate-900">
                      <Eye className="h-4 w-4 mr-2" />
                      View Docs
                    </Button>
                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleReject(partner.id)}>
                      Reject
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(partner.id)}>
                      Approve Partner
                    </Button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center space-y-3 grayscale opacity-40">
                <Clock className="h-12 w-12 mx-auto" />
                <p className="font-medium">No pending applications</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="partners" className="m-0 space-y-4">
            {activePartners.length > 0 ? activePartners.map((partner) => (
              <div key={partner.id} className="group relative border rounded-2xl p-4 transition-all hover:bg-slate-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-green-50 flex items-center justify-center">
                      <Truck className="h-7 w-7 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{partner.company_name}</h3>
                        <Badge className="bg-green-100 text-green-700 border-none">Active Provider</Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> {partner.performance_score.toFixed(1)}/100 Score</span>
                        <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5" /> {partner.successful_deliveries} / {partner.total_deliveries} Deliveries</span>
                        <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-blue-500" /> Verified Partner</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Performance Insights</Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center space-y-3 grayscale opacity-40">
                <Truck className="h-12 w-12 mx-auto" />
                <p className="font-medium">No active partners yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tracking" className="m-0">
            <div className="py-20 text-center space-y-3 bg-slate-50 rounded-2xl border-2 border-dashed">
              <MapPin className="h-12 w-12 mx-auto text-slate-300" />
              <p className="font-medium text-slate-500">Global Fleet Map View</p>
              <p className="text-sm text-slate-400">Initialize Mapbox/Google Maps in API Management to see live tracking.</p>
              <Button variant="outline" size="sm" className="mt-4">Connect Maps API</Button>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
}

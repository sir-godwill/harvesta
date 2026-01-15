import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  MoreVertical,
  Navigation,
  Calendar,
  Wallet,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getLogisticsProfile,
  getAssignedDeliveries,
  getLogisticsAnalytics
} from '@/lib/logistics-api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function LogisticsDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [profileRes, deliveriesRes, analyticsRes] = await Promise.all([
        getLogisticsProfile(),
        getAssignedDeliveries({ limit: 5 }),
        getLogisticsAnalytics()
      ]);

      if (profileRes.error) {
        // If profile doesn't exist, redirect to application
        if (profileRes.error.code === 'PGRST116') {
          navigate('/logistics/apply');
          return;
        }
        throw profileRes.error;
      }

      setProfile(profileRes.data);
      setDeliveries(deliveriesRes.data || []);
      setStats(analyticsRes.data);
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Logistics Overview</h1>
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
              {profile?.company_name}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">Real-time status of your fleet and ongoing deliveries.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10" onClick={() => navigate('/logistics/deliveries')}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button className="h-10 bg-primary hover:bg-primary/90">
            <Navigation className="h-4 w-4 mr-2" />
            Map View
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-100 rounded-lg"><Truck className="h-5 w-5 text-blue-600" /></div>
              <Badge variant="secondary" className="bg-blue-50">Active</Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Active Deliveries</p>
              <h3 className="text-2xl font-bold">{deliveries.filter(d => ['assigned', 'picked_up', 'in_transit'].includes(d.status)).length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="h-5 w-5 text-green-600" /></div>
              <div className="flex items-center text-xs text-green-600 font-bold">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                98%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Delivery Success</p>
              <h3 className="text-2xl font-bold">{profile?.performance_score?.toFixed(1) || '0.0'}%</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-purple-100 rounded-lg"><Wallet className="h-5 w-5 text-purple-600" /></div>
              <Badge variant="secondary" className="bg-purple-50">Monthly</Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Earnings (XAF)</p>
              <h3 className="text-2xl font-bold">450.0K</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-amber-100 rounded-lg"><AlertTriangle className="h-5 w-5 text-amber-600" /></div>
              <Badge variant="outline" className="text-amber-600 border-amber-200">2 Pending</Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Active Disputes</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Deliveries List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Priority Deliveries</CardTitle>
                <CardDescription>Ongoing tasks requiring immediate attention.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5" onClick={() => navigate('/logistics/shipments')}>View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveries.length > 0 ? deliveries.map((delivery) => (
                <div key={delivery.id} className="group relative flex items-center justify-between p-4 rounded-2xl border bg-white hover:border-primary/50 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Package className="h-6 w-6 text-slate-600 group-hover:text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm">#{delivery.tracking_number}</span>
                        <Badge className={`${delivery.status === 'in_transit' ? 'bg-blue-100 text-blue-700' :
                          delivery.status === 'picked_up' ? 'bg-purple-100 text-purple-700' :
                            'bg-amber-100 text-amber-700'
                          } border-none hover:bg-opacity-80`}>
                          {delivery.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {delivery.delivery_address?.city || 'Douala'}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(new Date(delivery.created_at), 'HH:mm')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="hidden md:flex" onClick={() => navigate(`/logistics/deliveries?id=${delivery.id}`)}>Update View</Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-600">No active deliveries</p>
                    <p className="text-sm text-slate-400">Assigned deliveries will appear here.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance & Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">In Transit</span>
                </div>
                <span className="text-sm font-bold">12 Vehicles</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium">Available</span>
                </div>
                <span className="text-sm font-bold">5 Vehicles</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-slate-300" />
                  <span className="text-sm font-medium">Maintenance</span>
                </div>
                <span className="text-sm font-bold">2 Vehicles</span>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/logistics/vehicles')}>Manage Fleet</Button>
            </CardContent>
          </Card>

          <Card className="bg-primary text-white border-none">
            <CardHeader>
              <CardTitle className="text-white">Earnings Progress</CardTitle>
              <CardDescription className="text-primary-foreground/70">Target: 1.2M XAF / mo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold">
                  <span>Current: 450,000</span>
                  <span>37.5%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-1000" style={{ width: '37.5%' }} />
                </div>
                <p className="text-xs text-primary-foreground/60 italic">You're 15% ahead of your last month's pace!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

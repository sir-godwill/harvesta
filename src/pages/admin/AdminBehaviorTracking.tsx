import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Users,
    Eye,
    ShoppingCart,
    CheckCircle,
    TrendingDown,
    Filter,
    Download,
    Calendar,
    MousePointer2,
    Search,
    MessageSquare,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    getBehaviorAnalytics,
    getFunnelData,
    getDropOffPoints,
    getMostViewedProducts,
    getUserBehavior,
    exportBehaviorData
} from '@/lib/analytics-api';
import { toast } from 'sonner';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { format } from 'date-fns';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminBehaviorTracking() {
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState<any>(null);
    const [funnel, setFunnel] = useState<any>(null);
    const [dropOffs, setDropOffs] = useState<any>(null);
    const [popularProducts, setPopularProducts] = useState<any[]>([]);
    const [recentEvents, setRecentEvents] = useState<any[]>([]);
    const [timeRange, setTimeRange] = useState('7d');

    useEffect(() => {
        loadAnalytics();
    }, [timeRange]);

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            const now = new Date();
            let startDate = new Date();
            if (timeRange === '24h') startDate.setHours(now.getHours() - 24);
            else if (timeRange === '7d') startDate.setDate(now.getDate() - 7);
            else if (timeRange === '30d') startDate.setDate(now.getDate() - 30);

            const startIso = startDate.toISOString();

            const [analyticsRes, funnelRes, dropOffRes, productsRes, eventsRes] = await Promise.all([
                getBehaviorAnalytics(startIso),
                getFunnelData(startIso),
                getDropOffPoints(),
                getMostViewedProducts(5),
                getUserBehavior(undefined, { limit: 10 })
            ]);

            setAnalytics(analyticsRes.data);
            setFunnel(funnelRes.data);
            setDropOffs(dropOffRes.data);
            setPopularProducts(productsRes.data);
            setRecentEvents(eventsRes.data);
        } catch (error) {
            toast.error('Failed to load behavior analytics');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        const { data, error } = await exportBehaviorData();
        if (error) {
            toast.error('Export failed');
            return;
        }
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `harvesta_behavior_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
        toast.success('Report exported!');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const chartData = [
        { name: 'Page Views', value: funnel?.pageViews || 0 },
        { name: 'Product Views', value: funnel?.productViews || 0 },
        { name: 'Add to Cart', value: funnel?.cartAdds || 0 },
        { name: 'Purchases', value: funnel?.purchases || 0 },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Behavior & Activity</h1>
                    <p className="text-muted-foreground">Deep insights into how users interact with the Harvestá platform.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[150px]">
                            <Calendar className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Time Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">Last 24 Hours</SelectItem>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-blue-100 rounded-lg"><Eye className="h-5 w-5 text-blue-600" /></div>
                            <Badge variant="secondary" className="bg-blue-50">+{analytics?.uniqueUsers} users</Badge>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
                            <h3 className="text-2xl font-bold">{analytics?.uniqueUsers.toLocaleString()}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-green-100 rounded-lg"><MousePointer2 className="h-5 w-5 text-green-600" /></div>
                            <Badge variant="secondary" className="bg-green-50">Active</Badge>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                            <h3 className="text-2xl font-bold">{analytics?.pageViews.toLocaleString()}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-purple-100 rounded-lg"><ShoppingCart className="h-5 w-5 text-purple-600" /></div>
                            <Badge variant="secondary" className="bg-purple-50">{analytics?.cartActions} actions</Badge>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-muted-foreground">Cart Intent</p>
                            <h3 className="text-2xl font-bold">{analytics?.cartActions.toLocaleString()}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-amber-100 rounded-lg"><TrendingDown className="h-5 w-5 text-amber-600" /></div>
                            <Badge variant="outline" className="text-amber-600 border-amber-200">
                                {analytics?.conversionRate.toFixed(1)}% Conv
                            </Badge>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-muted-foreground">Purchase Conversion</p>
                            <h3 className="text-2xl font-bold">{analytics?.purchases.toLocaleString()}</h3>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Conversion Funnel */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Conversion Funnel</CardTitle>
                        <CardDescription>Track user progression from entry to final purchase.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#22c55e" fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="text-center p-3 rounded-lg bg-orange-50">
                                <p className="text-xs text-orange-600 font-bold uppercase">{"Entry -> Product"}</p>
                                <p className="text-lg font-bold text-orange-700">{dropOffs?.viewToProduct.toFixed(1)}% Drop-off</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-orange-50">
                                <p className="text-xs text-orange-600 font-bold uppercase">{"Product -> Cart"}</p>
                                <p className="text-lg font-bold text-orange-700">{dropOffs?.productToCart.toFixed(1)}% Drop-off</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-orange-50">
                                <p className="text-xs text-orange-600 font-bold uppercase">{"Cart -> Buy"}</p>
                                <p className="text-lg font-bold text-orange-700">{dropOffs?.cartToPurchase.toFixed(1)}% Drop-off</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Popular Tags/Products */}
                <Card>
                    <CardHeader>
                        <CardTitle>Most Viewed Products</CardTitle>
                        <CardDescription>High-intent items trending now.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {popularProducts.length > 0 ? popularProducts.map((p, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <div>
                                            <p className="text-sm font-medium">Product ID: {p.product_id.split('-')[0]}...</p>
                                            <p className="text-xs text-muted-foreground">{p.view_count} views</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )) : (
                                <p className="text-sm text-center text-muted-foreground italic py-10">No trending data yet.</p>
                            )}
                        </div>
                        <Button variant="outline" className="w-full mt-6">View Full Product Stats</Button>
                    </CardContent>
                </Card>
            </div>

            {/* Real-time Activity Feed */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Live Activity Feed</CardTitle>
                            <CardDescription>Real-time granular event tracking.</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 animate-pulse">
                            Live Data
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-muted/50 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Event</th>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Page</th>
                                    <th className="px-6 py-3">Device</th>
                                    <th className="px-6 py-3">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {recentEvents.map((event) => (
                                    <tr key={event.id} className="bg-white hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {event.event_type === 'page_view' && <Eye className="h-4 w-4 text-blue-500" />}
                                                {event.event_type === 'product_view' && <Search className="h-4 w-4 text-purple-500" />}
                                                {event.event_type === 'cart_add' && <ShoppingCart className="h-4 w-4 text-green-500" />}
                                                {event.event_type === 'purchase' && <CheckCircle className="h-4 w-4 text-green-600" />}
                                                {event.event_type === 'chat_open' && <MessageSquare className="h-4 w-4 text-amber-500" />}
                                                <span className="capitalize">{event.event_type.replace('_', ' ')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">
                                            {event.user_id ? event.user_id.split('-')[0] : 'Guest'}
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono max-w-[200px] truncate">
                                            {event.page_url?.split('/').pop() || '/'}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-muted-foreground truncate max-w-[150px]">
                                            {event.user_agent?.split('(')[1]?.split(')')[0] || event.user_agent}
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {format(new Date(event.created_at), 'HH:mm:ss')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

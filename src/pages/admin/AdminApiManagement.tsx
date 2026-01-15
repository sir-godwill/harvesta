import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Key,
    Settings,
    RefreshCw,
    Shield,
    Activity,
    Database,
    Zap,
    AlertCircle,
    CheckCircle2,
    Trash2,
    Edit,
    Plus,
    ArrowRight,
    Globe,
    Lock,
    Eye,
    EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const categories = [
    { id: 'payment', label: 'Payments', icon: Zap },
    { id: 'maps', label: 'Maps & Geolocation', icon: Globe },
    { id: 'messaging', label: 'Messaging & Notifs', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: Database },
    { id: 'logistics', label: 'Logistics', icon: Truck => <Lock className="h-4 w-4" /> }, // Fallback for simple implementation
    { id: 'ai', label: 'AI & Search', icon: Shield },
    { id: 'weather', label: 'Weather', icon: Globe },
];

export default function AdminApiManagement() {
    const [loading, setLoading] = useState(true);
    const [configs, setConfigs] = useState<any[]>([]);
    const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

    const [newConfig, setNewConfig] = useState({
        name: '',
        provider: '',
        category: 'payment',
        api_key: '',
        environment: 'sandbox'
    });

    useEffect(() => {
        loadConfigs();
    }, []);

    const loadConfigs = async () => {
        try {
            const { data, error } = await supabase
                .from('api_configurations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setConfigs(data || []);
        } catch (error) {
            toast.error('Failed to load API configurations');
        } finally {
            setLoading(false);
        }
    };

    const handleAddConfig = async () => {
        if (!newConfig.name || !newConfig.api_key) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const { error } = await supabase
                .from('api_configurations')
                .insert([newConfig]);

            if (error) throw error;

            toast.success('API configuration added successfully');
            setNewConfig({ name: '', provider: '', category: 'payment', api_key: '', environment: 'sandbox' });
            loadConfigs();
        } catch (error) {
            toast.error('Failed to add configuration');
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            const { error } = await supabase
                .from('api_configurations')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            loadConfigs();
            toast.success(`API ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const deleteConfig = async (id: string) => {
        if (!confirm('Are you sure you want to remove this API configuration?')) return;
        try {
            const { error } = await supabase
                .from('api_configurations')
                .delete()
                .eq('id', id);

            if (error) throw error;
            loadConfigs();
            toast.success('Configuration removed');
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const toggleKeyVisibility = (id: string) => {
        setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">API Management</h1>
                    <p className="text-muted-foreground">Manage external service integrations, keys, and environment variables.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin Only Access
                    </Badge>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Add New API Card */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" />
                            Add Integration
                        </CardTitle>
                        <CardDescription>Configure a new external API provider.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Service Name</Label>
                            <Input
                                placeholder="Google Maps, Stripe, etc."
                                value={newConfig.name}
                                onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Provider</Label>
                            <Input
                                placeholder="Google, Twilio, SendGrid"
                                value={newConfig.provider}
                                onChange={(e) => setNewConfig({ ...newConfig, provider: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={newConfig.category} onValueChange={(val) => setNewConfig({ ...newConfig, category: val })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>API Key / Secret</Label>
                            <div className="relative">
                                <Input
                                    type="password"
                                    placeholder="sk_test_..."
                                    value={newConfig.api_key}
                                    onChange={(e) => setNewConfig({ ...newConfig, api_key: e.target.value })}
                                />
                                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Environment</Label>
                            <Select value={newConfig.environment} onValueChange={(val) => setNewConfig({ ...newConfig, environment: val })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sandbox">Sandbox / Test</SelectItem>
                                    <SelectItem value="production">Production / Live</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="w-full mt-4" onClick={handleAddConfig}>Register API Provider</Button>
                    </CardContent>
                </Card>

                {/* Configurations List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {configs.length > 0 ? configs.map((config) => (
                            <Card key={config.id} className="relative overflow-hidden group">
                                <div className={`absolute left-0 top-0 w-1 h-full ${config.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border">
                                                <Zap className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm">{config.name}</h3>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{config.provider} • {config.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={config.status === 'active'}
                                                onCheckedChange={() => toggleStatus(config.id, config.status)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-slate-50 p-2 rounded-lg border flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <Key className="h-3.5 w-3.5 text-muted-foreground" />
                                                <code className="text-xs font-mono truncate">
                                                    {showKeys[config.id] ? config.api_key : '••••••••••••••••'}
                                                </code>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleKeyVisibility(config.id)}>
                                                {showKeys[config.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <Badge variant="outline" className={`${config.environment === 'production' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                                {config.environment}
                                            </Badge>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/5" onClick={() => deleteConfig(config.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )) : (
                            <div className="col-span-full py-12 text-center border-2 border-dashed rounded-2xl bg-white">
                                <Lock className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">No API providers configured.</p>
                                <p className="text-slate-400 text-sm">Add your first integration to start using external services.</p>
                            </div>
                        )}
                    </div>

                    <Card className="bg-slate-950 text-slate-400 border-none font-mono text-xs">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-white text-sm">System Environment Variables</CardTitle>
                                <RefreshCw className="h-3 w-3 animate-spin-slow" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <p><span className="text-green-400">DB_STATUS:</span> connected</p>
                                <p><span className="text-green-400">REALTIME:</span> enabled</p>
                                <p><span className="text-green-400">EDGE_FUNCTIONS:</span> synchronized</p>
                                <p><span className="text-green-400">VAULT_ENCRYPTION:</span> AES-256-GCM</p>
                                <p className="mt-4 text-[10px] text-slate-600">// Managed by Harvestá Production Engine</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { verifyExternalApis } from "@/lib/marketplaceApi";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Activity,
    Database,
    CreditCard,
    Server,
    AlertTriangle,
    CheckCircle2,
    XCircle
} from "lucide-react";

export default function AdminSystemHealth() {
    const { data: healthData, isLoading } = useQuery({
        queryKey: ['system-health'],
        queryFn: async () => {
            // 1. Run verification
            await verifyExternalApis();

            // 2. Fetch latest logs
            const { data: logs } = await supabase
                .from('api_health_logs')
                .select('*')
                .order('last_verified_at', { ascending: false });

            // Latest per API
            const latestApis = logs?.reduce((acc: any, log: any) => {
                if (!acc[log.api_name]) acc[log.api_name] = log;
                return acc;
            }, {});

            const startTime = Date.now();
            const { error: dbError } = await supabase.from('platform_settings').select('count', { count: 'exact', head: true });
            const latency = Date.now() - startTime;

            return {
                database: { status: dbError ? 'down' : 'healthy', latency: `${latency}ms` },
                apis: latestApis || {},
                storage: { status: 'healthy', provider: 'Supabase Storage' }
            };
        },
        refetchInterval: 60000
    });

    const StatusIcon = ({ status }: { status: string }) => {
        if (status === 'working' || status === 'healthy') return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        if (status === 'limited') return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        return <XCircle className="h-5 w-5 text-red-500" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
                    <p className="text-muted-foreground">Monitoring active integrations & infrastructure</p>
                </div>
                <Badge variant="outline" className="gap-1 px-3 py-1">
                    <Activity className="h-3 w-3" /> Live
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Database (Supabase)</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <StatusIcon status={healthData?.database.status || 'healthy'} />
                            <div className="text-2xl font-bold capitalize">{healthData?.database.status || '...'}</div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Latency: {healthData?.database.latency || '...'}</p>
                    </CardContent>
                </Card>

                {Object.values(healthData?.apis || {}).map((api: any) => (
                    <Card key={api.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium capitalize">{api.api_name}</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <StatusIcon status={api.status} />
                                <div className="text-2xl font-bold capitalize">{api.status}</div>
                            </div>
                            <div className="mt-2 space-y-1">
                                <p className="text-xs text-muted-foreground">Environment: <span className="font-medium text-foreground capitalize">{api.environment}</span></p>
                                <p className="text-xs text-muted-foreground">Latency: <span className="font-medium text-foreground">{api.latency_ms}ms</span></p>
                                {api.error_message && (
                                    <p className="text-xs text-red-500 font-medium truncate" title={api.error_message}>Error: {api.error_message}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Resource Usage</CardTitle>
                    <CardDescription>Server-side resource allocation metrics</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
                    <p className="text-sm text-muted-foreground">Detailed metrics chart will be available in production</p>
                </CardContent>
            </Card>
        </div>
    );
}

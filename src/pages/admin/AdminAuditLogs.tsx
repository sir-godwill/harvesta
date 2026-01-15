import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, Clock, User } from "lucide-react";
import { format } from "date-fns";

export default function AdminAuditLogs() {
    const [searchTerm, setSearchTerm] = useState("");

    const { data: logs, isLoading } = useQuery({
        queryKey: ['admin-audit-logs', searchTerm],
        queryFn: async () => {
            let query = supabase
                .from('audit_logs')
                .select(`
          *,
          profiles:user_id (full_name)
        `)
                .order('created_at', { ascending: false })
                .limit(100);

            if (searchTerm) {
                query = query.or(`action.ilike.%${searchTerm}%,entity_system_id.ilike.%${searchTerm}%`);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search action or entity ID..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Activity History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Admin</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Entity ID</TableHead>
                                    <TableHead>Entity Type</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={5} className="text-center py-10">Loading logs...</TableCell></TableRow>
                                ) : logs?.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center py-10">No logs found.</TableCell></TableRow>
                                ) : logs?.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-sm">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                {format(new Date(log.created_at), "MMM d, HH:mm:ss")}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-3 w-3 text-primary" />
                                                </div>
                                                <span className="text-sm font-medium">{(log.profiles as any)?.full_name || 'System'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">{log.action}</Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{log.entity_system_id || 'N/A'}</TableCell>
                                        <TableCell className="text-sm capitalize">{log.entity_type}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

import { supabase } from "@/integrations/supabase/client";

export type LogLevel = 'info' | 'warn' | 'error' | 'critical';
export type LogCategory = 'auth' | 'payment' | 'api' | 'logistics' | 'system';

interface LogOptions {
    level?: LogLevel;
    category: LogCategory;
    message: string;
    metadata?: any;
    errorStack?: string;
    userId?: string;
}

/**
 * Structured logger for system events and observability.
 * Persists to public.system_logs table.
 */
export async function logSystemEvent(options: LogOptions) {
    try {
        const {
            level = 'info',
            category,
            message,
            metadata = {},
            errorStack,
            userId
        } = options;

        let targetUserId = userId;
        if (!targetUserId) {
            const { data: { user } } = await supabase.auth.getUser();
            targetUserId = user?.id;
        }

        const { error } = await supabase
            .from('system_logs')
            .insert({
                level,
                category,
                message,
                metadata,
                error_stack: errorStack,
                user_id: targetUserId
            });

        if (error) {
            console.error('Failed to persist log to database:', error);
            // Fallback to console for critical failures
            console.log(`[${level.toUpperCase()}] ${category}: ${message}`, metadata);
        }
    } catch (err) {
        console.error('Logger error:', err);
    }
}

/**
 * Audit logger for administrative and sensitive actions.
 * Persists to public.audit_logs table.
 */
export async function logAuditAction(options: {
    action: string;
    entityType: string;
    entityId: string;
    entitySystemId?: string;
    oldData?: any;
    newData?: any;
}) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
            .from('audit_logs')
            .insert({
                user_id: user.id,
                action: options.action,
                entity_type: options.entityType,
                entity_id: options.entityId,
                entity_system_id: options.entitySystemId,
                old_data: options.oldData,
                new_data: options.newData
            });
    } catch (err) {
        console.error('Audit logger error:', err);
    }
}

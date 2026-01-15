import { supabase } from "@/integrations/supabase/client";

export interface PlatformSetting {
    key: string;
    value: any;
    description: string;
}

export interface ApiConfiguration {
    id: string;
    name: string;
    provider: string;
    category: 'payment' | 'maps' | 'messaging' | 'analytics' | 'logistics' | 'ai' | 'weather';
    api_key: string;
    environment: 'sandbox' | 'production';
    status: 'active' | 'inactive';
}

/**
 * Fetch a specific platform setting
 */
export async function getPlatformSetting<T = any>(key: string): Promise<T | null> {
    try {
        const { data, error } = await supabase
            .from('platform_settings')
            .select('value')
            .eq('key', key)
            .single();

        if (error) {
            if (error.code !== 'PGRST116') console.error(`Error fetching setting ${key}:`, error);
            return null;
        }

        return data.value as T;
    } catch (err) {
        console.error(`Error in getPlatformSetting for ${key}:`, err);
        return null;
    }
}

/**
 * Check if the platform is in sandbox mode for a specific category
 */
export async function isSandboxMode(category: ApiConfiguration['category'] = 'payment'): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('api_configurations')
            .select('environment')
            .eq('category', category)
            .eq('status', 'active')
            .limit(1)
            .maybeSingle();

        if (error) return true; // Default to sandbox on error
        return !data || data.environment === 'sandbox';
    } catch (err) {
        return true;
    }
}

/**
 * Get active API configuration for a category
 */
export async function getApiConfig(category: ApiConfiguration['category']): Promise<ApiConfiguration | null> {
    try {
        const { data, error } = await supabase
            .from('api_configurations')
            .select('*')
            .eq('category', category)
            .eq('status', 'active')
            .limit(1)
            .maybeSingle();

        if (error) throw error;
        return data as ApiConfiguration;
    } catch (err) {
        console.error(`Error fetching API config for ${category}:`, err);
        return null;
    }
}

-- =====================================================
-- API MANAGEMENT & PLATFORM SETTINGS SCHEMA
-- =====================================================

-- 7. API CONFIGURATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.api_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    category TEXT CHECK (category IN ('payment', 'maps', 'messaging', 'analytics', 'logistics', 'ai', 'weather')) NOT NULL,
    api_key TEXT NOT NULL,
    environment TEXT CHECK (environment IN ('sandbox', 'production')) DEFAULT 'sandbox',
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    usage_stats JSONB DEFAULT '{}'::jsonb,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. PLATFORM SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for API Configurations (Admin only)
ALTER TABLE public.api_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage api configurations"
    ON public.api_configurations FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND app_role IN ('admin', 'super_admin')
        )
    );

-- RLS for Platform Settings
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view platform settings"
    ON public.platform_settings FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage platform settings"
    ON public.platform_settings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND app_role IN ('admin', 'super_admin')
        )
    );

-- Triggers for updated_at
CREATE TRIGGER update_api_configurations_updated_at
    BEFORE UPDATE ON public.api_configurations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

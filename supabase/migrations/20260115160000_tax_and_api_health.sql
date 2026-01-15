-- ================================================
-- HARVESTÁ FINANCIAL READINESS & TAX FREEZE
-- ================================================

-- 1. TAX CONFIGURATION FRAMEWORK
-- ================================================
CREATE TYPE public.tax_type AS ENUM ('vat', 'sales_tax', 'service_tax', 'import_tax', 'export_tax');
CREATE TYPE public.tax_scope AS ENUM ('platform', 'country', 'region', 'category');
CREATE TYPE public.tax_calculation_method AS ENUM ('fixed', 'percentage', 'tiered');

CREATE TABLE IF NOT EXISTS public.tax_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_id TEXT UNIQUE DEFAULT public.generate_system_id('TAX'),
    name TEXT NOT NULL,
    type tax_type NOT NULL DEFAULT 'vat',
    scope tax_scope NOT NULL DEFAULT 'platform',
    scope_id TEXT, -- country code, region name, or category_id
    method tax_calculation_method NOT NULL DEFAULT 'percentage',
    rate DECIMAL(10, 4) NOT NULL DEFAULT 0,
    is_inclusive BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT false, -- Disabled by default
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS for Tax Configurations
ALTER TABLE public.tax_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super Admins can manage tax configurations"
    ON public.tax_configurations FOR ALL
    USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can view tax configurations"
    ON public.tax_configurations FOR SELECT
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- 2. TAX FREEZE STATUS
-- ================================================
INSERT INTO public.platform_settings (key, value, description)
VALUES ('tax_freeze_active', 'true', 'When true, all tax calculations return 0 across the platform.')
ON CONFLICT (key) DO UPDATE SET value = 'true';

-- 3. API HEALTH MONITORING
-- ================================================
CREATE TABLE IF NOT EXISTS public.api_health_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_name TEXT NOT NULL,
    environment TEXT NOT NULL, -- 'sandbox', 'production'
    status TEXT NOT NULL, -- 'working', 'failed', 'limited'
    latency_ms INTEGER,
    error_message TEXT,
    last_verified_at TIMESTAMPTZ DEFAULT now(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Index for quick health dashboard lookup
CREATE INDEX idx_api_health_latest ON public.api_health_logs (api_name, last_verified_at DESC);

-- Enable RLS
ALTER TABLE public.api_health_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view api health"
    ON public.api_health_logs FOR SELECT
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- 4. HARDENED TAX FREEZE TRIGGER
-- ================================================
CREATE OR REPLACE FUNCTION public.enforce_tax_freeze()
RETURNS TRIGGER AS $$
DECLARE
    v_tax_frozen TEXT;
BEGIN
    SELECT value INTO v_tax_frozen FROM public.platform_settings WHERE key = 'tax_freeze_active';
    
    IF v_tax_frozen = 'true' THEN
        NEW.tax_amount := 0;
        -- Re-calculate total_amount to ensure it's subtotal + delivery_fee + 0
        NEW.total_amount := NEW.subtotal + COALESCE(NEW.delivery_fee, 0);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enforce_tax_freeze ON public.orders;
CREATE TRIGGER trg_enforce_tax_freeze
    BEFORE INSERT OR UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_tax_freeze();

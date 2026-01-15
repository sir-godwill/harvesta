-- ================================================
-- HARVESTÁ PRODUCTION SECURITY & RBAC
-- ================================================

-- 1. ROLE EXTENSIONS
-- ================================================
-- Add new roles to the existing enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'affiliate';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'support_agent';

-- 2. GLOBAL SYSTEM ID INFRASTRUCTURE
-- ================================================
CREATE TABLE IF NOT EXISTS public.system_id_sequences (
    prefix TEXT PRIMARY KEY,
    current_val BIGINT DEFAULT 1
);

CREATE OR REPLACE FUNCTION public.generate_system_id(p_prefix TEXT)
RETURNS TEXT AS $$
DECLARE
    seq_val BIGINT;
    year_str TEXT := to_char(now(), 'YYYY');
    result_id TEXT;
BEGIN
    INSERT INTO public.system_id_sequences (prefix, current_val)
    VALUES (p_prefix, 1)
    ON CONFLICT (prefix) DO UPDATE 
    SET current_val = public.system_id_sequences.current_val + 1
    RETURNING current_val INTO seq_val;

    result_id := p_prefix || '-' || year_str || '-' || LPAD(seq_val::text, 6, '0');
    RETURN result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. AUDIT & SYSTEM LOGS
-- ================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_id TEXT UNIQUE DEFAULT public.generate_system_id('AUDIT'),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    entity_system_id TEXT,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_id TEXT UNIQUE DEFAULT public.generate_system_id('SYS'),
    level TEXT CHECK (level IN ('info', 'warn', 'error', 'critical')) DEFAULT 'info',
    category TEXT NOT NULL, -- 'auth', 'payment', 'api', 'logistics'
    message TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    error_stack TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Protect logs (Immutable)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super Admins can view audit logs"
    ON public.audit_logs FOR SELECT
    USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super Admins can view system logs"
    ON public.system_logs FOR SELECT
    USING (public.has_role(auth.uid(), 'super_admin'));

-- 4. APPLY SYSTEM IDS TO EXISTING TABLES
-- ================================================

-- Helper to add current_id column and trigger
CREATE OR REPLACE FUNCTION public.apply_system_id_trigger(table_name TEXT, prefix TEXT)
RETURNS VOID AS $$
BEGIN
    EXECUTE 'ALTER TABLE public.' || table_name || ' ADD COLUMN IF NOT EXISTS system_id TEXT UNIQUE';
    
    EXECUTE 'CREATE OR REPLACE FUNCTION public.tr_fn_set_system_id_' || table_name || '() ' ||
            'RETURNS trigger AS $tr$ ' ||
            'BEGIN ' ||
            '  IF NEW.system_id IS NULL THEN ' ||
            '    NEW.system_id := public.generate_system_id(''' || prefix || '''); ' ||
            '  END IF; ' ||
            '  RETURN NEW; ' ||
            'END; ' ||
            '$tr$ LANGUAGE plpgsql';

    EXECUTE 'DROP TRIGGER IF EXISTS tr_set_system_id ON public.' || table_name;
    EXECUTE 'CREATE TRIGGER tr_set_system_id BEFORE INSERT ON public.' || table_name || 
            ' FOR EACH ROW EXECUTE FUNCTION public.tr_fn_set_system_id_' || table_name || '()';
            
    -- Backfill existing rows
    EXECUTE 'UPDATE public.' || table_name || ' SET system_id = public.generate_system_id(''' || prefix || ''') WHERE system_id IS NULL';
END;
$$ LANGUAGE plpgsql;

-- Apply to target tables
SELECT public.apply_system_id_trigger('profiles', 'USR');
SELECT public.apply_system_id_trigger('suppliers', 'SELL');
SELECT public.apply_system_id_trigger('buyer_profiles', 'BUY');
SELECT public.apply_system_id_trigger('affiliates', 'AFF');
SELECT public.apply_system_id_trigger('products', 'PRD');
SELECT public.apply_system_id_trigger('orders', 'ORD');
SELECT public.apply_system_id_trigger('order_items', 'ITM');
SELECT public.apply_system_id_trigger('payments', 'PAY');
SELECT public.apply_system_id_trigger('deliveries', 'SHIP');
SELECT public.apply_system_id_trigger('delivery_tracking', 'TRK');
SELECT public.apply_system_id_trigger('conversations', 'CHAT');
SELECT public.apply_system_id_trigger('messages', 'MSG');
SELECT public.apply_system_id_trigger('rfq_requests', 'RFQ');

-- 5. ASSIGN SUPER ADMIN
-- ================================================
CREATE OR REPLACE FUNCTION public.setup_super_admin(target_email TEXT)
RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
BEGIN
    SELECT id INTO v_user_id FROM auth.users WHERE email = target_email;
    
    IF v_user_id IS NOT NULL THEN
        -- Delete any existing role for this user to avoid conflict
        DELETE FROM public.user_roles WHERE user_id = v_user_id;
        
        -- Insert Super Admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (v_user_id, 'super_admin');
        
        -- Update profile status
        UPDATE public.profiles SET status = 'active' WHERE id = v_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT public.setup_super_admin('sir.godwill08@gmail.com');

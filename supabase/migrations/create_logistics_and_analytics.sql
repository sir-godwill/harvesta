-- =====================================================
-- LOGISTICS SYSTEM DATABASE SCHEMA
-- =====================================================

-- 1. LOGISTICS PARTNERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.logistics_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    operating_regions TEXT[] NOT NULL,
    vehicle_types TEXT[] NOT NULL,
    capacity_kg DECIMAL(10,2),
    license_number TEXT,
    documents JSONB DEFAULT '[]'::jsonb,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')) DEFAULT 'pending',
    rejection_reason TEXT,
    performance_score DECIMAL(5,2) DEFAULT 0,
    total_deliveries INTEGER DEFAULT 0,
    successful_deliveries INTEGER DEFAULT 0,
    failed_deliveries INTEGER DEFAULT 0,
    average_delivery_time DECIMAL(10,2),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. DELIVERIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) NOT NULL,
    logistics_partner_id UUID REFERENCES public.logistics_partners(id),
    status TEXT CHECK (status IN ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'cancelled')) DEFAULT 'pending',
    pickup_address JSONB NOT NULL,
    delivery_address JSONB NOT NULL,
    pickup_time TIMESTAMP WITH TIME ZONE,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    tracking_number TEXT UNIQUE,
    notes TEXT,
    failure_reason TEXT,
    proof_of_delivery JSONB,
    distance_km DECIMAL(10,2),
    delivery_fee DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DELIVERY TRACKING TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.delivery_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_id UUID REFERENCES public.deliveries(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL,
    location JSONB,
    notes TEXT,
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. LOGISTICS VEHICLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.logistics_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    logistics_partner_id UUID REFERENCES public.logistics_partners(id) ON DELETE CASCADE NOT NULL,
    vehicle_type TEXT NOT NULL,
    registration_number TEXT UNIQUE NOT NULL,
    capacity_kg DECIMAL(10,2),
    status TEXT CHECK (status IN ('active', 'maintenance', 'inactive')) DEFAULT 'active',
    current_location JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. LOGISTICS DISPUTES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.logistics_disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_id UUID REFERENCES public.deliveries(id) NOT NULL,
    reported_by UUID REFERENCES auth.users(id) NOT NULL,
    dispute_type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT CHECK (status IN ('open', 'investigating', 'resolved', 'closed')) DEFAULT 'open',
    resolution TEXT,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. USER BEHAVIOR TRACKING TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_behavior_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    session_id TEXT,
    event_type TEXT NOT NULL, -- 'page_view', 'product_view', 'search', 'cart_add', 'cart_remove', 'purchase', 'chat_open', 'rfq_create'
    event_data JSONB NOT NULL,
    page_url TEXT,
    referrer_url TEXT,
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Generate unique tracking number
CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS TEXT AS $$
DECLARE
    tracking TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        tracking := 'TRK' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        SELECT EXISTS(SELECT 1 FROM public.deliveries WHERE tracking_number = tracking) INTO exists;
        EXIT WHEN NOT exists;
    END LOOP;
    RETURN tracking;
END;
$$ LANGUAGE plpgsql;

-- Calculate logistics partner performance
CREATE OR REPLACE FUNCTION calculate_logistics_performance(p_partner_id UUID)
RETURNS VOID AS $$
DECLARE
    v_total INTEGER;
    v_successful INTEGER;
    v_failed INTEGER;
    v_avg_time DECIMAL;
BEGIN
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'delivered'),
        COUNT(*) FILTER (WHERE status = 'failed')
    INTO v_total, v_successful, v_failed
    FROM public.deliveries
    WHERE logistics_partner_id = p_partner_id;

    SELECT AVG(EXTRACT(EPOCH FROM (actual_delivery - pickup_time)) / 3600)
    INTO v_avg_time
    FROM public.deliveries
    WHERE logistics_partner_id = p_partner_id
        AND status = 'delivered'
        AND actual_delivery IS NOT NULL
        AND pickup_time IS NOT NULL;

    UPDATE public.logistics_partners
    SET 
        total_deliveries = v_total,
        successful_deliveries = v_successful,
        failed_deliveries = v_failed,
        average_delivery_time = v_avg_time,
        performance_score = CASE 
            WHEN v_total > 0 THEN (v_successful::DECIMAL / v_total) * 100
            ELSE 0
        END,
        updated_at = NOW()
    WHERE id = p_partner_id;
END;
$$ LANGUAGE plpgsql;

-- Track user behavior event
CREATE OR REPLACE FUNCTION track_user_behavior(
    p_user_id UUID,
    p_session_id TEXT,
    p_event_type TEXT,
    p_event_data JSONB,
    p_page_url TEXT DEFAULT NULL,
    p_referrer_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_event_id UUID;
BEGIN
    INSERT INTO public.user_behavior_tracking (
        user_id,
        session_id,
        event_type,
        event_data,
        page_url,
        referrer_url
    ) VALUES (
        p_user_id,
        p_session_id,
        p_event_type,
        p_event_data,
        p_page_url,
        p_referrer_url
    ) RETURNING id INTO v_event_id;

    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql;

-- Create delivery for order
CREATE OR REPLACE FUNCTION create_delivery_for_order(
    p_order_id UUID,
    p_pickup_address JSONB,
    p_delivery_address JSONB
)
RETURNS UUID AS $$
DECLARE
    v_delivery_id UUID;
    v_tracking TEXT;
BEGIN
    v_tracking := generate_tracking_number();

    INSERT INTO public.deliveries (
        order_id,
        pickup_address,
        delivery_address,
        tracking_number,
        status
    ) VALUES (
        p_order_id,
        p_pickup_address,
        p_delivery_address,
        v_tracking,
        'pending'
    ) RETURNING id INTO v_delivery_id;

    RETURN v_delivery_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update delivery tracking on status change
CREATE OR REPLACE FUNCTION update_delivery_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert tracking record
    INSERT INTO public.delivery_tracking (
        delivery_id,
        status,
        notes,
        updated_by
    ) VALUES (
        NEW.id,
        NEW.status,
        'Status updated to ' || NEW.status,
        COALESCE(NEW.logistics_partner_id, NEW.id)
    );

    -- Update logistics performance if completed or failed
    IF NEW.status IN ('delivered', 'failed') AND NEW.logistics_partner_id IS NOT NULL THEN
        PERFORM calculate_logistics_performance(NEW.logistics_partner_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delivery_status_update
    AFTER UPDATE OF status ON public.deliveries
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION update_delivery_status();

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_logistics_partners_updated_at
    BEFORE UPDATE ON public.logistics_partners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at
    BEFORE UPDATE ON public.deliveries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON public.logistics_vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at
    BEFORE UPDATE ON public.logistics_disputes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Logistics Partners
ALTER TABLE public.logistics_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own data"
    ON public.logistics_partners FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Partners can update own data"
    ON public.logistics_partners FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can apply"
    ON public.logistics_partners FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can manage all partners"
    ON public.logistics_partners FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND app_role IN ('admin', 'super_admin')
        )
    );

-- Deliveries
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logistics partners can view assigned deliveries"
    ON public.deliveries FOR SELECT
    USING (
        logistics_partner_id IN (
            SELECT id FROM public.logistics_partners WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Logistics partners can update assigned deliveries"
    ON public.deliveries FOR UPDATE
    USING (
        logistics_partner_id IN (
            SELECT id FROM public.logistics_partners WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Buyers can view own order deliveries"
    ON public.deliveries FOR SELECT
    USING (
        order_id IN (
            SELECT id FROM public.orders WHERE buyer_id = auth.uid()
        )
    );

CREATE POLICY "Sellers can view deliveries for their orders"
    ON public.deliveries FOR SELECT
    USING (
        order_id IN (
            SELECT id FROM public.orders WHERE seller_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all deliveries"
    ON public.deliveries FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND app_role IN ('admin', 'super_admin')
        )
    );

-- Delivery Tracking
ALTER TABLE public.delivery_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tracking for accessible deliveries"
    ON public.delivery_tracking FOR SELECT
    USING (
        delivery_id IN (
            SELECT id FROM public.deliveries
        )
    );

-- Logistics Vehicles
ALTER TABLE public.logistics_vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can manage own vehicles"
    ON public.logistics_vehicles FOR ALL
    USING (
        logistics_partner_id IN (
            SELECT id FROM public.logistics_partners WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all vehicles"
    ON public.logistics_vehicles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND app_role IN ('admin', 'super_admin')
        )
    );

-- Logistics Disputes
ALTER TABLE public.logistics_disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own disputes"
    ON public.logistics_disputes FOR SELECT
    USING (reported_by = auth.uid());

CREATE POLICY "Users can create disputes"
    ON public.logistics_disputes FOR INSERT
    WITH CHECK (reported_by = auth.uid());

CREATE POLICY "Admins can manage all disputes"
    ON public.logistics_disputes FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND app_role IN ('admin', 'super_admin')
        )
    );

-- User Behavior Tracking
ALTER TABLE public.user_behavior_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all behavior"
    ON public.user_behavior_tracking FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND app_role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Public can insert behavior events"
    ON public.user_behavior_tracking FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_logistics_partners_user_id ON public.logistics_partners(user_id);
CREATE INDEX IF NOT EXISTS idx_logistics_partners_status ON public.logistics_partners(status);

CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON public.deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_partner_id ON public.deliveries(logistics_partner_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON public.deliveries(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_tracking ON public.deliveries(tracking_number);

CREATE INDEX IF NOT EXISTS idx_delivery_tracking_delivery_id ON public.delivery_tracking(delivery_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_created_at ON public.delivery_tracking(created_at);

CREATE INDEX IF NOT EXISTS idx_vehicles_partner_id ON public.logistics_vehicles(logistics_partner_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.logistics_vehicles(status);

CREATE INDEX IF NOT EXISTS idx_disputes_delivery_id ON public.logistics_disputes(delivery_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.logistics_disputes(status);

CREATE INDEX IF NOT EXISTS idx_behavior_user_id ON public.user_behavior_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_behavior_event_type ON public.user_behavior_tracking(event_type);
CREATE INDEX IF NOT EXISTS idx_behavior_created_at ON public.user_behavior_tracking(created_at);
CREATE INDEX IF NOT EXISTS idx_behavior_session_id ON public.user_behavior_tracking(session_id);

-- =====================================================
-- AFFILIATE SYSTEM DATABASE SCHEMA
-- =====================================================

-- 1. AFFILIATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
    affiliate_code TEXT UNIQUE NOT NULL,
    status TEXT CHECK (status IN ('active', 'suspended', 'inactive')) DEFAULT 'active',
    total_earnings DECIMAL(10,2) DEFAULT 0,
    pending_earnings DECIMAL(10,2) DEFAULT 0,
    approved_earnings DECIMAL(10,2) DEFAULT 0,
    withdrawn_earnings DECIMAL(10,2) DEFAULT 0,
    available_balance DECIMAL(10,2) DEFAULT 0,
    total_referrals INTEGER DEFAULT 0,
    buyer_referrals INTEGER DEFAULT 0,
    seller_referrals INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. AFFILIATE REFERRALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE NOT NULL,
    referred_user_id UUID REFERENCES auth.users(id) NOT NULL,
    referral_type TEXT CHECK (referral_type IN ('buyer', 'seller')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    reward_amount DECIMAL(10,2) NOT NULL,
    milestone_achieved TEXT, -- 'signup', 'first_purchase', 'verification', 'first_sale', 'subscription'
    milestone_date TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES auth.users(id),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. AFFILIATE TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.affiliate_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE NOT NULL,
    type TEXT CHECK (type IN ('earning', 'withdrawal', 'adjustment', 'bonus')) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
    description TEXT,
    referral_id UUID REFERENCES public.affiliate_referrals(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    processed_by UUID REFERENCES auth.users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. AFFILIATE WITHDRAWALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.affiliate_withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
    payment_method TEXT NOT NULL, -- 'bank_transfer', 'mobile_money', 'paypal'
    payment_details JSONB NOT NULL,
    admin_notes TEXT,
    rejection_reason TEXT,
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. AFFILIATE CLICKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    referrer_url TEXT,
    landing_page TEXT,
    converted BOOLEAN DEFAULT FALSE,
    converted_user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Generate unique affiliate code
CREATE OR REPLACE FUNCTION generate_affiliate_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        code := 'AFF' || UPPER(substring(md5(random()::text) from 1 for 8));
        SELECT EXISTS(SELECT 1 FROM public.affiliates WHERE affiliate_code = code) INTO exists;
        EXIT WHEN NOT exists;
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Calculate affiliate earnings
CREATE OR REPLACE FUNCTION calculate_affiliate_earnings(p_affiliate_id UUID)
RETURNS VOID AS $$
DECLARE
    v_total_approved DECIMAL(10,2);
    v_total_withdrawn DECIMAL(10,2);
BEGIN
    -- Calculate total approved earnings
    SELECT COALESCE(SUM(reward_amount), 0)
    INTO v_total_approved
    FROM public.affiliate_referrals
    WHERE affiliate_id = p_affiliate_id
        AND status = 'approved';

    -- Calculate total withdrawn
    SELECT COALESCE(SUM(amount), 0)
    INTO v_total_withdrawn
    FROM public.affiliate_withdrawals
    WHERE affiliate_id = p_affiliate_id
        AND status = 'completed';

    -- Update affiliate record
    UPDATE public.affiliates
    SET 
        total_earnings = v_total_approved,
        pending_earnings = (
            SELECT COALESCE(SUM(reward_amount), 0)
            FROM public.affiliate_referrals
            WHERE affiliate_id = p_affiliate_id
                AND status = 'pending'
        ),
        approved_earnings = v_total_approved,
        withdrawn_earnings = v_total_withdrawn,
        available_balance = v_total_approved - v_total_withdrawn,
        total_referrals = (
            SELECT COUNT(*)
            FROM public.affiliate_referrals
            WHERE affiliate_id = p_affiliate_id
        ),
        buyer_referrals = (
            SELECT COUNT(*)
            FROM public.affiliate_referrals
            WHERE affiliate_id = p_affiliate_id
                AND referral_type = 'buyer'
        ),
        seller_referrals = (
            SELECT COUNT(*)
            FROM public.affiliate_referrals
            WHERE affiliate_id = p_affiliate_id
                AND referral_type = 'seller'
        ),
        conversion_rate = CASE 
            WHEN total_clicks > 0 THEN 
                (SELECT COUNT(*)::DECIMAL FROM public.affiliate_referrals WHERE affiliate_id = p_affiliate_id) / total_clicks * 100
            ELSE 0
        END,
        updated_at = NOW()
    WHERE id = p_affiliate_id;
END;
$$ LANGUAGE plpgsql;

-- Process referral reward
CREATE OR REPLACE FUNCTION process_referral_reward(
    p_referral_id UUID,
    p_approved_by UUID
)
RETURNS VOID AS $$
DECLARE
    v_affiliate_id UUID;
    v_amount DECIMAL(10,2);
BEGIN
    -- Get referral details
    SELECT affiliate_id, reward_amount
    INTO v_affiliate_id, v_amount
    FROM public.affiliate_referrals
    WHERE id = p_referral_id;

    -- Update referral status
    UPDATE public.affiliate_referrals
    SET 
        status = 'approved',
        approved_at = NOW(),
        approved_by = p_approved_by,
        updated_at = NOW()
    WHERE id = p_referral_id;

    -- Create transaction
    INSERT INTO public.affiliate_transactions (
        affiliate_id,
        type,
        amount,
        status,
        description,
        referral_id,
        processed_by,
        processed_at
    ) VALUES (
        v_affiliate_id,
        'earning',
        v_amount,
        'approved',
        'Referral reward',
        p_referral_id,
        p_approved_by,
        NOW()
    );

    -- Recalculate earnings
    PERFORM calculate_affiliate_earnings(v_affiliate_id);
END;
$$ LANGUAGE plpgsql;

-- Track affiliate click
CREATE OR REPLACE FUNCTION track_affiliate_click(
    p_affiliate_code TEXT,
    p_ip_address TEXT,
    p_user_agent TEXT,
    p_referrer_url TEXT,
    p_landing_page TEXT
)
RETURNS UUID AS $$
DECLARE
    v_affiliate_id UUID;
    v_click_id UUID;
BEGIN
    -- Get affiliate ID
    SELECT id INTO v_affiliate_id
    FROM public.affiliates
    WHERE affiliate_code = p_affiliate_code
        AND status = 'active';

    IF v_affiliate_id IS NULL THEN
        RETURN NULL;
    END IF;

    -- Insert click record
    INSERT INTO public.affiliate_clicks (
        affiliate_id,
        ip_address,
        user_agent,
        referrer_url,
        landing_page
    ) VALUES (
        v_affiliate_id,
        p_ip_address,
        p_user_agent,
        p_referrer_url,
        p_landing_page
    ) RETURNING id INTO v_click_id;

    -- Update click count
    UPDATE public.affiliates
    SET 
        total_clicks = total_clicks + 1,
        updated_at = NOW()
    WHERE id = v_affiliate_id;

    RETURN v_click_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Affiliates table
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own affiliate data"
    ON public.affiliates FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own affiliate data"
    ON public.affiliates FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all affiliates"
    ON public.affiliates FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
                AND app_role IN ('admin', 'super_admin')
        )
    );

-- Affiliate referrals
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can view own referrals"
    ON public.affiliate_referrals FOR SELECT
    USING (
        affiliate_id IN (
            SELECT id FROM public.affiliates WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all referrals"
    ON public.affiliate_referrals FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
                AND app_role IN ('admin', 'super_admin')
        )
    );

-- Affiliate transactions
ALTER TABLE public.affiliate_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can view own transactions"
    ON public.affiliate_transactions FOR SELECT
    USING (
        affiliate_id IN (
            SELECT id FROM public.affiliates WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all transactions"
    ON public.affiliate_transactions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
                AND app_role IN ('admin', 'super_admin')
        )
    );

-- Affiliate withdrawals
ALTER TABLE public.affiliate_withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can view own withdrawals"
    ON public.affiliate_withdrawals FOR SELECT
    USING (
        affiliate_id IN (
            SELECT id FROM public.affiliates WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Affiliates can create withdrawal requests"
    ON public.affiliate_withdrawals FOR INSERT
    WITH CHECK (
        affiliate_id IN (
            SELECT id FROM public.affiliates WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all withdrawals"
    ON public.affiliate_withdrawals FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
                AND app_role IN ('admin', 'super_admin')
        )
    );

-- Affiliate clicks
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can view own clicks"
    ON public.affiliate_clicks FOR SELECT
    USING (
        affiliate_id IN (
            SELECT id FROM public.affiliates WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Public can insert clicks"
    ON public.affiliate_clicks FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON public.affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON public.affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON public.affiliates(status);

CREATE INDEX IF NOT EXISTS idx_referrals_affiliate_id ON public.affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user ON public.affiliate_referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.affiliate_referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_type ON public.affiliate_referrals(referral_type);

CREATE INDEX IF NOT EXISTS idx_transactions_affiliate_id ON public.affiliate_transactions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.affiliate_transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.affiliate_transactions(status);

CREATE INDEX IF NOT EXISTS idx_withdrawals_affiliate_id ON public.affiliate_withdrawals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON public.affiliate_withdrawals(status);

CREATE INDEX IF NOT EXISTS idx_clicks_affiliate_id ON public.affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON public.affiliate_clicks(created_at);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_affiliates_updated_at
    BEFORE UPDATE ON public.affiliates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at
    BEFORE UPDATE ON public.affiliate_referrals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

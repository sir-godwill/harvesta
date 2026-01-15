-- ================================================
-- AUDIT FULFILLMENT: ENHANCED SEARCH & AUTH
-- ================================================

-- 1. ENHANCED SEARCH INDEX
-- Add tsvector column for performance
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS fts_vector tsvector;

-- Create function to update fts_vector
CREATE OR REPLACE FUNCTION public.products_fts_trigger() RETURNS trigger AS $$
BEGIN
  NEW.fts_vector := to_tsvector('english', COALESCE(NEW.name, '') || ' ' || COALESCE(NEW.description, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS tr_products_fts ON public.products;
CREATE TRIGGER tr_products_fts
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.products_fts_trigger();

-- Backfill data
UPDATE public.products SET fts_vector = to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, ''));

-- Create GIN index
DROP INDEX IF EXISTS public.idx_products_search;
CREATE INDEX idx_products_search ON public.products USING gin(fts_vector);

-- 2. ENHANCED USER REGISTRATION TRIGGER
-- Capturing metadata from signup (buyer_type, company_name, phone)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_buyer_type public.buyer_type;
    v_company_name TEXT;
    v_phone TEXT;
BEGIN
    -- Extract metadata
    v_buyer_type := COALESCE((NEW.raw_user_meta_data ->> 'buyer_type')::public.buyer_type, 'individual');
    v_company_name := NEW.raw_user_meta_data ->> 'company_name';
    v_phone := NEW.raw_user_meta_data ->> 'phone';

    -- Create profile
    INSERT INTO public.profiles (id, email, full_name, phone)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
        v_phone
    );
    
    -- Create role based on metadata (default to buyer_individual)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (
        NEW.id, 
        CASE 
            WHEN v_buyer_type = 'business' THEN 'buyer_business'::public.app_role
            ELSE 'buyer_individual'::public.app_role
        END
    );
    
    -- Create buyer profile with business data if present
    INSERT INTO public.buyer_profiles (user_id, buyer_type, business_name)
    VALUES (NEW.id, v_buyer_type, v_company_name);
    
    -- Create active cart
    INSERT INTO public.carts (user_id, status)
    VALUES (NEW.id, 'active');
    
    RETURN NEW;
END;
$$;

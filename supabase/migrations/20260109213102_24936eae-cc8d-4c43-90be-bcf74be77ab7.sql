-- ================================================
-- HARVESTÁ ROW LEVEL SECURITY POLICIES (WITH DROP IF EXISTS)
-- ================================================

-- ================================================
-- FIX FUNCTION SEARCH PATHS
-- ================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.order_number := 'HRV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_rfq_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.rfq_number := 'RFQ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_dispute_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.dispute_number := 'DSP-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
  RETURN NEW;
END;
$$;

-- ================================================
-- DROP EXISTING POLICIES (if any from partial run)
-- ================================================
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own buyer profile" ON public.buyer_profiles;
DROP POLICY IF EXISTS "Users can update own buyer profile" ON public.buyer_profiles;
DROP POLICY IF EXISTS "Admins can manage all buyer profiles" ON public.buyer_profiles;
DROP POLICY IF EXISTS "Users can view own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can insert own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Anyone can view active suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Suppliers can manage own record" ON public.suppliers;
DROP POLICY IF EXISTS "Admins can manage all suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Suppliers can manage own products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view active variants" ON public.product_variants;
DROP POLICY IF EXISTS "Suppliers can manage own variants" ON public.product_variants;
DROP POLICY IF EXISTS "Anyone can view product images" ON public.product_images;
DROP POLICY IF EXISTS "Suppliers can manage own images" ON public.product_images;
DROP POLICY IF EXISTS "Anyone can view active pricing" ON public.pricing_tiers;
DROP POLICY IF EXISTS "Suppliers can manage own pricing" ON public.pricing_tiers;
DROP POLICY IF EXISTS "Users can manage own carts" ON public.carts;
DROP POLICY IF EXISTS "Users can manage own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Buyers can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Buyers can create own orders" ON public.orders;
DROP POLICY IF EXISTS "Buyers can update pending orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Buyers can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Suppliers can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Buyers can insert own order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can view active logistics partners" ON public.logistics_partners;
DROP POLICY IF EXISTS "Logistics partners can manage own record" ON public.logistics_partners;
DROP POLICY IF EXISTS "Admins can manage all logistics partners" ON public.logistics_partners;
DROP POLICY IF EXISTS "Buyers can view own deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Logistics partners can view assigned deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Logistics partners can update assigned deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Admins can manage all deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Buyers can view own shipment events" ON public.shipment_events;
DROP POLICY IF EXISTS "Logistics partners can manage own events" ON public.shipment_events;
DROP POLICY IF EXISTS "Buyers can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can manage all payments" ON public.payments;
DROP POLICY IF EXISTS "Buyers can manage own RFQs" ON public.rfq_requests;
DROP POLICY IF EXISTS "Suppliers can view open RFQs" ON public.rfq_requests;
DROP POLICY IF EXISTS "Buyers can view own RFQ quotes" ON public.rfq_quotes;
DROP POLICY IF EXISTS "Suppliers can manage own quotes" ON public.rfq_quotes;
DROP POLICY IF EXISTS "Users can view own disputes" ON public.disputes;
DROP POLICY IF EXISTS "Users can create own disputes" ON public.disputes;
DROP POLICY IF EXISTS "Suppliers can view disputes against them" ON public.disputes;
DROP POLICY IF EXISTS "Admins can manage all disputes" ON public.disputes;
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Buyers can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Buyers can update own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Suppliers can respond to reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can view own activity logs" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Users can insert own activity logs" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Users can manage own recommendation events" ON public.recommendation_events;
DROP POLICY IF EXISTS "Users can manage own saved products" ON public.saved_products;
DROP POLICY IF EXISTS "Users can manage own saved suppliers" ON public.saved_suppliers;

-- ================================================
-- USER ROLES POLICIES
-- ================================================

CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- ================================================
-- PROFILES POLICIES
-- ================================================

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- ================================================
-- BUYER PROFILES POLICIES
-- ================================================

CREATE POLICY "Users can view own buyer profile"
ON public.buyer_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own buyer profile"
ON public.buyer_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all buyer profiles"
ON public.buyer_profiles FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- ================================================
-- ADDRESSES POLICIES
-- ================================================

CREATE POLICY "Users can view own addresses"
ON public.addresses FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
ON public.addresses FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
ON public.addresses FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
ON public.addresses FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ================================================
-- SUPPLIERS POLICIES
-- ================================================

CREATE POLICY "Anyone can view active suppliers"
ON public.suppliers FOR SELECT
USING (is_active = true AND verification_status = 'verified');

CREATE POLICY "Suppliers can manage own record"
ON public.suppliers FOR ALL
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all suppliers"
ON public.suppliers FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- ================================================
-- CATEGORIES POLICIES
-- ================================================

CREATE POLICY "Anyone can view active categories"
ON public.categories FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- ================================================
-- PRODUCTS POLICIES
-- ================================================

CREATE POLICY "Anyone can view active products"
ON public.products FOR SELECT
USING (status = 'active');

CREATE POLICY "Suppliers can manage own products"
ON public.products FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.suppliers
    WHERE suppliers.id = products.supplier_id
    AND suppliers.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all products"
ON public.products FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- ================================================
-- PRODUCT VARIANTS POLICIES
-- ================================================

CREATE POLICY "Anyone can view active variants"
ON public.product_variants FOR SELECT
USING (
  is_active = true AND
  EXISTS (
    SELECT 1 FROM public.products
    WHERE products.id = product_variants.product_id
    AND products.status = 'active'
  )
);

CREATE POLICY "Suppliers can manage own variants"
ON public.product_variants FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.suppliers s ON s.id = p.supplier_id
    WHERE p.id = product_variants.product_id
    AND s.user_id = auth.uid()
  )
);

-- ================================================
-- PRODUCT IMAGES POLICIES
-- ================================================

CREATE POLICY "Anyone can view product images"
ON public.product_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.products
    WHERE products.id = product_images.product_id
    AND products.status = 'active'
  )
);

CREATE POLICY "Suppliers can manage own images"
ON public.product_images FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.suppliers s ON s.id = p.supplier_id
    WHERE p.id = product_images.product_id
    AND s.user_id = auth.uid()
  )
);

-- ================================================
-- PRICING TIERS POLICIES
-- ================================================

CREATE POLICY "Anyone can view active pricing"
ON public.pricing_tiers FOR SELECT
USING (is_active = true);

CREATE POLICY "Suppliers can manage own pricing"
ON public.pricing_tiers FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.product_variants pv
    JOIN public.products p ON p.id = pv.product_id
    JOIN public.suppliers s ON s.id = p.supplier_id
    WHERE pv.id = pricing_tiers.product_variant_id
    AND s.user_id = auth.uid()
  )
);

-- ================================================
-- CARTS POLICIES
-- ================================================

CREATE POLICY "Users can manage own carts"
ON public.carts FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ================================================
-- CART ITEMS POLICIES
-- ================================================

CREATE POLICY "Users can manage own cart items"
ON public.cart_items FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.carts
    WHERE carts.id = cart_items.cart_id
    AND carts.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.carts
    WHERE carts.id = cart_items.cart_id
    AND carts.user_id = auth.uid()
  )
);

-- ================================================
-- ORDERS POLICIES
-- ================================================

CREATE POLICY "Buyers can view own orders"
ON public.orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Buyers can create own orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Buyers can update pending orders"
ON public.orders FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can manage all orders"
ON public.orders FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- ================================================
-- ORDER ITEMS POLICIES
-- ================================================

CREATE POLICY "Buyers can view own order items"
ON public.order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Suppliers can view own order items"
ON public.order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.suppliers
    WHERE suppliers.id = order_items.supplier_id
    AND suppliers.user_id = auth.uid()
  )
);

CREATE POLICY "Buyers can insert own order items"
ON public.order_items FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- ================================================
-- LOGISTICS PARTNERS POLICIES
-- ================================================

CREATE POLICY "Anyone can view active logistics partners"
ON public.logistics_partners FOR SELECT
USING (is_active = true);

CREATE POLICY "Logistics partners can manage own record"
ON public.logistics_partners FOR ALL
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all logistics partners"
ON public.logistics_partners FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- ================================================
-- DELIVERIES POLICIES
-- ================================================

CREATE POLICY "Buyers can view own deliveries"
ON public.deliveries FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = deliveries.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Logistics partners can view assigned deliveries"
ON public.deliveries FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.logistics_partners
    WHERE logistics_partners.id = deliveries.logistics_partner_id
    AND logistics_partners.user_id = auth.uid()
  )
);

CREATE POLICY "Logistics partners can update assigned deliveries"
ON public.deliveries FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.logistics_partners
    WHERE logistics_partners.id = deliveries.logistics_partner_id
    AND logistics_partners.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all deliveries"
ON public.deliveries FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- ================================================
-- SHIPMENT EVENTS POLICIES
-- ================================================

CREATE POLICY "Buyers can view own shipment events"
ON public.shipment_events FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.deliveries d
    JOIN public.orders o ON o.id = d.order_id
    WHERE d.id = shipment_events.delivery_id
    AND o.user_id = auth.uid()
  )
);

CREATE POLICY "Logistics partners can manage own events"
ON public.shipment_events FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.deliveries d
    JOIN public.logistics_partners lp ON lp.id = d.logistics_partner_id
    WHERE d.id = shipment_events.delivery_id
    AND lp.user_id = auth.uid()
  )
);

-- ================================================
-- PAYMENTS POLICIES
-- ================================================

CREATE POLICY "Buyers can view own payments"
ON public.payments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = payments.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all payments"
ON public.payments FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- ================================================
-- RFQ REQUESTS POLICIES
-- ================================================

CREATE POLICY "Buyers can manage own RFQs"
ON public.rfq_requests FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Suppliers can view open RFQs"
ON public.rfq_requests FOR SELECT
TO authenticated
USING (
  status = 'open' AND
  public.has_role(auth.uid(), 'supplier')
);

-- ================================================
-- RFQ QUOTES POLICIES
-- ================================================

CREATE POLICY "Buyers can view own RFQ quotes"
ON public.rfq_quotes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.rfq_requests
    WHERE rfq_requests.id = rfq_quotes.rfq_id
    AND rfq_requests.user_id = auth.uid()
  )
);

CREATE POLICY "Suppliers can manage own quotes"
ON public.rfq_quotes FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.suppliers
    WHERE suppliers.id = rfq_quotes.supplier_id
    AND suppliers.user_id = auth.uid()
  )
);

-- ================================================
-- DISPUTES POLICIES
-- ================================================

CREATE POLICY "Users can view own disputes"
ON public.disputes FOR SELECT
TO authenticated
USING (auth.uid() = raised_by);

CREATE POLICY "Users can create own disputes"
ON public.disputes FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = raised_by AND
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = disputes.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Suppliers can view disputes against them"
ON public.disputes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.suppliers
    WHERE suppliers.id = disputes.against_supplier_id
    AND suppliers.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all disputes"
ON public.disputes FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- ================================================
-- REVIEWS POLICIES
-- ================================================

CREATE POLICY "Anyone can view reviews"
ON public.reviews FOR SELECT
USING (true);

CREATE POLICY "Buyers can create reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update own reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (auth.uid() = buyer_id);

CREATE POLICY "Suppliers can respond to reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.suppliers s ON s.id = p.supplier_id
    WHERE p.id = reviews.product_id
    AND s.user_id = auth.uid()
  )
);

-- ================================================
-- USER ACTIVITY LOGS POLICIES
-- ================================================

CREATE POLICY "Users can view own activity logs"
ON public.user_activity_logs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs"
ON public.user_activity_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity logs"
ON public.user_activity_logs FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- ================================================
-- RECOMMENDATION EVENTS POLICIES
-- ================================================

CREATE POLICY "Users can manage own recommendation events"
ON public.recommendation_events FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ================================================
-- SAVED PRODUCTS POLICIES
-- ================================================

CREATE POLICY "Users can manage own saved products"
ON public.saved_products FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ================================================
-- SAVED SUPPLIERS POLICIES
-- ================================================

CREATE POLICY "Users can manage own saved suppliers"
ON public.saved_suppliers FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
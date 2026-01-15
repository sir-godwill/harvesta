-- Harvestá Marketplace Seed Data
-- This script populates the database with realistic agricultural products, suppliers, and categories.

-- 1. CLEANUP (Optional - Use with caution)
-- TRUNCATE public.categories, public.suppliers, public.products, public.product_variants, public.pricing_tiers, public.product_images CASCADE;

-- 2. CATEGORIES
INSERT INTO public.categories (id, name, slug, description, icon, image_url, is_active, sort_order) VALUES
('c1111111-1111-1111-1111-111111111111', 'Grains', 'grains', 'High-quality grains including maize, wheat, rice, sorghum, and millets.', '🌾', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800', true, 1),
('c2222222-2222-2222-2222-222222222222', 'Tubers', 'tubers', 'Fresh tubers and roots including cassava, yams, and potatoes.', '🥔', 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?w=800', true, 2),
('c3333333-3333-3333-3333-333333333333', 'Fruits', 'fruits', 'Exotic and tropical fruits from verified organic farms.', '🍎', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800', true, 3),
('c4444444-4444-4444-4444-444444444444', 'Vegetables', 'vegetables', 'Fresh seasonal vegetables harvested daily.', '🥬', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800', true, 4),
('c5555555-5555-5555-5555-555555555555', 'Agro-inputs', 'agro-inputs', 'Fertilizers, seeds, and organic farming inputs.', '🌱', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800', true, 5);

-- 3. SUPPLIERS (Note: user_id should be a valid auth.users id in a real scenario)
-- For demo purposes, we assume these user_ids exist or we use a subquery/trigger.
-- Here we'll use a placeholder UUID that matches a likely test user or just creating the profile.
INSERT INTO public.suppliers (id, company_name, slug, description, country, city, region, rating, verification_status, is_active, is_featured) VALUES
('s1111111-1111-1111-1111-111111111111', 'Green Valley Farms', 'green-valley-farms', 'Leading producer of organic Arabica coffee and avocados.', 'Cameroon', 'Douala', 'Littoral', 4.9, 'verified', true, true),
('s2222222-2222-2222-2222-222222222222', 'Sunshine Agro Ltd', 'sunshine-agro', 'Specialists in high-yield maize and tubers.', 'Cameroon', 'Yaoundé', 'Centre', 4.7, 'verified', true, false),
('s3333333-3333-3333-3333-333333333333', 'Global Organics', 'global-organics', 'Export-grade fruits and certified organic vegetables.', 'Cameroon', 'Bafoussam', 'West', 4.8, 'verified', true, true);

-- 4. PRODUCTS
INSERT INTO public.products (id, supplier_id, category_id, name, slug, short_description, description, unit_of_measure, min_order_quantity, is_organic, is_featured, status, origin_country, origin_region) VALUES
('p1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Premium Arabica Coffee Beans', 'premium-arabica-coffee', 'Freshly harvested Grade AA coffee beans.', 'Our premium Arabica coffee beans are grown at high altitudes in the Littoral region. They are hand-picked and sun-dried to ensure the highest quality.', 'kg', 50, true, true, 'active', 'Cameroon', 'Littoral'),
('p2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 'Organic Hass Avocados', 'organic-hass-avocados', 'Export-quality creamy avocados.', 'Rich in flavor and nutrients, our Hass avocados are perfect for export. They are grown under organic conditions without synthetic pesticides.', 'crate (50 pcs)', 10, true, true, 'active', 'Cameroon', 'Littoral'),
('p3333333-3333-3333-3333-333333333333', 's2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'Yellow Maize (Bulk)', 'yellow-maize-bulk', 'High-quality animal feed and human consumption maize.', 'Our yellow maize is dried to 13% moisture content, ensuring long shelf life and high nutritional value.', 'bag (90kg)', 100, false, false, 'active', 'Cameroon', 'Centre'),
('p4444444-4444-4444-4444-444444444444', 's3333333-3333-3333-3333-333333333333', 'c4444444-4444-4444-4444-444444444444', 'Field Tomatoes (Seasonal)', 'field-tomatoes', 'Fresh red tomatoes harvested daily.', 'Juicy and firm field tomatoes, ideal for local markets and processing.', 'crate (25kg)', 20, false, true, 'active', 'Cameroon', 'West');

-- 5. PRODUCT VARIANTS
INSERT INTO public.product_variants (id, product_id, name, sku, grade, packaging, weight, weight_unit, stock_quantity, is_default, is_active) VALUES
('v1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'Grade AA - Roasted', 'COF-AA-RST', 'Grade AA', 'Vacuum bag', 1, 'kg', 500, true, true),
('v1111111-1111-1111-1111-111111111112', 'p1111111-1111-1111-1111-111111111111', 'Grade A - Green', 'COF-A-GRN', 'Grade A', 'Jute bag', 1, 'kg', 1000, false, true),
('v2222222-2222-2222-2222-222222222221', 'p2222222-2222-2222-2222-222222222222', 'Large Size', 'AVO-HASS-LG', 'Export', 'Wood Crate', 15, 'kg', 200, true, true),
('v3333333-3333-3333-3333-333333333331', 'p3333333-3333-3333-3333-333333333331', '90kg Bag', 'MAI-YEL-90', 'Grade 1', 'Poly bag', 90, 'kg', 5000, true, true);

-- 6. PRICING TIERS
INSERT INTO public.pricing_tiers (id, product_variant_id, min_quantity, max_quantity, price_per_unit, currency, is_active) VALUES
(gen_random_uuid(), 'v1111111-1111-1111-1111-111111111111', 50, 199, 7500, 'XAF', true),
(gen_random_uuid(), 'v1111111-1111-1111-1111-111111111111', 200, 499, 6800, 'XAF', true),
(gen_random_uuid(), 'v1111111-1111-1111-1111-111111111111', 500, NULL, 6200, 'XAF', true),
(gen_random_uuid(), 'v2222222-2222-2222-2222-222222222221', 10, 49, 25000, 'XAF', true),
(gen_random_uuid(), 'v2222222-2222-2222-2222-222222222221', 50, NULL, 22000, 'XAF', true);

-- 7. PRODUCT IMAGES
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, sort_order) VALUES
(gen_random_uuid(), 'p1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400', 'Coffee Beans', true, 1),
(gen_random_uuid(), 'p2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400', 'Hass Avocados', true, 1),
(gen_random_uuid(), 'p3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400', 'Yellow Maize', true, 1),
(gen_random_uuid(), 'p4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1546470427-227c7eb5cf00?w=400', 'Fresh Tomatoes', true, 1);

-- 8. LOGISTICS PARTNERS
INSERT INTO public.logistics_partners (id, name, code, coverage_regions, is_active, verification_status) VALUES
(gen_random_uuid(), 'Harvestá Express', 'HEX-01', '{"Littoral", "Centre", "West"}', true, 'verified'),
(gen_random_uuid(), 'Cameroon Logistics Corp', 'CLC-02', '{"Littoral", "South West"}', true, 'verified');

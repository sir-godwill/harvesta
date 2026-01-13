-- Insert sample categories
INSERT INTO categories (id, name, slug, description, icon, is_active, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Fruits', 'fruits', 'Fresh fruits from local farms', 'Apple', true, 1),
  ('22222222-2222-2222-2222-222222222222', 'Vegetables', 'vegetables', 'Organic and conventional vegetables', 'Carrot', true, 2),
  ('33333333-3333-3333-3333-333333333333', 'Grains & Cereals', 'grains-cereals', 'Maize, rice, wheat and more', 'Wheat', true, 3),
  ('44444444-4444-4444-4444-444444444444', 'Tubers & Roots', 'tubers-roots', 'Cassava, yam, potatoes', 'Potato', true, 4),
  ('55555555-5555-5555-5555-555555555555', 'Livestock', 'livestock', 'Poultry, cattle, and other animals', 'Bird', true, 5),
  ('66666666-6666-6666-6666-666666666666', 'Dairy & Eggs', 'dairy-eggs', 'Fresh dairy products and eggs', 'Milk', true, 6);

-- Insert sample suppliers
INSERT INTO suppliers (id, company_name, country, city, region, email, phone, description, rating, verification_status, is_active, is_featured, total_products, total_orders) VALUES
  ('aaaa1111-1111-1111-1111-111111111111', 'Green Valley Farms', 'Cameroon', 'Douala', 'Littoral', 'info@greenvalleyfarms.cm', '+237 699 123 456', 'Premium organic produce from the highlands', 4.8, 'verified', true, true, 24, 156),
  ('aaaa2222-2222-2222-2222-222222222222', 'Savanna Agro Ltd', 'Cameroon', 'Yaoundé', 'Centre', 'sales@savannaagro.cm', '+237 677 234 567', 'Leading supplier of grains and cereals', 4.5, 'verified', true, true, 18, 89),
  ('aaaa3333-3333-3333-3333-333333333333', 'Fresh Harvest Co.', 'Cameroon', 'Bamenda', 'North-West', 'contact@freshharvest.cm', '+237 655 345 678', 'Farm-fresh vegetables and fruits', 4.6, 'verified', true, false, 32, 203),
  ('aaaa4444-4444-4444-4444-444444444444', 'Golden Poultry Farm', 'Cameroon', 'Bafoussam', 'West', 'order@goldenpoultry.cm', '+237 698 456 789', 'Quality poultry and eggs', 4.3, 'verified', true, false, 8, 67),
  ('aaaa5555-5555-5555-5555-555555555555', 'Tropical Roots Inc.', 'Cameroon', 'Buea', 'South-West', 'info@tropicalroots.cm', '+237 670 567 890', 'Cassava, yams, and plantains specialists', 4.7, 'verified', true, true, 15, 124);

-- Insert sample products
INSERT INTO products (id, name, slug, short_description, description, supplier_id, category_id, status, unit_of_measure, origin_country, origin_region, is_organic, is_featured, min_order_quantity, max_order_quantity, lead_time_days) VALUES
  ('bbbb1111-1111-1111-1111-111111111111', 'Organic Tomatoes', 'organic-tomatoes', 'Fresh organic tomatoes from highland farms', 'Premium quality organic tomatoes grown without pesticides. Perfect for restaurants and households.', 'aaaa1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'active', 'kg', 'Cameroon', 'Littoral', true, true, 10, 1000, 2),
  ('bbbb2222-2222-2222-2222-222222222222', 'Yellow Maize', 'yellow-maize', 'High-quality yellow maize grain', 'Dry yellow maize suitable for animal feed and human consumption.', 'aaaa2222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'active', 'kg', 'Cameroon', 'Centre', false, true, 100, 10000, 3),
  ('bbbb3333-3333-3333-3333-333333333333', 'Fresh Plantains', 'fresh-plantains', 'Ripe plantains ready for cooking', 'Sweet ripe plantains from local farms. Excellent for frying and roasting.', 'aaaa5555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'active', 'bunch', 'Cameroon', 'South-West', false, true, 5, 500, 1),
  ('bbbb4444-4444-4444-4444-444444444444', 'Fresh Eggs', 'fresh-eggs', 'Farm-fresh eggs from free-range chickens', 'Nutritious eggs from healthy free-range chickens.', 'aaaa4444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666666', 'active', 'crate', 'Cameroon', 'West', true, false, 1, 100, 1),
  ('bbbb5555-5555-5555-5555-555555555555', 'Cassava Tubers', 'cassava-tubers', 'Fresh cassava root tubers', 'High-quality cassava suitable for garri production or cooking.', 'aaaa5555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'active', 'kg', 'Cameroon', 'South-West', false, true, 50, 5000, 2),
  ('bbbb6666-6666-6666-6666-666666666666', 'Fresh Cabbage', 'fresh-cabbage', 'Green cabbage heads', 'Crisp fresh cabbage perfect for salads and cooking.', 'aaaa3333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'active', 'head', 'Cameroon', 'North-West', false, false, 10, 500, 2),
  ('bbbb7777-7777-7777-7777-777777777777', 'Local Rice', 'local-rice', 'Premium Ndop rice grain', 'Locally grown rice from the Ndop plains. Rich flavor and texture.', 'aaaa2222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'active', 'kg', 'Cameroon', 'North-West', false, true, 25, 2000, 3),
  ('bbbb8888-8888-8888-8888-888888888888', 'Fresh Mangoes', 'fresh-mangoes', 'Sweet ripe mangoes', 'Juicy and sweet mangoes from Northern Cameroon.', 'aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'active', 'kg', 'Cameroon', 'North', false, true, 10, 1000, 2);

-- Insert product variants
INSERT INTO product_variants (id, product_id, name, sku, weight, weight_unit, stock_quantity, low_stock_threshold, is_active, is_default) VALUES
  ('cccc1111-1111-1111-1111-111111111111', 'bbbb1111-1111-1111-1111-111111111111', 'Standard Box (25kg)', 'TOM-25KG', 25, 'kg', 500, 50, true, true),
  ('cccc1112-1111-1111-1111-111111111111', 'bbbb1111-1111-1111-1111-111111111111', 'Small Box (10kg)', 'TOM-10KG', 10, 'kg', 300, 30, true, false),
  ('cccc2222-2222-2222-2222-222222222222', 'bbbb2222-2222-2222-2222-222222222222', 'Bulk Bag (100kg)', 'MAIZE-100KG', 100, 'kg', 2000, 200, true, true),
  ('cccc3333-3333-3333-3333-333333333333', 'bbbb3333-3333-3333-3333-333333333333', 'Large Bunch (10-12 fingers)', 'PLANT-LG', 3, 'kg', 800, 100, true, true),
  ('cccc4444-4444-4444-4444-444444444444', 'bbbb4444-4444-4444-4444-444444444444', 'Standard Crate (30 eggs)', 'EGG-30', 2, 'kg', 150, 20, true, true),
  ('cccc5555-5555-5555-5555-555555555555', 'bbbb5555-5555-5555-5555-555555555555', 'Bulk Sack (50kg)', 'CASS-50KG', 50, 'kg', 1500, 150, true, true),
  ('cccc6666-6666-6666-6666-666666666666', 'bbbb6666-6666-6666-6666-666666666666', 'Single Head', 'CAB-1', 1.5, 'kg', 400, 50, true, true),
  ('cccc7777-7777-7777-7777-777777777777', 'bbbb7777-7777-7777-7777-777777777777', 'Rice Bag (25kg)', 'RICE-25KG', 25, 'kg', 600, 60, true, true),
  ('cccc8888-8888-8888-8888-888888888888', 'bbbb8888-8888-8888-8888-888888888888', 'Mango Box (20kg)', 'MANGO-20KG', 20, 'kg', 350, 40, true, true);

-- Insert pricing tiers
INSERT INTO pricing_tiers (id, product_variant_id, min_quantity, max_quantity, price_per_unit, currency, is_active) VALUES
  ('dddd1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', 1, 10, 25000, 'XAF', true),
  ('dddd1112-1111-1111-1111-111111111112', 'cccc1111-1111-1111-1111-111111111111', 11, 50, 22000, 'XAF', true),
  ('dddd1113-1111-1111-1111-111111111113', 'cccc1111-1111-1111-1111-111111111111', 51, NULL, 20000, 'XAF', true),
  ('dddd2222-2222-2222-2222-222222222222', 'cccc2222-2222-2222-2222-222222222222', 1, 5, 45000, 'XAF', true),
  ('dddd2223-2222-2222-2222-222222222223', 'cccc2222-2222-2222-2222-222222222222', 6, NULL, 40000, 'XAF', true),
  ('dddd3333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-333333333333', 1, NULL, 2500, 'XAF', true),
  ('dddd4444-4444-4444-4444-444444444444', 'cccc4444-4444-4444-4444-444444444444', 1, 10, 3500, 'XAF', true),
  ('dddd4445-4444-4444-4444-444444444445', 'cccc4444-4444-4444-4444-444444444444', 11, NULL, 3200, 'XAF', true),
  ('dddd5555-5555-5555-5555-555555555555', 'cccc5555-5555-5555-5555-555555555555', 1, NULL, 15000, 'XAF', true),
  ('dddd6666-6666-6666-6666-666666666666', 'cccc6666-6666-6666-6666-666666666666', 1, NULL, 500, 'XAF', true),
  ('dddd7777-7777-7777-7777-777777777777', 'cccc7777-7777-7777-7777-777777777777', 1, 10, 18000, 'XAF', true),
  ('dddd7778-7777-7777-7777-777777777778', 'cccc7777-7777-7777-7777-777777777777', 11, NULL, 16500, 'XAF', true),
  ('dddd8888-8888-8888-8888-888888888888', 'cccc8888-8888-8888-8888-888888888888', 1, NULL, 30000, 'XAF', true);

-- Insert sample logistics partners
INSERT INTO logistics_partners (id, name, code, email, phone, coverage_regions, coverage_cities, base_rate, per_km_rate, is_active, verification_status, on_time_rate, total_deliveries, performance_score, service_types) VALUES
  ('eeee1111-1111-1111-1111-111111111111', 'Express Cameroon', 'EXP-CM', 'dispatch@expresscm.com', '+237 655 111 222', ARRAY['Littoral', 'Centre', 'West'], ARRAY['Douala', 'Yaoundé', 'Bafoussam'], 2000, 150, true, 'verified', 94.5, 1250, 4.7, ARRAY['standard', 'express', 'same-day']),
  ('eeee2222-2222-2222-2222-222222222222', 'Swift Logistics', 'SWIFT', 'orders@swiftlog.cm', '+237 699 222 333', ARRAY['Littoral', 'Centre'], ARRAY['Douala', 'Yaoundé'], 1800, 120, true, 'verified', 91.2, 890, 4.5, ARRAY['standard', 'express']),
  ('eeee3333-3333-3333-3333-333333333333', 'Rural Connect', 'RURAL', 'info@ruralconnect.cm', '+237 677 333 444', ARRAY['North-West', 'West', 'South-West'], ARRAY['Bamenda', 'Bafoussam', 'Buea'], 2500, 180, true, 'verified', 88.7, 560, 4.3, ARRAY['standard', 'bulk']),
  ('eeee4444-4444-4444-4444-444444444444', 'City Movers', 'CITY', 'dispatch@citymovers.cm', '+237 670 444 555', ARRAY['Littoral'], ARRAY['Douala'], 1500, 100, true, 'verified', 96.1, 2100, 4.8, ARRAY['standard', 'express', 'same-day', 'cold-chain']);

-- Insert sample product images
INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, sort_order) VALUES
  ('ffff1111-1111-1111-1111-111111111111', 'bbbb1111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1546470427-227c7eb92983?w=800', 'Fresh organic tomatoes', true, 0),
  ('ffff2222-2222-2222-2222-222222222222', 'bbbb2222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800', 'Yellow maize grain', true, 0),
  ('ffff3333-3333-3333-3333-333333333333', 'bbbb3333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800', 'Fresh ripe plantains', true, 0),
  ('ffff4444-4444-4444-4444-444444444444', 'bbbb4444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800', 'Farm fresh eggs', true, 0),
  ('ffff5555-5555-5555-5555-555555555555', 'bbbb5555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?w=800', 'Cassava tubers', true, 0),
  ('ffff6666-6666-6666-6666-666666666666', 'bbbb6666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800', 'Fresh green cabbage', true, 0),
  ('ffff7777-7777-7777-7777-777777777777', 'bbbb7777-7777-7777-7777-777777777777', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800', 'Premium local rice', true, 0),
  ('ffff8888-8888-8888-8888-888888888888', 'bbbb8888-8888-8888-8888-888888888888', 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800', 'Sweet ripe mangoes', true, 0);
-- Create a comprehensive sample product showcasing all features
INSERT INTO products (
  name,
  slug,
  short_description,
  description,
  category_id,
  supplier_id,
  sku,
  unit_of_measure,
  status,
  is_organic,
  is_featured,
  origin_country,
  origin_region,
  harvest_date,
  expiry_date,
  lead_time_days,
  min_order_quantity,
  max_order_quantity,
  view_count,
  order_count
) VALUES (
  'Premium Organic Cocoa Beans - Grade A Export Quality',
  'premium-organic-cocoa-beans-grade-a-export',
  'Finest organic cocoa beans from the volcanic soils of Southwest Cameroon. Sun-dried, hand-sorted, and export-ready for chocolate manufacturers worldwide.',
  '<h2>Premium Organic Cocoa Beans</h2>
<p>Sourced from the fertile volcanic soils of the Southwest Region of Cameroon, these Grade A organic cocoa beans represent the finest quality available for chocolate production.</p>

<h3>🌱 Origin & Quality</h3>
<ul>
  <li><strong>Farm Location:</strong> Fako Division, Southwest Region</li>
  <li><strong>Altitude:</strong> 600-1200m above sea level</li>
  <li><strong>Variety:</strong> Trinitario hybrid (premium flavor profile)</li>
  <li><strong>Certification:</strong> USDA Organic, Fair Trade, Rainforest Alliance</li>
</ul>

<h3>📦 Processing & Packaging</h3>
<ul>
  <li>Traditional 6-day fermentation for optimal flavor development</li>
  <li>Sun-dried to 7% moisture content</li>
  <li>Hand-sorted to remove defective beans</li>
  <li>Packed in food-grade jute bags (60kg standard)</li>
</ul>

<h3>🍫 Flavor Profile</h3>
<p>These beans deliver a rich, complex flavor with notes of red berries, mild citrus, and hints of caramel. Low bitterness with moderate astringency makes them ideal for premium dark chocolate production.</p>

<h3>💼 B2B Terms</h3>
<ul>
  <li><strong>Minimum Order:</strong> 100kg</li>
  <li><strong>Lead Time:</strong> 5-7 business days</li>
  <li><strong>Payment:</strong> 30% advance, 70% before shipping</li>
  <li><strong>Shipping:</strong> FOB Douala or CIF to destination</li>
</ul>

<h3>📋 Storage Instructions</h3>
<p>Store in a cool, dry place away from direct sunlight. Maintain humidity below 70% and temperature below 25°C. Properly stored beans can maintain quality for up to 12 months.</p>',
  '33333333-3333-3333-3333-333333333333',
  'aaaa1111-1111-1111-1111-111111111111',
  'COC-ORG-GRA-001',
  'kg',
  'active',
  true,
  true,
  'Cameroon',
  'Southwest Region, Fako Division',
  '2024-12-01',
  '2025-12-01',
  5,
  100,
  10000,
  1245,
  87
);

-- Get the product ID and create variants with tiered pricing
DO $$
DECLARE
  product_id_var UUID;
  variant_60kg UUID;
  variant_bulk UUID;
  variant_retail UUID;
BEGIN
  -- Get the product we just created
  SELECT id INTO product_id_var FROM products WHERE slug = 'premium-organic-cocoa-beans-grade-a-export' LIMIT 1;
  
  -- Create 60kg Jute Bag variant (Standard Export)
  INSERT INTO product_variants (product_id, name, sku, grade, quality, packaging, weight, weight_unit, stock_quantity, low_stock_threshold, is_default, is_active)
  VALUES (product_id_var, '60kg Jute Bag - Export Standard', 'COC-ORG-60KG', 'Grade A', 'Export Quality', '60kg Jute Bag', 60, 'kg', 5000, 500, true, true)
  RETURNING id INTO variant_60kg;
  
  -- Create Bulk Container variant
  INSERT INTO product_variants (product_id, name, sku, grade, quality, packaging, weight, weight_unit, stock_quantity, low_stock_threshold, is_default, is_active)
  VALUES (product_id_var, 'Bulk Container - 20 Tons', 'COC-ORG-BULK', 'Grade A', 'Export Quality', '20ft Container', 20000, 'kg', 100000, 20000, false, true)
  RETURNING id INTO variant_bulk;
  
  -- Create Retail Sample variant
  INSERT INTO product_variants (product_id, name, sku, grade, quality, packaging, weight, weight_unit, stock_quantity, low_stock_threshold, is_default, is_active)
  VALUES (product_id_var, 'Sample Pack - 1kg', 'COC-ORG-1KG', 'Grade A', 'Premium', '1kg Vacuum Sealed', 1, 'kg', 200, 50, false, true)
  RETURNING id INTO variant_retail;
  
  -- Create tiered pricing for 60kg variant (1688-style bulk discounts)
  INSERT INTO pricing_tiers (product_variant_id, min_quantity, max_quantity, price_per_unit, currency, discount_percentage, is_active)
  VALUES 
    (variant_60kg, 1, 4, 2500, 'XAF', 0, true),
    (variant_60kg, 5, 19, 2350, 'XAF', 6, true),
    (variant_60kg, 20, 49, 2200, 'XAF', 12, true),
    (variant_60kg, 50, NULL, 2000, 'XAF', 20, true);
    
  -- Pricing for bulk container
  INSERT INTO pricing_tiers (product_variant_id, min_quantity, max_quantity, price_per_unit, currency, discount_percentage, is_active)
  VALUES 
    (variant_bulk, 1, 2, 1800, 'XAF', 28, true),
    (variant_bulk, 3, NULL, 1650, 'XAF', 34, true);
    
  -- Pricing for retail sample
  INSERT INTO pricing_tiers (product_variant_id, min_quantity, max_quantity, price_per_unit, currency, discount_percentage, is_active)
  VALUES 
    (variant_retail, 1, 9, 3500, 'XAF', 0, true),
    (variant_retail, 10, NULL, 3200, 'XAF', 8.5, true);
    
  -- Add product images
  INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
  VALUES 
    (product_id_var, 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800', 'Premium Organic Cocoa Beans - Main Image', true, 0),
    (product_id_var, 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800', 'Cocoa beans close-up showing quality', false, 1),
    (product_id_var, 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800', 'Cocoa beans in traditional packaging', false, 2);
END $$;
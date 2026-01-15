import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createProduct, createProductVariant, createPricingTier } from '@/lib/productManagementApi';

export function SeedDataButton() {
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        if (!confirm('This will add sample products to your account. Continue?')) return;

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('You must be logged in.');
                return;
            }

            const { data: supplier } = await supabase
                .from('suppliers')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!supplier) {
                toast.error('Supplier profile found.');
                return;
            }

            // 1. Create Sample Products
            const products_to_create = [
                {
                    name: 'Premium Cocoa Beans',
                    short_description: 'High quality fermented cocoa beans.',
                    description: 'Our cocoa beans are sourced from the best farms in the region...',
                    category_id: '8a8167f9-4d64-4e94-811c-c2f829910d9f', // You might want to fetch a real category ID first
                    unit_of_measure: 'kg',
                    status: 'active' as const,
                    is_organic: true,
                    is_featured: true,
                    origin_country: 'Cameroon',
                    origin_region: 'South West',
                    min_order_quantity: 100,
                    supplier_id: supplier.id,
                    tags: [],
                    labels: [],
                    enable_b2b: true,
                    enable_b2c: false,
                    enable_international: true,
                    sku: 'COC-001',
                    price: 2500
                },
                {
                    name: 'Robusta Coffee',
                    short_description: 'Freshly harvested coffee cherries.',
                    description: 'Robusta coffee grown at high altitude...',
                    category_id: '8a8167f9-4d64-4e94-811c-c2f829910d9f',
                    unit_of_measure: 'kg',
                    status: 'active' as const,
                    is_organic: false,
                    is_featured: false,
                    origin_country: 'Cameroon',
                    origin_region: 'West',
                    min_order_quantity: 50,
                    supplier_id: supplier.id,
                    tags: [],
                    labels: [],
                    enable_b2b: true,
                    enable_b2c: true,
                    enable_international: true,
                    sku: 'COF-002',
                    price: 1800
                }
            ];

            // Fetch a valid category first to avoid FK constraint errors
            const { data: categories } = await supabase.from('categories').select('id').limit(1);
            const categoryId = categories?.[0]?.id;

            for (const p of products_to_create) {
                const { data: product, error } = await createProduct({
                    ...p,
                    category_id: categoryId || p.category_id,
                    // @ts-ignore
                    supplier_id: supplier.id
                });

                if (product) {
                    // Variant
                    const { data: variant } = await createProductVariant({
                        product_id: product.id,
                        name: 'Default',
                        stock_quantity: 1000,
                        low_stock_threshold: 50,
                        is_default: true,
                        is_active: true
                    });

                    // Price
                    if (variant) {
                        await createPricingTier({
                            product_variant_id: variant.id,
                            min_quantity: 1,
                            price_per_unit: p.price,
                            currency: 'XAF',
                            is_active: true
                        });
                    }
                }
            }

            toast.success('Seed data added successfully!');
            window.location.reload(); // Refresh to see data

        } catch (error) {
            console.error('Error seeding data:', error);
            toast.error('Failed to seed data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="outline" size="sm" onClick={handleSeed} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Database className="w-4 h-4 mr-2" />}
            Seed Data
        </Button>
    );
}

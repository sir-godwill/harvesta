
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Demo Data
const CATEGORIES = [
    { name: 'Grains & Cereals', slug: 'grains-cereals', icon: 'wheat' },
    { name: 'Vegetables', slug: 'vegetables', icon: 'sprout' },
    { name: 'Fruits', slug: 'fruits', icon: 'apple' },
    { name: 'Tubers & Roots', slug: 'tubers-roots', icon: 'package' }, // Cassava/Yam
    { name: 'Cash Crops', slug: 'cash-crops', icon: 'leaf' }, // Cocoa, Coffee
    { name: 'Oils & Fats', slug: 'oils-fats', icon: 'flask' },
    { name: 'Livestock', slug: 'livestock', icon: 'cow' }, // using default icon actually
    { name: 'Spices', slug: 'spices', icon: 'gem' },
];

const SUPPLIERS = [
    {
        company: "GreenValley Coop",
        contact: "Emmanuel Ngu",
        email: "emmanuel@greenvalley.com",
        city: "Bamenda",
        desc: "A cooperative of over 500 smallholder farmers in the NW region.",
        logo: "https://images.unsplash.com/photo-1595856450099-009d749dfb2b?w=150&h=150&fit=crop"
    },
    {
        company: "Tropical Harvest Ltd",
        contact: "Sarah Mbi",
        email: "sarah@tropicalharvest.cm",
        city: "Douala",
        desc: "Export-grade tropical fruits and spices.",
        logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&h=150&fit=crop"
    },
    {
        company: "Savanna Grains",
        contact: "Alhaji Musa",
        email: "musa@savanna.cm",
        city: "Garoua",
        desc: "Premium maize, millet, and sorghum from the north.",
        logo: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=150&h=150&fit=crop"
    },
    {
        company: "Coastal Cocoas",
        contact: "Jean-Pierre Eko",
        email: "jp@coastalcocoas.com",
        city: "Kribi",
        desc: "Fine flavor cocoa beans, fermented and dried to perfection.",
        logo: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=150&h=150&fit=crop"
    },
    {
        company: "Highland Coffee Growers",
        contact: "Fon Tita",
        email: "info@highlandcoffee.cm",
        city: "Bafoussam",
        desc: "Arabica and Robusta coffee direct from the volcanic soils.",
        logo: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=150&h=150&fit=crop"
    }
];

const PRODUCTS = [
    {
        name: "Premium Cocoa Beans",
        cat: "Cash Crops",
        supplier: "Coastal Cocoas",
        image: "https://images.unsplash.com/photo-1552329868-b79e7019623e?w=800&q=80",
        price: 1500,
        unit: "kg",
        desc: "Grade A fermented cocoa beans suitable for chocolate production."
    },
    {
        name: "Arabica Coffee Beans",
        cat: "Cash Crops",
        supplier: "Highland Coffee Growers",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
        price: 2500,
        unit: "kg",
        desc: "Washed Arabica beans with notes of citrus and caramel."
    },
    {
        name: "Yellow Maize",
        cat: "Grains & Cereals",
        supplier: "Savanna Grains",
        image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80",
        price: 350,
        unit: "kg",
        desc: "Dried yellow maize, perfect for animal feed or flour."
    },
    {
        name: "Organic Cassava",
        cat: "Tubers & Roots",
        supplier: "GreenValley Coop",
        image: "https://images.unsplash.com/photo-1596556555191-2319208752c0?w=800&q=80",
        price: 200,
        unit: "kg",
        desc: "Freshly harvested cassava tubers."
    },
    {
        name: "Red Palm Oil",
        cat: "Oils & Fats",
        supplier: "Tropical Harvest Ltd",
        image: "https://images.unsplash.com/photo-1621952932915-0b046700438c?w=800&q=80",
        price: 1200,
        unit: "liter",
        desc: "Unrefined red palm oil, rich in vitamins."
    },
    {
        name: "Penja Pepper",
        cat: "Spices",
        supplier: "Tropical Harvest Ltd",
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
        price: 15000,
        unit: "kg",
        desc: "World-famous white pepper from Penja valley."
    }
];

export async function seedDatabase() {
    console.log("Starting database seed...");
    toast.info("Seeding database... Check console for details.");

    try {
        // 1. Seed Categories
        console.log("Seeding categories...");
        const { data: existingCats } = await supabase.from('categories').select('name, id');

        const catMap: Record<string, string> = {};

        for (const cat of CATEGORIES) {
            const existing = existingCats?.find(c => c.name === cat.name);
            if (existing) {
                catMap[cat.name] = existing.id;
                continue;
            }

            const { data, error } = await supabase.from('categories').insert({
                name: cat.name,
                slug: cat.slug,
                icon: cat.icon,
                is_active: true,
                sort_order: 1
            }).select().single();

            if (error) {
                console.error("Error creating category:", cat.name, error);
            } else if (data) {
                catMap[cat.name] = data.id;
            }
        }

        // 2. Seed Suppliers
        console.log("Seeding suppliers...");
        const { data: existingSuppliers } = await supabase.from('suppliers').select('company_name, id');
        const supplierMap: Record<string, string> = {};

        for (const sup of SUPPLIERS) {
            const existing = existingSuppliers?.find(s => s.company_name === sup.company);
            if (existing) {
                supplierMap[sup.company] = existing.id;
                continue;
            }

            // Create a profile first? The schema usually links supplier to a user profile, OR just a supplier record.
            // Based on schema in types.ts, `suppliers` doesn't strictly enforce a user_id foreign key constraint on creation? 
            // Actually `suppliers` has `user_id` but it might be nullable or we can make a fake one if there's no FK constraint enforced or if we can make a fake user profile.
            // Checking types.ts: `suppliers` has `user_id` column.

            // For simplicity in seeding, we might skip creating Auth Users and just create Supplier records if user_id is nullable.
            // If user_id is NOT nullable, we have a problem seeding without real users.
            // Let's assume for a moment we can insert with a placeholder UUID or NULL if allowed.
            // If it fails, I'll need to create profiles first.

            // Let's try inserting with a made-up UUID or current user's UUID (but current user is Admin?).
            // Better strategy: Check if we can insert without user_id.

            const { data, error } = await supabase.from('suppliers').insert({
                company_name: sup.company,
                contact_person: sup.contact,
                email: sup.email,
                city: sup.city,
                description: sup.desc,
                logo_url: sup.logo,
                status: 'active',
                is_active: true,
                verification_status: 'verified',
                // user_id: ??? - omitting to see if works.
            }).select().single();

            if (error) {
                console.error("Error creating supplier (likely auth constraint):", sup.company, error);
                // Fallback: try to fetch *any* user id to attach, or just skip.
            } else if (data) {
                supplierMap[sup.company] = data.id;
            }
        }

        // 3. Seed Products
        console.log("Seeding products...");
        for (const prod of PRODUCTS) {
            const catId = catMap[prod.cat];
            const supId = supplierMap[prod.supplier];

            if (!catId || !supId) {
                console.warn(`Skipping product ${prod.name}, missing cat or supplier ref.`);
                continue;
            }

            // Check existence
            const { data: existingProd } = await supabase.from('products').select('id').eq('name', prod.name).single();
            if (existingProd) continue;

            const slug = prod.name.toLowerCase().replace(/ /g, '-');

            const { data: product, error } = await supabase.from('products').insert({
                name: prod.name,
                slug: slug,
                description: prod.desc,
                short_description: prod.desc,
                category_id: catId,
                supplier_id: supId,
                unit_of_measure: prod.unit,
                price: prod.price, // Some schemas have price directly on product, mostly deprecated for variants but useful for listing
                status: 'active',
                is_featured: true
            }).select().single();

            if (error) {
                console.error("Error creating product:", prod.name, error);
                continue;
            }

            if (product) {
                // Create Default Variant
                const { data: variant } = await supabase.from('product_variants').insert({
                    product_id: product.id,
                    name: 'Default',
                    sku: `${slug.toUpperCase().substring(0, 5)}-001`,
                    stock_quantity: 100,
                    is_default: true,
                    is_active: true
                }).select().single();

                if (variant) {
                    // Pricing Tier
                    await supabase.from('pricing_tiers').insert({
                        product_variant_id: variant.id,
                        min_quantity: 1,
                        price_per_unit: prod.price,
                        currency: 'XAF',
                        is_active: true
                    });
                }

                // Image
                await supabase.from('product_images').insert({
                    product_id: product.id,
                    image_url: prod.image,
                    is_primary: true,
                    alt_text: prod.name
                });
            }
        }

        toast.success("Database seeding completed!");
        console.log("Seeding complete.");
    } catch (e) {
        console.error("Seeding failed", e);
        toast.error("Seeding failed");
    }
}

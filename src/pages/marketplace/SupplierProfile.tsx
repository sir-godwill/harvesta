import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SupplierHeader } from '@/components/marketplace/SupplierHeader';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Star, Leaf, MapPin, Globe, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function SupplierProfile() {
  const { supplierId } = useParams();
  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (supplierId) {
      fetchSupplierData();
    }
  }, [supplierId]);

  const fetchSupplierData = async () => {
    try {
      setLoading(true);

      // Fetch Supplier Details
      const { data: supplierData, error: supplierError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', supplierId)
        .single();

      if (supplierError) throw supplierError;
      setSupplier(supplierData);

      // Fetch Supplier Products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
            *,
            product_variants (
                price:pricing_tiers(price_per_unit, currency)
            ),
            images:product_images(image_url, is_primary)
        `)
        .eq('supplier_id', supplierId)
        .eq('status', 'active');

      if (productsError) throw productsError;

      // Transform products for ProductCard
      const transformedProducts = (productsData || []).map(p => {
        const primaryImage = p.images?.find((i: any) => i.is_primary)?.image_url || p.images?.[0]?.image_url;
        const price = p.product_variants?.[0]?.price?.[0]?.price_per_unit || 0;
        const currency = p.product_variants?.[0]?.price?.[0]?.currency || 'XAF';

        return {
          id: p.id,
          name: p.name,
          price: price,
          unit: p.unit_of_measure,
          image: primaryImage,
          location: `${supplierData.city}, ${supplierData.country}`,
          minOrder: p.min_order_quantity,
          rating: 4.8, // Mock rating for now
          reviews: 12,
          supplier: {
            name: supplierData.company_name,
            verified: supplierData.verification_status === 'verified'
          }
        };
      });

      setProducts(transformedProducts);

    } catch (error) {
      console.error('Error fetching supplier:', error);
      toast.error('Failed to load supplier profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-2">Supplier Not Found</h2>
          <p className="text-muted-foreground">The supplier you are looking for does not exist.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Transform supplier data for Header
  const supplierHeaderData = {
    id: supplier.id,
    name: supplier.company_name,
    banner: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=400&fit=crop', // Default banner
    logo: supplier.logo_url || 'https://via.placeholder.com/100',
    rating: 4.8,
    reviews: 124,
    location: `${supplier.city}, ${supplier.country}`,
    verified: supplier.verification_status === 'verified',
    joinedDate: new Date(supplier.created_at).toLocaleDateString(),
    responseRate: 98,
    tags: ['Organic', 'Fair Trade', 'Verified'] // Mock tags
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <SupplierHeader
          supplier={supplierHeaderData}
          isFollowing={isFollowing}
          onFollow={() => setIsFollowing(!isFollowing)}
          onContact={() => { }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-card rounded-xl p-6 border">
                    <h2 className="text-xl font-semibold mb-4">About {supplier.company_name}</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap">{supplier.description || 'No description provided.'}</p>
                  </div>

                  <div className="bg-card rounded-xl p-6 border">
                    <h3 className="font-semibold mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      {supplier.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-5 h-5 text-muted-foreground" />
                          <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {supplier.website}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <span>{supplier.address}, {supplier.city}, {supplier.country}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-card rounded-xl p-6 border">
                    <h3 className="font-semibold mb-4">Quick Stats</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Joined</span><span className="font-medium">{new Date(supplier.created_at).toLocaleDateString()}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Total Sales</span><span className="font-medium">--</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="products">
              {products.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-xl">
                  <p className="text-muted-foreground">No active products.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map(product => (<ProductCard key={product.id} product={product} />))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <div className="text-center py-12 bg-muted/20 rounded-xl">
                <p className="text-muted-foreground">Reviews coming soon.</p>
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
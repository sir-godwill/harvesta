import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    MapPin,
    Phone,
    Mail,
    Globe,
    Star,
    Package,
    Award,
    MessageSquare,
    ExternalLink,
    Loader2,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function PublicSellerPage() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [seller, setSeller] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalProducts: 0, rating: 0, reviews: 0 });

    useEffect(() => {
        if (id) {
            loadSellerData();
        }
    }, [id]);

    const loadSellerData = async () => {
        try {
            // Fetch seller info
            const { data: sellerData, error: sellerError } = await supabase
                .from('suppliers')
                .select('*')
                .eq('id', id)
                .single();

            if (sellerError) throw sellerError;
            setSeller(sellerData);

            // Fetch seller's products
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*, product_images(image_url)')
                .eq('supplier_id', id)
                .eq('status', 'active')
                .limit(12);

            if (productsError) throw productsError;
            setProducts(productsData || []);

            // Calculate stats
            setStats({
                totalProducts: productsData?.length || 0,
                rating: 4.8, // Mock data - replace with real ratings
                reviews: 127, // Mock data - replace with real reviews
            });
        } catch (error) {
            console.error('Error loading seller data:', error);
            toast.error('Failed to load seller information');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!seller) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-2">Seller Not Found</h1>
                <p className="text-muted-foreground mb-4">The seller you're looking for doesn't exist.</p>
                <Button asChild>
                    <Link to="/">Go Home</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Logo */}
                        <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white shadow-lg flex-shrink-0">
                            <img
                                src={seller.logo || '/placeholder-logo.png'}
                                alt={seller.company_name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-2xl sm:text-3xl font-bold">{seller.company_name}</h1>
                                {seller.verification_status === 'verified' && (
                                    <VerificationBadge verified={true} size="lg" />
                                )}
                            </div>

                            <p className="text-muted-foreground mb-4 max-w-2xl">
                                {seller.description || 'Quality agricultural products supplier'}
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm">
                                {seller.city && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{seller.city}, {seller.country}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-medium">{stats.rating}</span>
                                    <span className="text-muted-foreground">({stats.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                    <span>{stats.totalProducts} Products</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                            <Button size="lg" className="gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Contact Seller
                            </Button>
                            <Button size="lg" variant="outline" className="gap-2">
                                <Award className="h-4 w-4" />
                                Request Quote
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Products */}
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="products" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="products">Products</TabsTrigger>
                                <TabsTrigger value="about">About</TabsTrigger>
                            </TabsList>

                            <TabsContent value="products" className="mt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {products.map((product) => (
                                        <Link
                                            key={product.id}
                                            to={`/product/${product.id}`}
                                            className="group"
                                        >
                                            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                                <div className="aspect-square overflow-hidden bg-muted">
                                                    <img
                                                        src={product.product_images?.[0]?.image_url || '/placeholder-product.png'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                </div>
                                                <CardContent className="p-4">
                                                    <h3 className="font-semibold line-clamp-2 mb-2">{product.name}</h3>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">{product.category}</span>
                                                        <Badge variant="secondary">In Stock</Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>

                                {products.length === 0 && (
                                    <div className="text-center py-12">
                                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">No products available</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="about" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>About {seller.company_name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-muted-foreground">
                                            {seller.description || 'No description available.'}
                                        </p>

                                        {seller.certifications && (
                                            <>
                                                <Separator />
                                                <div>
                                                    <h3 className="font-semibold mb-2">Certifications</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Badge variant="outline">Organic Certified</Badge>
                                                        <Badge variant="outline">Fair Trade</Badge>
                                                        <Badge variant="outline">ISO 9001</Badge>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Column - Contact Info */}
                    <div className="space-y-6">
                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {seller.email && (
                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Email</p>
                                            <a href={`mailto:${seller.email}`} className="text-sm text-primary hover:underline">
                                                {seller.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {seller.phone && (
                                    <div className="flex items-start gap-3">
                                        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Phone</p>
                                            <a href={`tel:${seller.phone}`} className="text-sm text-primary hover:underline">
                                                {seller.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {seller.website && (
                                    <div className="flex items-start gap-3">
                                        <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Website</p>
                                            <a
                                                href={seller.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:underline flex items-center gap-1"
                                            >
                                                Visit Website
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {seller.address && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Address</p>
                                            <p className="text-sm text-muted-foreground">
                                                {seller.address}
                                                {seller.city && `, ${seller.city}`}
                                                {seller.country && `, ${seller.country}`}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Business Hours */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Business Hours</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Monday - Friday</span>
                                    <span className="font-medium">8:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Saturday</span>
                                    <span className="font-medium">9:00 AM - 2:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Sunday</span>
                                    <span className="font-medium">Closed</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Media */}
                        {(seller.facebook || seller.twitter || seller.instagram) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Follow Us</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2">
                                        {seller.facebook && (
                                            <Button variant="outline" size="icon" asChild>
                                                <a href={seller.facebook} target="_blank" rel="noopener noreferrer">
                                                    <Facebook className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        )}
                                        {seller.twitter && (
                                            <Button variant="outline" size="icon" asChild>
                                                <a href={seller.twitter} target="_blank" rel="noopener noreferrer">
                                                    <Twitter className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        )}
                                        {seller.instagram && (
                                            <Button variant="outline" size="icon" asChild>
                                                <a href={seller.instagram} target="_blank" rel="noopener noreferrer">
                                                    <Instagram className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

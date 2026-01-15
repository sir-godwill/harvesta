import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HorizontalScrollCard } from './HorizontalScrollCard';
import { supabase } from '@/integrations/supabase/client';

export function TrendingProductsCarousel() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrendingProducts();
    }, []);

    const loadTrendingProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, supplier:suppliers(*), product_images(*)')
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error loading trending products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Trending Products
                </h3>
                <div className="flex gap-4 overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i} className="min-w-[200px] animate-pulse">
                            <CardContent className="p-0">
                                <div className="aspect-square bg-muted" />
                                <div className="p-3 space-y-2">
                                    <div className="h-4 bg-muted rounded" />
                                    <div className="h-3 bg-muted rounded w-2/3" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Trending Products
                </h3>
                <Link to="/products" className="text-sm text-primary hover:underline">
                    View All
                </Link>
            </div>

            <HorizontalScrollCard autoScrollInterval={3500}>
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link to={`/product/${product.id}`}>
                            <Card className="min-w-[200px] hover:shadow-lg transition-all cursor-pointer group">
                                <CardContent className="p-0">
                                    <div className="aspect-square overflow-hidden bg-muted relative">
                                        <img
                                            src={product.product_images?.[0]?.image_url || '/placeholder-product.png'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <Badge className="absolute top-2 right-2 bg-primary/90">
                                            <TrendingUp className="h-3 w-3 mr-1" />
                                            Hot
                                        </Badge>
                                    </div>

                                    <div className="p-3">
                                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                                            {product.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mb-2">
                                            {product.supplier?.company_name}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-primary">
                                                {product.price ? `${product.price} XAF` : 'Contact for price'}
                                            </span>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Eye className="h-3 w-3" />
                                                <span>1.2k</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </HorizontalScrollCard>
        </div>
    );
}

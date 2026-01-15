import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HorizontalScrollCard } from './HorizontalScrollCard';

export function RecentlyViewedCarousel() {
    const [recentProducts, setRecentProducts] = useState<any[]>([]);

    useEffect(() => {
        // Load from localStorage
        const stored = localStorage.getItem('recently_viewed_products');
        if (stored) {
            try {
                const products = JSON.parse(stored);
                setRecentProducts(products.slice(0, 10));
            } catch (error) {
                console.error('Error parsing recently viewed:', error);
            }
        }
    }, []);

    if (recentProducts.length === 0) {
        return null; // Don't show if no history
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recently Viewed
                </h3>
                <button
                    onClick={() => {
                        localStorage.removeItem('recently_viewed_products');
                        setRecentProducts([]);
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    Clear History
                </button>
            </div>

            <HorizontalScrollCard autoScrollInterval={3500}>
                {recentProducts.map((product, index) => (
                    <motion.div
                        key={product.id || index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link to={`/product/${product.id}`}>
                            <Card className="min-w-[180px] hover:shadow-lg transition-all cursor-pointer group">
                                <CardContent className="p-0">
                                    <div className="aspect-square overflow-hidden bg-muted relative">
                                        <img
                                            src={product.image || '/placeholder-product.png'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <Badge className="absolute top-2 left-2 bg-background/80 text-foreground" variant="outline">
                                            Viewed
                                        </Badge>
                                    </div>

                                    <div className="p-3">
                                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                                            {product.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            {product.supplier || 'Seller'}
                                        </p>
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

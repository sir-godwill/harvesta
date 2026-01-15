import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { HorizontalScrollCard } from './HorizontalScrollCard';
import { supabase } from '@/integrations/supabase/client';

export function SellerCarousel() {
    const [sellers, setSellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSellers();
    }, []);

    const loadSellers = async () => {
        try {
            const { data, error } = await supabase
                .from('suppliers')
                .select('*')
                .eq('verification_status', 'verified')
                .order('rating', { ascending: false })
                .limit(10);

            if (error) throw error;
            setSellers(data || []);
        } catch (error) {
            console.error('Error loading sellers:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Top Verified Sellers</h3>
                <div className="flex gap-4 overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i} className="min-w-[280px] animate-pulse">
                            <CardContent className="p-4">
                                <div className="h-32 bg-muted rounded" />
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
                <h3 className="text-lg font-semibold">Top Verified Sellers</h3>
                <Link to="/sellers" className="text-sm text-primary hover:underline">
                    View All
                </Link>
            </div>

            <HorizontalScrollCard autoScrollInterval={4000}>
                {sellers.map((seller, index) => (
                    <motion.div
                        key={seller.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link to={`/supplier/${seller.id}`}>
                            <Card className="min-w-[280px] hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3 mb-3">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={seller.logo} />
                                            <AvatarFallback className="text-lg">
                                                {seller.company_name?.charAt(0) || 'S'}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1 mb-1">
                                                <h4 className="font-semibold truncate">{seller.company_name}</h4>
                                                <VerificationBadge verified={true} size="sm" showTooltip={false} />
                                            </div>

                                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                                                <MapPin className="h-3 w-3" />
                                                <span className="truncate">{seller.city || seller.country}</span>
                                            </div>

                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                    <span className="font-medium">4.8</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Package className="h-3 w-3" />
                                                    <span>50+ products</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {seller.description || 'Quality agricultural products supplier'}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </HorizontalScrollCard>
        </div>
    );
}

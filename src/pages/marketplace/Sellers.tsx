import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Star,
  CheckCircle2,
  Package,
  MessageCircle,
  ChevronRight,
  Building2,
  Globe,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Seller {
  id: string;
  company_name: string;
  logo_url: string | null;
  description: string | null;
  city: string | null;
  country: string;
  rating: number | null;
  total_products: number | null;
  total_orders: number | null;
  verification_status: string;
  is_featured: boolean | null;
  response_rate: number | null;
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error fetching sellers:', error);
    } else {
      setSellers(data || []);
    }
    setLoading(false);
  };

  const filteredSellers = sellers
    .filter(seller => {
      const matchesSearch = seller.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = filterCountry === 'all' || seller.country === filterCountry;
      return matchesSearch && matchesCountry;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'products') return (b.total_products || 0) - (a.total_products || 0);
      if (sortBy === 'orders') return (b.total_orders || 0) - (a.total_orders || 0);
      return 0;
    });

  const countries = [...new Set(sellers.map(s => s.country))];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Verified Sellers
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover trusted suppliers from across Africa
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search sellers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="products">Most Products</SelectItem>
                  <SelectItem value="orders">Most Orders</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sellers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No sellers found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSellers.map((seller, index) => (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/supplier/${seller.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-4 sm:p-6">
                      {/* Header */}
                      <div className="flex items-start gap-3 sm:gap-4 mb-4">
                        <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
                          <AvatarImage src={seller.logo_url || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                            {seller.company_name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
                              {seller.company_name}
                            </h3>
                            {seller.is_featured && (
                              <Badge className="bg-amber-500 text-white text-[10px] flex-shrink-0">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{seller.city}, {seller.country}</span>
                          </div>
                          {seller.verification_status === 'verified' && (
                            <Badge variant="secondary" className="mt-1.5 text-[10px] gap-1">
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      {seller.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-4">
                          {seller.description}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 text-center mb-4">
                        <div className="bg-muted/50 rounded-lg p-2">
                          <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-sm font-semibold">{(seller.rating ?? 0).toFixed(1)}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">Rating</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-2">
                          <p className="text-sm font-semibold">{seller.total_products || 0}</p>
                          <p className="text-[10px] text-muted-foreground">Products</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-2">
                          <p className="text-sm font-semibold">{seller.total_orders || 0}</p>
                          <p className="text-[10px] text-muted-foreground">Orders</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs"
                          onClick={(e) => {
                            e.preventDefault();
                            // Handle contact
                          }}
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Contact
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 text-xs"
                        >
                          View Store
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

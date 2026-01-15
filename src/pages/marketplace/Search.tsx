import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Grid3X3, List, SlidersHorizontal, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { FilterSidebar } from '@/components/marketplace/FilterSidebar';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { SortDropdown } from '@/components/marketplace/SortDropdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { searchProducts } from '@/lib/marketplaceApi';
import type { SearchFilters } from '@/types/marketplace';

export default function Search() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Real data fetching with React Query
  const { data: searchResponse, isLoading, error } = useQuery({
    queryKey: ['products', filters, sortBy, page],
    queryFn: () => searchProducts(filters, sortBy, page, pageSize),
  });

  const products = useMemo(() => searchResponse?.data?.items || [], [searchResponse]);
  const totalItems = searchResponse?.data?.total || 0;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, query }));
    setPage(1); // Reset to first page on new search
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 py-8 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={handleSearch} className="max-w-3xl mx-auto" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <FilterSidebar filters={filters} onFiltersChange={(f) => { setFilters(f); setPage(1); }} onClearFilters={clearFilters} className="hidden lg:block w-72 shrink-0 sticky top-24 h-fit" />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold">{searchQuery ? `Results for "${searchQuery}"` : 'All Products'}</h1>
                  <p className="text-muted-foreground">{totalItems} products found</p>
                </div>
                <div className="flex items-center gap-3">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden gap-2"><SlidersHorizontal className="w-4 h-4" /> Filters</Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <FilterSidebar filters={filters} onFiltersChange={(f) => { setFilters(f); setPage(1); }} onClearFilters={clearFilters} className="border-0 h-full overflow-auto" />
                    </SheetContent>
                  </Sheet>
                  <SortDropdown value={sortBy} onChange={setSortBy} />
                  <div className="hidden sm:flex border rounded-lg">
                    <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('grid')}><Grid3X3 className="w-4 h-4" /></Button>
                    <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>

              {(filters.category || filters.grade?.length || filters.verifiedOnly) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {filters.category && (
                    <Badge variant="secondary" className="gap-1">{filters.category}<button onClick={() => setFilters(prev => ({ ...prev, category: undefined }))}>×</button></Badge>
                  )}
                  {filters.grade?.map(g => (
                    <Badge key={g} variant="secondary" className="gap-1">{g}<button onClick={() => setFilters(prev => ({ ...prev, grade: prev.grade?.filter(x => x !== g) }))}>×</button></Badge>
                  ))}
                  {filters.verifiedOnly && (
                    <Badge variant="secondary" className="gap-1">Verified Only<button onClick={() => setFilters(prev => ({ ...prev, verifiedOnly: false }))}>×</button></Badge>
                  )}
                </div>
              )}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-muted-foreground animate-pulse">Scanning the fields for you...</p>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-destructive">Error loading products. Please try again.</p>
                </div>
              ) : products.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      vendor={undefined} // Vendor is now nested in product in real data
                      onAddToCart={() => navigate('/cart')}
                      onRequestQuote={() => navigate('/rfq')}
                      onCompare={() => navigate(`/compare/${product.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
                  <Button variant="link" onClick={clearFilters} className="mt-2 text-primary">Clear all filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

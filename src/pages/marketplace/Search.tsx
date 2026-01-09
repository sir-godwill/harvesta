import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { FilterSidebar } from '@/components/marketplace/FilterSidebar';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { SortDropdown } from '@/components/marketplace/SortDropdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { mockProducts, mockVendors } from '@/lib/mockData';
import type { SearchFilters } from '@/types/marketplace';

export default function Search() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, query }));
  };

  const clearFilters = () => setFilters({});

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
            <FilterSidebar filters={filters} onFiltersChange={setFilters} onClearFilters={clearFilters} className="hidden lg:block w-72 shrink-0 sticky top-24 h-fit" />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold">{searchQuery ? `Results for "${searchQuery}"` : 'All Products'}</h1>
                  <p className="text-muted-foreground">{mockProducts.length} products found</p>
                </div>
                <div className="flex items-center gap-3">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden gap-2"><SlidersHorizontal className="w-4 h-4" /> Filters</Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <FilterSidebar filters={filters} onFiltersChange={setFilters} onClearFilters={clearFilters} className="border-0 h-full overflow-auto" />
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

              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {mockProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    vendor={mockVendors[idx % mockVendors.length]}
                    onAddToCart={() => navigate('/cart')}
                    onRequestQuote={() => navigate('/rfq')}
                    onCompare={() => navigate(`/compare/${product.id}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
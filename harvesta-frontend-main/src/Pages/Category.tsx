import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { SortDropdown } from '@/components/marketplace/SortDropdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import { mockCategories, mockProducts, mockVendors } from '@/lib/mockData';

export default function Category() {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState('relevance');
  
  const category = mockCategories.find(c => c.slug === slug) || mockCategories[0];
  const products = mockProducts.filter(p => p.category === category.name || true).slice(0, 8);

  return (
    <Layout>
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <Link to="/search" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4" /> All Categories
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{category.icon}</span>
              <h1 className="text-3xl font-bold">{category.name}</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subcategories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge variant="secondary" className="text-sm py-1.5 px-3 cursor-pointer">All</Badge>
          {category.subCategories.map(sub => (
            <Badge key={sub.id} variant="outline" className="text-sm py-1.5 px-3 cursor-pointer hover:bg-muted">
              {sub.name} ({sub.productCount})
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 border flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">{category.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{category.productCount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Products</p>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">150+</p>
              <p className="text-sm text-muted-foreground">Verified Suppliers</p>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">+12%</p>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
          </div>
        </div>

        {/* Products Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Products in {category.name}</h2>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              vendor={mockVendors[idx % mockVendors.length]}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}

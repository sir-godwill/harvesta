import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShoppingCart, 
  Package, 
  Truck, 
  Shield, 
  Star,
  TrendingUp,
  Users,
  Globe
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { TrustBadge, VendorRating } from '@/components/marketplace/TrustBadge';
import { mockProducts, mockVendors } from '@/lib/mockData';

export default function IndexPage() {
  const featuredProducts = mockProducts.slice(0, 4);
  const topVendors = mockVendors;

  const stats = [
    { icon: Users, value: '50,000+', label: 'Active Buyers' },
    { icon: Package, value: '10,000+', label: 'Products Listed' },
    { icon: Globe, value: '25+', label: 'African Countries' },
    { icon: TrendingUp, value: '$2M+', label: 'Monthly Trade Volume' },
  ];

  const categories = [
    { name: 'Coffee & Tea', icon: '☕', count: 1240 },
    { name: 'Fruits', icon: '🍎', count: 2350 },
    { name: 'Vegetables', icon: '🥬', count: 1890 },
    { name: 'Grains & Cereals', icon: '🌾', count: 980 },
    { name: 'Cocoa', icon: '🍫', count: 560 },
    { name: 'Spices & Herbs', icon: '🌿', count: 780 },
    { name: 'Nuts & Seeds', icon: '🥜', count: 450 },
    { name: 'Oils & Butters', icon: '🫒', count: 320 },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span>🌍</span>
              Africa's Premier Agro-Commerce Marketplace
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Source Quality{' '}
              <span className="text-primary">Agricultural Products</span>{' '}
              at Scale
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with verified suppliers across Africa. Buy in bulk, negotiate prices, 
              and build lasting trade relationships with Harvestá.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cart">
                <Button size="lg" className="btn-checkout gap-2 w-full sm:w-auto">
                  <ShoppingCart className="w-5 h-5" />
                  View Demo Cart
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="btn-secondary-action w-full sm:w-auto">
                Become a Supplier
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <TrustBadge type="verified" size="md" />
              <TrustBadge type="quality" size="md" />
              <div className="trust-badge px-3 py-1.5 text-sm bg-primary/10 text-primary">
                <Truck className="w-4 h-4" />
                Pan-African Delivery
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Browse Categories</h2>
              <p className="text-muted-foreground mt-1">Find products across all agricultural sectors</p>
            </div>
            <Button variant="ghost" className="gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                className="flex flex-col items-center p-4 bg-card rounded-xl border hover:border-primary hover:shadow-lg transition-all group"
              >
                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {category.icon}
                </span>
                <span className="font-medium text-sm text-center">{category.name}</span>
                <span className="text-xs text-muted-foreground">{category.count} products</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground mt-1">Quality products from verified suppliers</p>
            </div>
            <Button variant="ghost" className="gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-card rounded-xl border overflow-hidden card-hover group"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded">
                      {product.grade}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                  <h3 className="font-semibold line-clamp-2 mb-2">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">📍 {product.origin}</p>
                  
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-primary">
                      ${product.currentPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">/{product.unit}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground mb-3">
                    MOQ: <span className="font-medium text-foreground">{product.moq} {product.unit}</span>
                  </div>

                  <Button className="w-full" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Vendors */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Top Verified Suppliers</h2>
              <p className="text-muted-foreground mt-1">Trusted partners with proven track records</p>
            </div>
            <Button variant="ghost" className="gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {topVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-card rounded-xl border p-6 card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-2xl font-bold text-primary">
                      {vendor.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground">📍 {vendor.location}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <VendorRating rating={vendor.rating} totalSales={vendor.totalSales} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {vendor.isVerified && <TrustBadge type="verified" />}
                  {vendor.isQualityChecked && <TrustBadge type="quality" />}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Store
                  </Button>
                  <Button size="sm" className="flex-1">
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of businesses sourcing quality agricultural products across Africa.
            Start your journey with Harvestá today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cart">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2">
                <ShoppingCart className="w-5 h-5" />
                Explore Demo
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Register as Buyer
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

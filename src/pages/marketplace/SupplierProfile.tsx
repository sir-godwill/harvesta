import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SupplierHeader } from '@/components/marketplace/SupplierHeader';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Star, Leaf } from 'lucide-react';
import { mockSupplierProfile, mockProducts, mockReviews } from '@/lib/mockData';

export default function SupplierProfile() {
  const { supplierId } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const supplier = mockSupplierProfile;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <SupplierHeader supplier={supplier} isFollowing={isFollowing} onFollow={() => setIsFollowing(!isFollowing)} onContact={() => {}} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-card rounded-xl p-6 border">
                    <h2 className="text-xl font-semibold mb-4">About {supplier.name}</h2>
                    <p className="text-muted-foreground">{supplier.description}</p>
                  </div>
                  <div className="bg-card rounded-xl p-6 border">
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><Leaf className="w-5 h-5 text-secondary" /> Production Methods</h3>
                    <div className="flex flex-wrap gap-2">
                      {supplier.productionMethods.map(method => (<Badge key={method} variant="secondary">{method}</Badge>))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-card rounded-xl p-6 border">
                    <h3 className="font-semibold mb-4">Quick Stats</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Years in Operation</span><span className="font-medium">{supplier.yearsInOperation} years</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Annual Capacity</span><span className="font-medium">{supplier.capacity}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Total Sales</span><span className="font-medium">{supplier.totalSales.toLocaleString()}</span></div>
                    </div>
                  </div>
                  <div className="bg-card rounded-xl p-6 border">
                    <h3 className="font-semibold mb-4">Certifications</h3>
                    <div className="space-y-3">
                      {supplier.certifications.map(cert => (
                        <div key={cert.id} className="flex items-center gap-3">
                          <span className="text-xl">{cert.icon}</span>
                          <div><p className="font-medium text-sm">{cert.name}</p><p className="text-xs text-muted-foreground">{cert.issuedBy}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="products">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockProducts.slice(0, 6).map(product => (<ProductCard key={product.id} product={product} />))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              {mockReviews.map(review => (
                <div key={review.id} className="bg-card rounded-xl p-6 border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-medium">{review.buyerName.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{review.buyerName}</span>
                        <div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted'}`} />))}</div>
                      </div>
                      {review.productName && <p className="text-sm text-muted-foreground mb-2">Purchased: {review.productName}</p>}
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="gallery">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {supplier.gallery.map(item => (
                  <div key={item.id} className="aspect-video rounded-xl overflow-hidden bg-muted">
                    <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
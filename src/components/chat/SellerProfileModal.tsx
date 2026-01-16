import { useState, useEffect } from 'react';
import { X, Star, MapPin, Clock, Shield, BadgeCheck, Store, Flag, Phone, Video, MessageSquare, ChevronRight, ExternalLink, Share2, Mail, Globe, Award, TrendingUp, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { fetchSupplierProfile, fetchSupplierProducts } from '@/lib/marketplaceApi';
import { SupplierProfile, Product } from '@/types/marketplace';
import { useToast } from '@/hooks/use-toast';

// Local interface matching the component's expectations
interface SellerProfile {
  id: string;
  name: string;
  companyName: string;
  location: string;
  country: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  reliabilityScore: number;
  yearsActive: number;
  responseTime: string;
  certifications: string[];
  products: {
    id: string;
    image: string;
    name: string;
    price: number;
    currency: string;
    unit: string;
  }[];
}

interface SellerProfileModalProps {
  sellerId: string;
  isOpen: boolean;
  onClose: () => void;
  onMessage?: () => void;
  isBuyer?: boolean;
}

export function SellerProfileModal({ sellerId, isOpen, onClose, onMessage, isBuyer = true }: SellerProfileModalProps) {
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'products' | 'reviews'>('about');
  const { toast } = useToast();

  useEffect(() => {
    async function loadProfile() {
      if (!isOpen || !sellerId) return;

      setLoading(true);
      try {
        const [profileRes, productsRes] = await Promise.all([
          fetchSupplierProfile(sellerId),
          // Fetch first page of products
          fetchSupplierProducts(sellerId, 1)
        ]);

        if (profileRes.success && profileRes.data) {
          const p = profileRes.data;
          const products = productsRes.success && productsRes.data ? productsRes.data.items : [];

          // Transform to SellerProfile shape
          const mappedProfile: SellerProfile = {
            id: p.id,
            name: p.name, // Suppliers name is company name usually
            companyName: p.name,
            location: p.location,
            country: p.location.split(',').pop()?.trim() || 'Unknown',
            isVerified: p.isVerified,
            rating: p.rating,
            reviewCount: 10, // Mock or fetch actual count if available in profile
            reliabilityScore: 95, // Mock
            yearsActive: p.yearsInOperation || 1,
            responseTime: p.responseTime || '24h',
            certifications: p.certifications || [],
            products: products.map(prod => ({
              id: prod.id,
              name: prod.name,
              image: prod.image,
              price: prod.currentPrice || 0,
              currency: 'XAF', // Default
              unit: prod.unit
            }))
          };
          setProfile(mappedProfile);
        } else {
          console.error("Failed to fetch profile");
          setProfile(null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [isOpen, sellerId]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center md:p-4">
        <div className={cn("bg-background w-full max-h-[95vh] md:max-w-lg md:rounded-2xl overflow-hidden rounded-t-3xl md:rounded-2xl shadow-2xl")}>
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground text-sm">Loading profile...</p>
            </div>
          ) : profile ? (
            <>
              <div className="relative bg-gradient-to-br from-green-600 via-green-600 to-green-500 h-32">
                <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full z-10" onClick={onClose}><X className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="absolute top-4 left-4 text-white hover:bg-white/20 rounded-full z-10" onClick={() => toast({ title: "Link Copied" })}><Share2 className="w-5 h-5" /></Button>
              </div>
              <div className="relative px-5 pb-5">
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center text-white text-5xl font-bold border-4 border-background shadow-xl">{profile.name.charAt(0)}</div>
                  {profile.isVerified && <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center border-2 border-background shadow-lg"><BadgeCheck className="w-5 h-5 text-white" /></div>}
                </div>
                <div className="pt-20 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
                    {profile.isVerified && <Badge className="bg-green-100 text-green-700 text-xs">Verified</Badge>}
                  </div>
                  {profile.companyName && <p className="text-muted-foreground font-medium mt-0.5">{profile.companyName}</p>}
                  <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mt-2"><MapPin className="w-4 h-4 text-orange-500" /><span>{profile.location}, {profile.country}</span></div>
                </div>
                <div className="flex gap-3 mt-5 justify-center">
                  <Button className="flex-1 max-w-[120px] gap-2 bg-orange-500 hover:bg-orange-600 rounded-xl h-11 shadow-md" onClick={() => { onMessage?.(); onClose(); }}><MessageSquare className="w-4 h-4" />Message</Button>
                  <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2 hover:border-green-600 hover:text-green-600"><Phone className="w-5 h-5" /></Button>
                  <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2 hover:border-green-600 hover:text-green-600"><Store className="w-5 h-5" /></Button>
                </div>
              </div>
              <div className="flex border-b border-border px-5">
                {['about', 'products', 'reviews'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab as any)} className={cn("flex-1 py-3 text-sm font-medium transition-colors relative", activeTab === tab ? "text-orange-500" : "text-muted-foreground hover:text-foreground")}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />}
                  </button>
                ))}
              </div>
              <ScrollArea className="h-[40vh]">
                <div className="p-5 space-y-5">
                  {activeTab === 'about' && (
                    <>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-accent rounded-xl p-3 text-center"><div className="flex items-center justify-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span className="font-bold text-foreground">{profile.rating}</span></div><p className="text-[10px] text-muted-foreground mt-0.5">{profile.reviewCount} reviews</p></div>
                        <div className="bg-accent rounded-xl p-3 text-center"><p className="font-bold text-foreground">{profile.reliabilityScore}%</p><p className="text-[10px] text-muted-foreground mt-0.5">Reliability</p></div>
                        <div className="bg-accent rounded-xl p-3 text-center"><p className="font-bold text-foreground">{profile.yearsActive}</p><p className="text-[10px] text-muted-foreground mt-0.5">Years Active</p></div>
                        <div className="bg-accent rounded-xl p-3 text-center"><TrendingUp className="w-4 h-4 mx-auto text-green-600" /><p className="text-[10px] text-muted-foreground mt-0.5">Top Seller</p></div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100"><div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"><Clock className="w-6 h-6 text-green-600" /></div><div className="flex-1"><p className="font-medium text-foreground">Response Time</p><p className="text-sm text-muted-foreground">{profile.responseTime}</p></div><Badge variant="secondary" className="bg-green-100 text-green-700">Fast</Badge></div>
                      {profile.certifications.length > 0 && <div><h3 className="font-semibold mb-3 flex items-center gap-2 text-sm"><Award className="w-4 h-4 text-orange-500" />Certifications</h3><div className="flex flex-wrap gap-2">{profile.certifications.map((cert, i) => <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs py-1.5 px-3"><Shield className="w-3 h-3 mr-1" />{cert}</Badge>)}</div></div>}
                    </>
                  )}
                  {activeTab === 'products' && (
                    <div className="grid grid-cols-2 gap-3">{profile.products.map(product => <div key={product.id} className="rounded-xl overflow-hidden bg-accent border border-border hover:border-green-500/30 transition-colors cursor-pointer group"><div className="aspect-square overflow-hidden bg-muted"><img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div><div className="p-3"><p className="font-medium text-sm line-clamp-1">{product.name}</p><p className="text-orange-500 font-bold text-sm mt-1">{product.currency} {product.price.toLocaleString()}/{product.unit}</p></div></div>)}</div>
                  )}
                  {activeTab === 'reviews' && <div className="text-center py-10 text-muted-foreground"><Star className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" /><p className="font-medium">Reviews coming soon</p></div>}
                </div>
              </ScrollArea>
            </>
          ) : <div className="h-96 flex flex-col items-center justify-center text-muted-foreground gap-2"><Shield className="w-12 h-12 text-muted-foreground/30" /><p className="font-medium">Profile not found</p></div>}
        </div>
      </div>
    </>
  );
}

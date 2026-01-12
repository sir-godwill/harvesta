import { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  BadgeCheck, 
  Store, 
  Flag,
  Phone,
  Video,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Share2,
  Copy,
  Mail,
  Globe,
  Award,
  TrendingUp,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { fetchSellerProfile, SellerProfile } from '@/lib/chat-api';
import { useToast } from '@/hooks/use-toast';

interface SellerProfileModalProps {
  sellerId: string;
  isOpen: boolean;
  onClose: () => void;
  onMessage?: () => void;
  isBuyer?: boolean;
}

export function SellerProfileModal({ 
  sellerId, 
  isOpen, 
  onClose, 
  onMessage,
  isBuyer = true 
}: SellerProfileModalProps) {
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'products' | 'reviews'>('about');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && sellerId) {
      setLoading(true);
      fetchSellerProfile(sellerId).then(data => {
        setProfile(data);
        setLoading(false);
      });
    }
  }, [isOpen, sellerId]);

  if (!isOpen) return null;

  const handleShare = () => {
    toast({
      title: "Link Copied",
      description: "Profile link copied to clipboard",
    });
  };

  const handleReport = () => {
    toast({
      title: "Report Submitted",
      description: "Thank you for your report. We'll review it shortly.",
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center md:p-4">
        <div className={cn(
          "bg-background w-full max-h-[95vh] md:max-w-lg md:rounded-2xl overflow-hidden",
          "rounded-t-3xl md:rounded-2xl",
          "animate-slide-up md:animate-scale-in shadow-2xl"
        )}>
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground text-sm">Loading profile...</p>
            </div>
          ) : profile ? (
            <>
              {/* Header with gradient */}
              <div className="relative bg-gradient-to-br from-primary via-primary to-primary/80 h-32">
                {/* Close button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full z-10"
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </Button>
                
                {/* Share button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 left-4 text-white hover:bg-white/20 rounded-full z-10"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
                
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E")`,
                  }} />
                </div>
              </div>

              {/* Profile Info */}
              <div className="relative px-5 pb-5">
                {/* Avatar */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center text-white text-5xl font-bold border-4 border-background shadow-xl">
                    {profile.name.charAt(0)}
                  </div>
                  {profile.isVerified && (
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background shadow-lg">
                      <BadgeCheck className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Name & Info */}
                <div className="pt-20 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
                    {profile.isVerified && (
                      <Badge className="bg-primary/10 text-primary text-xs">Verified</Badge>
                    )}
                  </div>
                  {profile.companyName && (
                    <p className="text-muted-foreground font-medium mt-0.5">{profile.companyName}</p>
                  )}
                  <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mt-2">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span>{profile.location}, {profile.country}</span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex gap-3 mt-5 justify-center">
                  <Button 
                    className="flex-1 max-w-[120px] gap-2 bg-secondary hover:bg-secondary/90 rounded-xl h-11 shadow-md" 
                    onClick={() => {
                      onMessage?.();
                      onClose();
                    }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </Button>
                  <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2 hover:border-primary hover:text-primary">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2 hover:border-primary hover:text-primary">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2 hover:border-primary hover:text-primary">
                    <Store className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border px-5">
                {['about', 'products', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={cn(
                      "flex-1 py-3 text-sm font-medium transition-colors relative",
                      activeTab === tab 
                        ? "text-secondary" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <ScrollArea className="h-[40vh]">
                <div className="p-5 space-y-5">
                  {activeTab === 'about' && (
                    <>
                      {/* Stats Grid */}
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-accent rounded-xl p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-foreground">{profile.rating}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{profile.reviewCount} reviews</p>
                        </div>
                        <div className="bg-accent rounded-xl p-3 text-center">
                          <p className="font-bold text-foreground">{profile.reliabilityScore}%</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Reliability</p>
                        </div>
                        <div className="bg-accent rounded-xl p-3 text-center">
                          <p className="font-bold text-foreground">{profile.yearsActive}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Years Active</p>
                        </div>
                        <div className="bg-accent rounded-xl p-3 text-center">
                          <TrendingUp className="w-4 h-4 mx-auto text-primary" />
                          <p className="text-[10px] text-muted-foreground mt-0.5">Top Seller</p>
                        </div>
                      </div>

                      {/* Response Time */}
                      <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">Response Time</p>
                          <p className="text-sm text-muted-foreground">{profile.responseTime}</p>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">Fast</Badge>
                      </div>

                      {/* Certifications */}
                      {profile.certifications.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                            <Award className="w-4 h-4 text-secondary" />
                            Certifications & Badges
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {profile.certifications.map((cert, index) => (
                              <Badge 
                                key={index} 
                                variant="outline"
                                className="bg-primary/5 text-primary border-primary/20 text-xs py-1.5 px-3"
                              >
                                <Shield className="w-3 h-3 mr-1" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contact */}
                      <div>
                        <h3 className="font-semibold mb-3 text-sm">Contact Information</h3>
                        <div className="space-y-2">
                          {profile.socialLinks?.website && (
                            <Button variant="outline" className="w-full justify-start gap-3 h-11 rounded-xl">
                              <Globe className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Visit Website</span>
                              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                            </Button>
                          )}
                          <Button variant="outline" className="w-full justify-start gap-3 h-11 rounded-xl">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Send Email</span>
                            <ChevronRight className="w-3 h-3 ml-auto text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'products' && (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Package className="w-4 h-4 text-secondary" />
                          Products ({profile.products.length})
                        </h3>
                        <Button variant="ghost" size="sm" className="text-xs gap-1 text-secondary hover:text-secondary">
                          View Store <ChevronRight className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {profile.products.map(product => (
                          <div 
                            key={product.id} 
                            className="rounded-xl overflow-hidden bg-accent border border-border hover:border-primary/30 transition-colors cursor-pointer group"
                          >
                            <div className="aspect-square overflow-hidden bg-muted">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="p-3">
                              <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                              <p className="text-secondary font-bold text-sm mt-1">
                                {product.currency} {product.price.toLocaleString()}/{product.unit}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="text-center py-10 text-muted-foreground">
                      <Star className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                      <p className="font-medium">Reviews coming soon</p>
                      <p className="text-sm mt-1">This feature is being developed</p>
                    </div>
                  )}

                  {/* Report Seller (Buyers only) */}
                  {isBuyer && activeTab === 'about' && (
                    <Button 
                      variant="ghost" 
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                      onClick={handleReport}
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Report Seller
                    </Button>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Shield className="w-12 h-12 text-muted-foreground/30" />
              <p className="font-medium">Profile not found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

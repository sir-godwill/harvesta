import { ChevronRight, ShieldCheck, Truck, Globe, HeadphonesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBanner from '@/assets/hero-banner.jpg';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroBanner} 
          alt="Agricultural B2B Marketplace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 px-6 lg:px-10 py-10 lg:py-16">
        <div className="max-w-xl">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Your B2B Agricultural 
            <span className="text-primary"> Marketplace</span>
          </h1>
          <p className="text-white/90 text-lg mb-6">
            Connect directly with verified farmers and suppliers across Africa. 
            Quality products, competitive prices, secure transactions.
          </p>
          
          <div className="flex flex-wrap gap-3 mb-8">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 gap-2">
              Start Sourcing
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="secondary" className="bg-white/20 text-white border border-white/40 hover:bg-white/30">
              Become a Supplier
            </Button>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" />
              <span>Verified Suppliers</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <span>Trade Assurance</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-info" />
              <span>Global Export</span>
            </div>
            <div className="flex items-center gap-2">
              <HeadphonesIcon className="h-4 w-4 text-warning" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

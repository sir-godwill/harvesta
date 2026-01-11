import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, Leaf, Award, Package, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Slide {
  id: string;
  category: string;
  headline: string;
  subtext: string;
  primaryCta: { text: string; href: string };
  secondaryCta: { text: string; href: string };
  image: string;
  badges: { icon: React.ElementType; text: string }[];
  accent: 'primary' | 'success' | 'warning';
}

const slides: Slide[] = [
  {
    id: '1',
    category: 'Bulk Farm Produce',
    headline: 'Source Premium Agricultural Products at Scale',
    subtext: 'Connect with verified farmers across Africa. Competitive MOQ pricing, trade assurance, and nationwide delivery.',
    primaryCta: { text: 'Shop Now', href: '/products' },
    secondaryCta: { text: 'Request Quote', href: '/rfq' },
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=800&fit=crop',
    badges: [
      { icon: ShieldCheck, text: 'Verified Suppliers' },
      { icon: Truck, text: 'Nationwide Delivery' },
      { icon: Leaf, text: 'Organic Options' },
    ],
    accent: 'primary',
  },
  {
    id: '2',
    category: 'Wholesale Inputs',
    headline: 'Farm Equipment & Agricultural Supplies',
    subtext: 'Quality seeds, fertilizers, and farming equipment from trusted manufacturers. Bulk discounts available.',
    primaryCta: { text: 'View Deals', href: '/deals' },
    secondaryCta: { text: 'Contact Supplier', href: '/contact' },
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&h=800&fit=crop',
    badges: [
      { icon: Award, text: 'Gold Suppliers' },
      { icon: Package, text: 'Bulk Pricing' },
      { icon: Users, text: '24/7 Support' },
    ],
    accent: 'success',
  },
  {
    id: '3',
    category: 'Seasonal Specials',
    headline: 'Harvest Season Flash Deals',
    subtext: 'Up to 40% off on seasonal produce. Limited time offers from top-rated agricultural suppliers.',
    primaryCta: { text: 'Grab Deals', href: '/flash-deals' },
    secondaryCta: { text: 'View All', href: '/products' },
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&h=800&fit=crop',
    badges: [
      { icon: ShieldCheck, text: 'Trade Assurance' },
      { icon: Truck, text: 'Fast Shipping' },
      { icon: Award, text: 'Best Prices' },
    ],
    accent: 'warning',
  },
  {
    id: '4',
    category: 'Livestock Deals',
    headline: 'Premium Livestock & Animal Products',
    subtext: 'Source quality cattle, poultry, and animal products. Health-certified, traceable supply chain.',
    primaryCta: { text: 'Browse Livestock', href: '/livestock' },
    secondaryCta: { text: 'Request Quote', href: '/rfq' },
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=1920&h=800&fit=crop',
    badges: [
      { icon: ShieldCheck, text: 'Health Certified' },
      { icon: Leaf, text: 'Free Range' },
      { icon: Users, text: 'Direct from Farms' },
    ],
    accent: 'primary',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, currentSlide]);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slide = slides[currentSlide];

  return (
    <section 
      className="relative overflow-hidden rounded-xl bg-card"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Hero carousel"
    >
      {/* Slides Container */}
      <div className="relative h-[200px] sm:h-[280px] lg:h-[400px]">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={cn(
              "absolute inset-0 transition-all duration-500 ease-out",
              index === currentSlide 
                ? "opacity-100 translate-x-0 z-10" 
                : index < currentSlide 
                  ? "opacity-0 -translate-x-full z-0"
                  : "opacity-0 translate-x-full z-0"
            )}
          >
            {/* Background Image with Lazy Loading */}
            <img
              src={s.image}
              alt={s.headline}
              loading={index === 0 ? "eager" : "lazy"}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20" />
            
            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="px-4 sm:px-6 lg:px-10 max-w-2xl">
                {/* Category Label */}
                <div className={cn(
                  "inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3 transition-all duration-500",
                  index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                  s.accent === 'primary' && "bg-primary/20 text-primary border border-primary/30",
                  s.accent === 'success' && "bg-success/20 text-success border border-success/30",
                  s.accent === 'warning' && "bg-warning/20 text-warning border border-warning/30"
                )}
                style={{ transitionDelay: '100ms' }}
                >
                  {s.category}
                </div>
                
                {/* Headline */}
                <h2 
                  className={cn(
                    "text-lg sm:text-2xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 leading-tight transition-all duration-500",
                    index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  )}
                  style={{ transitionDelay: '200ms' }}
                >
                  {s.headline}
                </h2>
                
                {/* Subtext - Hidden on mobile */}
                <p 
                  className={cn(
                    "hidden sm:block text-white/80 text-sm sm:text-base mb-4 sm:mb-5 line-clamp-2 transition-all duration-500",
                    index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  )}
                  style={{ transitionDelay: '300ms' }}
                >
                  {s.subtext}
                </p>
                
                {/* CTAs */}
                <div 
                  className={cn(
                    "flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-6 transition-all duration-500",
                    index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  )}
                  style={{ transitionDelay: '400ms' }}
                >
                  <Button 
                    size="sm" 
                    className="bg-gradient-primary hover:opacity-90 font-semibold px-4 sm:px-6 gap-1 sm:gap-2 shadow-lg text-xs sm:text-sm h-8 sm:h-10"
                  >
                    {s.primaryCta.text}
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20 font-medium text-xs sm:text-sm h-8 sm:h-10"
                  >
                    {s.secondaryCta.text}
                  </Button>
                </div>
                
                {/* Trust Badges - Hidden on mobile */}
                <div 
                  className={cn(
                    "hidden sm:flex flex-wrap gap-4 transition-all duration-500",
                    index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  )}
                  style={{ transitionDelay: '500ms' }}
                >
                  {s.badges.map((badge, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-2 text-white/70 text-sm"
                    >
                      <badge.icon className={cn(
                        "h-4 w-4",
                        s.accent === 'primary' && "text-primary",
                        s.accent === 'success' && "text-success",
                        s.accent === 'warning' && "text-warning"
                      )} />
                      <span>{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Hidden on mobile */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 items-center justify-center text-white hover:bg-white/30 transition-all duration-200 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 items-center justify-center text-white hover:bg-white/30 transition-all duration-200 group"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-1.5 sm:h-2 rounded-full transition-all duration-300",
              index === currentSlide 
                ? "w-5 sm:w-8 bg-primary" 
                : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-white/10 z-20">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </section>
  );
}

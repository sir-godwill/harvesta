import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import CategoryGrid from '@/components/home/CategoryGrid';
import QuickActions from '@/components/home/QuickActions';
import DealsSection from '@/components/home/DealsSection';
import BusinessGroups from '@/components/home/BusinessGroups';
import WelcomePanel from '@/components/home/WelcomePanel';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import TopSuppliers from '@/components/home/TopSuppliers';
import HeroBanner from '@/components/home/HeroBanner';
import HeroSlider from '@/components/home/HeroSlider';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 pb-20 lg:pb-8">
          {/* Mobile Quick Actions */}
          <div className="lg:hidden px-4 py-4 bg-card border-b border-border">
            <QuickActions />
          </div>
          
          {/* Hero Slider - Mobile (after quick actions) */}
          <div className="lg:hidden px-4 py-4">
            <HeroSlider />
          </div>
          
          {/* Main Content */}
          <div className="px-4 lg:px-6 py-4 lg:py-6">
            {/* Hero Banner - Desktop */}
            <div className="hidden lg:block mb-6">
              <HeroBanner />
            </div>
            
            {/* Hero Slider - Desktop (after hero banner) */}
            <div className="hidden lg:block mb-6">
              <HeroSlider />
            </div>
            
            {/* Desktop Layout - 3 Column Grid */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-6 mb-6">
              {/* Categories */}
              <div className="col-span-3">
                <CategoryGrid />
              </div>
              
              {/* Business Groups */}
              <div className="col-span-6">
                <BusinessGroups />
              </div>
              
              {/* Welcome Panel */}
              <div className="col-span-3">
                <WelcomePanel />
              </div>
            </div>
            
            {/* Mobile Layout */}
            <div className="lg:hidden space-y-4">
              <DealsSection />
              <CategoryGrid />
            </div>
            
            {/* Featured Products */}
            <FeaturedProducts />
            
            {/* Top Suppliers */}
            <TopSuppliers />
          </div>
        </main>
      </div>
      
      <Footer />
      <MobileNav />
    </div>
  );
}

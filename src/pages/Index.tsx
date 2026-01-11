import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileHeader from '@/components/layout/MobileHeader';
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
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <Header />
      </div>
      
      {/* Mobile Header */}
      <MobileHeader />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 w-full min-w-0 pb-16 lg:pb-8">
          {/* Mobile Quick Actions - Horizontally scrollable */}
          <div className="lg:hidden px-3 py-2 bg-card border-b border-border overflow-x-auto">
            <QuickActions />
          </div>
          
          {/* Hero Slider - Mobile */}
          <div className="lg:hidden px-3 py-2">
            <HeroSlider />
          </div>
          
          {/* Mobile Content Sections */}
          <div className="lg:hidden px-3 py-2 space-y-3">
            <DealsSection />
            <CategoryGrid />
          </div>
          
          {/* Main Content - Desktop */}
          <div className="px-3 lg:px-6 py-2 lg:py-6">
            {/* Hero Banner - Desktop */}
            <div className="hidden lg:block mb-6">
              <HeroBanner />
            </div>
            
            {/* Hero Slider - Desktop */}
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
            
            {/* Featured Products */}
            <FeaturedProducts />
            
            {/* Top Suppliers */}
            <TopSuppliers />
          </div>
        </main>
      </div>
      
      {/* Footer - Only visible on desktop */}
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}

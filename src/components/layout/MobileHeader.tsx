import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Camera, X, ChevronRight, Home, ShoppingBag, User, Heart, FileText, HelpCircle, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import harvestaLogo from '@/assets/harvesta-logo.png';

export default function MobileHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
    navigate('/');
  };

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: ShoppingBag, label: 'My Orders', href: '/orders' },
    { icon: Heart, label: 'Saved Products', href: '/saved-products' },
    { icon: FileText, label: 'Request Quote', href: '/rfq' },
    { icon: HelpCircle, label: 'Help Center', href: '/help' },
    { icon: Settings, label: 'Settings', href: '/profile' },
  ];

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card shadow-sm">
        <div className="px-3 py-2.5">
          <div className="flex items-center gap-2">
            {/* Left Section: Logo (default) or Hamburger (scrolled) */}
            <div className="shrink-0 w-8 h-8 flex items-center justify-center">
              {/* Logo - Fades out when scrolled */}
              <Link 
                to="/" 
                className={cn(
                  "absolute transition-all duration-300 ease-out",
                  isScrolled ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"
                )}
              >
                <img 
                  src={harvestaLogo} 
                  alt="Harvestá" 
                  className="h-6 w-auto"
                />
              </Link>
              
              {/* Hamburger - Fades in when scrolled */}
              <button 
                onClick={() => setIsMenuOpen(true)}
                className={cn(
                  "absolute p-1 transition-all duration-300 ease-out",
                  isScrolled ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
                )}
              >
                <Menu className="h-5 w-5 text-foreground" />
              </button>
            </div>
            
            {/* Search Bar - Expands when scrolled */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className={cn(
                "flex items-center bg-muted rounded-full overflow-hidden transition-all duration-400 ease-out",
                isScrolled ? "border-2 border-success" : "border border-border"
              )}>
                {/* Rotating Placeholder Icon */}
                <div className="flex items-center pl-3">
                  <svg className="h-4 w-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="1.5"/>
                    <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <input
                  type="text"
                  placeholder="Spend & Save"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-2 py-2 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                />
                
                {/* Camera Icon Inside Search */}
                <button 
                  type="button"
                  className="p-2"
                >
                  <Camera className="h-5 w-5 text-muted-foreground" />
                </button>
                
                {/* GO Button */}
                <button 
                  type="submit" 
                  className="bg-primary text-primary-foreground px-4 py-2 text-sm font-bold rounded-full mr-0.5"
                >
                  GO
                </button>
              </div>
            </form>
            
            {/* Right Section: Profile (default) or Camera (scrolled - hidden since camera is in search) */}
            <div className="shrink-0 w-9 h-9 flex items-center justify-center">
              {/* Profile Avatar - Fades out when scrolled */}
              <Link 
                to={user ? "/dashboard" : "/login"} 
                className={cn(
                  "absolute transition-all duration-300 ease-out",
                  isScrolled ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"
                )}
              >
                <Avatar className="h-8 w-8 border-2 border-success">
                  <AvatarImage src={user ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" : undefined} />
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    {user ? 'U' : <User className="h-3 w-3" />}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="lg:hidden h-14" />

      {/* Mobile Menu Overlay */}
      <div 
        className={cn(
          "lg:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div 
        className={cn(
          "lg:hidden fixed top-0 left-0 bottom-0 w-[75vw] max-w-[280px] z-[70] bg-card shadow-2xl transition-transform duration-400 ease-out",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <img 
            src={harvestaLogo} 
            alt="Harvestá" 
            className="h-5 w-auto"
          />
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-1.5 -mr-1.5 rounded-full hover:bg-muted transition-colors active:scale-90"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* User Section */}
        <div className="p-3 border-b border-border">
          {user ? (
            <div className="flex items-center gap-3 p-2">
              <Avatar className="h-10 w-10 border-2 border-success">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" />
                <AvatarFallback className="bg-success/10 text-success text-sm">U</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground text-sm">Welcome back!</p>
                <p className="text-xs text-muted-foreground">View your account</p>
              </div>
            </div>
          ) : (
            <Link 
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 p-2.5 bg-primary/10 rounded-xl active:scale-[0.98] transition-transform"
            >
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">Sign in / Register</p>
                <p className="text-xs text-muted-foreground">Access your account</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          )}
        </div>

        {/* Menu Items */}
        <nav className="p-2">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-muted active:scale-[0.98] transition-all duration-300",
                isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
              )}
              style={{ transitionDelay: isMenuOpen ? `${(index + 1) * 40}ms` : '0ms' }}
            >
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sign Out */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 active:scale-[0.98] transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

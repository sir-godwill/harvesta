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
      <header className={cn(
        "lg:hidden fixed top-0 left-0 right-0 z-50 bg-card transition-all duration-300",
        isScrolled ? "shadow-md" : ""
      )}>
        <div className="px-4 py-3">
          {/* Default Header State */}
          <div className={cn(
            "flex items-center gap-3 transition-all duration-500 ease-out",
            isScrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
          )}>
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <img 
                src={harvestaLogo} 
                alt="Harvestá" 
                className="h-7 w-auto"
              />
            </Link>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="flex items-center bg-muted border border-border rounded-full overflow-hidden">
                <div className="flex-1 flex items-center px-3">
                  <svg className="h-4 w-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-2 py-2 text-sm bg-transparent outline-none"
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-success text-success-foreground px-4 py-2 text-sm font-medium rounded-r-full"
                >
                  Search
                </button>
              </div>
            </form>
            
            {/* Profile Avatar */}
            <Link to={user ? "/dashboard" : "/login"} className="shrink-0">
              <Avatar className="h-9 w-9 border-2 border-success">
                <AvatarImage src={user ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" : undefined} />
                <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                  {user ? 'U' : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
          
          {/* Scrolled Header State */}
          <div className={cn(
            "flex items-center gap-3 transition-all duration-500 ease-out",
            isScrolled ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
          )}>
            {/* Hamburger Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className={cn(
                "shrink-0 p-2 -ml-2 transition-all duration-300",
                isScrolled ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              )}
              style={{ transitionDelay: isScrolled ? '100ms' : '0ms' }}
            >
              <Menu className="h-6 w-6 text-foreground" />
            </button>
            
            {/* Expanded Search Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className={cn(
                "flex items-center bg-muted border-2 border-success rounded-full overflow-hidden transition-all duration-500",
                isScrolled ? "scale-100 opacity-100" : "scale-95 opacity-0"
              )}
              style={{ transitionDelay: isScrolled ? '150ms' : '0ms' }}
              >
                <div className="flex-1 flex items-center px-3">
                  <svg className="h-4 w-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="What are you looking for..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-2 py-2.5 text-sm bg-transparent outline-none"
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-success text-success-foreground px-5 py-2.5 text-sm font-medium"
                >
                  Search
                </button>
              </div>
            </form>
            
            {/* Camera Icon for Photo Search */}
            <button 
              className={cn(
                "shrink-0 p-2 -mr-2 transition-all duration-300",
                isScrolled ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
              )}
              style={{ transitionDelay: isScrolled ? '200ms' : '0ms' }}
            >
              <Camera className="h-6 w-6 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="lg:hidden h-[60px]" />

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
          "lg:hidden fixed top-0 left-0 bottom-0 w-[280px] z-[70] bg-card shadow-2xl transition-transform duration-500 ease-out",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <img 
            src={harvestaLogo} 
            alt="Harvestá" 
            className="h-6 w-auto"
          />
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* User Section */}
        <div className="p-4 border-b border-border">
          {user ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-success">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" />
                <AvatarFallback className="bg-success/10 text-success">U</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">Welcome back!</p>
                <p className="text-sm text-muted-foreground">View your account</p>
              </div>
            </div>
          ) : (
            <Link 
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 p-3 bg-success/10 rounded-xl"
            >
              <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center">
                <User className="h-5 w-5 text-success-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Sign in / Register</p>
                <p className="text-sm text-muted-foreground">Access your account</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
            </Link>
          )}
        </div>

        {/* Menu Items */}
        <nav className="p-3">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted transition-all duration-300",
                isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
              )}
              style={{ transitionDelay: isMenuOpen ? `${(index + 1) * 50}ms` : '0ms' }}
            >
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sign Out */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

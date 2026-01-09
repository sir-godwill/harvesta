import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Camera, ShoppingCart, MessageSquare, User, FileText, Sparkles, Globe, ChevronDown, LogOut } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { language, setLanguage, currency, setCurrency, t } = useApp();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      {/* Top Bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-2 bg-muted text-sm">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">Welcome to Harvestá B2B</span>
          <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
          <Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link>
        </div>
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-2">
                <Globe className="h-4 w-4" />
                {language === 'en' ? 'English' : 'Français'}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('fr')}>Français</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Currency Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-2">
                {currency}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCurrency('XAF')}>XAF (FCFA)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrency('USD')}>USD ($)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrency('EUR')}>EUR (€)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link to="/rfq" className="text-muted-foreground hover:text-primary transition-colors">Request Quote</Link>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Supplier Center</a>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="text-2xl lg:text-3xl font-bold">
            <span className="text-primary">Harvest</span>
            <span className="text-foreground">á</span>
          </div>
          <div className="hidden md:block w-6 h-1 bg-primary rounded-full" />
        </Link>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
          <div className="flex items-center bg-background border-2 border-primary rounded-full overflow-hidden">
            <div className="flex-1 flex items-center px-4">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input w-full px-3 py-2.5 text-sm"
              />
            </div>
            <Button type="submit" className="bg-gradient-primary rounded-none px-6 h-11 font-medium">
              {t('search.button')}
            </Button>
            <button type="button" className="hidden lg:flex items-center gap-2 px-4 py-2.5 border-l border-border text-primary hover:bg-primary/5 transition-colors">
              <Camera className="h-5 w-5" />
              <span className="text-sm font-medium">{t('search.image')}</span>
            </button>
          </div>
        </form>
        
        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-1">
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2 px-3 gap-1" asChild>
            <Link to="/rfq">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs">RFQ</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2 px-3 gap-1" asChild>
            <Link to="/orders">
              <FileText className="h-5 w-5" />
              <span className="text-xs">{t('nav.orders')}</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2 px-3 gap-1 relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-xs">{t('nav.cart')}</span>
              <span className="absolute top-1 right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">3</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2 px-3 gap-1">
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">{t('nav.messages')}</span>
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex-col h-auto py-2 px-3 gap-1">
                  <User className="h-5 w-5" />
                  <span className="text-xs">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/saved-products">Saved Products</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" className="flex-col h-auto py-2 px-3 gap-1" asChild>
              <Link to="/login">
                <User className="h-5 w-5" />
                <span className="text-xs">{t('nav.login')}</span>
              </Link>
            </Button>
          )}
        </div>
        
        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to={user ? "/dashboard" : "/login"}>
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Category Navigation - Desktop */}
      <nav className="hidden lg:flex items-center justify-center gap-8 px-6 py-2 border-t border-border bg-card">
        <Link to="/search" className="text-primary font-medium text-sm hover:text-primary/80 transition-colors">Find Products</Link>
        <Link to="/search?type=suppliers" className="text-foreground text-sm hover:text-primary transition-colors">Find Suppliers</Link>
        <Link to="/search?category=industrial" className="text-foreground text-sm hover:text-primary transition-colors">Industrial Supplies</Link>
        <Link to="/search?category=organic" className="text-foreground text-sm hover:text-primary transition-colors">Organic Certified</Link>
        <Link to="/buyer-protection" className="text-foreground text-sm hover:text-primary transition-colors">Trade Assurance</Link>
      </nav>
    </header>
  );
}

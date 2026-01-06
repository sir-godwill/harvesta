import { useState } from 'react';
import { Search, Camera, ShoppingCart, MessageSquare, User, FileText, Sparkles, Globe, ChevronDown } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { language, setLanguage, currency, setCurrency, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      {/* Top Bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-2 bg-muted text-sm">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">Welcome to Harvestá B2B</span>
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
          
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Supplier Center</a>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-2xl lg:text-3xl font-bold">
            <span className="text-primary">Harvest</span>
            <span className="text-foreground">á</span>
          </div>
          <div className="hidden md:block w-6 h-1 bg-primary rounded-full" />
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-3xl">
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
            <Button className="bg-gradient-primary rounded-none px-6 h-11 font-medium">
              {t('search.button')}
            </Button>
            <button className="hidden lg:flex items-center gap-2 px-4 py-2.5 border-l border-border text-primary hover:bg-primary/5 transition-colors">
              <Camera className="h-5 w-5" />
              <span className="text-sm font-medium">{t('search.image')}</span>
            </button>
          </div>
        </div>
        
        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-1">
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2 px-3 gap-1">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs">Plugin</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2 px-3 gap-1">
            <FileText className="h-5 w-5" />
            <span className="text-xs">{t('nav.orders')}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2 px-3 gap-1 relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-xs">{t('nav.cart')}</span>
            <span className="absolute top-1 right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">3</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2 px-3 gap-1">
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">{t('nav.messages')}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2 px-3 gap-1">
            <User className="h-5 w-5" />
            <span className="text-xs">{t('nav.login')}</span>
          </Button>
        </div>
        
        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-2">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Category Navigation - Desktop */}
      <nav className="hidden lg:flex items-center justify-center gap-8 px-6 py-2 border-t border-border bg-card">
        <a href="#" className="text-primary font-medium text-sm hover:text-primary/80 transition-colors">Find Products</a>
        <a href="#" className="text-foreground text-sm hover:text-primary transition-colors">Find Suppliers</a>
        <a href="#" className="text-foreground text-sm hover:text-primary transition-colors">Industrial Supplies</a>
        <a href="#" className="text-foreground text-sm hover:text-primary transition-colors">Organic Certified</a>
        <a href="#" className="text-foreground text-sm hover:text-primary transition-colors">Trade Assurance</a>
      </nav>
    </header>
  );
}

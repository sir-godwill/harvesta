import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr';
type Currency = 'XAF' | 'USD' | 'EUR';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  formatPrice: (price: number) => string;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.orders': 'Orders',
    'nav.products': 'Products',
    'nav.suppliers': 'Suppliers',
    'nav.global': 'Global',
    'nav.distribution': 'Distribution',
    'nav.messages': 'Messages',
    'nav.cart': 'Cart',
    'nav.login': 'Login',
    'search.placeholder': 'Search for agricultural products...',
    'search.button': 'Search',
    'search.image': 'Image Search',
    'categories.all': 'All Categories',
    'categories.freshProduce': 'Fresh Produce',
    'categories.grains': 'Grains & Seeds',
    'categories.dairy': 'Dairy Products',
    'categories.livestock': 'Livestock',
    'categories.equipment': 'Farm Equipment',
    'categories.organic': 'Organic Products',
    'categories.processed': 'Processed Foods',
    'categories.fertilizers': 'Fertilizers',
    'home.featuredProducts': 'Featured Products',
    'home.topSuppliers': 'Top Suppliers',
    'home.newArrivals': 'New Arrivals',
    'home.deals': 'Hot Deals',
    'product.moq': 'MOQ',
    'product.pieces': 'pieces',
    'product.contactSupplier': 'Contact Supplier',
    'product.addToCart': 'Add to Cart',
    'product.orderNow': 'Order Now',
    'product.verified': 'Verified',
    'product.goldSupplier': 'Gold Supplier',
    'supplier.yearsInBusiness': 'Years',
    'supplier.responseRate': 'Response Rate',
    'supplier.onTimeDelivery': 'On-Time Delivery',
    'welcome.title': 'Welcome to AgroMarket',
    'welcome.subtitle': 'Your B2B Agricultural Marketplace',
    'footer.about': 'About Us',
    'footer.howItWorks': 'How It Works',
    'footer.support': 'Support',
    'footer.terms': 'Terms of Service',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.orders': 'Commandes',
    'nav.products': 'Produits',
    'nav.suppliers': 'Fournisseurs',
    'nav.global': 'Global',
    'nav.distribution': 'Distribution',
    'nav.messages': 'Messages',
    'nav.cart': 'Panier',
    'nav.login': 'Connexion',
    'search.placeholder': 'Rechercher des produits agricoles...',
    'search.button': 'Rechercher',
    'search.image': 'Recherche Image',
    'categories.all': 'Toutes les Catégories',
    'categories.freshProduce': 'Produits Frais',
    'categories.grains': 'Céréales & Graines',
    'categories.dairy': 'Produits Laitiers',
    'categories.livestock': 'Bétail',
    'categories.equipment': 'Équipement Agricole',
    'categories.organic': 'Produits Bio',
    'categories.processed': 'Aliments Transformés',
    'categories.fertilizers': 'Engrais',
    'home.featuredProducts': 'Produits en Vedette',
    'home.topSuppliers': 'Meilleurs Fournisseurs',
    'home.newArrivals': 'Nouveautés',
    'home.deals': 'Offres Spéciales',
    'product.moq': 'QMC',
    'product.pieces': 'pièces',
    'product.contactSupplier': 'Contacter Fournisseur',
    'product.addToCart': 'Ajouter au Panier',
    'product.orderNow': 'Commander',
    'product.verified': 'Vérifié',
    'product.goldSupplier': 'Fournisseur Or',
    'supplier.yearsInBusiness': 'Ans',
    'supplier.responseRate': 'Taux de Réponse',
    'supplier.onTimeDelivery': 'Livraison à Temps',
    'welcome.title': 'Bienvenue sur AgroMarket',
    'welcome.subtitle': 'Votre Marché B2B Agricole',
    'footer.about': 'À Propos',
    'footer.howItWorks': 'Comment ça Marche',
    'footer.support': 'Support',
    'footer.terms': 'Conditions d\'Utilisation',
  },
};

const currencyFormats: Record<Currency, { symbol: string; position: 'before' | 'after'; locale: string }> = {
  XAF: { symbol: 'FCFA', position: 'after', locale: 'fr-CM' },
  USD: { symbol: '$', position: 'before', locale: 'en-US' },
  EUR: { symbol: '€', position: 'after', locale: 'fr-FR' },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('XAF');

  const formatPrice = (price: number): string => {
    const format = currencyFormats[currency];
    const formatted = new Intl.NumberFormat(format.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    
    return format.position === 'before' 
      ? `${format.symbol}${formatted}`
      : `${formatted} ${format.symbol}`;
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, currency, setCurrency, formatPrice, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

import { ChevronRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import ProductCard, { Product } from './ProductCard';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Organic Cocoa Beans - Fair Trade Certified',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop',
    price: 15000,
    priceMax: 25000,
    moq: 100,
    unit: 'kg',
    supplier: 'Cameroon Cocoa Exports Ltd',
    location: 'Douala',
    rating: 4.8,
    sold: 12500,
    verified: true,
    goldSupplier: true,
    discount: '-15%',
  },
  {
    id: '2',
    name: 'Fresh Arabica Coffee Beans - Premium Grade A',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    price: 8500,
    priceMax: 12000,
    moq: 50,
    unit: 'kg',
    supplier: 'Highland Coffee Farms',
    location: 'Bafoussam',
    rating: 4.9,
    sold: 8700,
    verified: true,
    goldSupplier: true,
  },
  {
    id: '3',
    name: 'Organic Palm Oil - Cold Pressed Virgin',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
    price: 3500,
    priceMax: 5000,
    moq: 200,
    unit: 'liters',
    supplier: 'Green Palm Industries',
    location: 'Kribi',
    rating: 4.6,
    sold: 15200,
    verified: true,
  },
  {
    id: '4',
    name: 'Fresh Plantain Bunches - Export Quality',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
    price: 2000,
    priceMax: 3500,
    moq: 500,
    unit: 'bunches',
    supplier: 'Tropical Fruits Co.',
    location: 'Buea',
    rating: 4.7,
    sold: 22000,
    verified: true,
    discount: 'New Seller',
  },
  {
    id: '5',
    name: 'Organic Honey - Pure & Unfiltered',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop',
    price: 5000,
    priceMax: 8000,
    moq: 20,
    unit: 'liters',
    supplier: 'Bee Harvest Cooperative',
    location: 'Bamenda',
    rating: 4.9,
    sold: 3400,
    verified: true,
    goldSupplier: true,
  },
  {
    id: '6',
    name: 'Premium Cassava Flour - Gluten Free',
    image: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?w=400&h=400&fit=crop',
    price: 1500,
    priceMax: 2500,
    moq: 1000,
    unit: 'kg',
    supplier: 'AgroProcess Industries',
    location: 'Yaoundé',
    rating: 4.5,
    sold: 45000,
    verified: true,
  },
  {
    id: '7',
    name: 'Fresh Pineapples - Sugar Loaf Variety',
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop',
    price: 800,
    priceMax: 1200,
    moq: 200,
    unit: 'pieces',
    supplier: 'Sweet Farms Ltd',
    location: 'Limbé',
    rating: 4.8,
    sold: 18500,
    verified: true,
    discount: '-20%',
  },
  {
    id: '8',
    name: 'Organic Moringa Powder - Dried Leaves',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    price: 12000,
    priceMax: 18000,
    moq: 25,
    unit: 'kg',
    supplier: 'NutriGreen Exports',
    location: 'Garoua',
    rating: 4.7,
    sold: 2100,
    verified: true,
    goldSupplier: true,
  },
];

export default function FeaturedProducts() {
  const { t } = useApp();

  return (
    <section className="py-3 sm:py-6">
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-foreground">
          {t('home.featuredProducts')}
        </h2>
        <a href="/products" className="flex items-center gap-0.5 text-primary text-xs sm:text-sm font-medium hover:underline">
          View All
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </a>
      </div>
      
      {/* Mobile 2-Column Grid */}
      <div className="grid grid-cols-2 gap-1.5 sm:hidden">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Tablet & Desktop Grid */}
      <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

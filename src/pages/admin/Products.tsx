import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

interface Product {
  id: string;
  name: string;
  seller: string;
  category: string;
  status: 'live' | 'pending' | 'draft' | 'rejected';
  price: number;
  stock: number;
  qualityGrade?: string;
  image?: string;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Organic Cocoa Beans', seller: 'Cameroon Cocoa Ltd', category: 'Cocoa', status: 'live', price: 4500, stock: 2500, qualityGrade: 'Grade A' },
  { id: '2', name: 'Premium Coffee Arabica', seller: 'Ethiopian Coffee', category: 'Coffee', status: 'live', price: 6800, stock: 1200, qualityGrade: 'Grade A' },
  { id: '3', name: 'Fresh Plantains', seller: 'Lagos Agro Export', category: 'Fruits', status: 'pending', price: 850, stock: 5000, qualityGrade: 'Grade B' },
  { id: '4', name: 'Dried Pepper Mix', seller: 'Kenya Spice', category: 'Spices', status: 'live', price: 3200, stock: 800, qualityGrade: 'Grade A' },
  { id: '5', name: 'Palm Oil 5L', seller: 'Kofi Organic Farms', category: 'Oils', status: 'draft', price: 2500, stock: 0, qualityGrade: 'Grade C' },
  { id: '6', name: 'Cassava Flour 25kg', seller: 'Nigeria Staples', category: 'Grains', status: 'live', price: 12000, stock: 350, qualityGrade: 'Grade A' },
];

function ProductCard({ product, view }: { product: Product; view: 'grid' | 'list' }) {
  const statusColors = {
    live: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    draft: 'bg-muted text-muted-foreground',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const gradeColors = {
    'Grade A': 'bg-green-600 text-white',
    'Grade B': 'bg-blue-600 text-white',
    'Grade C': 'bg-yellow-600 text-white',
  };

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);

  if (view === 'grid') {
    return (
      <motion.div variants={itemVariants} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
        <Card className="overflow-hidden group cursor-pointer">
          <div className="aspect-square bg-muted relative overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
              </div>
            )}
            <Badge className={cn('absolute top-2 left-2', statusColors[product.status])}>
              {product.status}
            </Badge>
            {product.qualityGrade && (
              <Badge className={cn('absolute top-2 right-2', gradeColors[product.qualityGrade as keyof typeof gradeColors])}>
                {product.qualityGrade}
              </Badge>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button size="sm" variant="secondary" className="mr-2">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{product.name}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{product.seller}</p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-primary">{formatPrice(product.price)}</p>
                <span className="text-xs text-muted-foreground">{product.stock} in stock</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="bg-muted px-2 py-0.5 rounded">{product.category}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden">
        <CardContent className="p-3 sm:p-4">
          <div className="flex gap-3 sm:gap-4">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.seller}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[product.status]}>{product.status}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                      <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                <span className="text-sm text-muted-foreground">• {product.stock} in stock</span>
                <span className="text-sm text-muted-foreground">• {product.category}</span>
                {product.qualityGrade && (
                  <Badge variant="outline" className="text-xs">{product.qualityGrade}</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 500);
  }, []);

  const stats = {
    total: products.length,
    live: products.filter((p) => p.status === 'live').length,
    pending: products.filter((p) => p.status === 'pending').length,
    draft: products.filter((p) => p.status === 'draft').length,
  };

  const filteredProducts = filter === 'all' ? products : products.filter((p) => p.status === filter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4 sm:space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Products & Catalog
          </h1>
          <p className="text-sm text-muted-foreground">Manage products, categories, and quality grades</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Package className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: stats.total, icon: Package, color: 'bg-primary' },
          { label: 'Live', value: stats.live, icon: CheckCircle2, color: 'bg-green-600' },
          { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'bg-yellow-500' },
          { label: 'Draft', value: stats.draft, icon: XCircle, color: 'bg-gray-500' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={cn('p-2 rounded-lg', stat.color)}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-9" />
              </div>
              <div className="flex gap-2">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full sm:w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="hidden sm:flex">
                  <Filter className="h-4 w-4" />
                </Button>
                <div className="hidden sm:flex border rounded-lg">
                  <Button
                    variant={view === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setView('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={view === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setView('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Products Grid/List */}
      <motion.div
        variants={containerVariants}
        className={cn(
          view === 'grid' || isMobile
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4'
            : 'space-y-3'
        )}
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} view={isMobile ? 'grid' : view} />
        ))}
      </motion.div>
    </motion.div>
  );
}

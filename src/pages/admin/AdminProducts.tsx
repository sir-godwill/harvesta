import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  Plus,
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
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
  short_description: string | null;
  status: string;
  is_organic: boolean | null;
  is_featured: boolean | null;
  created_at: string;
  supplier: { company_name: string } | null;
  category: { name: string } | null;
  images: { image_url: string; is_primary: boolean }[];
  variants: {
    stock_quantity: number | null;
    grade: string | null;
    pricing_tiers: { price_per_unit: number }[];
  }[];
}

function ProductCard({ product, view, onRefresh }: { product: Product; view: 'grid' | 'list'; onRefresh: () => void }) {
  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    draft: 'bg-gray-100 text-gray-700',
    inactive: 'bg-red-100 text-red-700',
  };

  const primaryImage = product.images?.find(i => i.is_primary) || product.images?.[0];
  const defaultVariant = product.variants?.[0];
  const price = defaultVariant?.pricing_tiers?.[0]?.price_per_unit || 0;
  const stock = defaultVariant?.stock_quantity || 0;
  const grade = defaultVariant?.grade || '';

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id);
    
    if (error) {
      toast.error('Failed to delete product');
    } else {
      toast.success('Product deleted');
      onRefresh();
    }
  };

  if (view === 'grid') {
    return (
      <motion.div variants={itemVariants} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
        <Card className="overflow-hidden group cursor-pointer">
          <div className="aspect-square bg-muted relative overflow-hidden">
            {primaryImage?.image_url ? (
              <img src={primaryImage.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
              </div>
            )}
            <Badge className={cn('absolute top-2 left-2', statusColors[product.status] || statusColors.draft)}>
              {product.status}
            </Badge>
            {grade && (
              <Badge className="absolute top-2 right-2 bg-blue-600 text-white">
                {grade}
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
                    <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{product.supplier?.company_name || 'Unknown Seller'}</p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-primary">{formatPrice(price)}</p>
                <span className="text-xs text-muted-foreground">{stock} in stock</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="bg-muted px-2 py-0.5 rounded">{product.category?.name || 'Uncategorized'}</span>
                {product.is_organic && <Badge variant="outline" className="text-green-600 text-[10px]">Organic</Badge>}
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
              {primaryImage?.image_url ? (
                <img src={primaryImage.image_url} alt={product.name} className="w-full h-full object-cover" />
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
                  <p className="text-sm text-muted-foreground">{product.supplier?.company_name || 'Unknown Seller'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[product.status] || statusColors.draft}>{product.status}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                      <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="font-bold text-primary">{formatPrice(price)}</span>
                <span className="text-sm text-muted-foreground">• {stock} in stock</span>
                <span className="text-sm text-muted-foreground">• {product.category?.name || 'Uncategorized'}</span>
                {grade && <Badge variant="outline" className="text-xs">{grade}</Badge>}
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        short_description,
        status,
        is_organic,
        is_featured,
        created_at,
        supplier:suppliers(company_name),
        category:categories(name),
        images:product_images(image_url, is_primary),
        variants:product_variants(
          stock_quantity,
          grade,
          pricing_tiers(price_per_unit)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === 'active').length,
    pending: products.filter((p) => p.status === 'draft').length,
    inactive: products.filter((p) => p.status === 'inactive').length,
  };

  const filteredProducts = products
    .filter(p => {
      const matchesFilter = filter === 'all' || p.status === filter;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.supplier?.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

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
        <Button className="w-full sm:w-auto" asChild>
          <Link to="/admin/products/add">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: stats.total, icon: Package, color: 'bg-primary' },
          { label: 'Active', value: stats.active, icon: CheckCircle2, color: 'bg-green-600' },
          { label: 'Draft', value: stats.pending, icon: Clock, color: 'bg-yellow-500' },
          { label: 'Inactive', value: stats.inactive, icon: XCircle, color: 'bg-gray-500' },
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
                <Input 
                  placeholder="Search products..." 
                  className="pl-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full sm:w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">Start by adding your first product</p>
          <Button asChild>
            <Link to="/admin/products/add">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          className={cn(
            view === 'grid' || isMobile
              ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4'
              : 'space-y-3'
          )}
        >
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              view={isMobile ? 'grid' : view} 
              onRefresh={fetchProducts}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/seller/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatXAF } from "@/lib/currency";
import { AddProductModal } from "@/components/products/AddProductModal";

// Extended Product type for the Products page
interface Product {
  id: string;
  name: string;
  category: string;
  origin: string;
  grade: string;
  stock: number;
  unit: string;
  price: number;
  status: 'active' | 'low_stock' | 'out_of_stock' | 'seasonal' | 'inactive';
  certifications: string[];
}

// Mock products data
const mockProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Premium Arabica Coffee Beans',
    category: 'Coffee',
    origin: 'West Region, Cameroon',
    grade: 'Premium',
    stock: 500,
    unit: 'kg',
    price: 8500,
    status: 'active',
    certifications: ['Organic', 'Fair Trade'],
  },
  {
    id: 'prod_2',
    name: 'Organic Cocoa Beans',
    category: 'Cocoa',
    origin: 'South Region, Cameroon',
    grade: 'Grade A',
    stock: 45,
    unit: 'kg',
    price: 5200,
    status: 'low_stock',
    certifications: ['Organic', 'Rainforest Alliance'],
  },
  {
    id: 'prod_3',
    name: 'Dried White Pepper',
    category: 'Spices',
    origin: 'Penja, Cameroon',
    grade: 'Export',
    stock: 0,
    unit: 'kg',
    price: 25000,
    status: 'out_of_stock',
    certifications: ['GI Protected'],
  },
  {
    id: 'prod_4',
    name: 'Fresh Plantains',
    category: 'Fruits',
    origin: 'Littoral Region',
    grade: 'Standard',
    stock: 1200,
    unit: 'bunch',
    price: 1500,
    status: 'active',
    certifications: [],
  },
  {
    id: 'prod_5',
    name: 'Honey - Pure Forest',
    category: 'Honey',
    origin: 'Adamawa Region',
    grade: 'Premium',
    stock: 150,
    unit: 'liter',
    price: 4500,
    status: 'active',
    certifications: ['Organic'],
  },
];

async function fetchSellerProducts(): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts;
}

const statusConfig = {
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  low_stock: { label: "Low Stock", className: "bg-warning/10 text-warning border-warning/20" },
  out_of_stock: { label: "Out of Stock", className: "bg-destructive/10 text-destructive border-destructive/20" },
  seasonal: { label: "Seasonal", className: "bg-primary/10 text-primary border-primary/20" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground border-muted" },
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const data = await fetchSellerProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  const handleAddProduct = async (data: any) => {
    console.log('Creating product:', data);
    // API placeholder - will be connected to Supabase
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Products & Inventory" subtitle="Manage your agricultural products and stock levels" />

      <div className="p-4 md:p-6">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 mb-6"
        >
          {/* Top Row: Search and Add */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                size="icon"
                className="md:hidden shrink-0"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
              </Button>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 flex-1 sm:flex-none"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </Button>
            </div>
          </div>

          {/* Filters Row - Always visible on desktop, toggle on mobile */}
          <div className={cn(
            "flex flex-col sm:flex-row gap-3",
            !showFilters && "hidden md:flex"
          )}>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Products Table - Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-card rounded-xl border shadow-soft overflow-hidden hidden md:block"
        >
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[300px]">Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, index) => {
                  const status = statusConfig[product.status] || statusConfig.active;
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.15 + index * 0.03 }}
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Package className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{product.name}</p>
                            <div className="flex gap-1 mt-1">
                              {product.certifications.slice(0, 2).map((cert) => (
                                <Badge key={cert} variant="outline" className="text-xs py-0 px-1.5 bg-muted">
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{product.category}</TableCell>
                      <TableCell className="text-muted-foreground">{product.origin}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted">{product.grade}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {product.status !== 'active' && (
                            <AlertTriangle className={cn(
                              "w-4 h-4",
                              product.status === 'out_of_stock' ? "text-destructive" : "text-warning"
                            )} />
                          )}
                          <span className={cn(
                            "font-medium",
                            product.status === 'out_of_stock' ? "text-destructive" :
                            product.status === 'low_stock' ? "text-warning" : "text-foreground"
                          )}>
                            {product.stock} {product.unit}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatXAF(product.price)}/{product.unit}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(status.className)}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Eye className="w-4 h-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="w-4 h-4" /> Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive">
                              <Trash2 className="w-4 h-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </motion.div>

        {/* Products Cards - Mobile */}
        <div className="md:hidden space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            filteredProducts.map((product, index) => {
              const status = statusConfig[product.status] || statusConfig.active;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.03 }}
                  className="bg-card rounded-xl border p-4 shadow-soft"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <Badge variant="outline" className={cn("shrink-0", status.className)}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {product.certifications.slice(0, 2).map((cert) => (
                          <Badge key={cert} variant="outline" className="text-xs py-0 px-1.5 bg-muted">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Stock</p>
                        <p className={cn(
                          "font-medium text-sm",
                          product.status === 'out_of_stock' ? "text-destructive" :
                          product.status === 'low_stock' ? "text-warning" : "text-foreground"
                        )}>
                          {product.stock} {product.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-semibold text-sm">{formatXAF(product.price)}/{product.unit}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="w-4 h-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="w-4 h-4" /> Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search or filters" : "Start by adding your first product"}
            </p>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </motion.div>
        )}
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleAddProduct}
      />
    </div>
  );
}

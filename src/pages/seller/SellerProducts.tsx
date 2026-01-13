import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Package,
  Eye,
  Edit,
  Trash2,
  Archive,
  Copy,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { mockSellerProducts, SellerProduct } from '@/services/seller-api';
import { Link } from 'react-router-dom';

const formatCurrency = (amount: number, currency = 'XAF') => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);
};

const getStatusBadge = (status: SellerProduct['status']) => {
  const styles: Record<SellerProduct['status'], string> = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    inactive: 'bg-yellow-100 text-yellow-800',
    out_of_stock: 'bg-red-100 text-red-800',
  };
  return styles[status];
};

export default function SellerProducts() {
  const [products] = useState(mockSellerProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === 'active').length,
    outOfStock: products.filter((p) => p.status === 'out_of_stock').length,
    draft: products.filter((p) => p.status === 'draft').length,
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700" asChild>
            <Link to="/seller/products/add">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <Package className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.outOfStock}</p>
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Package className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.draft}</p>
                  <p className="text-sm text-muted-foreground">Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200"
          >
            <span className="text-sm font-medium">{selectedProducts.length} selected</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Archive className="w-4 h-4 mr-1" />
                Archive
              </Button>
              <Button size="sm" variant="outline" className="text-red-600">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </motion.div>
        )}

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => toggleSelect(product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">MOQ: {product.minOrderQuantity} {product.unit}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{formatCurrency(product.domesticPrice)}</p>
                          {product.internationalPrice && (
                            <p className="text-xs text-muted-foreground">
                              ${product.internationalPrice} (Int'l)
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={product.stock === 0 ? 'text-red-600 font-medium' : ''}>
                          {product.stock.toLocaleString()} {product.unit}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusBadge(product.status)}>
                          {product.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.views.toLocaleString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SellerLayout>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import {
  Package,
  AlertTriangle,
  Search,
  Plus,
  Edit,
  History,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function SellerInventory() {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [restockQuantity, setRestockQuantity] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: supplier } = await supabase
        .from('suppliers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!supplier) return;

      // Fetch product variants with product details using inner join for seller filtering
      const { data, error } = await supabase
        .from('product_variants')
        .select(`
                *,
                product:products!inner (
                    name,
                    sku,
                    unit_of_measure,
                    supplier_id,
                    status
                )
            `)
        .eq('product.supplier_id', supplier.id);

      if (error) throw error;
      setInventory(data || []);

    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const productName = item.product?.name || '';
    const productSku = item.sku || item.product?.sku || '';

    const matchesSearch = productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      productSku.toLowerCase().includes(searchQuery.toLowerCase());

    // Status logic
    let status = 'healthy';
    if (item.stock_quantity <= 0) status = 'out';
    else if (item.stock_quantity <= (item.low_stock_threshold || 10)) status = 'low';

    const matchesStatus = filterStatus === 'all' || status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatus = (item: any) => {
    if (item.stock_quantity <= 0) return 'out';
    if (item.stock_quantity <= (item.low_stock_threshold || 10)) return 'low';
    return 'healthy';
  };

  const stats = {
    total: inventory.length,
    healthy: inventory.filter(i => getStatus(i) === 'healthy').length,
    low: inventory.filter(i => getStatus(i) === 'low').length,
    out: inventory.filter(i => getStatus(i) === 'out').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">In Stock</Badge>;
      case 'low':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">Low Stock</Badge>;
      case 'out':
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleRestock = async () => {
    if (!selectedVariant || !restockQuantity) return;

    try {
      const newStock = (selectedVariant.stock_quantity || 0) + parseInt(restockQuantity);

      const { error } = await supabase
        .from('product_variants')
        .update({ stock_quantity: newStock })
        .eq('id', selectedVariant.id);

      if (error) throw error;

      toast.success('Stock updated successfully');
      setShowRestockModal(false);
      setRestockQuantity('');
      setSelectedVariant(null);
      fetchInventory();

    } catch (error) {
      console.error('Restock error:', error);
      toast.error('Failed to update stock');
    }
  };

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
            <p className="text-muted-foreground">Track stock levels and set alerts</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchInventory}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Variants</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Healthy Stock</p>
                  <p className="text-2xl font-bold text-green-600">{stats.healthy}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={stats.low > 0 ? 'border-yellow-200 bg-yellow-50/30' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.low}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={stats.out > 0 ? 'border-red-200 bg-red-50/30' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">{stats.out}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="healthy">In Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base">Stock Levels</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="hidden sm:table-cell">SKU</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInventory.map((item) => {
                      const status = getStatus(item);
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{item.product?.name}</p>
                              <p className="text-xs text-muted-foreground">{item.name !== 'Default' ? item.name : ''}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{item.sku || item.product?.sku}</code>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-semibold">
                                {item.stock_quantity.toLocaleString()} {item.product?.unit_of_measure}
                              </p>
                              <Progress
                                value={Math.min((item.stock_quantity / ((item.low_stock_threshold || 10) * 3)) * 100, 100)}
                                className={`h-1.5 ${status === 'out' ? 'bg-red-200' :
                                  status === 'low' ? 'bg-yellow-200' : 'bg-green-200'
                                  }`}
                              />
                              <p className="text-xs text-muted-foreground">
                                Alert at {item.low_stock_threshold || 10} {item.product?.unit_of_measure}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedVariant(item);
                                setShowRestockModal(true);
                              }}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Restock
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Restock Modal */}
        <Dialog open={showRestockModal} onOpenChange={setShowRestockModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Stock</DialogTitle>
            </DialogHeader>
            {selectedVariant && (
              <div className="space-y-4 py-4">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="font-medium">{selectedVariant.product?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Current stock: {selectedVariant.stock_quantity} {selectedVariant.product?.unit_of_measure}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Quantity to Add ({selectedVariant.product?.unit_of_measure})</Label>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(e.target.value)}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRestockModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleRestock} disabled={!restockQuantity}>
                <Plus className="w-4 h-4 mr-2" />
                Update Stock
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SellerLayout>
  );
}

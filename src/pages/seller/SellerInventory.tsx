import { useState } from 'react';
import { motion } from 'framer-motion';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  TrendingDown,
  TrendingUp,
  Search,
  Plus,
  Edit,
  History,
  BarChart3,
  Download,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

// Mock inventory data
const mockInventory = [
  { id: '1', name: 'Premium Arabica Coffee Beans', sku: 'COF-ARB-001', variant: 'Grade A', stock: 2500, unit: 'kg', lowThreshold: 500, status: 'healthy', lastUpdated: '2026-01-13', batchNumber: 'CAM-2026-001' },
  { id: '2', name: 'Organic Cocoa Beans', sku: 'COC-ORG-001', variant: 'Export Quality', stock: 150, unit: 'kg', lowThreshold: 200, status: 'low', lastUpdated: '2026-01-12', batchNumber: 'CAM-2026-015' },
  { id: '3', name: 'Fresh Plantains', sku: 'PLT-FRE-001', variant: 'Medium Size', stock: 0, unit: 'bunches', lowThreshold: 50, status: 'out', lastUpdated: '2026-01-11', batchNumber: 'CAM-2026-022' },
  { id: '4', name: 'Ground Cassava Flour', sku: 'CAS-FLO-001', variant: '50kg Bag', stock: 800, unit: 'bags', lowThreshold: 100, status: 'healthy', lastUpdated: '2026-01-13', batchNumber: 'CAM-2026-030' },
  { id: '5', name: 'Palm Oil', sku: 'PLM-OIL-001', variant: '20L Container', stock: 45, unit: 'containers', lowThreshold: 30, status: 'low', lastUpdated: '2026-01-10', batchNumber: 'CAM-2026-035' },
];

const mockStockHistory = [
  { id: '1', productName: 'Premium Arabica Coffee Beans', change: +500, type: 'restock', note: 'New harvest arrival', date: '2026-01-13 10:30' },
  { id: '2', productName: 'Organic Cocoa Beans', change: -200, type: 'sale', note: 'Order #HRV-00042', date: '2026-01-12 15:45' },
  { id: '3', productName: 'Fresh Plantains', change: -50, type: 'sale', note: 'Order #HRV-00041', date: '2026-01-11 09:20' },
  { id: '4', productName: 'Ground Cassava Flour', change: +200, type: 'restock', note: 'Supplier delivery', date: '2026-01-10 14:00' },
];

export default function SellerInventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof mockInventory[0] | null>(null);
  const [restockQuantity, setRestockQuantity] = useState('');
  const [batchNumber, setBatchNumber] = useState('');

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockInventory.length,
    healthy: mockInventory.filter(i => i.status === 'healthy').length,
    low: mockInventory.filter(i => i.status === 'low').length,
    out: mockInventory.filter(i => i.status === 'out').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-success/10 text-success border-success/20">In Stock</Badge>;
      case 'low':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Low Stock</Badge>;
      case 'out':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleRestock = () => {
    // API placeholder: updateInventory()
    console.log('Restocking:', { selectedProduct, restockQuantity, batchNumber });
    setShowRestockModal(false);
    setRestockQuantity('');
    setBatchNumber('');
    setSelectedProduct(null);
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
            <p className="text-muted-foreground">Track stock levels, set alerts, and manage batches</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Healthy Stock</p>
                    <p className="text-2xl font-bold text-success">{stats.healthy}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className={stats.low > 0 ? 'border-warning/50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Low Stock</p>
                    <p className="text-2xl font-bold text-warning">{stats.low}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className={stats.out > 0 ? 'border-destructive/50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Out of Stock</p>
                    <p className="text-2xl font-bold text-destructive">{stats.out}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name or SKU..."
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
                    <TableHead className="hidden md:table-cell">Batch</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.variant}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{item.sku}</code>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-semibold">
                            {item.stock.toLocaleString()} {item.unit}
                          </p>
                          <Progress 
                            value={Math.min((item.stock / (item.lowThreshold * 3)) * 100, 100)} 
                            className={`h-1.5 ${
                              item.status === 'out' ? 'bg-destructive/20' :
                              item.status === 'low' ? 'bg-warning/20' : 'bg-success/20'
                            }`}
                          />
                          <p className="text-xs text-muted-foreground">
                            Alert at {item.lowThreshold} {item.unit}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <code className="text-xs">{item.batchNumber}</code>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(item);
                              setShowRestockModal(true);
                            }}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Restock
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Stock Changes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Recent Stock Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockStockHistory.map((record) => (
                <div 
                  key={record.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      record.change > 0 ? 'bg-success/10' : 'bg-destructive/10'
                    }`}>
                      {record.change > 0 ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{record.productName}</p>
                      <p className="text-xs text-muted-foreground">{record.note} • {record.date}</p>
                    </div>
                  </div>
                  <div className={`font-semibold ${record.change > 0 ? 'text-success' : 'text-destructive'}`}>
                    {record.change > 0 ? '+' : ''}{record.change}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Restock Modal */}
        <Dialog open={showRestockModal} onOpenChange={setShowRestockModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Restock Product</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4 py-4">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="font-medium">{selectedProduct.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Current stock: {selectedProduct.stock} {selectedProduct.unit}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Quantity to Add ({selectedProduct.unit})</Label>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Batch Number</Label>
                  <Input
                    placeholder="e.g., CAM-2026-040"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
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
                Add Stock
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SellerLayout>
  );
}

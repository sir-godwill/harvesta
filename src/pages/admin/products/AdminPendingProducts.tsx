import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, Eye, Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const mockProducts = [
  { id: 'PRD-001', name: 'Organic Cassava Flour', seller: 'Green Valley Farms', category: 'Grains', price: 45, submittedAt: '2024-01-10', status: 'pending' },
  { id: 'PRD-002', name: 'Premium Cocoa Beans', seller: 'Congo Cocoa Co', category: 'Raw Materials', price: 120, submittedAt: '2024-01-09', status: 'pending' },
  { id: 'PRD-003', name: 'Fresh Hibiscus Flowers', seller: 'Nairobi Spice Traders', category: 'Spices', price: 35, submittedAt: '2024-01-08', status: 'pending' },
];

export default function AdminPendingProducts() {
  const [products, setProducts] = useState(mockProducts);

  const handleApprove = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success('Product approved successfully!');
  };

  const handleReject = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.error('Product rejected.');
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold">Pending Product Reviews</h1>
        <p className="text-muted-foreground">Review and approve new product listings</p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-10" />
        </div>
        <Button variant="outline"><Filter className="mr-2 h-4 w-4" />Filter</Button>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.seller} • {product.category}</p>
                <p className="text-sm font-medium text-primary">${product.price}/unit</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Eye className="mr-1 h-4 w-4" />View</Button>
                <Button variant="destructive" size="sm" onClick={() => handleReject(product.id)}><XCircle className="mr-1 h-4 w-4" />Reject</Button>
                <Button size="sm" onClick={() => handleApprove(product.id)}><CheckCircle className="mr-1 h-4 w-4" />Approve</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {products.length === 0 && (
          <Card className="p-12 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-success mb-4" />
            <h3 className="text-lg font-medium">All caught up!</h3>
            <p className="text-muted-foreground">No products pending review.</p>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
}

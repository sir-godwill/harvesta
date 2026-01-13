import { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderTree, Plus, Edit2, Trash2, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const mockCategories = [
  { id: '1', name: 'Grains & Cereals', count: 156, subcategories: ['Maize', 'Rice', 'Wheat', 'Millet'] },
  { id: '2', name: 'Vegetables', count: 89, subcategories: ['Leafy Greens', 'Root Vegetables', 'Peppers'] },
  { id: '3', name: 'Fruits', count: 72, subcategories: ['Tropical', 'Citrus', 'Berries'] },
  { id: '4', name: 'Legumes', count: 45, subcategories: ['Beans', 'Lentils', 'Peas'] },
  { id: '5', name: 'Spices & Herbs', count: 128, subcategories: ['Dried Spices', 'Fresh Herbs', 'Blends'] },
  { id: '6', name: 'Oils & Fats', count: 34, subcategories: ['Palm Oil', 'Shea Butter', 'Coconut Oil'] },
];

export default function AdminCategories() {
  const [categories] = useState(mockCategories);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">Product Categories</h1>
          <p className="text-muted-foreground">Manage product category hierarchy</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Add Category</Button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderTree className="h-5 w-5 text-primary" />
                  {cat.name}
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                <Package className="h-4 w-4" /> {cat.count} products
              </p>
              <div className="flex flex-wrap gap-1">
                {cat.subcategories.map((sub) => (
                  <span key={sub} className="text-xs px-2 py-1 bg-muted rounded-full">{sub}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </motion.div>
  );
}

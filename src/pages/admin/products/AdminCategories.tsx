import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderTree, Plus, Edit2, Trash2, Package, Save, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCategories, createCategory, updateCategory, deleteCategory, Category } from '@/lib/admin-api';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({ name: '', parentId: 'none', isActive: true });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const data = await fetchCategories();
    setCategories(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }

    const payload: Partial<Category> = {
      name: formData.name,
      description: formData.description,
      parentId: formData.parentId === 'none' ? null : formData.parentId,
      isActive: formData.isActive,
      // Slug is auto-generated in API if missing
    };

    try {
      if (editingCategory) {
        const result = await updateCategory(editingCategory.id, payload);
        if (result.success) {
          toast.success('Category updated successfully');
        } else {
          throw result.error;
        }
      } else {
        const result = await createCategory(payload);
        if (result.success) {
          toast.success('Category created successfully');
        } else {
          throw result.error;
        }
      }
      setIsDialogOpen(false);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description,
      parentId: cat.parentId || 'none',
      isActive: cat.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) {
      try {
        const result = await deleteCategory(id);
        if (result.success) {
          toast.success('Category deleted');
          loadCategories();
        } else {
          throw result.error;
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  const openNewDialog = () => {
    setEditingCategory(null);
    setFormData({ name: '', parentId: 'none', isActive: true });
    setIsDialogOpen(true);
  };

  // Group categories by parent
  const topLevelCategories = categories.filter(c => !c.parentId);

  // Helper to get subcategories for a parent
  const getSubcategories = (parentId: string) => categories.filter(c => c.parentId === parentId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 p-4">
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">Product Categories</h1>
          <p className="text-muted-foreground">Manage product category hierarchy</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}><Plus className="mr-2 h-4 w-4" />Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              <DialogDescription>
                Create or modify product categories here.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Grains"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent">Parent Category</Label>
                <Select
                  value={formData.parentId || 'none'}
                  onValueChange={(val) => setFormData({ ...formData, parentId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top Level)</SelectItem>
                    {topLevelCategories.filter(c => c.id !== editingCategory?.id).map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Input
                  id="desc"
                  placeholder="Optional description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={!formData.name}>
                <Save className="mr-2 h-4 w-4" /> Save Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={itemVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topLevelCategories.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No categories found. Click "Add Category" to create one.
          </div>
        ) : (
          topLevelCategories.map((cat) => {
            const subcats = getSubcategories(cat.id);
            return (
              <Card key={cat.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FolderTree className="h-5 w-5 text-primary" />
                      {cat.name}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(cat.id, cat.name)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                    <Package className="h-4 w-4" /> {subcats.length} subcategories
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {subcats.length > 0 ? (
                      subcats.map((sub) => (
                        <div key={sub.id} className="group relative">
                          <span className="text-xs px-2 py-1 bg-muted rounded-full cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => handleEdit(sub)}>
                            {sub.name}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No subcategories</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
}

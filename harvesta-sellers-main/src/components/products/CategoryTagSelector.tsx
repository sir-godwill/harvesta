import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, X, Tag, FolderTree } from "lucide-react";
import { cn } from "@/lib/utils";

export const defaultCategories = [
  { id: 'coffee', name: 'Coffee', icon: '☕' },
  { id: 'cocoa', name: 'Cocoa', icon: '🍫' },
  { id: 'grains', name: 'Grains & Cereals', icon: '🌾' },
  { id: 'tubers', name: 'Tubers & Roots', icon: '🥔' },
  { id: 'fruits', name: 'Fruits', icon: '🍎' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
  { id: 'spices', name: 'Spices & Herbs', icon: '🌿' },
  { id: 'oils', name: 'Oils & Fats', icon: '🫒' },
  { id: 'honey', name: 'Honey & Bee Products', icon: '🍯' },
  { id: 'nuts', name: 'Nuts & Seeds', icon: '🥜' },
  { id: 'livestock', name: 'Livestock & Poultry', icon: '🐄' },
  { id: 'fish', name: 'Fish & Seafood', icon: '🐟' },
  { id: 'dairy', name: 'Dairy Products', icon: '🥛' },
  { id: 'inputs', name: 'Farm Inputs', icon: '🌱' },
];

export const defaultTags = [
  'Organic', 'Fair Trade', 'Export Quality', 'Local Market', 
  'Premium', 'Fresh', 'Dried', 'Processed', 'Raw', 'Wholesale',
  'Certified', 'Sustainable', 'Family Farm', 'Cooperative',
];

interface CategoryTagSelectorProps {
  category: string;
  tags: string[];
  onCategoryChange: (category: string) => void;
  onTagsChange: (tags: string[]) => void;
  customCategories?: { id: string; name: string; icon: string }[];
  onAddCustomCategory?: (category: { id: string; name: string; icon: string }) => void;
}

export function CategoryTagSelector({
  category,
  tags,
  onCategoryChange,
  onTagsChange,
  customCategories = [],
  onAddCustomCategory,
}: CategoryTagSelectorProps) {
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📦');
  const [newTag, setNewTag] = useState('');

  const allCategories = [...defaultCategories, ...customCategories];

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      onTagsChange([...tags, tag]);
    }
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    onTagsChange(tags.filter(t => t !== tag));
  };

  const handleNewCategory = () => {
    if (newCategoryName && onAddCustomCategory) {
      const newCat = {
        id: newCategoryName.toLowerCase().replace(/\s+/g, '_'),
        name: newCategoryName,
        icon: newCategoryIcon,
      };
      onAddCustomCategory(newCat);
      onCategoryChange(newCat.id);
      setShowNewCategoryDialog(false);
      setNewCategoryName('');
      setNewCategoryIcon('📦');
    }
  };

  const availableTags = defaultTags.filter(t => !tags.includes(t));

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-primary" />
          <Label className="text-sm font-medium">Product Category</Label>
        </div>
        <div className="flex gap-2">
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {allCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowNewCategoryDialog(true)}
            title="Add new category"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          <Label className="text-sm font-medium">Labels & Tags</Label>
        </div>

        {/* Selected Tags */}
        <AnimatePresence mode="popLayout">
          {tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-wrap gap-2"
            >
              {tags.map((tag) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                >
                  <Badge 
                    variant="secondary" 
                    className="gap-1 pr-1 bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Tags */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a custom tag..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(newTag);
                }
              }}
              className="pr-16"
            />
            {newTag && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addTag(newTag)}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
              >
                Add
              </Button>
            )}
          </div>
        </div>

        {/* Suggested Tags */}
        {availableTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Suggested tags:</p>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="px-2.5 py-1 text-xs rounded-full border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* New Category Dialog */}
      <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Palm Products"
              />
            </div>
            <div className="space-y-2">
              <Label>Icon (Emoji)</Label>
              <Input
                value={newCategoryIcon}
                onChange={(e) => setNewCategoryIcon(e.target.value)}
                placeholder="e.g., 🌴"
                className="w-20 text-center text-xl"
              />
              <p className="text-xs text-muted-foreground">
                Use an emoji that represents this category
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewCategoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleNewCategory} disabled={!newCategoryName}>
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

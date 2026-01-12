import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Star, Package, Store, GripVertical, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ManageFeaturedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'sellers' | 'products';
}

interface FeaturedItem {
  id: string;
  name: string;
  image?: string;
  category?: string;
  isFeatured: boolean;
}

const mockSellers: FeaturedItem[] = [
  { id: '1', name: 'Kofi Organic Farms', category: 'Cocoa, Coffee', isFeatured: true },
  { id: '2', name: 'Ethiopian Coffee', category: 'Coffee, Spices', isFeatured: true },
  { id: '3', name: 'Lagos Agro Export', category: 'Grains, Vegetables', isFeatured: false },
  { id: '4', name: 'Cameroon Cocoa', category: 'Cocoa', isFeatured: true },
  { id: '5', name: 'Nairobi Spice Traders', category: 'Spices, Herbs', isFeatured: false },
];

const mockProducts: FeaturedItem[] = [
  { id: '1', name: 'Premium Cocoa Beans', category: 'Cocoa', isFeatured: true },
  { id: '2', name: 'Ethiopian Yirgacheffe Coffee', category: 'Coffee', isFeatured: true },
  { id: '3', name: 'Organic Cassava Flour', category: 'Grains', isFeatured: false },
  { id: '4', name: 'Dried Hibiscus Flowers', category: 'Spices', isFeatured: true },
  { id: '5', name: 'Raw Shea Butter', category: 'Cosmetics', isFeatured: false },
];

export function ManageFeaturedModal({ open, onOpenChange, type }: ManageFeaturedModalProps) {
  const [items, setItems] = useState<FeaturedItem[]>(type === 'sellers' ? mockSellers : mockProducts);
  const [searchQuery, setSearchQuery] = useState('');

  const featuredCount = items.filter(i => i.isFeatured).length;
  const maxFeatured = type === 'sellers' ? 5 : 12;

  const toggleFeatured = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        if (!item.isFeatured && featuredCount >= maxFeatured) {
          toast.error(`Maximum ${maxFeatured} featured ${type} allowed`);
          return item;
        }
        return { ...item, isFeatured: !item.isFeatured };
      }
      return item;
    }));
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    toast.success(`Featured ${type} updated successfully`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'sellers' ? <Store className="h-5 w-5" /> : <Package className="h-5 w-5" />}
            Manage Featured {type === 'sellers' ? 'Sellers' : 'Products'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm">Featured</span>
            <Badge variant={featuredCount >= maxFeatured ? 'destructive' : 'default'}>
              {featuredCount} / {maxFeatured}
            </Badge>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${type}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Featured Items */}
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer',
                    item.isFeatured ? 'bg-primary/5 border-primary/30' : 'hover:bg-muted/50'
                  )}
                  onClick={() => toggleFeatured(item.id)}
                >
                  <Checkbox checked={item.isFeatured} />
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarImage src={item.image} />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                      {item.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  {item.isFeatured && (
                    <Star className="h-4 w-4 text-warning fill-warning" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Package, Image as ImageIcon, Store, Tag, DollarSign, 
  BarChart3, Edit, Trash2, CheckCircle2, XCircle, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/admin-api';
import { toast } from 'sonner';

interface ViewProductModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ViewProductModal({ product, open, onOpenChange, onEdit, onDelete }: ViewProductModalProps) {
  if (!product) return null;

  const statusColors = {
    live: 'bg-success/10 text-success',
    pending: 'bg-warning/10 text-warning',
    draft: 'bg-muted text-muted-foreground',
    rejected: 'bg-destructive/10 text-destructive',
  };

  const gradeColors = {
    'Grade A': 'bg-success text-success-foreground',
    'Grade B': 'bg-info text-info-foreground',
    'Grade C': 'bg-warning text-warning-foreground',
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);

  const handleApprove = () => {
    toast.success(`Product ${product.name} has been approved`);
    onOpenChange(false);
  };

  const handleReject = () => {
    toast.error(`Product ${product.name} has been rejected`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Product Image & Basic Info */}
          <div className="flex gap-4">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-muted overflow-hidden flex-shrink-0">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">{product.name}</h2>
                  <p className="text-sm text-muted-foreground">{product.seller}</p>
                </div>
                <Badge className={statusColors[product.status]}>{product.status}</Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline">{product.category}</Badge>
                {product.qualityGrade && (
                  <Badge className={gradeColors[product.qualityGrade as keyof typeof gradeColors]}>
                    {product.qualityGrade}
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-bold text-primary mt-3">{formatPrice(product.price)}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <Package className="h-5 w-5 mx-auto text-primary mb-1" />
                <p className="text-xl font-bold">{product.stock}</p>
                <p className="text-xs text-muted-foreground">In Stock</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <BarChart3 className="h-5 w-5 mx-auto text-success mb-1" />
                <p className="text-xl font-bold">156</p>
                <p className="text-xs text-muted-foreground">Sold</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <Eye className="h-5 w-5 mx-auto text-info mb-1" />
                <p className="text-xl font-bold">2.3K</p>
                <p className="text-xs text-muted-foreground">Views</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <DollarSign className="h-5 w-5 mx-auto text-accent mb-1" />
                <p className="text-xl font-bold">{formatPrice(product.price * 156)}</p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">
                Premium quality {product.name.toLowerCase()} sourced directly from verified African farmers. 
                This product meets our {product.qualityGrade || 'quality'} standards and is ready for export.
                Minimum order quantity: 100 units. Available for bulk orders with discounted pricing.
              </p>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Specifications</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU</span>
                  <span className="font-medium">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quality Grade</span>
                  <span className="font-medium">{product.qualityGrade || 'Standard'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Origin</span>
                  <span className="font-medium">Cameroon</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium">1 kg/unit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MOQ</span>
                  <span className="font-medium">100 units</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          {product.status === 'pending' && (
            <>
              <Button onClick={handleApprove} className="bg-success hover:bg-success/90">
                <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                <XCircle className="h-4 w-4 mr-2" /> Reject
              </Button>
            </>
          )}
          <Button variant="outline" onClick={() => onEdit?.(product)}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="outline" className="text-destructive" onClick={() => onDelete?.(product)}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

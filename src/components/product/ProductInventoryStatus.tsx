import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Package, AlertTriangle, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductInventory } from '@/lib/productApi';

interface ProductInventoryStatusProps {
  inventory: ProductInventory;
  unit: string;
  seasonalAvailability?: {
    startMonth: number;
    endMonth: number;
  };
  className?: string;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ProductInventoryStatus({
  inventory,
  unit,
  seasonalAvailability,
  className,
}: ProductInventoryStatusProps) {
  const stockPercentage = (inventory.availableStock / inventory.totalStock) * 100;
  
  const getStockStatus = () => {
    if (inventory.isOutOfStock) {
      return { label: 'Out of Stock', color: 'destructive', icon: XCircle };
    }
    if (inventory.isLowStock) {
      return { label: 'Low Stock', color: 'warning', icon: AlertTriangle };
    }
    return { label: 'In Stock', color: 'success', icon: CheckCircle };
  };

  const stockStatus = getStockStatus();
  const StatusIcon = stockStatus.icon;

  const isInSeason = () => {
    if (!seasonalAvailability) return true;
    const currentMonth = new Date().getMonth();
    const { startMonth, endMonth } = seasonalAvailability;
    
    if (startMonth <= endMonth) {
      return currentMonth >= startMonth && currentMonth <= endMonth;
    } else {
      // Season crosses year boundary (e.g., Nov-Feb)
      return currentMonth >= startMonth || currentMonth <= endMonth;
    }
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="w-5 h-5 text-primary" />
          Availability & Stock
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stock Status Badge */}
        <div className="flex items-center justify-between">
          <Badge 
            variant={stockStatus.color === 'success' ? 'default' : 'destructive'}
            className={cn(
              'gap-1.5 px-3 py-1',
              stockStatus.color === 'success' && 'bg-green-600',
              stockStatus.color === 'warning' && 'bg-amber-500'
            )}
          >
            <StatusIcon className="w-4 h-4" />
            {stockStatus.label}
          </Badge>
          {!inventory.isOutOfStock && (
            <span className="text-sm text-muted-foreground">
              {inventory.availableStock.toLocaleString()} {unit} available
            </span>
          )}
        </div>

        {/* Stock Progress Bar */}
        {!inventory.isOutOfStock && (
          <div className="space-y-2">
            <Progress 
              value={stockPercentage} 
              className={cn(
                'h-2',
                inventory.isLowStock && '[&>div]:bg-amber-500',
                !inventory.isLowStock && '[&>div]:bg-green-500'
              )}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{inventory.reservedStock.toLocaleString()} reserved</span>
              <span>{inventory.totalStock.toLocaleString()} total</span>
            </div>
          </div>
        )}

        {/* Low Stock Warning */}
        {inventory.isLowStock && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Limited Stock Available
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-500">
                Only {inventory.availableStock} {unit} remaining. Order soon!
              </p>
            </div>
          </div>
        )}

        {/* Out of Stock Message */}
        {inventory.isOutOfStock && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                Currently Unavailable
              </p>
              <p className="text-xs text-red-600 dark:text-red-500">
                Contact the seller for restock information
              </p>
            </div>
          </div>
        )}

        {/* Seasonal Calendar */}
        {seasonalAvailability && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-medium text-foreground">Seasonal Availability</h4>
              {isInSeason() ? (
                <Badge className="bg-green-600 text-white text-xs">In Season</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">Off Season</Badge>
              )}
            </div>
            <div className="flex gap-1">
              {monthNames.map((month, index) => {
                const { startMonth, endMonth } = seasonalAvailability;
                let isAvailable = false;
                
                if (startMonth <= endMonth) {
                  isAvailable = index >= startMonth && index <= endMonth;
                } else {
                  isAvailable = index >= startMonth || index <= endMonth;
                }
                
                const isCurrent = index === new Date().getMonth();
                
                return (
                  <div
                    key={month}
                    className={cn(
                      'flex-1 py-1.5 text-center text-[10px] rounded transition-colors',
                      isAvailable 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-muted text-muted-foreground',
                      isCurrent && 'ring-2 ring-primary ring-offset-1'
                    )}
                    title={`${month}: ${isAvailable ? 'Available' : 'Not available'}`}
                  >
                    {month.charAt(0)}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

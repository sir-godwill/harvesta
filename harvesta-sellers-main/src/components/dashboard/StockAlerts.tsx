import { motion } from "framer-motion";
import { AlertTriangle, Package, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/services/api";

interface StockAlertsProps {
  products: Product[];
  isLoading?: boolean;
}

export function StockAlerts({ products, isLoading }: StockAlertsProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card rounded-xl border shadow-soft p-5"
      >
        <div className="h-6 w-32 bg-muted animate-pulse rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </motion.div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-card rounded-xl border shadow-soft p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="text-lg font-semibold text-foreground">Stock Alerts</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
            <Package className="w-6 h-6 text-success" />
          </div>
          <p className="text-sm text-muted-foreground">All products are well stocked!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-card rounded-xl border shadow-soft p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="text-lg font-semibold text-foreground">Stock Alerts</h3>
        </div>
        <Link
          to="/dashboard/products"
          className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          Manage <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {products.slice(0, 4).map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                product.status === 'out_of_stock' ? "bg-destructive/10" : "bg-warning/10"
              )}>
                <Package className={cn(
                  "w-5 h-5",
                  product.status === 'out_of_stock' ? "text-destructive" : "text-warning"
                )} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.category}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge
                variant="outline"
                className={cn(
                  product.status === 'out_of_stock'
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : "bg-warning/10 text-warning border-warning/20"
                )}
              >
                {product.status === 'out_of_stock' ? 'Out of Stock' : `${product.stock} left`}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

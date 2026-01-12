import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, Truck, FileText, Plus } from "lucide-react";

const actions = [
  { icon: Plus, label: "Add Product", path: "/dashboard/products/new", color: "bg-primary text-primary-foreground" },
  { icon: ShoppingCart, label: "View Orders", path: "/dashboard/orders", color: "bg-accent text-accent-foreground" },
  { icon: Truck, label: "Manage Deliveries", path: "/dashboard/deliveries", color: "bg-secondary text-secondary-foreground" },
  { icon: FileText, label: "RFQ Inbox", path: "/dashboard/rfq", color: "bg-success text-success-foreground" },
];

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card rounded-xl border shadow-soft p-5"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.path}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
          >
            <Link
              to={action.path}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
            >
              <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                <action.icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-foreground">{action.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

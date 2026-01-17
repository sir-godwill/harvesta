import { Home, FileText, Grid3X3, Store, Globe, Truck } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  labelKey: string;
  href: string;
  active?: boolean;
}

export default function Sidebar() {
  const { t } = useApp();

  const navItems: NavItem[] = [
    { icon: Home, labelKey: "nav.home", href: "/", active: true },
    { icon: FileText, labelKey: "nav.orders", href: "/orders" },
    { icon: Grid3X3, labelKey: "nav.products", href: "/products" },
    { icon: Store, labelKey: "nav.suppliers", href: "/suppliers" },
    { icon: Globe, labelKey: "nav.global", href: "/global" },
    { icon: Truck, labelKey: "nav.distribution", href: "/distribution" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-20 bg-sidebar border-r border-sidebar-border h-[calc(100vh-120px)] sticky top-[120px] shrink-0">
      <nav className="flex flex-col py-4">
        {navItems.map((item) => (
          <a
            key={item.labelKey}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-2 py-4 px-2 text-center transition-colors duration-200 group",
              item.active
                ? "text-primary bg-sidebar-accent border-l-4 border-primary"
                : "text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent",
            )}
          >
            <item.icon className="h-6 w-6 transition-transform group-hover:scale-110" />
            <span className="text-xs font-medium leading-tight">
              {t(item.labelKey)}
            </span>
          </a>
        ))}
      </nav>
    </aside>
  );
}

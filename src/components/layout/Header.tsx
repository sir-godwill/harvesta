import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Camera,
  ShoppingCart,
  MessageSquare,
  User,
  FileText,
  Sparkles,
  Globe,
  ChevronDown,
  LogOut,
  Bell,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import harvestaLogo from "@/assets/harvesta-logo.png";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { NotificationBell } from "@/components/chat/NotificationBell";
import { NotificationCard } from "@/components/common/NotificationCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { language, setLanguage, currency, setCurrency, t } = useApp();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Notifications logic
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: !!user,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (!user) return;

    // Real-time subscription for notifications
    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      {/* Top Bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-2 bg-muted text-sm">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">Welcome to Harvestá B2B</span>
          <Link
            to="/about"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            About Us
          </Link>
          <Link
            to="/help"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Help Center
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-2">
                <Globe className="h-4 w-4" />
                {language === "en" ? "English" : "Français"}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("fr")}>
                Français
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Currency Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-2">
                {currency}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCurrency("XAF")}>
                XAF (FCFA)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrency("USD")}>
                USD ($)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrency("EUR")}>
                EUR (€)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to="/rfq"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Request Quote
          </Link>
          <a
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Supplier Center
          </a>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src={harvestaLogo}
            alt="Harvestá Logo"
            className="h-10 lg:h-12 w-auto"
          />
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
          <div className="flex items-center bg-background border-2 border-primary rounded-full overflow-hidden">
            <div className="flex-1 flex items-center px-4">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder={t("search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input w-full px-3 py-2.5 text-sm"
              />
            </div>
            <Button
              type="submit"
              className="bg-gradient-primary rounded-none px-6 h-11 font-medium"
            >
              {t("search.button")}
            </Button>
            <button
              type="button"
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 border-l border-border text-primary hover:bg-primary/5 transition-colors"
            >
              <Camera className="h-5 w-5" />
              <span className="text-sm font-medium">{t("search.image")}</span>
            </button>
          </div>
        </form>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-auto py-2 px-3 gap-1"
            asChild
          >
            <Link to="/rfq">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs">RFQ</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-auto py-2 px-3 gap-1"
            asChild
          >
            <Link to="/orders">
              <FileText className="h-5 w-5" />
              <span className="text-xs">{t("nav.orders")}</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-auto py-2 px-3 gap-1 relative"
            asChild
          >
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-xs">{t("nav.cart")}</span>
              <span className="absolute top-1 right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                3
              </span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-auto py-2 px-3 gap-1"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">{t("nav.messages")}</span>
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center">
                  <NotificationBell count={unreadCount} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 p-0 overflow-hidden"
              >
                <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 text-primary hover:text-primary/80"
                    >
                      Mark all as read
                    </Button>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="flex flex-col">
                      {notifications.map((n) => (
                        <NotificationCard
                          key={n.id}
                          id={n.id}
                          type={n.type}
                          title={n.title}
                          message={n.message}
                          timestamp={n.timestamp}
                          isRead={n.isRead}
                          className="border-0 border-b last:border-b-0 rounded-none shadow-none hover:bg-muted/30 cursor-pointer"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-background">
                      <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                      <p className="text-sm text-muted-foreground">
                        All caught up!
                      </p>
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    className="w-full rounded-none border-t text-xs h-10 font-normal hover:bg-muted/50"
                    asChild
                  >
                    <Link to="/dashboard">View all notifications</Link>
                  </Button>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-col h-auto py-2 px-3 gap-1"
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/saved-products">Saved Products</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="flex-col h-auto py-2 px-3 gap-1"
              asChild
            >
              <Link to="/login">
                <User className="h-5 w-5" />
                <span className="text-xs">{t("nav.login")}</span>
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to={user ? "/dashboard" : "/login"}>
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Category Navigation - Desktop */}
      <nav className="hidden lg:flex items-center justify-center gap-8 px-6 py-2 border-t border-border bg-card">
        <Link
          to="/search"
          className="text-primary font-medium text-sm hover:text-primary/80 transition-colors"
        >
          Find Products
        </Link>
        <Link
          to="/search?type=suppliers"
          className="text-foreground text-sm hover:text-primary transition-colors"
        >
          Find Suppliers
        </Link>
        <Link
          to="/search?category=industrial"
          className="text-foreground text-sm hover:text-primary transition-colors"
        >
          Industrial Supplies
        </Link>
        <Link
          to="/search?category=organic"
          className="text-foreground text-sm hover:text-primary transition-colors"
        >
          Organic Certified
        </Link>
        <Link
          to="/buyer-protection"
          className="text-foreground text-sm hover:text-primary transition-colors"
        >
          Trade Assurance
        </Link>
      </nav>
    </header>
  );
}

import { 
  X, 
  Store, 
  MapPin, 
  Calendar, 
  TrendingUp,
  Package,
  DollarSign,
  Star,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface Seller {
  id: string;
  name: string;
  owner: string;
  country: string;
  status: 'active' | 'pending' | 'suspended';
  productsListed: number;
  totalRevenue: number;
  commission: number;
  joinDate: string;
  email?: string;
  phone?: string;
}

interface SellerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: Seller | null;
}

export function SellerDetailModal({ isOpen, onClose, seller }: SellerDetailModalProps) {
  if (!isOpen || !seller) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="badge-success flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="badge-pending flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 gap-1">
            <AlertCircle className="w-3 h-3" />
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  // Mock additional seller data
  const sellerDetails = {
    ...seller,
    email: seller.email || `${seller.owner.toLowerCase().replace(' ', '.')}@email.com`,
    phone: seller.phone || '+237 6XX XXX XXX',
    rating: 4.8,
    totalOrders: Math.floor(Math.random() * 200) + 50,
    avgOrderValue: Math.floor(seller.totalRevenue / (Math.floor(Math.random() * 200) + 50)),
    categories: ['Fresh Produce', 'Cocoa', 'Coffee'],
    monthlyGrowth: Math.floor(Math.random() * 30) + 5,
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-card rounded-2xl shadow-elevated max-w-lg w-full animate-scale-in max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="font-semibold text-primary text-lg">
                {seller.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{seller.name}</h3>
              <div className="flex items-center gap-2">
                {getStatusBadge(seller.status)}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)] space-y-4">
          {/* Contact Info */}
          <div className="section-card p-4">
            <h4 className="font-medium text-foreground mb-3">Contact Information</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Store className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{sellerDetails.owner} (Owner)</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{seller.country}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{sellerDetails.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{sellerDetails.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">Joined {formatDate(seller.joinDate)}</span>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="stat-card-green p-3">
              <Package className="w-5 h-5 text-primary mb-2" />
              <p className="text-xl font-bold text-foreground">{seller.productsListed}</p>
              <p className="text-xs text-muted-foreground">Products Listed</p>
            </div>
            <div className="stat-card-orange p-3">
              <TrendingUp className="w-5 h-5 text-accent mb-2" />
              <p className="text-xl font-bold text-foreground">{sellerDetails.totalOrders}</p>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </div>
            <div className="stat-card p-3">
              <DollarSign className="w-5 h-5 text-primary mb-2" />
              <p className="text-xl font-bold text-foreground">{formatCurrency(seller.totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </div>
            <div className="stat-card p-3">
              <Star className="w-5 h-5 text-amber-500 mb-2" />
              <p className="text-xl font-bold text-foreground">{sellerDetails.rating}</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
          </div>

          {/* Your Earnings */}
          <div className="p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-xl border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Commission</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(seller.commission)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  +{sellerDetails.monthlyGrowth}% this month
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Rate</p>
                <p className="text-lg font-semibold text-foreground">7%</p>
                <p className="text-xs text-muted-foreground">of revenue</p>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="section-card p-4">
            <h4 className="font-medium text-foreground mb-3">Product Categories</h4>
            <div className="flex flex-wrap gap-2">
              {sellerDetails.categories.map((category) => (
                <span key={category} className="px-3 py-1 bg-muted rounded-full text-sm text-foreground">
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="btn-primary flex-1 justify-center">
              <MessageCircle className="w-4 h-4" />
              Contact Seller
            </button>
            <button className="btn-outline flex-1 justify-center">
              <ExternalLink className="w-4 h-4" />
              View Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

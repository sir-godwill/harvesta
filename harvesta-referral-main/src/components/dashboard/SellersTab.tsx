import { useState, useEffect } from 'react';
import { fetchReferredSellers, submitSellerOnboarding, approveSellerOnboarding } from '@/lib/api';
import { formatCurrency, formatDate, simulatedData } from '@/lib/mockData';
import { 
  Store, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Package,
  DollarSign,
  X,
  Eye,
  MoreVertical,
  MessageCircle,
  Ban,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SellerDetailModal } from '@/components/ui/SellerDetailModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { SocialShareModal } from '@/components/ui/SocialShareModal';
import { toast } from 'sonner';

export function SellersTab() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    country: 'Cameroon',
    category: 'crops',
    notes: '',
  });
  
  // Modal states
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [showSellerDetail, setShowSellerDetail] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    loadSellers();
  }, []);

  async function loadSellers() {
    try {
      const data = await fetchReferredSellers();
      setSellers(data);
    } catch (error) {
      console.error('Failed to load sellers:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitSellerOnboarding(formData);
      toast.success('Invitation sent successfully!');
      setShowInviteForm(false);
      setFormData({ businessName: '', email: '', phone: '', country: 'Cameroon', category: 'crops', notes: '' });
      loadSellers();
    } catch (error) {
      toast.error('Failed to send invitation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewSeller = (seller: any) => {
    setSelectedSeller(seller);
    setShowSellerDetail(true);
    setActiveDropdown(null);
  };

  const handleApprove = async () => {
    if (!selectedSeller) return;
    setActionLoading(true);
    try {
      await approveSellerOnboarding(selectedSeller.id);
      toast.success(`${selectedSeller.name} has been approved!`);
      setSellers(prev => prev.map(s => 
        s.id === selectedSeller.id ? { ...s, status: 'active' } : s
      ));
      setShowApproveModal(false);
    } catch (error) {
      toast.error('Failed to approve seller');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!selectedSeller) return;
    setActionLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(`${selectedSeller.name} has been suspended`);
      setSellers(prev => prev.map(s => 
        s.id === selectedSeller.id ? { ...s, status: 'suspended' } : s
      ));
      setShowSuspendModal(false);
    } catch (error) {
      toast.error('Failed to suspend seller');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateInviteLink = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setInviteLink(`https://harvesta.app/seller-invite/${code}`);
    setShowShareModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'suspended':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Stats
  const activeCount = sellers.filter(s => s.status === 'active').length;
  const pendingCount = sellers.filter(s => s.status === 'pending').length;
  const totalRevenue = sellers.reduce((acc, s) => acc + s.totalRevenue, 0);
  const totalCommission = sellers.reduce((acc, s) => acc + s.commission, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Seller Onboarding</h2>
          <p className="text-sm text-muted-foreground">Manage sellers you've referred to Harvestá</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleGenerateInviteLink}
            className="btn-outline"
          >
            <Mail className="w-4 h-4" />
            Share Invite Link
          </button>
          <button 
            onClick={() => setShowInviteForm(true)}
            className="btn-action"
          >
            <UserPlus className="w-4 h-4" />
            Invite New Seller
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{sellers.length}</p>
              <p className="text-sm text-muted-foreground">Total Sellers</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalCommission)}</p>
              <p className="text-sm text-muted-foreground">Your Commission</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals Alert */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600" />
          <p className="text-sm text-amber-800">
            <strong>{pendingCount} seller(s)</strong> awaiting verification. Review and approve to start earning commissions!
          </p>
        </div>
      )}

      {/* Sellers List */}
      <div className="section-card">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Referred Sellers</h3>
          <button 
            onClick={loadSellers}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="divide-y divide-border">
          {sellers.map((seller, index) => (
            <div 
              key={seller.id} 
              className="p-4 hover:bg-muted/30 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Seller Info */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-semibold text-primary">
                      {seller.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">{seller.name}</p>
                      <span className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1',
                        seller.status === 'active' && 'bg-emerald-100 text-emerald-700',
                        seller.status === 'pending' && 'bg-amber-100 text-amber-700',
                        seller.status === 'suspended' && 'bg-red-100 text-red-700',
                      )}>
                        {getStatusIcon(seller.status)}
                        {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{seller.owner}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3" />
                      {seller.country}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 lg:gap-6 text-center lg:text-right">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{seller.productsListed}</p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">{formatCurrency(seller.totalRevenue)}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-primary">{formatCurrency(seller.commission)}</p>
                    <p className="text-xs text-muted-foreground">Your Earn</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === seller.id ? null : seller.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-muted-foreground" />
                  </button>
                  
                  {activeDropdown === seller.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setActiveDropdown(null)}
                      />
                      <div className="absolute right-0 top-10 bg-card border border-border rounded-lg shadow-lg z-50 py-1 min-w-[160px]">
                        <button
                          onClick={() => handleViewSeller(seller)}
                          className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSeller(seller);
                            setActiveDropdown(null);
                            window.open(`mailto:${seller.owner?.toLowerCase().replace(' ', '.')}@example.com`);
                          }}
                          className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Contact Seller
                        </button>
                        {seller.status === 'pending' && (
                          <button
                            onClick={() => {
                              setSelectedSeller(seller);
                              setActiveDropdown(null);
                              setShowApproveModal(true);
                            }}
                            className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center gap-2 text-emerald-600"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve Seller
                          </button>
                        )}
                        {seller.status === 'active' && (
                          <button
                            onClick={() => {
                              setSelectedSeller(seller);
                              setActiveDropdown(null);
                              setShowSuspendModal(true);
                            }}
                            className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center gap-2 text-red-600"
                          >
                            <Ban className="w-4 h-4" />
                            Suspend Seller
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Form Modal */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-elevated max-w-md w-full animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h3 className="font-semibold text-foreground">Invite New Seller</h3>
              <button 
                onClick={() => setShowInviteForm(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Business/Farm Name *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="e.g., Golden Harvest Farms"
                  required
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="seller@email.com"
                  required
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+237 6XX XXX XXX"
                  required
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Country *
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option>Cameroon</option>
                    <option>Ghana</option>
                    <option>Nigeria</option>
                    <option>Ivory Coast</option>
                    <option>Senegal</option>
                    <option>Kenya</option>
                    <option>South Africa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="crops">Crops & Grains</option>
                    <option value="fruits">Fruits & Vegetables</option>
                    <option value="livestock">Livestock</option>
                    <option value="dairy">Dairy Products</option>
                    <option value="spices">Spices & Herbs</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional information about this seller..."
                  rows={3}
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteForm(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-action flex-1 justify-center"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Seller Detail Modal */}
      <SellerDetailModal
        isOpen={showSellerDetail}
        onClose={() => setShowSellerDetail(false)}
        seller={selectedSeller}
      />

      {/* Approve Confirmation Modal */}
      <ConfirmModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApprove}
        title="Approve Seller"
        message={`Are you sure you want to approve ${selectedSeller?.name}? They will be able to start selling on Harvestá.`}
        confirmText="Approve"
        variant="info"
        isLoading={actionLoading}
      />

      {/* Suspend Confirmation Modal */}
      <ConfirmModal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        onConfirm={handleSuspend}
        title="Suspend Seller"
        message={`Are you sure you want to suspend ${selectedSeller?.name}? They will not be able to sell until reinstated.`}
        confirmText="Suspend"
        variant="danger"
        isLoading={actionLoading}
      />

      {/* Share Invite Link Modal */}
      <SocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        link={inviteLink}
        qrCode={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteLink)}`}
        campaign="Seller Invitation"
      />
    </div>
  );
}

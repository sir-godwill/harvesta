import { useState, useEffect } from 'react';
import { fetchCommissionDetails, calculateAffiliateCommission, exportAnalyticsCSV } from '@/lib/api';
import { formatCurrency, formatDate, simulatedData } from '@/lib/mockData';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Store,
  Users,
  Gift,
  Filter,
  Loader2,
  Download,
  X,
  Eye,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExportModal } from '@/components/ui/ExportModal';
import { toast } from 'sonner';

export function CommissionsTab() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [commissionData, summaryData] = await Promise.all([
        fetchCommissionDetails(),
        calculateAffiliateCommission(),
      ]);
      setCommissions(commissionData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to load commissions:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredCommissions = filter === 'all' 
    ? commissions 
    : commissions.filter(c => c.status === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'seller_referral':
        return <Store className="w-5 h-5" />;
      case 'buyer_referral':
        return <Users className="w-5 h-5" />;
      case 'campaign_bonus':
        return <Gift className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'seller_referral':
        return 'bg-primary/10 text-primary';
      case 'buyer_referral':
        return 'bg-accent/10 text-accent';
      case 'campaign_bonus':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'seller_referral': return 'Seller Referral';
      case 'buyer_referral': return 'Buyer Referral';
      case 'campaign_bonus': return 'Campaign Bonus';
      default: return 'Commission';
    }
  };

  const handleViewDetails = (commission: any) => {
    setSelectedCommission(commission);
    setShowDetailModal(true);
  };

  const handleExport = async (format: 'csv' | 'pdf', dateRange: { start: string; end: string }) => {
    try {
      await exportAnalyticsCSV();
      toast.success(`Commission report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

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
      <div>
        <h2 className="text-xl font-bold text-foreground">Commissions</h2>
        <p className="text-sm text-muted-foreground">Track your earnings and commission history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card-green">
          <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
          <p className="text-xl font-bold text-foreground">{formatCurrency(summary?.totalEarned || 0)}</p>
          <div className="flex items-center gap-1 mt-1 text-emerald-600 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+{summary?.monthlyGrowth || 0}% this month</span>
          </div>
        </div>
        <div className="stat-card-orange">
          <p className="text-sm text-muted-foreground mb-1">This Month</p>
          <p className="text-xl font-bold text-foreground">{formatCurrency(summary?.thisMonth || 0)}</p>
          <p className="text-xs text-muted-foreground mt-1">vs {formatCurrency(summary?.lastMonth || 0)} last month</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground mb-1">Available</p>
          <p className="text-xl font-bold text-primary">{formatCurrency(summary?.available || 0)}</p>
          <p className="text-xs text-muted-foreground mt-1">Ready to withdraw</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-xl font-bold text-amber-600">{formatCurrency(summary?.pending || 0)}</p>
          <p className="text-xs text-muted-foreground mt-1">Processing...</p>
        </div>
      </div>

      {/* Commission Types Legend */}
      <div className="section-card p-4">
        <h3 className="font-semibold text-foreground mb-3">Commission Types</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Store className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Seller Referrals</p>
              <p className="text-xs text-muted-foreground">7% of seller revenue</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">Buyer Referrals</p>
              <p className="text-xs text-muted-foreground">5% of order value</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Gift className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Campaign Bonuses</p>
              <p className="text-xs text-muted-foreground">Special promotions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="section-card">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-semibold text-foreground">Commission History</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              {['all', 'paid', 'approved', 'pending'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-md transition-all',
                    filter === status 
                      ? 'bg-card text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowExportModal(true)}
              className="btn-outline py-1.5"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="divide-y divide-border">
          {filteredCommissions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No commissions found for this filter
            </div>
          ) : (
            filteredCommissions.map((commission, index) => (
              <div 
                key={commission.id} 
                className="p-4 hover:bg-muted/30 transition-colors animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleViewDetails(commission)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', getTypeColor(commission.type))}>
                    {getTypeIcon(commission.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{commission.description}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(commission.date)}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-primary">+{formatCurrency(commission.amount)}</p>
                      <span className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded-full',
                        commission.status === 'paid' && 'bg-emerald-100 text-emerald-700',
                        commission.status === 'approved' && 'bg-blue-100 text-blue-700',
                        commission.status === 'pending' && 'bg-amber-100 text-amber-700',
                      )}>
                        {commission.status === 'paid' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                        {commission.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                        {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                      </span>
                    </div>
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Commissions"
        dataType="commissions"
      />

      {/* Commission Detail Modal */}
      {showDetailModal && selectedCommission && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDetailModal(false)}>
          <div 
            className="bg-card rounded-2xl shadow-elevated max-w-md w-full animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Commission Details</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={cn('p-3 rounded-xl', getTypeColor(selectedCommission.type))}>
                  {getTypeIcon(selectedCommission.type)}
                </div>
                <div>
                  <p className="font-semibold text-lg">{getTypeName(selectedCommission.type)}</p>
                  <span className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    selectedCommission.status === 'paid' && 'bg-emerald-100 text-emerald-700',
                    selectedCommission.status === 'approved' && 'bg-blue-100 text-blue-700',
                    selectedCommission.status === 'pending' && 'bg-amber-100 text-amber-700',
                  )}>
                    {selectedCommission.status.charAt(0).toUpperCase() + selectedCommission.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Commission Amount</p>
                <p className="text-3xl font-bold text-primary">+{formatCurrency(selectedCommission.amount)}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Description</span>
                  <span className="font-medium text-right max-w-[200px]">{selectedCommission.description}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{formatDate(selectedCommission.date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Commission ID</span>
                  <code className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{selectedCommission.id}</code>
                </div>
                {selectedCommission.seller && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Seller</span>
                    <span className="font-medium">{selectedCommission.seller}</span>
                  </div>
                )}
                {selectedCommission.buyer && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Buyer</span>
                    <span className="font-medium">{selectedCommission.buyer}</span>
                  </div>
                )}
                {selectedCommission.campaign && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Campaign</span>
                    <span className="font-medium">{selectedCommission.campaign}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="btn-outline flex-1"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    toast.success('Receipt downloaded');
                    setShowDetailModal(false);
                  }}
                  className="btn-action flex-1"
                >
                  <FileText className="w-4 h-4" />
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

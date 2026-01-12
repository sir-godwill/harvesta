import { useState, useEffect } from 'react';
import { fetchAffiliateCampaigns, joinCampaign, leaveCampaign, createReferralLink } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/mockData';
import { 
  Gift, 
  Calendar, 
  TrendingUp, 
  Users,
  Clock,
  CheckCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Link2,
  Share2,
  Eye,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SocialShareModal } from '@/components/ui/SocialShareModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';

export function CampaignsTab() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState({ link: '', qrCode: '', campaign: '' });
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    try {
      const data = await fetchAffiliateCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleJoinLeave = async (campaign: any) => {
    if (campaign.joined) {
      setSelectedCampaign(campaign);
      setShowLeaveModal(true);
      return;
    }
    
    setJoiningId(campaign.id);
    try {
      await joinCampaign(campaign.id);
      toast.success(`Successfully joined ${campaign.name}!`);
      setCampaigns(prev => 
        prev.map(c => 
          c.id === campaign.id ? { ...c, joined: true } : c
        )
      );
    } catch (error) {
      toast.error('Failed to join campaign');
    } finally {
      setJoiningId(null);
    }
  };

  const handleLeaveConfirm = async () => {
    if (!selectedCampaign) return;
    setJoiningId(selectedCampaign.id);
    try {
      await leaveCampaign(selectedCampaign.id);
      toast.success(`Left ${selectedCampaign.name}`);
      setCampaigns(prev => 
        prev.map(c => 
          c.id === selectedCampaign.id ? { ...c, joined: false } : c
        )
      );
      setShowLeaveModal(false);
    } catch (error) {
      toast.error('Failed to leave campaign');
    } finally {
      setJoiningId(null);
    }
  };

  const handleGenerateCampaignLink = async (campaign: any) => {
    try {
      const result = await createReferralLink(campaign.id);
      setShareData({
        link: result.link,
        qrCode: result.qrCode,
        campaign: campaign.name,
      });
      setShowShareModal(true);
    } catch (error) {
      toast.error('Failed to generate campaign link');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="badge-success flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        );
      case 'upcoming':
        return (
          <span className="badge-info flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Upcoming
          </span>
        );
      case 'ended':
        return (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            Ended
          </span>
        );
      default:
        return null;
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleViewDetails = (campaign: any) => {
    setSelectedCampaign(campaign);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const upcomingCampaigns = campaigns.filter(c => c.status === 'upcoming');
  const joinedCampaigns = campaigns.filter(c => c.joined);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Campaigns</h2>
        <p className="text-sm text-muted-foreground">Join campaigns to earn bonus commissions</p>
      </div>

      {/* Active Campaigns Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card-green">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeCampaigns.length}</p>
              <p className="text-sm text-muted-foreground">Active Campaigns</p>
            </div>
          </div>
        </div>
        <div className="stat-card-orange">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {joinedCampaigns.reduce((acc, c) => acc + c.referrals, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Campaign Referrals</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(joinedCampaigns.reduce((acc, c) => acc + c.earnings, 0))}
              </p>
              <p className="text-sm text-muted-foreground">Campaign Earnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Campaigns */}
      {joinedCampaigns.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            My Campaigns ({joinedCampaigns.length})
          </h3>
          <div className="grid gap-4">
            {joinedCampaigns.map((campaign, index) => (
              <div 
                key={`joined-${campaign.id}`} 
                className="section-card p-5 ring-2 ring-primary/20 border-primary/30 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg text-foreground">{campaign.name}</h4>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm mb-3">
                      <div className="flex items-center gap-1 text-primary font-medium">
                        <TrendingUp className="w-4 h-4" />
                        +{campaign.bonusRate}% bonus
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {campaign.referrals} referrals
                      </div>
                      {campaign.status === 'active' && (
                        <div className="flex items-center gap-1 text-amber-600 font-medium">
                          <Clock className="w-4 h-4" />
                          {getDaysRemaining(campaign.endDate)} days left
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-muted px-3 py-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">Your Earnings</p>
                        <p className="text-lg font-bold text-primary">{formatCurrency(campaign.earnings)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleGenerateCampaignLink(campaign)}
                      className="btn-action"
                    >
                      <Link2 className="w-4 h-4" />
                      Get Link
                    </button>
                    <button
                      onClick={() => handleViewDetails(campaign)}
                      className="btn-outline"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </button>
                    <button
                      onClick={() => handleJoinLeave(campaign)}
                      disabled={joiningId === campaign.id}
                      className="btn-outline text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      {joiningId === campaign.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Leave'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Campaigns */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Available Campaigns
        </h3>
        <div className="grid gap-4">
          {activeCampaigns.filter(c => !c.joined).map((campaign, index) => (
            <div 
              key={campaign.id} 
              className="section-card p-5 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-lg text-foreground">{campaign.name}</h4>
                    {getStatusBadge(campaign.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                    </div>
                    <div className="flex items-center gap-1 text-primary font-medium">
                      <TrendingUp className="w-4 h-4" />
                      +{campaign.bonusRate}% bonus commission
                    </div>
                    <div className="flex items-center gap-1 text-amber-600 font-medium">
                      <Clock className="w-4 h-4" />
                      {getDaysRemaining(campaign.endDate)} days left
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleJoinLeave(campaign)}
                  disabled={joiningId === campaign.id}
                  className="btn-action"
                >
                  {joiningId === campaign.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Join Campaign
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
          
          {activeCampaigns.filter(c => !c.joined).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              You've joined all active campaigns! 🎉
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Campaigns */}
      {upcomingCampaigns.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Upcoming Campaigns
          </h3>
          <div className="grid gap-4">
            {upcomingCampaigns.map((campaign, index) => (
              <div 
                key={campaign.id} 
                className="section-card p-5 bg-muted/30 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg text-foreground">{campaign.name}</h4>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Starts {formatDate(campaign.startDate)}
                      </div>
                      <div className="flex items-center gap-1 text-primary font-medium">
                        <TrendingUp className="w-4 h-4" />
                        +{campaign.bonusRate}% bonus commission
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinLeave(campaign)}
                    disabled={joiningId === campaign.id}
                    className={cn(
                      campaign.joined ? 'btn-outline' : 'btn-primary'
                    )}
                  >
                    {joiningId === campaign.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : campaign.joined ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Registered
                      </>
                    ) : (
                      'Get Notified'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      <SocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        link={shareData.link}
        qrCode={shareData.qrCode}
        campaign={shareData.campaign}
      />

      {/* Leave Campaign Confirmation */}
      <ConfirmModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleLeaveConfirm}
        title="Leave Campaign"
        message={`Are you sure you want to leave ${selectedCampaign?.name}? You'll stop earning bonus commissions from this campaign.`}
        confirmText="Leave Campaign"
        variant="warning"
        isLoading={joiningId === selectedCampaign?.id}
      />

      {/* Campaign Detail Modal */}
      {showDetailModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDetailModal(false)}>
          <div 
            className="bg-card rounded-2xl shadow-elevated max-w-lg w-full animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Campaign Details</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{selectedCampaign.name}</h4>
                  {getStatusBadge(selectedCampaign.status)}
                </div>
              </div>
              
              <p className="text-muted-foreground">{selectedCampaign.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Bonus Rate</p>
                  <p className="text-xl font-bold text-primary">+{selectedCampaign.bonusRate}%</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium">{formatDate(selectedCampaign.startDate)} - {formatDate(selectedCampaign.endDate)}</p>
                </div>
              </div>
              
              {selectedCampaign.joined && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h5 className="font-medium mb-3">Your Performance</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Referrals</p>
                      <p className="text-2xl font-bold">{selectedCampaign.referrals}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Earnings</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(selectedCampaign.earnings)}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-2">
                {selectedCampaign.joined ? (
                  <>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        handleGenerateCampaignLink(selectedCampaign);
                      }}
                      className="btn-action flex-1 justify-center"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Campaign Link
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleJoinLeave(selectedCampaign);
                    }}
                    className="btn-action flex-1 justify-center"
                  >
                    Join Campaign
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

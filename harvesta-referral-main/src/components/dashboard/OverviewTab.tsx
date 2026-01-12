import { useEffect, useState } from 'react';
import { StatCard } from './StatCard';
import { 
  MousePointerClick, 
  Users, 
  Store, 
  Wallet, 
  TrendingUp,
  Link2,
  UserPlus,
  Gift,
  ArrowRight,
  Loader2,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { fetchReferralStats, fetchCommissionDetails, createReferralLink } from '@/lib/api';
import { formatCurrency, simulatedData } from '@/lib/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';
import { SocialShareModal } from '@/components/ui/SocialShareModal';
import { toast } from 'sonner';

interface OverviewTabProps {
  onNavigate: (tab: string) => void;
}

export function OverviewTab({ onNavigate }: OverviewTabProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [referralLink, setReferralLink] = useState<{ link: string; qrCode: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const referralStats = await fetchReferralStats();
        setStats(referralStats);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleGenerateLink = async () => {
    setGeneratingLink(true);
    try {
      const result = await createReferralLink();
      setReferralLink({ link: result.link, qrCode: result.qrCode });
      toast.success('Referral link generated!');
    } catch (error) {
      toast.error('Failed to generate link');
    } finally {
      setGeneratingLink(false);
    }
  };

  const copyToClipboard = async () => {
    if (referralLink) {
      await navigator.clipboard.writeText(referralLink.link);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
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
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
        <h2 className="text-xl font-bold mb-1">Welcome back, Kwame! 👋</h2>
        <p className="text-primary-foreground/80 text-sm">
          Here's an overview of your affiliate performance this month
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Clicks"
          value={stats?.totalClicks?.toLocaleString() || '0'}
          icon={MousePointerClick}
          trend={12.5}
          trendLabel="vs last week"
          variant="green"
        />
        <StatCard
          title="Buyers Referred"
          value={stats?.buyersReferred || '0'}
          icon={Users}
          trend={8.3}
          variant="orange"
        />
        <StatCard
          title="Sellers Onboarded"
          value={stats?.sellersOnboarded || '0'}
          icon={Store}
          trend={15.2}
          variant="brown"
        />
        <StatCard
          title="This Month"
          value={formatCurrency(simulatedData.commissionSummary.thisMonth)}
          icon={Wallet}
          trend={simulatedData.commissionSummary.monthlyGrowth}
          variant="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="section-card p-4">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button 
            onClick={handleGenerateLink}
            disabled={generatingLink}
            className="btn-action justify-center"
          >
            {generatingLink ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Link2 className="w-4 h-4" />
            )}
            Generate Referral Link
          </button>
          <button 
            onClick={() => onNavigate('sellers')}
            className="btn-primary justify-center"
          >
            <UserPlus className="w-4 h-4" />
            Invite Seller
          </button>
          <button 
            onClick={() => onNavigate('campaigns')}
            className="btn-outline justify-center"
          >
            <Gift className="w-4 h-4" />
            Join Campaign
          </button>
        </div>

        {/* Generated Link Display */}
        {referralLink && (
          <div className="mt-4 p-4 bg-muted rounded-lg animate-fade-in">
            <p className="text-xs text-muted-foreground mb-2">Your Referral Link:</p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <code className="flex-1 text-sm font-mono bg-background p-3 rounded border border-border truncate">
                {referralLink.link}
              </code>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="btn-outline py-2 px-3 flex-1 sm:flex-none"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="btn-action py-2 px-3 flex-1 sm:flex-none"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Performance Chart */}
      <div className="section-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Performance Overview</h3>
            <p className="text-sm text-muted-foreground">Weekly referral trends</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              Clicks
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent" />
              Signups
            </span>
          </div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={simulatedData.analytics.dailyClicks}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(140 52% 37%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(140 52% 37%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(24 95% 53%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(24 95% 53%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="clicks" 
                stroke="hsl(140 52% 37%)" 
                fillOpacity={1} 
                fill="url(#colorClicks)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="signups" 
                stroke="hsl(24 95% 53%)" 
                fillOpacity={1} 
                fill="url(#colorSignups)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Commissions */}
      <div className="section-card">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Commissions</h3>
          <button 
            onClick={() => onNavigate('commissions')}
            className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y divide-border">
          {simulatedData.commissionDetails.slice(0, 4).map((commission) => (
            <div key={commission.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  commission.type === 'seller_referral' && 'bg-primary/10 text-primary',
                  commission.type === 'buyer_referral' && 'bg-accent/10 text-accent',
                  commission.type === 'campaign_bonus' && 'bg-purple-100 text-purple-600',
                )}>
                  {commission.type === 'seller_referral' && <Store className="w-5 h-5" />}
                  {commission.type === 'buyer_referral' && <Users className="w-5 h-5" />}
                  {commission.type === 'campaign_bonus' && <Gift className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{commission.description}</p>
                  <p className="text-xs text-muted-foreground">{new Date(commission.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">+{formatCurrency(commission.amount)}</p>
                <span className={cn(
                  'text-xs font-medium',
                  commission.status === 'paid' && 'badge-success',
                  commission.status === 'approved' && 'badge-info',
                  commission.status === 'pending' && 'badge-pending',
                )}>
                  {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {referralLink && (
        <SocialShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          link={referralLink.link}
          qrCode={referralLink.qrCode}
        />
      )}
    </div>
  );
}

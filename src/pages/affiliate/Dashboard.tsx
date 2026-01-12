import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Link2,
  Users,
  Wallet,
  TrendingUp,
  Gift,
  ArrowRight,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  fetchAgentProfile,
  fetchReferralMetrics,
  fetchReferrals,
  fetchCampaigns,
  fetchPayouts,
  generateReferralLink,
  type AgentUser,
  type ReferralMetrics,
  type Referral,
  type Campaign,
  type Payout,
} from '@/services/referral-api';
import { Link } from 'react-router-dom';

function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  variant = 'default',
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle?: string;
  variant?: 'primary' | 'accent' | 'success' | 'default';
}) {
  const variantStyles = {
    primary: 'border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5',
    accent: 'border-accent/20 bg-gradient-to-br from-accent/10 to-accent/5',
    success: 'border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5',
    default: 'border-border bg-card',
  };

  const iconStyles = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-emerald-500/10 text-emerald-500',
    default: 'bg-muted text-muted-foreground',
  };

  return (
    <Card className={`${variantStyles[variant]} border`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className={`p-2 rounded-lg ${iconStyles[variant]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-emerald-500 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AffiliateDashboard() {
  const [agent, setAgent] = useState<AgentUser | null>(null);
  const [metrics, setMetrics] = useState<ReferralMetrics | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [referralLink, setReferralLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [agentData, metricsData, referralsData, campaignsData, payoutsData, link] = await Promise.all([
          fetchAgentProfile(),
          fetchReferralMetrics(),
          fetchReferrals(),
          fetchCampaigns(),
          fetchPayouts(),
          generateReferralLink(),
        ]);
        setAgent(agentData);
        setMetrics(metricsData);
        setReferrals(referralsData);
        setCampaigns(campaignsData);
        setPayouts(payoutsData);
        setReferralLink(link);
      } catch (error) {
        console.error('Failed to load affiliate data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: 'Link copied!',
      description: 'Referral link copied to clipboard',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-CM').format(amount) + ' XAF';
  };

  const getStatusBadge = (status: Referral['status']) => {
    const styles = {
      pending: 'bg-orange-500/10 text-orange-600',
      active: 'bg-blue-500/10 text-blue-600',
      completed: 'bg-emerald-500/10 text-emerald-600',
      expired: 'bg-gray-500/10 text-gray-600',
    };
    return styles[status] || styles.pending;
  };

  const getTierColor = (tier: string) => {
    const colors = {
      Bronze: 'text-orange-600',
      Silver: 'text-gray-500',
      Gold: 'text-yellow-600',
      Platinum: 'text-purple-600',
    };
    return colors[tier as keyof typeof colors] || 'text-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">
                {agent?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AG'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{agent?.name || 'Agent Dashboard'}</h1>
              <div className="flex items-center gap-2">
                <Badge className={getTierColor(agent?.tier || 'Bronze')} variant="outline">
                  {agent?.tier || 'Bronze'} Agent
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {agent?.totalReferrals || 0} total referrals
                </span>
              </div>
            </div>
          </div>
          <Button size="sm" asChild>
            <Link to="/affiliate/payouts">
              <Wallet className="w-4 h-4 mr-2" />
              Request Payout
            </Link>
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Referral Link Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Your Referral Link</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Share this link to earn commissions on new signups
                </p>
                <div className="flex items-center gap-2 bg-background/50 rounded-lg p-2 border border-border">
                  <code className="text-sm flex-1 truncate">{referralLink}</code>
                  <Button variant="ghost" size="icon" onClick={copyReferralLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyReferralLink}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button size="sm" asChild>
                  <Link to="/affiliate/links">
                    <Link2 className="w-4 h-4 mr-2" />
                    Manage Links
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Referrals"
            value={metrics?.totalReferrals ?? '—'}
            icon={Users}
            variant="primary"
          />
          <StatCard
            title="Active Referrals"
            value={metrics?.activeReferrals ?? '—'}
            icon={TrendingUp}
            subtitle={`${metrics?.conversionRate ?? 0}% conversion`}
            variant="accent"
          />
          <StatCard
            title="Total Earnings"
            value={metrics ? formatAmount(metrics.totalEarnings) : '—'}
            icon={Wallet}
            variant="success"
          />
          <StatCard
            title="Pending Earnings"
            value={metrics ? formatAmount(metrics.pendingEarnings) : '—'}
            icon={Wallet}
            subtitle="Awaiting approval"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Referrals */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Recent Referrals</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/affiliate/links">
                    View all <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {referrals.slice(0, 5).map((referral) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{referral.referredUserName}</p>
                          <Badge className={getStatusBadge(referral.status)} variant="secondary">
                            {referral.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {referral.referredUserType === 'seller' ? '🏪 Seller' : '🛒 Buyer'} • 
                          {' '}{new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${referral.commission > 0 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                          {referral.commission > 0 ? `+${formatAmount(referral.commission)}` : 'Pending'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Active Campaigns */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Gift className="w-4 h-4 text-primary" />
                  Active Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {campaigns.filter(c => c.isActive).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="p-3 bg-gradient-to-br from-primary/5 to-transparent rounded-lg border border-primary/10"
                  >
                    <p className="font-medium text-sm">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">{campaign.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-600 font-medium">
                        +{campaign.commissionRate}% commission
                      </span>
                      <span className="text-muted-foreground">
                        Ends {new Date(campaign.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/affiliate/campaigns">
                    View all campaigns <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Payouts */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Payouts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {payouts.slice(0, 3).map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                  >
                    <div>
                      <p className="text-sm font-medium">{formatAmount(payout.amount)}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {payout.method.replace('_', ' ')}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        payout.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : payout.status === 'processing'
                          ? 'bg-blue-500/10 text-blue-600'
                          : 'bg-orange-500/10 text-orange-600'
                      }
                    >
                      {payout.status}
                    </Badge>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/affiliate/payouts">
                    View all payouts <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

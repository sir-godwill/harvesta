import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Copy,
  Share2,
  ExternalLink,
  Gift,
  Target,
  Store,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  getAffiliateProfile,
  getAffiliateStats,
  createAffiliate,
  generateAffiliateLink,
} from '@/lib/affiliate-api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function AffiliateDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [affiliateLink, setAffiliateLink] = useState('');
  const [affiliateCode, setAffiliateCode] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      let { data: affiliate } = await getAffiliateProfile();

      // If not an affiliate, create account
      if (!affiliate) {
        const { data: newAffiliate, error } = await createAffiliate();
        if (error) throw error;
        affiliate = newAffiliate;
      }

      // Load stats
      const { data: statsData, error: statsError } = await getAffiliateStats();
      if (statsError) throw statsError;

      setStats(statsData);
      setAffiliateCode(affiliate!.affiliate_code);
      setAffiliateLink(generateAffiliateLink(affiliate!.affiliate_code));
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Harvestá',
          text: 'Sign up using my affiliate link and get the best agricultural products!',
          url: affiliateLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard(affiliateLink);
    }
  };

  const monthlyGoal = 500000;
  const monthlyProgress = stats ? (stats.monthlyEarnings / monthlyGoal) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Here's your affiliate performance overview</p>
        </div>
        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
          <Gift className="h-3 w-3 mr-1" />
          {stats?.total_referrals >= 50 ? 'Gold' : stats?.total_referrals >= 20 ? 'Silver' : 'Bronze'} Partner
        </Badge>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {/* Referral Link Card */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-lg mb-1">Your Referral Link</h2>
                  <p className="text-sm text-muted-foreground mb-3">Share this link to earn commissions</p>
                  <div className="flex items-center gap-2 bg-background/80 p-2 rounded-lg max-w-md">
                    <span className="text-sm truncate font-mono">{affiliateLink}</span>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(affiliateLink)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => copyToClipboard(affiliateCode)}>
                    <Copy className="h-4 w-4 mr-2" />Copy Code
                  </Button>
                  <Button onClick={shareLink}>
                    <Share2 className="h-4 w-4 mr-2" />Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-green-100">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">{stats?.total_earnings?.toLocaleString() || 0} XAF</p>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">{stats?.total_referrals || 0}</p>
              <p className="text-sm text-muted-foreground">Active Referrals</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-purple-100">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">{stats?.conversion_rate?.toFixed(1) || 0}%</p>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">{stats?.pending_earnings?.toLocaleString() || 0} XAF</p>
              <p className="text-sm text-muted-foreground">Pending Payout</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
          {/* Recent Referrals */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
              <CardDescription>Your latest referral activity</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.recentReferrals?.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentReferrals.map((ref: any) => (
                    <div key={ref.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'p-2 rounded-lg',
                          ref.referral_type === 'buyer' ? 'bg-blue-100' : 'bg-green-100'
                        )}>
                          {ref.referral_type === 'buyer' ?
                            <Users className="h-4 w-4 text-blue-600" /> :
                            <Store className="h-4 w-4 text-green-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">{ref.referred_user?.full_name || 'User'}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {ref.referral_type} • {ref.milestone_achieved || 'Signup'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">+{ref.reward_amount} XAF</p>
                        <Badge variant="secondary" className={cn(
                          'text-xs',
                          ref.status === 'approved' && 'bg-green-100 text-green-800',
                          ref.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                          ref.status === 'rejected' && 'bg-red-100 text-red-800'
                        )}>
                          {ref.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No referrals yet</p>
                  <p className="text-sm text-muted-foreground">Share your link to start earning!</p>
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/affiliate/referrals')}>
                View All Referrals
              </Button>
            </CardContent>
          </Card>

          {/* Reward Info */}
          <Card>
            <CardHeader>
              <CardTitle>Reward Structure</CardTitle>
              <CardDescription>Earn commissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">Buyer Referrals</p>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">Active</Badge>
                </div>
                <p className="text-sm text-primary font-semibold">200 XAF per user</p>
                <p className="text-xs text-muted-foreground mt-1">When they make a purchase</p>
              </div>

              <div className="p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">Seller Referrals</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Active</Badge>
                </div>
                <p className="text-sm text-primary font-semibold">500 XAF per seller</p>
                <p className="text-xs text-muted-foreground mt-1">When they verify or make a sale</p>
              </div>

              <Button variant="outline" className="w-full" onClick={() => navigate('/affiliate/wallet')}>
                <ExternalLink className="h-4 w-4 mr-2" />View Wallet
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Goal */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Monthly Goal Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {stats?.monthlyEarnings?.toLocaleString() || 0} XAF earned
                  </span>
                  <span className="text-sm font-medium">{monthlyGoal.toLocaleString()} XAF goal</span>
                </div>
                <Progress value={monthlyProgress} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  You're {monthlyProgress.toFixed(0)}% towards your monthly goal. Keep going! 🎯
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

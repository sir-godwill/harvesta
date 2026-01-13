import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, DollarSign, TrendingUp, Link2, Gift, BarChart3, 
  Bell, Settings, Store, Wallet, Target, Copy, Share2,
  ArrowUpRight, ArrowDownRight, ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const stats = [
  { title: 'Total Earnings', value: '245,000 XAF', trend: 12.5, icon: DollarSign, color: 'text-green-600 bg-green-100' },
  { title: 'Active Referrals', value: '48', trend: 8.2, icon: Users, color: 'text-blue-600 bg-blue-100' },
  { title: 'Conversion Rate', value: '24%', trend: -2.1, icon: TrendingUp, color: 'text-purple-600 bg-purple-100' },
  { title: 'Pending Payout', value: '45,000 XAF', trend: 0, icon: Wallet, color: 'text-orange-600 bg-orange-100' },
];

const recentReferrals = [
  { id: '1', name: 'Fresh Markets Inc', type: 'buyer', earnings: '12,500 XAF', status: 'completed', date: '2 hours ago' },
  { id: '2', name: 'Organic Farm Co', type: 'seller', earnings: '25,000 XAF', status: 'pending', date: '1 day ago' },
  { id: '3', name: 'Global Foods Ltd', type: 'buyer', earnings: '8,000 XAF', status: 'completed', date: '2 days ago' },
  { id: '4', name: 'Local Wholesaler', type: 'seller', earnings: '15,000 XAF', status: 'processing', date: '3 days ago' },
];

const campaigns = [
  { id: '1', name: 'New Year Bonus', reward: '+50% commission', ends: '5 days left', active: true },
  { id: '2', name: 'Seller Onboarding', reward: '10,000 XAF per seller', ends: 'Ongoing', active: true },
  { id: '3', name: 'Bulk Buyer Special', reward: '5% extra', ends: '10 days left', active: true },
];

export default function AffiliateDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const referralCode = 'HARVEST-JPK-2024';
  const referralLink = `https://harvesta.cm/ref/${referralCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Affiliate Dashboard</h1>
              <p className="text-xs text-muted-foreground">Welcome back, Jean-Pierre</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              <Gift className="h-3 w-3 mr-1" />Silver Partner
            </Badge>
            <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><Settings className="h-5 w-5" /></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Referral Link Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-lg mb-1">Your Referral Link</h2>
                    <p className="text-sm text-muted-foreground mb-3">Share this link to earn commissions</p>
                    <div className="flex items-center gap-2 bg-background/80 p-2 rounded-lg max-w-md">
                      <Link2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm truncate">{referralLink}</span>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(referralLink)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => copyToClipboard(referralCode)}>
                      <Copy className="h-4 w-4 mr-2" />Copy Code
                    </Button>
                    <Button>
                      <Share2 className="h-4 w-4 mr-2" />Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className={cn('p-2 rounded-lg', stat.color)}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    {stat.trend !== 0 && (
                      <span className={cn(
                        'text-xs font-medium flex items-center',
                        stat.trend > 0 ? 'text-green-600' : 'text-red-600'
                      )}>
                        {stat.trend > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(stat.trend)}%
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold mt-3">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Main Content */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6 mt-6">
            {/* Recent Referrals */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Referrals</CardTitle>
                <CardDescription>Your latest referral activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReferrals.map((ref) => (
                    <div key={ref.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'p-2 rounded-lg',
                          ref.type === 'buyer' ? 'bg-blue-100' : 'bg-green-100'
                        )}>
                          {ref.type === 'buyer' ? <Users className="h-4 w-4 text-blue-600" /> : <Store className="h-4 w-4 text-green-600" />}
                        </div>
                        <div>
                          <p className="font-medium">{ref.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{ref.type} • {ref.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{ref.earnings}</p>
                        <Badge variant="secondary" className={cn(
                          'text-xs',
                          ref.status === 'completed' && 'bg-green-100 text-green-800',
                          ref.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                          ref.status === 'processing' && 'bg-blue-100 text-blue-800'
                        )}>
                          {ref.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">View All Referrals</Button>
              </CardContent>
            </Card>

            {/* Active Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>Earn bonus rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="p-3 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{campaign.name}</p>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Active</Badge>
                    </div>
                    <p className="text-sm text-primary font-semibold">{campaign.reward}</p>
                    <p className="text-xs text-muted-foreground mt-1">{campaign.ends}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />Browse All Campaigns
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Monthly Goal */}
          <motion.div variants={itemVariants} className="mt-6">
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
                    <span className="text-sm text-muted-foreground">245,000 XAF earned</span>
                    <span className="text-sm font-medium">500,000 XAF goal</span>
                  </div>
                  <Progress value={49} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    You're 49% towards your monthly goal. Keep going! 🎯
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

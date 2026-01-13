import { useState } from 'react';
import { AffiliateLayout } from '@/components/affiliate/AffiliateLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, 
  Calendar, 
  TrendingUp, 
  Users,
  Clock,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Link2,
  Eye,
} from 'lucide-react';

const mockCampaigns = [
  {
    id: 'CMP-001',
    name: 'Cocoa Season Special',
    description: 'Earn extra on cocoa-related referrals during harvest season',
    bonusRate: 15,
    startDate: '2025-12-01',
    endDate: '2026-02-28',
    status: 'active',
    joined: true,
    referrals: 28,
    earnings: 125000,
  },
  {
    id: 'CMP-002',
    name: 'Coffee Export Drive',
    description: 'Special bonus for international coffee buyer referrals',
    bonusRate: 12,
    startDate: '2026-01-15',
    endDate: '2026-03-15',
    status: 'active',
    joined: false,
    referrals: 0,
    earnings: 0,
  },
  {
    id: 'CMP-003',
    name: 'New Year Seller Boost',
    description: 'Welcome new sellers with enhanced commission rates',
    bonusRate: 20,
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    status: 'upcoming',
    joined: false,
    referrals: 0,
    earnings: 0,
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AffiliateCampaigns() {
  const [campaigns, setCampaigns] = useState(mockCampaigns);

  const handleJoinLeave = (campaignId: string) => {
    setCampaigns(prev => 
      prev.map(c => 
        c.id === campaignId ? { ...c, joined: !c.joined } : c
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="bg-emerald-100 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
            Active
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <Clock className="w-3 h-3 mr-1" />
            Upcoming
          </Badge>
        );
      case 'ended':
        return (
          <Badge variant="secondary">Ended</Badge>
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

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const upcomingCampaigns = campaigns.filter(c => c.status === 'upcoming');
  const joinedCampaigns = campaigns.filter(c => c.joined);

  return (
    <AffiliateLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Campaigns</h2>
          <p className="text-sm text-muted-foreground">Join campaigns to earn bonus commissions</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Gift className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeCampaigns.length}</p>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-accent/10 to-transparent">
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
          </Card>
          <Card className="p-4">
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
          </Card>
        </div>

        {/* My Campaigns */}
        {joinedCampaigns.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              My Campaigns ({joinedCampaigns.length})
            </h3>
            {joinedCampaigns.map((campaign) => (
              <Card key={campaign.id} className="p-5 ring-2 ring-primary/20 border-primary/30">
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
                    <div className="bg-muted px-3 py-2 rounded-lg inline-block">
                      <p className="text-xs text-muted-foreground">Your Earnings</p>
                      <p className="text-lg font-bold text-primary">{formatCurrency(campaign.earnings)}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button>
                      <Link2 className="w-4 h-4 mr-2" />
                      Get Link
                    </Button>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                    <Button variant="outline" onClick={() => handleJoinLeave(campaign.id)}>
                      Leave
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Available Campaigns */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Available Campaigns
          </h3>
          {activeCampaigns.filter(c => !c.joined).map((campaign) => (
            <Card key={campaign.id} className="p-5">
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
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
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
                
                <Button onClick={() => handleJoinLeave(campaign.id)}>
                  Join Campaign
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Upcoming Campaigns */}
        {upcomingCampaigns.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Upcoming Campaigns
            </h3>
            {upcomingCampaigns.map((campaign) => (
              <Card key={campaign.id} className="p-5 bg-muted/30">
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
                        Starts {new Date(campaign.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-primary font-medium">
                        <TrendingUp className="w-4 h-4" />
                        +{campaign.bonusRate}% bonus commission
                      </div>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => handleJoinLeave(campaign.id)}>
                    Get Notified
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AffiliateLayout>
  );
}
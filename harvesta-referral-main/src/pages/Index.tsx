import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { OverviewTab } from '@/components/dashboard/OverviewTab';
import { ReferralsTab } from '@/components/dashboard/ReferralsTab';
import { SellersTab } from '@/components/dashboard/SellersTab';
import { CommissionsTab } from '@/components/dashboard/CommissionsTab';
import { CampaignsTab } from '@/components/dashboard/CampaignsTab';
import { AnalyticsTab } from '@/components/dashboard/AnalyticsTab';
import { PayoutsTab } from '@/components/dashboard/PayoutsTab';
import { NotificationsTab } from '@/components/dashboard/NotificationsTab';
import { SettingsTab } from '@/components/dashboard/SettingsTab';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab onNavigate={setActiveTab} />;
      case 'referrals':
        return <ReferralsTab />;
      case 'sellers':
        return <SellersTab />;
      case 'commissions':
        return <CommissionsTab />;
      case 'campaigns':
        return <CampaignsTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'payouts':
        return <PayoutsTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <main className="lg:ml-[280px] pt-16 lg:pt-0">
        <div className="p-4 lg:p-6 max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;

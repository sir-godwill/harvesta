import { useState, useEffect } from 'react';
import { createReferralLink } from '@/lib/api';
import { simulatedData } from '@/lib/mockData';
import { 
  Link2, 
  Copy, 
  Loader2,
  Check,
  Share2,
  Save,
  Trash2,
  Edit2,
  Star,
  MoreVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SocialShareModal } from '@/components/ui/SocialShareModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';

interface SavedLink {
  id: string;
  name: string;
  link: string;
  qrCode: string;
  campaign?: string;
  createdAt: string;
  clicks: number;
  conversions: number;
  isPrimary: boolean;
}

export function ReferralsTab() {
  const [generating, setGenerating] = useState(false);
  const [links, setLinks] = useState<Array<{ link: string; qrCode: string; code: string; campaign?: string }>>([]);
  const [savedLinks, setSavedLinks] = useState<SavedLink[]>([
    {
      id: 'saved-1',
      name: 'Main Referral Link',
      link: 'https://harvesta.app/ref/KWAME01',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://harvesta.app/ref/KWAME01',
      createdAt: '2025-12-01',
      clicks: 847,
      conversions: 45,
      isPrimary: true,
    },
    {
      id: 'saved-2',
      name: 'Cocoa Campaign Link',
      link: 'https://harvesta.app/ref/KWAME01?c=cocoa',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://harvesta.app/ref/KWAME01?c=cocoa',
      campaign: 'Cocoa Season Special',
      createdAt: '2025-12-15',
      clicks: 324,
      conversions: 28,
      isPrimary: false,
    },
  ]);
  const [copied, setCopied] = useState<string | null>(null);
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; link: string; qrCode: string; campaign?: string }>({
    isOpen: false, link: '', qrCode: ''
  });
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [linkName, setLinkName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingLink, setPendingLink] = useState<{ link: string; qrCode: string; code: string; campaign?: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<SavedLink | null>(null);
  const [editingLink, setEditingLink] = useState<SavedLink | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await createReferralLink(selectedCampaign || undefined);
      const newLink = { ...result, campaign: selectedCampaign };
      setLinks(prev => [newLink, ...prev]);
      setPendingLink(newLink);
      setShowSaveModal(true);
    } catch (error) {
      toast.error('Failed to generate link');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveLink = () => {
    if (!pendingLink || !linkName.trim()) {
      toast.error('Please enter a name for this link');
      return;
    }

    const newSavedLink: SavedLink = {
      id: `saved-${Date.now()}`,
      name: linkName,
      link: pendingLink.link,
      qrCode: pendingLink.qrCode,
      campaign: pendingLink.campaign ? simulatedData.campaigns.find(c => c.id === pendingLink.campaign)?.name : undefined,
      createdAt: new Date().toISOString().split('T')[0],
      clicks: 0,
      conversions: 0,
      isPrimary: savedLinks.length === 0,
    };

    setSavedLinks(prev => [newSavedLink, ...prev]);
    setShowSaveModal(false);
    setLinkName('');
    setPendingLink(null);
    toast.success('Link saved successfully!');
  };

  const handleDeleteLink = () => {
    if (!linkToDelete) return;
    setSavedLinks(prev => prev.filter(l => l.id !== linkToDelete.id));
    setShowDeleteModal(false);
    setLinkToDelete(null);
    toast.success('Link deleted');
  };

  const handleSetPrimary = (link: SavedLink) => {
    setSavedLinks(prev => prev.map(l => ({
      ...l,
      isPrimary: l.id === link.id
    })));
    setActiveDropdown(null);
    toast.success(`${link.name} set as primary link`);
  };

  const handleEditName = (link: SavedLink, newName: string) => {
    setSavedLinks(prev => prev.map(l => 
      l.id === link.id ? { ...l, name: newName } : l
    ));
    setEditingLink(null);
    toast.success('Link name updated');
  };

  const copyToClipboard = async (link: string, code: string) => {
    await navigator.clipboard.writeText(link);
    setCopied(code);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const openShareModal = (item: { link: string; qrCode: string; campaign?: string }) => {
    const campaignName = item.campaign 
      ? (typeof item.campaign === 'string' && item.campaign.startsWith('CMP-'))
        ? simulatedData.campaigns.find(c => c.id === item.campaign)?.name 
        : item.campaign
      : undefined;
    setShareModal({ isOpen: true, link: item.link, qrCode: item.qrCode, campaign: campaignName });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Referral Links</h2>
        <p className="text-sm text-muted-foreground">Generate, save, and manage your referral links</p>
      </div>

      {/* Link Generator */}
      <div className="section-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Generate New Link</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Campaign (Optional)
            </label>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="">General Referral Link</option>
              {simulatedData.campaigns
                .filter(c => c.status === 'active' && c.joined)
                .map(campaign => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name} (+{campaign.bonusRate}% bonus)
                  </option>
                ))}
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-action w-full sm:w-auto"
          >
            {generating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Link2 className="w-4 h-4" />
            )}
            Generate Referral Link
          </button>
        </div>
      </div>

      {/* Saved Links */}
      {savedLinks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Save className="w-5 h-5 text-primary" />
              Saved Links ({savedLinks.length})
            </h3>
          </div>
          
          {savedLinks.map((savedLink, index) => (
            <div 
              key={savedLink.id} 
              className={cn(
                "section-card p-4 animate-fade-in",
                savedLink.isPrimary && "ring-2 ring-primary/30 border-primary/30"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* QR Code */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 lg:w-28 lg:h-28 bg-white rounded-lg border border-border p-2 mx-auto lg:mx-0">
                    <img 
                      src={savedLink.qrCode} 
                      alt="QR Code" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Link Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      {editingLink?.id === savedLink.id ? (
                        <input
                          type="text"
                          defaultValue={savedLink.name}
                          autoFocus
                          onBlur={(e) => handleEditName(savedLink, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditName(savedLink, e.currentTarget.value);
                            if (e.key === 'Escape') setEditingLink(null);
                          }}
                          className="font-medium text-foreground bg-muted px-2 py-1 rounded border border-primary"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{savedLink.name}</p>
                          {savedLink.isPrimary && (
                            <span className="badge-success flex items-center gap-1">
                              <Star className="w-3 h-3" /> Primary
                            </span>
                          )}
                        </div>
                      )}
                      {savedLink.campaign && (
                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {savedLink.campaign}
                        </span>
                      )}
                    </div>
                    
                    {/* Actions Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === savedLink.id ? null : savedLink.id)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                      
                      {activeDropdown === savedLink.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-40"
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute right-0 top-10 bg-card border border-border rounded-lg shadow-lg z-50 py-1 min-w-[150px]">
                            <button
                              onClick={() => {
                                setEditingLink(savedLink);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Rename
                            </button>
                            {!savedLink.isPrimary && (
                              <button
                                onClick={() => handleSetPrimary(savedLink)}
                                className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center gap-2"
                              >
                                <Star className="w-4 h-4" />
                                Set as Primary
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setLinkToDelete(savedLink);
                                setShowDeleteModal(true);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center gap-2 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <code className="flex-1 text-sm font-mono truncate">{savedLink.link}</code>
                    <button
                      onClick={() => copyToClipboard(savedLink.link, savedLink.id)}
                      className="p-2 hover:bg-background rounded transition-colors"
                    >
                      {copied === savedLink.id ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Clicks:</span>
                      <span className="ml-1 font-medium text-foreground">{savedLink.clicks}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Conversions:</span>
                      <span className="ml-1 font-medium text-primary">{savedLink.conversions}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <span className="ml-1 font-medium text-foreground">
                        {new Date(savedLink.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => copyToClipboard(savedLink.link, savedLink.id)}
                      className="btn-outline text-sm py-1.5"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </button>
                    <button
                      onClick={() => openShareModal(savedLink)}
                      className="btn-action text-sm py-1.5"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recently Generated Links */}
      {links.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Recently Generated</h3>
          {links.map((item, index) => (
            <div 
              key={item.code} 
              className="section-card p-4 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* QR Code */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-white rounded-lg border border-border p-2 mx-auto lg:mx-0">
                    <img 
                      src={item.qrCode} 
                      alt="QR Code" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Link Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Referral Link</p>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <code className="flex-1 text-sm font-mono truncate">{item.link}</code>
                      <button
                        onClick={() => copyToClipboard(item.link, item.code)}
                        className="p-2 hover:bg-background rounded transition-colors"
                      >
                        {copied === item.code ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                  {item.campaign && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Campaign: </span>
                      <span className="badge-success">
                        {simulatedData.campaigns.find(c => c.id === item.campaign)?.name}
                      </span>
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setPendingLink(item);
                        setShowSaveModal(true);
                      }}
                      className="btn-outline text-sm py-1.5"
                    >
                      <Save className="w-4 h-4" />
                      Save Link
                    </button>
                    <button
                      onClick={() => openShareModal(item)}
                      className="btn-action text-sm py-1.5"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips Section */}
      <div className="section-card p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <h3 className="font-semibold text-foreground mb-3">💡 Tips for Better Conversions</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            Share your link in farming and agriculture WhatsApp groups
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            Use campaign-specific links for bonus commissions
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            QR codes work great for in-person networking at markets
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            Post on social media with product highlights from Harvestá
          </li>
        </ul>
      </div>

      {/* Save Link Modal */}
      {showSaveModal && pendingLink && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSaveModal(false)}>
          <div 
            className="bg-card rounded-2xl shadow-elevated max-w-md w-full animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Save Referral Link</h3>
              <p className="text-sm text-muted-foreground">Give this link a name to save it for later</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Link Name</label>
                <input
                  type="text"
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                  placeholder="e.g., Facebook Campaign Link"
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  autoFocus
                />
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Link URL</p>
                <code className="text-sm font-mono">{pendingLink.link}</code>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowSaveModal(false)} className="btn-outline flex-1">
                  Cancel
                </button>
                <button onClick={handleSaveLink} className="btn-action flex-1">
                  <Save className="w-4 h-4" />
                  Save Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setLinkToDelete(null);
        }}
        onConfirm={handleDeleteLink}
        title="Delete Link"
        message={`Are you sure you want to delete "${linkToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ isOpen: false, link: '', qrCode: '' })}
        link={shareModal.link}
        qrCode={shareModal.qrCode}
        campaign={shareModal.campaign}
      />
    </div>
  );
}

import { useState } from 'react';
import { AffiliateLayout } from '@/components/affiliate/AffiliateLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Link2, 
  Copy, 
  Check,
  Share2,
  Save,
  Star,
  MoreVertical,
  Loader2,
} from 'lucide-react';
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

const mockSavedLinks: SavedLink[] = [
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
];

export default function AffiliateReferrals() {
  const [savedLinks] = useState<SavedLink[]>(mockSavedLinks);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast.success('New referral link generated!');
    }, 1000);
  };

  const copyToClipboard = async (link: string, id: string) => {
    await navigator.clipboard.writeText(link);
    setCopied(id);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <AffiliateLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Referral Links</h2>
          <p className="text-sm text-muted-foreground">Generate, save, and manage your referral links</p>
        </div>

        {/* Link Generator */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Generate New Link</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Campaign (Optional)
              </label>
              <select className="w-full p-3 border border-border rounded-lg bg-background text-foreground">
                <option value="">General Referral Link</option>
                <option value="cocoa">Cocoa Season Special (+15% bonus)</option>
                <option value="coffee">Coffee Export Drive (+12% bonus)</option>
              </select>
            </div>
            <Button onClick={handleGenerate} disabled={generating} className="w-full sm:w-auto">
              {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Link2 className="w-4 h-4 mr-2" />}
              Generate Referral Link
            </Button>
          </div>
        </Card>

        {/* Saved Links */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Save className="w-5 h-5 text-primary" />
              Saved Links ({savedLinks.length})
            </h3>
          </div>
          
          {savedLinks.map((savedLink) => (
            <Card 
              key={savedLink.id} 
              className={`p-4 ${savedLink.isPrimary ? 'ring-2 ring-primary/30 border-primary/30' : ''}`}
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
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{savedLink.name}</p>
                        {savedLink.isPrimary && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="w-3 h-3" /> Primary
                          </Badge>
                        )}
                      </div>
                      {savedLink.campaign && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {savedLink.campaign}
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <code className="flex-1 text-sm font-mono truncate">{savedLink.link}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(savedLink.link, savedLink.id)}
                    >
                      {copied === savedLink.id ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(savedLink.link, savedLink.id)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AffiliateLayout>
  );
}
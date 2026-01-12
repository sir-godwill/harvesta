import { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Send,
  Mail,
  Share2,
  QrCode,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: string;
  qrCode?: string;
  title?: string;
  campaign?: string;
}

export function SocialShareModal({ 
  isOpen, 
  onClose, 
  link, 
  qrCode,
  title = 'Share Your Referral Link',
  campaign,
}: SocialShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'social' | 'qr'>('social');

  if (!isOpen) return null;

  const getShareMessage = (platform: string) => {
    const baseMessage = `🌾 Join Harvestá - Africa's leading agro-commerce platform! 

Get access to quality African produce from verified sellers. I've been using it and it's amazing!

Use my referral link to get started:
${link}

${campaign ? `🎁 Special offer: ${campaign}` : ''}

#Harvestá #AfricanAgriculture #FreshProduce`;

    return encodeURIComponent(baseMessage);
  };

  const shareOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366] hover:bg-[#20BD5B]',
      url: `https://wa.me/?text=${getShareMessage('whatsapp')}`,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2] hover:bg-[#0E6AE0]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(`Join me on Harvestá! ${campaign || ''}`)}`,
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      color: 'bg-[#1DA1F2] hover:bg-[#0D95E8]',
      url: `https://twitter.com/intent/tweet?text=${getShareMessage('twitter')}&url=${encodeURIComponent(link)}`,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0A66C2] hover:bg-[#085AA7]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: Send,
      color: 'bg-[#0088CC] hover:bg-[#006DAA]',
      url: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(`Join Harvestá! ${campaign || ''}`)}`,
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      url: `mailto:?subject=${encodeURIComponent('Join me on Harvestá!')}&body=${getShareMessage('email')}`,
    },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (option: typeof shareOptions[0]) => {
    window.open(option.url, '_blank', 'width=600,height=400');
    toast.success(`Opening ${option.name}...`);
  };

  const handleDownloadQR = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = 'harvesta-referral-qr.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-card rounded-2xl shadow-elevated max-w-md w-full animate-scale-in max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        {qrCode && (
          <div className="flex p-1 m-4 mb-0 bg-muted rounded-lg">
            <button
              onClick={() => setActiveTab('social')}
              className={cn(
                'flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2',
                activeTab === 'social' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              )}
            >
              <Share2 className="w-4 h-4" />
              Social Media
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={cn(
                'flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2',
                activeTab === 'qr' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              )}
            >
              <QrCode className="w-4 h-4" />
              QR Code
            </button>
          </div>
        )}

        <div className="p-4 overflow-y-auto">
          {activeTab === 'social' ? (
            <div className="space-y-4">
              {/* Copy Link */}
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Your Referral Link</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono truncate bg-background p-2 rounded border border-border">
                    {link}
                  </code>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      'p-2 rounded-lg transition-all',
                      copied ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-muted'
                    )}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {campaign && (
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <p className="text-sm text-foreground">
                    🎁 <strong>Campaign:</strong> {campaign}
                  </p>
                </div>
              )}

              {/* Share Options */}
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Share via</p>
                <div className="grid grid-cols-3 gap-3">
                  {shareOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleShare(option)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-3 rounded-xl text-white transition-all transform hover:scale-105',
                        option.color
                      )}
                    >
                      <option.icon className="w-6 h-6" />
                      <span className="text-xs font-medium">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pro Tips */}
              <div className="p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-xl border border-primary/20">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  💡 Pro Tips for More Referrals
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Share in agriculture and farming groups</li>
                  <li>• Post during peak hours (8-10 AM, 7-9 PM)</li>
                  <li>• Add a personal message about your experience</li>
                  <li>• Use the QR code for in-person networking</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* QR Code */}
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 bg-white rounded-xl border-2 border-border p-3">
                  <img 
                    src={qrCode} 
                    alt="QR Code" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  Scan this QR code to use your referral link
                </p>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownloadQR}
                className="btn-action w-full justify-center"
              >
                <Download className="w-4 h-4" />
                Download QR Code
              </button>

              {/* Use Cases */}
              <div className="p-4 bg-muted/50 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">Where to use your QR code:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>📋 Print on business cards</li>
                  <li>🏪 Display at your shop or market stall</li>
                  <li>📜 Include in flyers and posters</li>
                  <li>📱 Share at agricultural events</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

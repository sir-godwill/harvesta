import { useState, useEffect } from 'react';
import { fetchAffiliateProfile, updateAffiliateProfile } from '@/lib/api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Bell,
  Globe,
  Shield,
  Loader2,
  Save,
  Copy,
  Check,
  QrCode,
  Smartphone,
  Building2,
  X,
  Eye,
  EyeOff,
  Trash2,
  Link2,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export function SettingsTab() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeSection, setActiveSection] = useState<'personal' | 'payment' | 'notifications' | 'security'>('personal');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    preferredCurrency: 'XAF',
    paymentMethod: 'Mobile Money (MTN)',
    momoNumber: '',
    bankName: '',
    bankAccount: '',
    paypalEmail: '',
    notifications: {
      commissions: true,
      sellers: true,
      campaigns: true,
      payouts: true,
      emailDigest: false,
      smsAlerts: false,
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showPasswords: false,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await fetchAffiliateProfile();
      setProfile(data);
      setFormData(prev => ({
        ...prev,
        name: data.name,
        email: data.email,
        phone: data.phone,
        country: data.country,
        preferredCurrency: data.preferredCurrency,
        paymentMethod: data.paymentMethod,
      }));
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAffiliateProfile(formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    // Simulate password change
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Password changed successfully!');
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '', showPasswords: false });
  };

  const handleDeleteAccount = async () => {
    // Simulate account deletion
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Account deletion requested. You will receive a confirmation email.');
    setShowDeleteModal(false);
  };

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadQRCode = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://harvesta.app/ref/${profile?.id}`;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `harvesta-referral-${profile?.id}.png`;
    link.click();
    toast.success('QR Code downloaded!');
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
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your profile, payment methods, and preferences</p>
      </div>

      {/* Agent ID Card */}
      <div className="section-card p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {profile?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'AG'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{profile?.name}</h3>
                <span className="badge-success">{profile?.tier} Agent</span>
              </div>
              <p className="text-sm text-muted-foreground">Member since {new Date(profile?.joinDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Agent ID</p>
              <code className="text-sm font-mono font-medium">{profile?.id}</code>
            </div>
            <button
              onClick={() => copyToClipboard(profile?.id, 'id')}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
            >
              {copied === 'id' ? (
                <Check className="w-5 h-5 text-primary" />
              ) : (
                <Copy className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={() => setShowQRModal(true)}
              className="btn-outline py-2"
            >
              <QrCode className="w-4 h-4" />
              View QR
            </button>
          </div>
        </div>

        {/* Quick Copy Links */}
        <div className="mt-4 pt-4 border-t border-primary/20">
          <p className="text-xs text-muted-foreground mb-2">Your Referral Link</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono bg-background/50 p-2 rounded border border-border truncate">
              https://harvesta.app/ref/{profile?.id}
            </code>
            <button
              onClick={() => copyToClipboard(`https://harvesta.app/ref/${profile?.id}`, 'link')}
              className="btn-primary py-2"
            >
              {copied === 'link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'personal', label: 'Personal Info', icon: User },
          { key: 'payment', label: 'Payment', icon: CreditCard },
          { key: 'notifications', label: 'Notifications', icon: Bell },
          { key: 'security', label: 'Security', icon: Shield },
        ].map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              activeSection === section.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Information */}
        {activeSection === 'personal' && (
          <div className="section-card p-6 animate-fade-in">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option>Ghana</option>
                  <option>Cameroon</option>
                  <option>Nigeria</option>
                  <option>Ivory Coast</option>
                  <option>Senegal</option>
                  <option>Kenya</option>
                  <option>South Africa</option>
                  <option>France</option>
                  <option>Germany</option>
                  <option>United States</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Payment Preferences */}
        {activeSection === 'payment' && (
          <div className="section-card p-6 animate-fade-in">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent" />
              Payment Preferences
            </h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Preferred Currency</label>
                  <select
                    value={formData.preferredCurrency}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredCurrency: e.target.value }))}
                    className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="XAF">XAF (Central African CFA Franc)</option>
                    <option value="GHS">GHS (Ghana Cedis)</option>
                    <option value="NGN">NGN (Nigerian Naira)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Primary Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option>Mobile Money (MTN)</option>
                    <option>Mobile Money (Orange)</option>
                    <option>Bank Transfer</option>
                    <option>PayPal</option>
                  </select>
                </div>
              </div>

              {/* Payment Method Details */}
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Payment Method Details</h4>
                
                {formData.paymentMethod.includes('Mobile Money') && (
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      <Smartphone className="w-4 h-4 inline mr-1" />
                      Mobile Money Number
                    </label>
                    <input
                      type="tel"
                      value={formData.momoNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, momoNumber: e.target.value }))}
                      placeholder={formData.paymentMethod.includes('MTN') ? '+237 670 XXX XXX' : '+237 690 XXX XXX'}
                      className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                )}

                {formData.paymentMethod === 'Bank Transfer' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        <Building2 className="w-4 h-4 inline mr-1" />
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                        placeholder="e.g., Ecobank"
                        className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Account Number</label>
                      <input
                        type="text"
                        value={formData.bankAccount}
                        onChange={(e) => setFormData(prev => ({ ...prev, bankAccount: e.target.value }))}
                        placeholder="Enter account number"
                        className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'PayPal' && (
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      PayPal Email
                    </label>
                    <input
                      type="email"
                      value={formData.paypalEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, paypalEmail: e.target.value }))}
                      placeholder="your.email@example.com"
                      className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeSection === 'notifications' && (
          <div className="section-card p-6 animate-fade-in">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notification Settings
            </h3>
            <div className="space-y-3">
              {[
                { key: 'commissions', label: 'Commission Alerts', desc: 'Get notified when you earn a commission' },
                { key: 'sellers', label: 'Seller Updates', desc: 'Updates about referred sellers' },
                { key: 'campaigns', label: 'Campaign Notifications', desc: 'New campaigns and expiry reminders' },
                { key: 'payouts', label: 'Payout Alerts', desc: 'Payout processing and completion' },
                { key: 'emailDigest', label: 'Weekly Email Digest', desc: 'Summary of your weekly performance' },
                { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Important updates via SMS (charges may apply)' },
              ].map((item) => (
                <label 
                  key={item.key}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(formData.notifications as any)[item.key]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        [item.key]: e.target.checked,
                      }
                    }))}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeSection === 'security' && (
          <div className="section-card p-6 animate-fade-in">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Change Password</p>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="btn-outline"
                >
                  Change
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <button type="button" className="btn-primary">
                  Enable
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <p className="font-medium text-red-700">Delete Account</p>
                  <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        {activeSection !== 'security' && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-action"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        )}
      </form>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowQRModal(false)}>
          <div 
            className="bg-card rounded-2xl shadow-elevated max-w-sm w-full animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Your Referral QR Code</h3>
              <button 
                onClick={() => setShowQRModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-center space-y-4">
              <div className="bg-white p-4 rounded-xl border border-border inline-block">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://harvesta.app/ref/${profile?.id}`}
                  alt="Referral QR Code"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Scan this QR code to visit your referral link
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(`https://harvesta.app/ref/${profile?.id}`, 'qrlink')}
                  className="btn-outline flex-1"
                >
                  {copied === 'qrlink' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy Link
                </button>
                <button
                  onClick={downloadQRCode}
                  className="btn-action flex-1"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPasswordModal(false)}>
          <div 
            className="bg-card rounded-2xl shadow-elevated max-w-md w-full animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Change Password</h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={passwordData.showPasswords ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    required
                    className="w-full p-3 pr-10 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                <input
                  type={passwordData.showPasswords ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                  minLength={8}
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
                <input
                  type={passwordData.showPasswords ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={passwordData.showPasswords}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, showPasswords: e.target.checked }))}
                  className="rounded border-border"
                />
                Show passwords
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="btn-outline flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-action flex-1">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone. All your data, commissions, and referral history will be permanently deleted."
        confirmText="Delete Account"
        variant="danger"
      />
    </div>
  );
}

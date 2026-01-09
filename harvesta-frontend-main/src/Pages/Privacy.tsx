import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Calendar } from 'lucide-react';

const sections = [
  { id: 'information', title: '1. Information We Collect' },
  { id: 'use', title: '2. How We Use Your Data' },
  { id: 'cookies', title: '3. Cookies & Tracking' },
  { id: 'sharing', title: '4. Data Sharing' },
  { id: 'storage', title: '5. Data Storage & Security' },
  { id: 'rights', title: '6. Your Rights' },
  { id: 'deletion', title: '7. Account Deletion' },
  { id: 'updates', title: '8. Policy Updates' },
];

export default function Privacy() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-muted via-background to-muted/50 py-12 lg:py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Shield className="w-7 h-7 text-secondary" />
            </div>
            <div>
              <Badge className="mb-2 bg-muted text-muted-foreground">Legal</Badge>
              <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Last updated: January 1, 2026</span>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Table of Contents */}
            <div className="hidden lg:block">
              <div className="sticky top-8">
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                  Table of Contents
                </h3>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        {section.title}
                      </button>
                    ))}
                  </nav>
                </ScrollArea>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <Card className="bg-card border-border">
                <CardContent className="p-8 md:p-12 prose prose-neutral dark:prose-invert max-w-none">
                  <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-6 mb-8">
                    <p className="text-foreground font-medium mb-2">Our Commitment to Your Privacy</p>
                    <p className="text-muted-foreground text-sm">
                      At Harvestá, we take your privacy seriously. This policy explains how we collect, 
                      use, and protect your personal information when you use our Platform.
                    </p>
                  </div>

                  <section id="information" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                    
                    <h3 className="text-lg font-semibold mb-3">Information You Provide</h3>
                    <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                      <li><strong>Account Information:</strong> Name, email address, phone number, password</li>
                      <li><strong>Profile Information:</strong> Business name, address, tax ID (for business accounts)</li>
                      <li><strong>Transaction Data:</strong> Order history, payment information, delivery addresses</li>
                      <li><strong>Communication Data:</strong> Messages with suppliers/buyers, support inquiries</li>
                      <li><strong>Verification Documents:</strong> Business registration, certifications (for suppliers)</li>
                    </ul>

                    <h3 className="text-lg font-semibold mb-3">Information We Collect Automatically</h3>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li><strong>Device Information:</strong> Device type, operating system, browser type</li>
                      <li><strong>Usage Data:</strong> Pages visited, search queries, features used</li>
                      <li><strong>Location Data:</strong> Approximate location based on IP address</li>
                      <li><strong>Log Data:</strong> Access times, error reports, referral URLs</li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="use" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">2. How We Use Your Data</h2>
                    <p className="text-muted-foreground mb-4">
                      We use your information to:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>Provide, maintain, and improve our Platform</li>
                      <li>Process transactions and send related notifications</li>
                      <li>Verify identities and prevent fraud</li>
                      <li>Communicate with you about orders, updates, and promotions</li>
                      <li>Personalize your experience and show relevant products</li>
                      <li>Analyze usage patterns to improve our services</li>
                      <li>Comply with legal obligations and resolve disputes</li>
                      <li>Protect the security and integrity of our Platform</li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="cookies" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">3. Cookies & Tracking Technologies</h2>
                    <p className="text-muted-foreground mb-4">
                      We use cookies and similar technologies to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                      <li><strong>Essential Cookies:</strong> Enable core functionality like authentication and security</li>
                      <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                      <li><strong>Analytics Cookies:</strong> Understand how users interact with our Platform</li>
                      <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements (with your consent)</li>
                    </ul>
                    <p className="text-muted-foreground">
                      You can manage cookie preferences through your browser settings. Note that disabling 
                      certain cookies may affect Platform functionality.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="sharing" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">4. Data Sharing with Third Parties</h2>
                    <p className="text-muted-foreground mb-4">
                      We may share your information with:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li><strong>Transaction Partners:</strong> Buyers/suppliers for order fulfillment</li>
                      <li><strong>Payment Processors:</strong> To process payments securely</li>
                      <li><strong>Logistics Partners:</strong> For delivery and shipping</li>
                      <li><strong>Service Providers:</strong> Cloud hosting, analytics, customer support tools</li>
                      <li><strong>Legal Authorities:</strong> When required by law or to protect rights</li>
                    </ul>
                    <div className="bg-muted/50 rounded-lg p-4 mt-4">
                      <p className="text-sm text-muted-foreground">
                        <strong>We never sell your personal data to third parties for marketing purposes.</strong>
                      </p>
                    </div>
                  </section>

                  <Separator className="my-8" />

                  <section id="storage" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">5. Data Storage & Security</h2>
                    <p className="text-muted-foreground mb-4">
                      We implement robust security measures to protect your data:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>End-to-end encryption for sensitive data transmission</li>
                      <li>Secure servers with regular security audits</li>
                      <li>Access controls limiting employee access to personal data</li>
                      <li>Regular backups and disaster recovery procedures</li>
                      <li>Compliance with industry security standards</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Your data is stored on servers located in secure data centers. We retain your 
                      information for as long as your account is active or as needed to provide services 
                      and comply with legal obligations.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="rights" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
                    <p className="text-muted-foreground mb-4">
                      Depending on your location, you may have the following rights:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li><strong>Access:</strong> Request a copy of your personal data</li>
                      <li><strong>Correction:</strong> Update inaccurate or incomplete data</li>
                      <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                      <li><strong>Portability:</strong> Receive your data in a portable format</li>
                      <li><strong>Objection:</strong> Object to certain processing activities</li>
                      <li><strong>Restriction:</strong> Request limited processing of your data</li>
                      <li><strong>Withdraw Consent:</strong> Withdraw previously given consent</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      To exercise these rights, contact us at{' '}
                      <a href="mailto:privacy@harvesta.com" className="text-primary hover:underline">
                        privacy@harvesta.com
                      </a>
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="deletion" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">7. Account Deletion</h2>
                    <p className="text-muted-foreground mb-4">
                      You can request account deletion at any time. When you delete your account:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>Your profile and personal information will be removed</li>
                      <li>Transaction history may be retained for legal/compliance purposes</li>
                      <li>Some data may be retained in anonymized form for analytics</li>
                      <li>Pending transactions must be completed or cancelled first</li>
                      <li>Deletion is permanent and cannot be undone</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      To delete your account, go to Settings → Account → Delete Account, or contact our 
                      support team.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="updates" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">8. Updates to This Policy</h2>
                    <p className="text-muted-foreground mb-4">
                      We may update this Privacy Policy from time to time. When we make changes:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>We will update the "Last updated" date at the top of this page</li>
                      <li>For material changes, we will notify you via email or Platform notification</li>
                      <li>We encourage you to review this policy periodically</li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <div className="bg-muted/50 rounded-lg p-6 mt-8">
                    <p className="font-medium mb-2">Questions About This Policy?</p>
                    <p className="text-sm text-muted-foreground">
                      If you have any questions about our Privacy Policy or data practices, please contact 
                      our Data Protection Officer at{' '}
                      <a href="mailto:privacy@harvesta.com" className="text-primary hover:underline">
                        privacy@harvesta.com
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

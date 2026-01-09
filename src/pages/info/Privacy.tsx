import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Calendar } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-gradient-to-br from-muted via-background to-muted/50 py-12 lg:py-16 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center"><Shield className="w-7 h-7 text-secondary" /></div>
              <div>
                <Badge className="mb-2 bg-muted text-muted-foreground">Legal</Badge>
                <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="w-4 h-4" /><span>Last updated: January 1, 2026</span></div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4">
            <Card className="bg-card border-border max-w-4xl mx-auto">
              <CardContent className="p-8 md:p-12 prose prose-neutral dark:prose-invert max-w-none">
                <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-6 mb-8">
                  <p className="text-foreground font-medium mb-2">Our Commitment to Your Privacy</p>
                  <p className="text-muted-foreground text-sm">At Harvestá, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.</p>
                </div>

                <section id="information" className="scroll-mt-8">
                  <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                  <h3 className="text-lg font-semibold mb-3">Information You Provide</h3>
                  <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                    <li><strong>Account Information:</strong> Name, email address, phone number, password</li>
                    <li><strong>Profile Information:</strong> Business name, address, tax ID (for business accounts)</li>
                    <li><strong>Transaction Data:</strong> Order history, payment information, delivery addresses</li>
                  </ul>
                  <h3 className="text-lg font-semibold mb-3">Information We Collect Automatically</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Device Information:</strong> Device type, operating system, browser type</li>
                    <li><strong>Usage Data:</strong> Pages visited, search queries, features used</li>
                    <li><strong>Location Data:</strong> Approximate location based on IP address</li>
                  </ul>
                </section>

                <Separator className="my-8" />

                <section id="use" className="scroll-mt-8">
                  <h2 className="text-2xl font-bold mb-4">2. How We Use Your Data</h2>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Provide, maintain, and improve our Platform</li>
                    <li>Process transactions and send related notifications</li>
                    <li>Verify identities and prevent fraud</li>
                    <li>Communicate with you about orders, updates, and promotions</li>
                    <li>Personalize your experience and show relevant products</li>
                    <li>Comply with legal obligations and resolve disputes</li>
                  </ul>
                </section>

                <Separator className="my-8" />

                <section id="sharing" className="scroll-mt-8">
                  <h2 className="text-2xl font-bold mb-4">3. Data Sharing with Third Parties</h2>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Transaction Partners:</strong> Buyers/suppliers for order fulfillment</li>
                    <li><strong>Payment Processors:</strong> To process payments securely</li>
                    <li><strong>Logistics Partners:</strong> For delivery and shipping</li>
                    <li><strong>Legal Authorities:</strong> When required by law or to protect rights</li>
                  </ul>
                  <div className="bg-muted/50 rounded-lg p-4 mt-4">
                    <p className="text-sm text-muted-foreground"><strong>We never sell your personal data to third parties for marketing purposes.</strong></p>
                  </div>
                </section>

                <Separator className="my-8" />

                <section id="rights" className="scroll-mt-8">
                  <h2 className="text-2xl font-bold mb-4">4. Your Rights</h2>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Correction:</strong> Update inaccurate or incomplete data</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                    <li><strong>Portability:</strong> Receive your data in a portable format</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">To exercise these rights, contact us at <a href="mailto:privacy@harvesta.com" className="text-primary hover:underline">privacy@harvesta.com</a></p>
                </section>

                <Separator className="my-8" />

                <div className="bg-muted/50 rounded-lg p-6 mt-8">
                  <p className="font-medium mb-2">Questions About This Policy?</p>
                  <p className="text-sm text-muted-foreground">Contact our Data Protection Officer at <a href="mailto:privacy@harvesta.com" className="text-primary hover:underline">privacy@harvesta.com</a></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
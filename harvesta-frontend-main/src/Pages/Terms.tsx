import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Calendar } from 'lucide-react';

const sections = [
  { id: 'introduction', title: '1. Introduction & Acceptance' },
  { id: 'eligibility', title: '2. User Eligibility' },
  { id: 'accounts', title: '3. Account Responsibilities' },
  { id: 'transactions', title: '4. Orders & Transactions' },
  { id: 'payments', title: '5. Payments & Fees' },
  { id: 'delivery', title: '6. Delivery & Fulfillment' },
  { id: 'intellectual', title: '7. Intellectual Property' },
  { id: 'prohibited', title: '8. Prohibited Activities' },
  { id: 'liability', title: '9. Limitation of Liability' },
  { id: 'termination', title: '10. Termination & Suspension' },
  { id: 'law', title: '11. Governing Law' },
  { id: 'updates', title: '12. Updates to Terms' },
];

export default function Terms() {
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
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-7 h-7 text-primary" />
            </div>
            <div>
              <Badge className="mb-2 bg-muted text-muted-foreground">Legal</Badge>
              <h1 className="text-3xl md:text-4xl font-bold">Terms & Conditions</h1>
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
                  <section id="introduction" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">1. Introduction & Acceptance of Terms</h2>
                    <p className="text-muted-foreground mb-4">
                      Welcome to Harvestá ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your 
                      access to and use of the Harvestá platform, including our website, mobile applications, 
                      and related services (collectively, the "Platform").
                    </p>
                    <p className="text-muted-foreground mb-4">
                      By accessing or using our Platform, you agree to be bound by these Terms. If you do not 
                      agree to these Terms, you may not access or use the Platform.
                    </p>
                    <p className="text-muted-foreground">
                      These Terms constitute a legally binding agreement between you and Harvestá. Please read 
                      them carefully before using our services.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="eligibility" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">2. User Eligibility</h2>
                    <h3 className="text-lg font-semibold mb-3">For Buyers</h3>
                    <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                      <li>You must be at least 18 years old or the age of legal majority in your jurisdiction</li>
                      <li>Individual buyers must have legal capacity to enter into contracts</li>
                      <li>Business buyers must be duly authorized to transact on behalf of their organization</li>
                    </ul>
                    <h3 className="text-lg font-semibold mb-3">For Suppliers</h3>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>You must be a legally registered business entity</li>
                      <li>You must have valid licenses and permits for your products</li>
                      <li>You must comply with all applicable agricultural and trade regulations</li>
                      <li>You must complete our supplier verification process</li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="accounts" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">3. Account Responsibilities</h2>
                    <p className="text-muted-foreground mb-4">
                      When you create an account on Harvestá, you are responsible for:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>Providing accurate, current, and complete registration information</li>
                      <li>Maintaining the security of your account credentials</li>
                      <li>All activities that occur under your account</li>
                      <li>Promptly notifying us of any unauthorized use of your account</li>
                      <li>Keeping your contact information up to date</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      We reserve the right to suspend or terminate accounts that violate these Terms or 
                      engage in fraudulent activity.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="transactions" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">4. Orders & Transactions</h2>
                    <p className="text-muted-foreground mb-4">
                      When placing orders on Harvestá:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>Orders are subject to product availability and supplier confirmation</li>
                      <li>Minimum Order Quantities (MOQ) apply as specified on product listings</li>
                      <li>Prices are as displayed at the time of order, including any applicable tiered pricing</li>
                      <li>We facilitate transactions but are not a party to the sale between buyer and supplier</li>
                      <li>Order cancellations are subject to our cancellation policy and supplier terms</li>
                      <li>B2B orders may be subject to additional terms negotiated with suppliers</li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="payments" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">5. Payments & Fees</h2>
                    <p className="text-muted-foreground mb-4">
                      Payment terms and conditions:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>All prices are displayed in the applicable local currency</li>
                      <li>Payments must be made through approved payment methods on the Platform</li>
                      <li>Transaction fees may apply and will be disclosed before payment</li>
                      <li>For B2B transactions, escrow services may be available or required</li>
                      <li>Suppliers are responsible for all applicable taxes on their sales</li>
                      <li>Refunds are processed according to our Refunds & Returns Policy</li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="delivery" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">6. Delivery & Fulfillment</h2>
                    <p className="text-muted-foreground mb-4">
                      Delivery responsibilities and expectations:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>Delivery times are estimates and may vary based on location and product type</li>
                      <li>Suppliers are responsible for packaging products appropriately</li>
                      <li>Buyers must inspect deliveries and report issues within the specified timeframe</li>
                      <li>Delivery fees and methods vary by supplier and location</li>
                      <li>Risk of loss transfers to the buyer upon delivery confirmation</li>
                      <li>For perishable goods, special handling and inspection requirements apply</li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="intellectual" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>
                    <p className="text-muted-foreground mb-4">
                      All content on the Platform, including but not limited to text, graphics, logos, 
                      images, software, and trademarks, is the property of Harvestá or its licensors 
                      and is protected by intellectual property laws.
                    </p>
                    <p className="text-muted-foreground">
                      You may not reproduce, distribute, modify, or create derivative works from any 
                      content on the Platform without our express written permission.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="prohibited" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">8. Prohibited Activities</h2>
                    <p className="text-muted-foreground mb-4">
                      Users may not:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>List or sell prohibited, illegal, or restricted products</li>
                      <li>Engage in fraudulent transactions or misrepresent products</li>
                      <li>Circumvent Platform fees or payment systems</li>
                      <li>Harass, abuse, or harm other users</li>
                      <li>Use automated systems to access the Platform without permission</li>
                      <li>Attempt to gain unauthorized access to systems or data</li>
                      <li>Violate any applicable laws or regulations</li>
                      <li>Infringe on intellectual property rights of others</li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="liability" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
                    <p className="text-muted-foreground mb-4">
                      To the maximum extent permitted by law:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>Harvestá provides the Platform "as is" without warranties of any kind</li>
                      <li>We are not liable for disputes between buyers and suppliers</li>
                      <li>We are not responsible for product quality issues beyond our verification scope</li>
                      <li>Our liability is limited to the fees paid to us for the specific transaction</li>
                      <li>We are not liable for indirect, incidental, or consequential damages</li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="termination" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">10. Termination & Suspension</h2>
                    <p className="text-muted-foreground mb-4">
                      We may suspend or terminate your access to the Platform:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>For violations of these Terms</li>
                      <li>For fraudulent or illegal activity</li>
                      <li>For non-payment of fees or chargebacks</li>
                      <li>At our discretion with reasonable notice</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Upon termination, your right to use the Platform immediately ceases. 
                      Pending transactions will be handled according to our policies.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="law" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">11. Governing Law & Jurisdiction</h2>
                    <p className="text-muted-foreground mb-4">
                      These Terms shall be governed by and construed in accordance with the laws of 
                      the Federal Republic of Nigeria, without regard to conflict of law principles.
                    </p>
                    <p className="text-muted-foreground">
                      Any disputes arising from these Terms or use of the Platform shall be resolved 
                      through arbitration in Lagos, Nigeria, in accordance with the Arbitration and 
                      Conciliation Act.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="updates" className="scroll-mt-8">
                    <h2 className="text-2xl font-bold mb-4">12. Updates to Terms</h2>
                    <p className="text-muted-foreground mb-4">
                      We may update these Terms from time to time. When we make material changes:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>We will notify you via email or Platform notification</li>
                      <li>The updated Terms will be posted on this page with a new effective date</li>
                      <li>Continued use of the Platform after updates constitutes acceptance</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      We encourage you to review these Terms periodically for any changes.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <div className="bg-muted/50 rounded-lg p-6 mt-8">
                    <p className="text-sm text-muted-foreground">
                      If you have any questions about these Terms & Conditions, please contact us at{' '}
                      <a href="mailto:legal@harvesta.com" className="text-primary hover:underline">
                        legal@harvesta.com
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

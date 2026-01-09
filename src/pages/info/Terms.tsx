import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, Calendar } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-gradient-to-br from-muted via-background to-muted/50 py-12 lg:py-16 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center"><FileText className="w-7 h-7 text-primary" /></div>
              <div>
                <Badge className="mb-2 bg-muted text-muted-foreground">Legal</Badge>
                <h1 className="text-3xl md:text-4xl font-bold">Terms & Conditions</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="w-4 h-4" /><span>Last updated: January 1, 2026</span></div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4">
            <Card className="bg-card border-border max-w-4xl mx-auto">
              <CardContent className="p-8 md:p-12 prose prose-neutral dark:prose-invert max-w-none">
                <section id="introduction" className="scroll-mt-8">
                  <h2 className="text-2xl font-bold mb-4">1. Introduction & Acceptance of Terms</h2>
                  <p className="text-muted-foreground mb-4">Welcome to Harvestá. These Terms and Conditions govern your access to and use of the Harvestá platform, including our website, mobile applications, and related services.</p>
                  <p className="text-muted-foreground">By accessing or using our Platform, you agree to be bound by these Terms. If you do not agree, you may not access or use the Platform.</p>
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
                    <li>You must complete our supplier verification process</li>
                  </ul>
                </section>

                <Separator className="my-8" />

                <section id="transactions" className="scroll-mt-8">
                  <h2 className="text-2xl font-bold mb-4">3. Orders & Transactions</h2>
                  <p className="text-muted-foreground mb-4">When placing orders on Harvestá:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Orders are subject to product availability and supplier confirmation</li>
                    <li>Minimum Order Quantities (MOQ) apply as specified on product listings</li>
                    <li>Prices are as displayed at the time of order, including any applicable tiered pricing</li>
                    <li>Order cancellations are subject to our cancellation policy and supplier terms</li>
                  </ul>
                </section>

                <Separator className="my-8" />

                <section id="payments" className="scroll-mt-8">
                  <h2 className="text-2xl font-bold mb-4">4. Payments & Fees</h2>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>All prices are displayed in the applicable local currency</li>
                    <li>Payments must be made through approved payment methods on the Platform</li>
                    <li>For B2B transactions, escrow services may be available or required</li>
                    <li>Refunds are processed according to our Refunds & Returns Policy</li>
                  </ul>
                </section>

                <Separator className="my-8" />

                <section id="liability" className="scroll-mt-8">
                  <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Harvestá provides the Platform "as is" without warranties of any kind</li>
                    <li>We are not liable for disputes between buyers and suppliers</li>
                    <li>Our liability is limited to the fees paid to us for the specific transaction</li>
                  </ul>
                </section>

                <Separator className="my-8" />

                <div className="bg-muted/50 rounded-lg p-6 mt-8">
                  <p className="text-sm text-muted-foreground">If you have any questions about these Terms & Conditions, please contact us at <a href="mailto:legal@harvesta.com" className="text-primary hover:underline">legal@harvesta.com</a></p>
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
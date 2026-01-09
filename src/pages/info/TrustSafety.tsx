import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Lock, Eye, UserCheck, AlertTriangle, CheckCircle, FileSearch, CreditCard, MessageSquare, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';

const safetyFeatures = [
  { icon: UserCheck, title: 'Supplier Verification', description: 'Multi-step verification including business registration, documentation, and quality checks.' },
  { icon: Lock, title: 'Secure Transactions', description: 'End-to-end encryption and secure payment processing protect your data.' },
  { icon: Eye, title: 'Quality Monitoring', description: 'Continuous monitoring of supplier performance and product quality.' },
  { icon: CreditCard, title: 'Escrow Protection', description: 'Funds held securely until order confirmation for qualifying transactions.' },
  { icon: MessageSquare, title: 'Dispute Resolution', description: 'Fair and transparent process for resolving issues between buyers and suppliers.' },
  { icon: FileSearch, title: 'Fraud Detection', description: 'Advanced systems to detect and prevent fraudulent activities.' },
];

const reportReasons = [
  'Suspicious or fraudulent listing',
  'Product quality concerns',
  'Misrepresentation or false advertising',
  'Unsafe or prohibited products',
  'Harassment or abusive behavior',
  'Intellectual property violation',
];

export default function TrustSafety() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-gradient-to-br from-secondary/10 via-background to-primary/5 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">Security</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Trust & <span className="text-secondary">Safety</span></h1>
              <p className="text-lg text-muted-foreground mb-8">Your safety is our priority. Learn about the measures we take to ensure a secure and trustworthy marketplace.</p>
              <div className="inline-flex items-center gap-3 bg-card border border-border rounded-full px-6 py-3">
                <ShieldCheck className="w-6 h-6 text-secondary" /><span className="font-semibold">Secure & Verified Marketplace</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">How We Keep You Safe</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {safetyFeatures.map((feature, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4"><feature.icon className="w-6 h-6 text-secondary" /></div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Verification</Badge>
                <h2 className="text-3xl font-bold mb-4">Our Supplier Verification Process</h2>
                <p className="text-muted-foreground mb-6">Every supplier on Harvestá goes through a rigorous verification process to ensure legitimacy and quality.</p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div><h4 className="font-semibold">Document Verification</h4><p className="text-sm text-muted-foreground">Business registration, licenses, and certifications</p></div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div><h4 className="font-semibold">Identity Confirmation</h4><p className="text-sm text-muted-foreground">Verification of key personnel and contact information</p></div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div><h4 className="font-semibold">Quality Assessment</h4><p className="text-sm text-muted-foreground">Product sample review and quality standards check</p></div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <div><h4 className="font-semibold">Ongoing Monitoring</h4><p className="text-sm text-muted-foreground">Continuous performance and review tracking</p></div>
                  </li>
                </ul>
              </div>
              <Card className="bg-card border-border">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <UserCheck className="w-16 h-16 text-secondary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Verified Suppliers</h3>
                    <p className="text-muted-foreground">Look for these trust badges</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"><CheckCircle className="w-5 h-5 text-secondary" /><span className="text-sm font-medium">Verified Supplier</span></div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"><ShieldCheck className="w-5 h-5 text-primary" /><span className="text-sm font-medium">Quality Checked</span></div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"><Lock className="w-5 h-5 text-accent" /><span className="text-sm font-medium">Premium Supplier</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto bg-card border-border">
              <CardHeader className="text-center">
                <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-4"><Flag className="w-7 h-7 text-destructive" /></div>
                <CardTitle>Report a Concern</CardTitle>
                <p className="text-muted-foreground mt-2">Help us maintain a safe marketplace by reporting suspicious activity.</p>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3">Common reporting reasons:</p>
                  <ul className="space-y-2">
                    {reportReasons.map((reason, index) => (<li key={index} className="flex items-center gap-2 text-sm text-muted-foreground"><AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />{reason}</li>))}
                  </ul>
                </div>
                <Button className="w-full" asChild><Link to="/contact?subject=Report">Report an Issue</Link></Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Learn More About Our Policies</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Review our comprehensive policies to understand your rights and protections.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="outline" asChild><Link to="/buyer-protection">Buyer Protection</Link></Button>
              <Button variant="outline" asChild><Link to="/terms">Terms & Conditions</Link></Button>
              <Button variant="outline" asChild><Link to="/privacy">Privacy Policy</Link></Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShieldCheck, 
  CreditCard, 
  Package, 
  MessageSquare, 
  Scale,
  CheckCircle,
  Lock,
  RefreshCcw,
  Eye,
  Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const protections = [
  {
    icon: Lock,
    title: 'Secure Payments',
    description: 'All payments are processed through encrypted channels with fraud protection.',
  },
  {
    icon: Package,
    title: 'Product Guarantee',
    description: 'Products must match their descriptions or you get your money back.',
  },
  {
    icon: RefreshCcw,
    title: 'Easy Refunds',
    description: 'Simple refund process for qualifying issues with dedicated support.',
  },
  {
    icon: Eye,
    title: 'Verified Suppliers',
    description: 'All suppliers undergo verification to ensure legitimacy and quality.',
  },
  {
    icon: MessageSquare,
    title: 'Dispute Resolution',
    description: 'Fair mediation process with dedicated case managers.',
  },
  {
    icon: Truck,
    title: 'Delivery Protection',
    description: 'Coverage for lost, damaged, or significantly delayed shipments.',
  },
];

const steps = [
  {
    step: 1,
    title: 'Shop with Confidence',
    description: 'Browse verified suppliers and quality-checked products.',
  },
  {
    step: 2,
    title: 'Pay Securely',
    description: 'Your payment is protected until you confirm satisfaction.',
  },
  {
    step: 3,
    title: 'Receive & Inspect',
    description: 'Check your order and report any issues within 7 days.',
  },
  {
    step: 4,
    title: 'Get Support',
    description: 'Our team helps resolve any problems quickly and fairly.',
  },
];

export default function BuyerProtection() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary/10 via-background to-primary/5 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">Protection</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Buyer Protection <span className="text-secondary">Guarantee</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Shop with confidence knowing that every purchase on Harvestá is backed by our 
              comprehensive buyer protection program.
            </p>
            <div className="inline-flex items-center gap-3 bg-card border border-border rounded-full px-6 py-3">
              <ShieldCheck className="w-6 h-6 text-secondary" />
              <span className="font-semibold">100% Purchase Protection</span>
            </div>
          </div>
        </div>
      </section>

      {/* Protection Features */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">What's Covered</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {protections.map((item, index) => (
              <Card key={index} className="bg-card border-border card-hover">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, index) => (
              <Card key={index} className="bg-card border-border relative">
                <CardContent className="p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Escrow */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Escrow Protection</Badge>
              <h2 className="text-3xl font-bold mb-4">Your Money is Safe Until You're Satisfied</h2>
              <p className="text-muted-foreground mb-6">
                For qualifying orders, your payment is held in escrow until you confirm receipt 
                and satisfaction with your order. This protects both buyers and suppliers.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Funds held securely until delivery confirmed</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">7-day inspection window for disputes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Automatic release if no issues reported</span>
                </li>
              </ul>
            </div>
            <Card className="bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20">
              <CardContent className="p-8 text-center">
                <CreditCard className="w-16 h-16 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Escrow Available</h3>
                <p className="text-muted-foreground mb-4">
                  For orders over ₦50,000 or ₦500,000 for B2B transactions
                </p>
                <Scale className="w-10 h-10 text-primary mx-auto" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Shop with Confidence?</h2>
          <p className="mb-8 opacity-90 max-w-xl mx-auto">
            Join thousands of buyers who trust Harvestá for their agricultural purchases.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" className="bg-white text-secondary hover:bg-white/90" asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/faq">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

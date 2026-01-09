import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  RotateCcw, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  FileText,
  Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';

const disputeSteps = [
  {
    step: 1,
    title: 'Report Issue',
    description: 'File a dispute within 7 days of delivery through your order history.',
    icon: FileText,
  },
  {
    step: 2,
    title: 'Provide Evidence',
    description: 'Upload photos/videos and describe the issue in detail.',
    icon: MessageSquare,
  },
  {
    step: 3,
    title: 'Review Process',
    description: 'Our team reviews the case within 48 hours.',
    icon: Clock,
  },
  {
    step: 4,
    title: 'Resolution',
    description: 'We mediate and issue refund/replacement as appropriate.',
    icon: CheckCircle,
  },
];

export default function Refunds() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-muted via-background to-muted/50 py-12 lg:py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <RotateCcw className="w-7 h-7 text-primary" />
            </div>
            <div>
              <Badge className="mb-2 bg-muted text-muted-foreground">Policy</Badge>
              <h1 className="text-3xl md:text-4xl font-bold">Refunds, Returns & Disputes</h1>
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
          {/* Intro Card */}
          <Card className="bg-gradient-to-r from-secondary/5 to-primary/5 border-secondary/20 mb-10">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-10 h-10 text-secondary flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold mb-2">Buyer Protection Guarantee</h2>
                  <p className="text-muted-foreground">
                    At Harvestá, we're committed to ensuring fair and transparent transactions. 
                    This policy outlines how we handle refunds, returns, and disputes to protect 
                    both buyers and suppliers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Refund Eligibility */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-primary" />
                  Refund Eligibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-secondary">Eligible for Refund</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Product significantly different from description</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Quality below stated grade/standard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Damaged during shipping (with evidence)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Wrong product delivered</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Order not delivered within agreed timeframe</span>
                    </li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2 text-destructive">Not Eligible for Refund</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span>Change of mind after delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span>Products opened/used beyond inspection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span>Disputes filed after 7-day window</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span>Minor variations within acceptable range</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Return Conditions */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Return Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">General Products</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Returns accepted within 7 days of delivery</li>
                    <li>• Products must be in original condition</li>
                    <li>• Original packaging required when possible</li>
                    <li>• Photo/video evidence required</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Perishable Goods</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 24-hour inspection window from delivery</li>
                    <li>• Immediate photo documentation required</li>
                    <li>• Temperature-controlled items checked on receipt</li>
                    <li>• Spoilage claims require timestamped evidence</li>
                  </ul>
                </div>
                <Alert className="bg-warning/10 border-warning/20">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <AlertDescription className="text-sm">
                    For perishable goods, report issues immediately upon delivery. 
                    Delayed reporting may affect your claim.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Dispute Resolution Process */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Step-by-Step</Badge>
              <h2 className="text-2xl font-bold">Dispute Resolution Process</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {disputeSteps.map((step, index) => (
                <Card key={index} className="bg-card border-border relative">
                  <CardContent className="p-6 text-center">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mt-4 mb-4">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                  {index < disputeSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Buyer Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Inspect deliveries immediately upon receipt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Document any issues with photos/videos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Report problems within the specified timeframe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Provide accurate and honest dispute information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Cooperate with the resolution process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Return products as instructed for physical returns</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Supplier Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Provide accurate product descriptions and images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Package products appropriately for transit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Respond to disputes within 48 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Provide evidence supporting their position</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Accept valid return requests promptly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Process refunds within agreed timeframes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Timelines */}
          <Card className="bg-card border-border mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Resolution Timelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 font-semibold">Stage</th>
                      <th className="text-left py-3 font-semibold">Timeframe</th>
                      <th className="text-left py-3 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="py-3">Dispute Filing Window</td>
                      <td className="py-3">7 days (24h for perishables)</td>
                      <td className="py-3">From delivery confirmation</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3">Initial Review</td>
                      <td className="py-3">48 hours</td>
                      <td className="py-3">Our team reviews submitted evidence</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3">Supplier Response</td>
                      <td className="py-3">48 hours</td>
                      <td className="py-3">After notification</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3">Mediation (if needed)</td>
                      <td className="py-3">3-5 business days</td>
                      <td className="py-3">For complex disputes</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3">Refund Processing</td>
                      <td className="py-3">3-5 business days</td>
                      <td className="py-3">After resolution approval</td>
                    </tr>
                    <tr>
                      <td className="py-3">Fund Receipt</td>
                      <td className="py-3">Varies by payment method</td>
                      <td className="py-3">Mobile Money: instant, Card: 5-7 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* B2B Special Rules */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                Special Rules for B2B Bulk Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                For B2B transactions involving large volumes or custom orders:
              </p>
              <ul className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Pre-shipment inspection available for high-value orders</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Partial refunds may apply for quality variations within tolerance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Escrow protection for transactions over ₦500,000</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Custom dispute terms may apply as per quotation agreement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Dedicated account manager for dispute resolution</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Third-party arbitration available for major disputes</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Platform Mediation */}
          <Card className="bg-card border-border mb-12">
            <CardHeader>
              <CardTitle>Platform Mediation Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Harvestá acts as a neutral mediator in disputes between buyers and suppliers. 
                Our role includes:
              </p>
              <ul className="space-y-2">
                <li>• Reviewing evidence from both parties objectively</li>
                <li>• Facilitating communication between parties</li>
                <li>• Making fair decisions based on policy and evidence</li>
                <li>• Releasing escrow funds to the appropriate party</li>
                <li>• Escalating to arbitration when necessary</li>
              </ul>
              <Alert className="bg-muted border-border">
                <AlertDescription>
                  Our decisions are based on documented evidence, policy compliance, and 
                  transaction history. Decisions are final unless new evidence is presented.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Need Help with a Dispute?</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Our support team is here to help you through the process. 
              Contact us for any questions about refunds, returns, or disputes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-checkout" asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/faq">View FAQ</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

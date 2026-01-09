import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RotateCcw, Calendar, AlertTriangle, CheckCircle, Clock, FileText, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const disputeSteps = [
  { step: 1, title: 'Report Issue', description: 'File a dispute within 7 days of delivery.', icon: FileText },
  { step: 2, title: 'Provide Evidence', description: 'Upload photos/videos and describe the issue.', icon: FileText },
  { step: 3, title: 'Review Process', description: 'Our team reviews the case within 48 hours.', icon: Clock },
  { step: 4, title: 'Resolution', description: 'We issue refund/replacement as appropriate.', icon: CheckCircle },
];

export default function Refunds() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-gradient-to-br from-muted via-background to-muted/50 py-12 lg:py-16 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center"><RotateCcw className="w-7 h-7 text-primary" /></div>
              <div>
                <Badge className="mb-2 bg-muted text-muted-foreground">Policy</Badge>
                <h1 className="text-3xl md:text-4xl font-bold">Refunds, Returns & Disputes</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="w-4 h-4" /><span>Last updated: January 1, 2026</span></div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-r from-secondary/5 to-primary/5 border-secondary/20 mb-10">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="w-10 h-10 text-secondary flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-bold mb-2">Buyer Protection Guarantee</h2>
                    <p className="text-muted-foreground">At Harvestá, we're committed to ensuring fair and transparent transactions. This policy outlines how we handle refunds, returns, and disputes.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <Card className="bg-card border-border">
                <CardHeader><CardTitle className="flex items-center gap-2"><RotateCcw className="w-5 h-5 text-primary" /> Refund Eligibility</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-secondary">Eligible for Refund</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" /><span>Product significantly different from description</span></li>
                      <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" /><span>Quality below stated grade/standard</span></li>
                      <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" /><span>Damaged during shipping (with evidence)</span></li>
                      <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" /><span>Wrong product delivered</span></li>
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2 text-destructive">Not Eligible for Refund</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" /><span>Change of mind after delivery</span></li>
                      <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" /><span>Products opened/used beyond inspection</span></li>
                      <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" /><span>Disputes filed after 7-day window</span></li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Return Conditions</CardTitle></CardHeader>
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
                    </ul>
                  </div>
                  <Alert className="bg-warning/10 border-warning/20">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <AlertDescription className="text-sm">For perishable goods, report issues immediately upon delivery.</AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            <div className="mb-12">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Step-by-Step</Badge>
                <h2 className="text-2xl font-bold">Dispute Resolution Process</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {disputeSteps.map((step, index) => (
                  <Card key={index} className="bg-card border-border relative">
                    <CardContent className="p-6 text-center">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{step.step}</div>
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mt-4 mb-4"><step.icon className="w-7 h-7 text-primary" /></div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                    {index < disputeSteps.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2"><ArrowRight className="w-6 h-6 text-muted-foreground" /></div>}
                  </Card>
                ))}
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Need to File a Dispute?</h2>
              <p className="text-muted-foreground mb-6">Go to your order history to report any issues with your orders.</p>
              <div className="flex gap-4 justify-center">
                <Button asChild><Link to="/orders">View My Orders</Link></Button>
                <Button variant="outline" asChild><Link to="/contact">Contact Support</Link></Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
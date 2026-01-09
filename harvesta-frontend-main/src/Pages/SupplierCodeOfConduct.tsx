import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  FileCheck, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  Leaf,
  Users,
  Scale,
  ShieldCheck,
  Package,
  MessageSquare
} from 'lucide-react';

const principles = [
  {
    icon: ShieldCheck,
    title: 'Honesty & Transparency',
    description: 'Provide accurate product descriptions, pricing, and business information.',
  },
  {
    icon: Package,
    title: 'Quality Standards',
    description: 'Maintain consistent product quality and meet stated specifications.',
  },
  {
    icon: Scale,
    title: 'Fair Trade Practices',
    description: 'Engage in ethical pricing and honest business dealings.',
  },
  {
    icon: Users,
    title: 'Labor Standards',
    description: 'Ensure fair labor practices and safe working conditions.',
  },
  {
    icon: Leaf,
    title: 'Environmental Responsibility',
    description: 'Commit to sustainable and environmentally conscious practices.',
  },
  {
    icon: MessageSquare,
    title: 'Responsive Communication',
    description: 'Maintain timely and professional communication with buyers.',
  },
];

export default function SupplierCodeOfConduct() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-muted via-background to-muted/50 py-12 lg:py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileCheck className="w-7 h-7 text-primary" />
            </div>
            <div>
              <Badge className="mb-2 bg-muted text-muted-foreground">Standards</Badge>
              <h1 className="text-3xl md:text-4xl font-bold">Supplier Code of Conduct</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Effective: January 1, 2026</span>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Intro */}
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 mb-10">
              <CardContent className="p-6 md:p-8">
                <p className="text-lg text-muted-foreground">
                  At Harvestá, we are committed to building a marketplace based on trust, quality, 
                  and ethical practices. This Code of Conduct outlines the standards and expectations 
                  for all suppliers on our platform.
                </p>
              </CardContent>
            </Card>

            {/* Principles */}
            <h2 className="text-2xl font-bold mb-6">Core Principles</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {principles.map((item, index) => (
                <Card key={index} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Requirements */}
            <Card className="bg-card border-border mb-10">
              <CardHeader>
                <CardTitle>Supplier Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Product Listings</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Provide accurate descriptions, specifications, and images</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Clearly state product origin, grade, and certifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Keep pricing and availability up to date</span>
                    </li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-3">Order Fulfillment</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Process orders within stated timeframes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Package products appropriately for safe delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Provide tracking information when available</span>
                    </li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-3">Communication</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Respond to buyer inquiries within 24 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Address disputes professionally and promptly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Maintain professional conduct in all interactions</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Prohibited Activities */}
            <Card className="bg-card border-border mb-10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Prohibited Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Misrepresenting product quality, origin, or specifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Selling counterfeit, prohibited, or unsafe products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Price manipulation or anti-competitive practices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Attempting to circumvent platform fees or policies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Harassment or abusive behavior toward buyers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Fraudulent activities or document falsification</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Consequences */}
            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-3">Enforcement & Consequences</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Violations of this Code of Conduct may result in:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Warning and required corrective action</li>
                  <li>• Temporary suspension of selling privileges</li>
                  <li>• Permanent account termination</li>
                  <li>• Withholding of pending payments</li>
                  <li>• Legal action where applicable</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}

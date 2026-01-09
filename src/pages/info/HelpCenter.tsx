import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, CreditCard, Truck, User, ShieldCheck, MessageCircle, FileText, ArrowRight, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  { icon: ShoppingCart, title: 'Buying Guide', description: 'How to browse, order, and manage purchases', link: '/faq?category=buying' },
  { icon: CreditCard, title: 'Payments', description: 'Payment methods, security, and billing', link: '/faq?category=payments' },
  { icon: Truck, title: 'Shipping & Delivery', description: 'Delivery times, tracking, and logistics', link: '/faq?category=delivery' },
  { icon: User, title: 'Account Management', description: 'Profile settings, security, and preferences', link: '/faq?category=account' },
  { icon: ShieldCheck, title: 'Trust & Safety', description: 'Verification, protection, and security', link: '/trust-safety' },
  { icon: FileText, title: 'Policies', description: 'Terms, privacy, and refund policies', link: '/terms' },
];

const quickLinks = [
  { title: 'How to place an order', link: '/faq' },
  { title: 'Track my order', link: '/faq' },
  { title: 'Request a refund', link: '/refunds' },
  { title: 'Become a supplier', link: '/contact' },
  { title: 'Payment methods', link: '/faq' },
  { title: 'Report a problem', link: '/contact' },
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Support</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">Find answers, get support, and learn how to make the most of Harvestá.</p>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input type="text" placeholder="Search for help..." className="pl-12 h-14 text-lg" />
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Browse by Topic</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><cat.icon className="w-6 h-6 text-primary" /></div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{cat.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{cat.description}</p>
                        <Link to={cat.link} className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">Learn more <ArrowRight className="w-4 h-4" /></Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Popular Topics</h2>
            <div className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-4">
                {quickLinks.map((link, index) => (
                  <Link key={index} to={link.link} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <span className="font-medium">{link.title}</span><ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Still Need Help?</h2>
              <p className="text-muted-foreground">Our support team is here for you.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-card border-border text-center">
                <CardContent className="p-6">
                  <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mb-4">Chat with our support team</p>
                  <Button variant="outline" className="w-full">Start Chat</Button>
                </CardContent>
              </Card>
              <Card className="bg-card border-border text-center">
                <CardContent className="p-6">
                  <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">Get help via email</p>
                  <Button variant="outline" className="w-full" asChild><Link to="/contact">Send Email</Link></Button>
                </CardContent>
              </Card>
              <Card className="bg-card border-border text-center">
                <CardContent className="p-6">
                  <Phone className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Phone Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">Call us directly</p>
                  <Button variant="outline" className="w-full">+234 800 123 4567</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
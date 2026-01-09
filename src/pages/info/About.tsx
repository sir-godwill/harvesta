import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Eye, ShieldCheck, Truck, Leaf, Globe, Award, CheckCircle, ArrowRight, Search, Handshake, CreditCard, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { value: '10,000+', label: 'Active Suppliers' },
  { value: '50+', label: 'Countries Served' },
  { value: '100,000+', label: 'Products Listed' },
  { value: '5M+', label: 'Transactions Processed' },
];

const values = [
  { icon: ShieldCheck, title: 'Trust & Transparency', description: 'We verify every supplier and ensure transparent pricing for all transactions.' },
  { icon: Leaf, title: 'Sustainability', description: 'Supporting sustainable farming practices and reducing waste across the supply chain.' },
  { icon: Users, title: 'Farmer First', description: 'Empowering smallholder farmers with direct access to markets and fair pricing.' },
  { icon: Globe, title: 'Global Reach', description: 'Connecting African agriculture to global markets while strengthening local trade.' },
];

const howItWorks = [
  { step: 1, icon: Search, title: 'Discover Products', description: 'Browse thousands of verified agricultural products from trusted suppliers across Africa.' },
  { step: 2, icon: Handshake, title: 'Connect with Suppliers', description: 'Engage directly with verified farmers, processors, and distributors.' },
  { step: 3, icon: CreditCard, title: 'Order Securely', description: 'Place orders with confidence using our secure payment and escrow system.' },
  { step: 4, icon: Package, title: 'Delivery & Fulfillment', description: 'Track your orders from supplier to delivery with our logistics partners.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative bg-gradient-to-br from-secondary/10 via-background to-primary/5 py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-secondary/10 text-secondary border-secondary/20">Africa's Leading Agro-Commerce Platform</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Transforming Agriculture, <span className="text-primary">One Connection at a Time</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Harvestá connects farmers, suppliers, and buyers across Africa and globally, building transparent, efficient, and sustainable agricultural supply chains.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild><Link to="/search">Start Buying <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
                <Button variant="outline" size="lg" asChild><Link to="/contact">Become a Supplier</Link></Button>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 mt-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-card/80 backdrop-blur border-border/50">
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Who We Are</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Africa's Premier B2B Agricultural Marketplace</h2>
                <p className="text-muted-foreground mb-6 text-lg">Harvestá is a B2B-first agro-commerce platform that also serves local B2C markets. We're building the infrastructure that connects agricultural value chain participants across Africa and globally.</p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="px-4 py-2"><CheckCircle className="w-4 h-4 mr-2" /> B2B Marketplace</Badge>
                  <Badge variant="secondary" className="px-4 py-2"><CheckCircle className="w-4 h-4 mr-2" /> B2C Support</Badge>
                  <Badge variant="secondary" className="px-4 py-2"><CheckCircle className="w-4 h-4 mr-2" /> Cross-Border Trade</Badge>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                  <div className="text-center p-8"><Leaf className="w-16 h-16 text-secondary mx-auto mb-4" /><p className="text-lg font-medium text-foreground">Empowering African Agriculture</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-card border-border overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-accent" />
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6"><Eye className="w-7 h-7 text-primary" /></div>
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-muted-foreground text-lg">To become Africa's most trusted agricultural marketplace, enabling seamless trade that empowers farmers, strengthens food security, and connects the continent to global markets.</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-secondary to-green-400" />
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6"><Target className="w-7 h-7 text-secondary" /></div>
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-muted-foreground text-lg">To build technology infrastructure that creates transparent, efficient, and sustainable agricultural supply chains — increasing farmer incomes, reducing waste, and improving access to quality products.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">How It Works</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Secure, Seamless</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Our platform makes agricultural trade easy for everyone.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, index) => (
                <Card key={index} className="bg-card border-border relative overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{item.step}</div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mt-8 mb-4"><item.icon className="w-8 h-8 text-primary" /></div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Our Values</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Drives Us</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"><value.icon className="w-6 h-6 text-primary" /></div>
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
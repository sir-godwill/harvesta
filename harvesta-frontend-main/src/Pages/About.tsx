import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Target, 
  Eye, 
  ShieldCheck, 
  Truck, 
  Leaf, 
  Globe, 
  Award,
  CheckCircle,
  ArrowRight,
  Search,
  Handshake,
  CreditCard,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { value: '10,000+', label: 'Active Suppliers' },
  { value: '50+', label: 'Countries Served' },
  { value: '100,000+', label: 'Products Listed' },
  { value: '5M+', label: 'Transactions Processed' },
];

const values = [
  {
    icon: ShieldCheck,
    title: 'Trust & Transparency',
    description: 'We verify every supplier and ensure transparent pricing for all transactions.'
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'Supporting sustainable farming practices and reducing waste across the supply chain.'
  },
  {
    icon: Users,
    title: 'Farmer First',
    description: 'Empowering smallholder farmers with direct access to markets and fair pricing.'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connecting African agriculture to global markets while strengthening local trade.'
  },
];

const howItWorks = [
  {
    step: 1,
    icon: Search,
    title: 'Discover Products',
    description: 'Browse thousands of verified agricultural products from trusted suppliers across Africa.'
  },
  {
    step: 2,
    icon: Handshake,
    title: 'Connect with Suppliers',
    description: 'Engage directly with verified farmers, processors, and distributors.'
  },
  {
    step: 3,
    icon: CreditCard,
    title: 'Order Securely',
    description: 'Place orders with confidence using our secure payment and escrow system.'
  },
  {
    step: 4,
    icon: Package,
    title: 'Delivery & Fulfillment',
    description: 'Track your orders from supplier to delivery with our logistics partners.'
  },
];

const trustFeatures = [
  {
    icon: Award,
    title: 'Quality Assurance',
    description: 'Every product meets our strict quality standards with certifications and grading.'
  },
  {
    icon: ShieldCheck,
    title: 'Verified Suppliers',
    description: 'Multi-step verification process including documentation, site visits, and reviews.'
  },
  {
    icon: CreditCard,
    title: 'Secure Transactions',
    description: 'Escrow protection and multiple payment options ensure safe transactions.'
  },
];

const team = [
  { name: 'Leadership Position', role: 'Chief Executive Officer', image: '/placeholder.svg' },
  { name: 'Leadership Position', role: 'Chief Operations Officer', image: '/placeholder.svg' },
  { name: 'Leadership Position', role: 'Chief Technology Officer', image: '/placeholder.svg' },
  { name: 'Leadership Position', role: 'Head of Agriculture', image: '/placeholder.svg' },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary/10 via-background to-primary/5 py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-secondary/10 text-secondary border-secondary/20">
              Africa's Leading Agro-Commerce Platform
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Transforming Agriculture,{' '}
              <span className="text-primary">One Connection at a Time</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Harvestá connects farmers, suppliers, and buyers across Africa and globally, 
              building transparent, efficient, and sustainable agricultural supply chains.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-checkout" asChild>
                <Link to="/products">
                  Start Buying <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="btn-secondary-action" asChild>
                <Link to="/become-supplier">Become a Supplier</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Stats Bar */}
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

      {/* Who We Are */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Who We Are</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Africa's Premier B2B Agricultural Marketplace
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Harvestá is a B2B-first agro-commerce platform that also serves local B2C markets. 
                We're building the infrastructure that connects agricultural value chain participants 
                across Africa and globally.
              </p>
              <p className="text-muted-foreground mb-6">
                Our platform enables farmers, processors, distributors, and buyers to discover, 
                connect, negotiate, and transact seamlessly — from crops and livestock to 
                agro-inputs and machinery.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" /> B2B Marketplace
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" /> B2C Support
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" /> Cross-Border Trade
                </Badge>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <Leaf className="w-16 h-16 text-secondary mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground">Empowering African Agriculture</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card border-border overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary to-accent" />
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground text-lg">
                  To become Africa's most trusted agricultural marketplace, enabling 
                  seamless trade that empowers farmers, strengthens food security, 
                  and connects the continent to global markets.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-secondary to-green-400" />
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground text-lg">
                  To build technology infrastructure that creates transparent, efficient, 
                  and sustainable agricultural supply chains — increasing farmer incomes, 
                  reducing waste, and improving access to quality products.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Secure, Seamless</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform makes agricultural trade easy for everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <Card key={index} className="bg-card border-border card-hover relative overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mt-8 mb-4">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">Trust & Security</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trade with Confidence</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We've built robust systems to ensure every transaction is safe and reliable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {trustFeatures.map((feature, index) => (
              <Card key={index} className="bg-card border-border text-center card-hover">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Our Values</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Drives Us</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-card border-border card-hover">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card border-border">
                  <CardContent className="p-6 text-center">
                    <Leaf className="w-10 h-10 text-secondary mx-auto mb-3" />
                    <p className="text-2xl font-bold text-primary">50K+</p>
                    <p className="text-sm text-muted-foreground">Farmers Empowered</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-6 text-center">
                    <Truck className="w-10 h-10 text-primary mx-auto mb-3" />
                    <p className="text-2xl font-bold text-secondary">30%</p>
                    <p className="text-sm text-muted-foreground">Logistics Efficiency</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-6 text-center">
                    <Users className="w-10 h-10 text-accent mx-auto mb-3" />
                    <p className="text-2xl font-bold text-primary">200+</p>
                    <p className="text-sm text-muted-foreground">Partner Organizations</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-6 text-center">
                    <Globe className="w-10 h-10 text-info mx-auto mb-3" />
                    <p className="text-2xl font-bold text-secondary">25+</p>
                    <p className="text-sm text-muted-foreground">African Countries</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">Impact & Sustainability</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Building a Sustainable Agricultural Future
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                We're committed to creating positive impact across the agricultural value chain — 
                from empowering smallholder farmers to reducing post-harvest losses and promoting 
                sustainable practices.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Direct market access for smallholder farmers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Reduced post-harvest losses through efficient logistics</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Fair pricing and transparent trade practices</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Supporting sustainable and organic farming</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Leadership</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experienced leaders passionate about transforming African agriculture.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="bg-card border-border overflow-hidden card-hover">
                <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <Users className="w-20 h-20 text-muted-foreground/30" />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Agricultural Trade?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of buyers and suppliers already using Harvestá to grow their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="font-semibold" asChild>
              <Link to="/products">
                Start Buying <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link to="/become-supplier">Become a Supplier</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

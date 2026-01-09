import { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, ShoppingCart, CreditCard, Truck, RotateCcw, ShieldCheck, User, HelpCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqCategories = [
  { id: 'buying', label: 'Buying & Orders', icon: ShoppingCart },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'delivery', label: 'Delivery & Logistics', icon: Truck },
  { id: 'returns', label: 'Returns & Disputes', icon: RotateCcw },
  { id: 'verification', label: 'Supplier Verification', icon: ShieldCheck },
  { id: 'account', label: 'Account & Security', icon: User },
];

const faqs = [
  { category: 'buying', question: 'How do I place an order on Harvestá?', answer: 'To place an order, browse products, add items to your cart, and proceed to checkout. You can select your preferred delivery method and payment option.', popular: true },
  { category: 'buying', question: 'What is MOQ and how does it work?', answer: 'MOQ stands for Minimum Order Quantity. This is the smallest amount a supplier will sell for a particular product. MOQ varies by product and supplier.', popular: true },
  { category: 'payments', question: 'What payment methods are accepted?', answer: 'We accept Mobile Money (M-Pesa, MTN, Airtel), Bank Transfer, Card Payments (Visa, Mastercard), and Cash on Delivery for select locations.', popular: true },
  { category: 'payments', question: 'Is my payment information secure?', answer: 'Yes. All payments are processed through secure, encrypted channels. We use industry-standard SSL encryption and comply with PCI-DSS standards.', popular: true },
  { category: 'delivery', question: 'How long does delivery take?', answer: 'Delivery times vary by product type, supplier location, and your delivery address. Standard delivery within Nigeria is 3-7 business days.', popular: true },
  { category: 'delivery', question: 'Can I track my order?', answer: "Yes! Once your order ships, you'll receive a tracking number via email and SMS. You can track your order in real-time from your account dashboard.", popular: true },
  { category: 'returns', question: 'What is the return policy?', answer: "Returns are accepted within 7 days of delivery for products that don't match the description or have quality issues. Fresh produce has a 24-hour inspection window.", popular: true },
  { category: 'returns', question: 'How do I file a dispute?', answer: 'Go to your order history, select the order, and click "Report Issue". Describe the problem with photos if applicable.', popular: true },
  { category: 'verification', question: 'How are suppliers verified?', answer: 'Suppliers undergo a multi-step verification: business registration check, physical address verification, quality certification review, and sample inspection.', popular: true },
  { category: 'account', question: 'How do I create an account?', answer: 'Click "Sign Up", enter your email or phone number, set a password, and verify your account. You can register as a buyer, supplier, or both.', popular: true },
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    let result = faqs;
    if (activeCategory) result = result.filter(f => f.category === activeCategory);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f => f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query));
    }
    return result;
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 lg:py-20">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Help Center</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">Find answers to common questions about buying, selling, payments, and more.</p>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input type="text" placeholder="Search for answers..." className="pl-12 h-14 text-lg" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="py-8 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant={activeCategory === null ? 'default' : 'outline'} size="sm" onClick={() => setActiveCategory(null)}>All Topics</Button>
              {faqCategories.map((cat) => (
                <Button key={cat.id} variant={activeCategory === cat.id ? 'default' : 'outline'} size="sm" onClick={() => setActiveCategory(cat.id)}>
                  <cat.icon className="w-4 h-4 mr-2" /> {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="hidden lg:block">
                <div className="sticky top-8 space-y-4">
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {faqCategories.map((cat) => (
                      <button key={cat.id} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeCategory === cat.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`} onClick={() => setActiveCategory(cat.id)}>
                        <cat.icon className="w-5 h-5" /><span className="text-sm font-medium">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                  <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 mt-8">
                    <CardContent className="p-6 text-center">
                      <HelpCircle className="w-10 h-10 text-primary mx-auto mb-3" />
                      <h4 className="font-semibold mb-2">Still have questions?</h4>
                      <p className="text-sm text-muted-foreground mb-4">Can't find what you're looking for?</p>
                      <Button className="w-full" asChild><Link to="/contact"><MessageCircle className="w-4 h-4 mr-2" /> Contact Support</Link></Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="lg:col-span-3">
                {(searchQuery || activeCategory) && <div className="mb-4"><p className="text-sm text-muted-foreground">{filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} found</p></div>}
                {filteredFaqs.length > 0 ? (
                  <Accordion type="single" collapsible className="space-y-3">
                    {filteredFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`} className="border border-border rounded-lg px-6 bg-card">
                        <AccordionTrigger className="text-left hover:no-underline py-4"><span className="font-medium pr-4">{faq.question}</span></AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <Card className="bg-muted/50 border-border">
                    <CardContent className="py-12 text-center">
                      <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No results found</h3>
                      <p className="text-muted-foreground mb-4">We couldn't find any questions matching your search.</p>
                      <Button variant="outline" onClick={() => { setSearchQuery(''); setActiveCategory(null); }}>Clear Search</Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
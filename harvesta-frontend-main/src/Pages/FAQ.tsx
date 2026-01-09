import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Search, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  User,
  HelpCircle,
  MessageCircle
} from 'lucide-react';
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
  // Buying & Orders
  {
    category: 'buying',
    question: 'How do I place an order on Harvestá?',
    answer: 'To place an order, browse products, add items to your cart, and proceed to checkout. You can select your preferred delivery method and payment option. For bulk orders, you can also request a quotation directly from suppliers.',
    popular: true,
  },
  {
    category: 'buying',
    question: 'What is MOQ and how does it work?',
    answer: 'MOQ stands for Minimum Order Quantity. This is the smallest amount a supplier will sell for a particular product. MOQ varies by product and supplier. You can see the MOQ on each product page and in your cart.',
    popular: true,
  },
  {
    category: 'buying',
    question: 'Can I buy small quantities for personal use?',
    answer: 'Yes! While Harvestá is B2B-first, we support local B2C purchases. Some products have lower MOQs suitable for individual buyers. Look for "Retail Available" tags on product listings.',
    popular: false,
  },
  {
    category: 'buying',
    question: 'How do I request a quotation for bulk orders?',
    answer: 'Click "Request Quotation" on any product page or in your cart for items exceeding standard order sizes. Fill in your requirements, and the supplier will respond with a customized quote within 24-48 hours.',
    popular: true,
  },
  {
    category: 'buying',
    question: 'Can I negotiate prices with suppliers?',
    answer: 'Yes, for bulk B2B orders. Use the "Request Quotation" feature to start negotiations. Suppliers can offer tiered pricing, discounts, and custom terms based on order volume and frequency.',
    popular: false,
  },

  // Payments
  {
    category: 'payments',
    question: 'What payment methods are accepted?',
    answer: 'We accept Mobile Money (M-Pesa, MTN, Airtel), Bank Transfer, Card Payments (Visa, Mastercard), and Cash on Delivery for select locations. For large B2B orders, escrow payments are available.',
    popular: true,
  },
  {
    category: 'payments',
    question: 'Is my payment information secure?',
    answer: 'Yes. All payments are processed through secure, encrypted channels. We use industry-standard SSL encryption and comply with PCI-DSS standards. We never store your full card details.',
    popular: true,
  },
  {
    category: 'payments',
    question: 'How does escrow payment work?',
    answer: 'For B2B orders, funds are held in escrow until you confirm receipt and satisfaction with the order. This protects both buyers and suppliers. Funds are released to the supplier only after your approval.',
    popular: false,
  },
  {
    category: 'payments',
    question: 'Can I pay in installments?',
    answer: 'For qualifying bulk orders, some suppliers offer payment terms and installment options. This is negotiated directly with the supplier during the quotation process.',
    popular: false,
  },

  // Delivery & Logistics
  {
    category: 'delivery',
    question: 'How long does delivery take?',
    answer: 'Delivery times vary by product type, supplier location, and your delivery address. Standard delivery within Nigeria is 3-7 business days. Express options are available. You\'ll see estimated delivery times at checkout.',
    popular: true,
  },
  {
    category: 'delivery',
    question: 'Can I track my order?',
    answer: 'Yes! Once your order ships, you\'ll receive a tracking number via email and SMS. You can track your order in real-time from your account dashboard or order confirmation page.',
    popular: true,
  },
  {
    category: 'delivery',
    question: 'Do you deliver internationally?',
    answer: 'Yes, we support cross-border trade across Africa and internationally. Delivery times and costs vary by destination. Contact us for bulk export orders.',
    popular: false,
  },
  {
    category: 'delivery',
    question: 'What are the delivery options?',
    answer: 'Options include: Pickup from supplier, Vendor delivery, Third-party logistics (DHL, FedEx, local couriers), and Dedicated logistics for bulk orders. Options vary by supplier.',
    popular: false,
  },

  // Returns & Disputes
  {
    category: 'returns',
    question: 'What is the return policy?',
    answer: 'Returns are accepted within 7 days of delivery for products that don\'t match the description or have quality issues. Fresh produce has a 24-hour inspection window. See our full Returns Policy for details.',
    popular: true,
  },
  {
    category: 'returns',
    question: 'How do I file a dispute?',
    answer: 'Go to your order history, select the order, and click "Report Issue". Describe the problem with photos if applicable. Our dispute resolution team will review and respond within 48 hours.',
    popular: true,
  },
  {
    category: 'returns',
    question: 'How long do refunds take?',
    answer: 'Once a refund is approved, it\'s processed within 3-5 business days. The time to receive funds depends on your payment method: Mobile Money (instant), Bank Transfer (2-3 days), Card (5-7 days).',
    popular: false,
  },

  // Supplier Verification
  {
    category: 'verification',
    question: 'How are suppliers verified?',
    answer: 'Suppliers undergo a multi-step verification: business registration check, physical address verification, quality certification review, and sample inspection. Verified suppliers display trust badges.',
    popular: true,
  },
  {
    category: 'verification',
    question: 'What do the verification badges mean?',
    answer: '"Verified Supplier" means identity and business verified. "Quality Checked" means products meet our standards. "Premium Supplier" indicates high ratings and transaction volume.',
    popular: false,
  },
  {
    category: 'verification',
    question: 'How do I become a verified supplier?',
    answer: 'Register as a supplier, complete your profile, upload required documents (business registration, certifications), and submit for review. Verification takes 3-5 business days.',
    popular: false,
  },

  // Account & Security
  {
    category: 'account',
    question: 'How do I create an account?',
    answer: 'Click "Sign Up", enter your email or phone number, set a password, and verify your account. You can register as a buyer, supplier, or both. Business accounts require additional verification.',
    popular: true,
  },
  {
    category: 'account',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page, enter your email or phone, and follow the reset link. For security, links expire in 24 hours.',
    popular: false,
  },
  {
    category: 'account',
    question: 'Is my personal data protected?',
    answer: 'Yes. We comply with data protection regulations. Your personal data is encrypted, never sold, and only used for platform operations. See our Privacy Policy for full details.',
    popular: true,
  },
];

const popularFaqs = faqs.filter(f => f.popular);

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    let result = faqs;
    
    if (activeCategory) {
      result = result.filter(f => f.category === activeCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        f => f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [searchQuery, activeCategory]);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Help Center</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers to common questions about buying, selling, payments, and more.
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for answers..."
              className="pl-12 h-14 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant={activeCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(null)}
            >
              All Topics
            </Button>
            {faqCategories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
              >
                <cat.icon className="w-4 h-4 mr-2" />
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-8 space-y-4">
                <h3 className="font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {faqCategories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeCategory === cat.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      <cat.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>

                {/* Quick Contact */}
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 mt-8">
                  <CardContent className="p-6 text-center">
                    <HelpCircle className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Still have questions?</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Can't find what you're looking for?
                    </p>
                    <Button className="w-full" asChild>
                      <Link to="/contact">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Support
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              {/* Popular Questions */}
              {!searchQuery && !activeCategory && (
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">Popular</Badge>
                    <h2 className="text-xl font-semibold">Most Asked Questions</h2>
                  </div>
                  <Accordion type="single" collapsible className="space-y-3">
                    {popularFaqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`popular-${index}`}
                        className="border border-border rounded-lg px-6 bg-card"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-medium pr-4">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {/* Filtered/All FAQs */}
              {(searchQuery || activeCategory) && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} found
                    {activeCategory && ` in ${faqCategories.find(c => c.id === activeCategory)?.label}`}
                    {searchQuery && ` for "${searchQuery}"`}
                  </p>
                </div>
              )}

              {filteredFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-3">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`faq-${index}`}
                      className="border border-border rounded-lg px-6 bg-card"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <div className="flex items-start gap-3 pr-4">
                          <span className="font-medium">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        <Badge variant="outline" className="mb-3 text-xs">
                          {faqCategories.find(c => c.id === faq.category)?.label}
                        </Badge>
                        <p>{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <Card className="bg-muted/50 border-border">
                  <CardContent className="py-12 text-center">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-4">
                      We couldn't find any questions matching your search.
                    </p>
                    <Button variant="outline" onClick={() => {
                      setSearchQuery('');
                      setActiveCategory(null);
                    }}>
                      Clear Search
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* CTA for mobile */}
              <Card className="lg:hidden bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 mt-8">
                <CardContent className="p-6 text-center">
                  <HelpCircle className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Still have questions?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our support team is here to help you.
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/contact">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Support
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

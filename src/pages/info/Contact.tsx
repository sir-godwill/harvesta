import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle, AlertCircle, Building2, Headphones, Handshake, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const departments = [
  { value: 'sales', label: 'Sales & Business Development', icon: Building2 },
  { value: 'support', label: 'Customer Support', icon: Headphones },
  { value: 'partnerships', label: 'Partnerships & Collaborations', icon: Handshake },
  { value: 'disputes', label: 'Disputes & Resolutions', icon: AlertTriangle },
];

const contactMethods = [
  { icon: Mail, title: 'Email Us', value: 'support@harvesta.com', description: 'We respond within 24 hours' },
  { icon: Phone, title: 'Call Us', value: '+234 800 123 4567', description: 'Mon-Fri, 8AM-6PM WAT' },
  { icon: MessageCircle, title: 'WhatsApp', value: '+234 800 123 4567', description: 'Quick responses available' },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', department: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitStatus('success');
    toast.success('Message sent successfully!');
    setFormData({ name: '', email: '', phone: '', department: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitStatus !== 'idle') setSubmitStatus('idle');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 lg:py-20">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Get in Touch</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Have questions? We're here to help. Reach out to our team and we'll get back to you as quickly as possible.</p>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                    <p className="text-muted-foreground">Fill out the form below and we'll respond within 24 hours.</p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="name">Full Name *</Label><Input id="name" placeholder="Your full name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required /></div>
                        <div className="space-y-2"><Label htmlFor="email">Email Address *</Label><Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required /></div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" type="tel" placeholder="+234 XXX XXX XXXX" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} /></div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department *</Label>
                          <Select value={formData.department} onValueChange={(value) => handleChange('department', value)}>
                            <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                            <SelectContent>{departments.map((dept) => (<SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>))}</SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2"><Label htmlFor="subject">Subject *</Label><Input id="subject" placeholder="How can we help?" value={formData.subject} onChange={(e) => handleChange('subject', e.target.value)} required /></div>
                      <div className="space-y-2"><Label htmlFor="message">Message *</Label><Textarea id="message" placeholder="Tell us more about your inquiry..." rows={5} value={formData.message} onChange={(e) => handleChange('message', e.target.value)} required /></div>
                      {submitStatus === 'success' && <div className="flex items-center gap-2 p-4 bg-secondary/10 text-secondary rounded-lg"><CheckCircle className="w-5 h-5" /><span>Thank you! We've received your message.</span></div>}
                      <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : <><Send className="w-4 h-4 mr-2" /> Send Message</>}</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><method.icon className="w-6 h-6 text-primary" /></div>
                        <div><h3 className="font-semibold mb-1">{method.title}</h3><p className="text-primary font-medium">{method.value}</p><p className="text-sm text-muted-foreground">{method.description}</p></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0"><MapPin className="w-6 h-6 text-secondary" /></div>
                      <div><h3 className="font-semibold mb-1">Office Address</h3><p className="text-muted-foreground text-sm">123 Agriculture Hub<br />Victoria Island, Lagos<br />Nigeria</p></div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0"><Clock className="w-6 h-6 text-accent" /></div>
                      <div>
                        <h3 className="font-semibold mb-2">Office Hours</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between"><span className="text-muted-foreground">Monday - Friday</span><span className="font-medium">8:00 AM - 6:00 PM</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Saturday</span><span className="font-medium">9:00 AM - 2:00 PM</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Sunday</span><span className="font-medium">Closed</span></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
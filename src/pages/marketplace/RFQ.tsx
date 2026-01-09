import { useState } from 'react';
import { CheckCircle2, FileText } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { RFQForm } from '@/components/marketplace/RFQForm';
import { Button } from '@/components/ui/button';
import { submitRFQ } from '@/lib/marketplaceApi';
import type { RFQRequest } from '@/types/marketplace';

export default function RFQ() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRFQ, setSubmittedRFQ] = useState<string | null>(null);

  const handleSubmit = async (rfq: RFQRequest) => {
    setIsSubmitting(true);
    const response = await submitRFQ(rfq);
    setIsSubmitting(false);
    if (response.success && response.data) {
      setSubmittedRFQ(response.data.rfqId);
    }
  };

  if (submittedRFQ) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="min-h-[70vh] flex items-center justify-center p-4">
          <div className="max-w-md text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="text-2xl font-bold">RFQ Submitted Successfully!</h1>
            <p className="text-muted-foreground">
              Your request for quotation has been sent to matching suppliers. You'll receive quotes within 24-48 hours.
            </p>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">RFQ Reference</p>
              <p className="font-mono font-bold text-lg">{submittedRFQ}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setSubmittedRFQ(null)}>Submit Another</Button>
              <Button>Track RFQ Status</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-12 border-b">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-3">Request for Quotation</h1>
            <p className="text-muted-foreground">Get competitive quotes from verified suppliers for bulk orders</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-card rounded-xl border p-6 md:p-8">
            <RFQForm onSubmit={handleSubmit} isLoading={isSubmitting} />
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { icon: '📋', title: 'Submit Request', desc: 'Fill in your requirements' },
              { icon: '📩', title: 'Get Quotes', desc: 'Receive quotes in 24-48h' },
              { icon: '🤝', title: 'Compare & Order', desc: 'Choose the best offer' },
            ].map((step, i) => (
              <div key={i} className="text-center p-4 rounded-lg bg-muted/50">
                <span className="text-3xl">{step.icon}</span>
                <h3 className="font-medium mt-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
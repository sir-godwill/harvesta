import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

interface ProductFAQProps {
    productName: string;
}

export function ProductFAQ({ productName }: ProductFAQProps) {
    const faqs = [
        {
            question: `How long does it take to ship ${productName}?`,
            answer: "Typically, shipping takes 2-5 business days depending on your location and the vendor's processing speed. You will receive a tracking number once the order is shipped.",
        },
        {
            question: "Can I request a sample before a bulk order?",
            answer: "Yes, most sellers allow sample requests. You can use the 'Request for Quote' or 'Chat Now' button to discuss sample pricing and shipping with the seller.",
        },
        {
            question: "Is there a discount for very large orders?",
            answer: "Absolutely! Our platform is designed for B2B. For orders exceeding the listed pricing tiers, we recommend using the 'Send Offer' button to negotiate directly with the seller.",
        },
        {
            question: "What is the return policy for quality issues?",
            answer: "We offer a 7-day quality guarantee. If the product does not match the description or quality standards, Harvestá will facilitate a full refund or replacement.",
        },
        {
            question: "Are the prices negotiable?",
            answer: "While standard prices are fixed, bulk orders and long-term contracts can be negotiated via the 'Send Offer' or 'Chat Now' feature.",
        },
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-sm font-medium hover:no-underline">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Send, DollarSign, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { sendMessage } from '@/lib/chat-api';
import { toast } from 'sonner';

interface SellerChatPanelProps {
    conversationId: string;
    buyerInfo?: any;
}

export function SellerChatPanel({ conversationId, buyerInfo }: SellerChatPanelProps) {
    const [quoteData, setQuoteData] = useState({
        productName: '',
        quantity: '',
        pricePerUnit: '',
        deliveryTerms: '',
        validUntil: '',
    });

    const handleSendQuote = async () => {
        try {
            const quoteMessage = {
                type: 'quote' as const,
                content: `Quote: ${quoteData.productName}`,
                metadata: {
                    productName: quoteData.productName,
                    quantity: parseFloat(quoteData.quantity),
                    pricePerUnit: parseFloat(quoteData.pricePerUnit),
                    totalPrice: parseFloat(quoteData.quantity) * parseFloat(quoteData.pricePerUnit),
                    deliveryTerms: quoteData.deliveryTerms,
                    validUntil: quoteData.validUntil,
                    currency: 'XAF',
                },
            };

            await sendMessage(conversationId, quoteMessage.content, quoteMessage.type, quoteMessage.metadata);

            toast.success('Quote sent successfully');
            setQuoteData({
                productName: '',
                quantity: '',
                pricePerUnit: '',
                deliveryTerms: '',
                validUntil: '',
            });
        } catch (error) {
            console.error('Error sending quote:', error);
            toast.error('Failed to send quote');
        }
    };

    return (
        <div className="space-y-4 p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Seller Tools</CardTitle>
                    <CardDescription>Quick actions for this conversation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-2">
                        <Package className="h-4 w-4" />
                        Share Product
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Send Catalog
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                        <FileText className="h-4 w-4" />
                        View Order History
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Send Quote</CardTitle>
                    <CardDescription>Create and send a price quote</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="productName">Product Name</Label>
                        <Input
                            id="productName"
                            value={quoteData.productName}
                            onChange={(e) => setQuoteData(prev => ({ ...prev, productName: e.target.value }))}
                            placeholder="e.g., Organic Cocoa Beans"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity (kg)</Label>
                            <Input
                                id="quantity"
                                type="number"
                                value={quoteData.quantity}
                                onChange={(e) => setQuoteData(prev => ({ ...prev, quantity: e.target.value }))}
                                placeholder="1000"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pricePerUnit">Price/Unit (XAF)</Label>
                            <Input
                                id="pricePerUnit"
                                type="number"
                                value={quoteData.pricePerUnit}
                                onChange={(e) => setQuoteData(prev => ({ ...prev, pricePerUnit: e.target.value }))}
                                placeholder="850"
                            />
                        </div>
                    </div>

                    {quoteData.quantity && quoteData.pricePerUnit && (
                        <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium">Total Price</p>
                            <p className="text-2xl font-bold text-primary">
                                {(parseFloat(quoteData.quantity) * parseFloat(quoteData.pricePerUnit)).toLocaleString()} XAF
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="deliveryTerms">Delivery Terms</Label>
                        <Textarea
                            id="deliveryTerms"
                            value={quoteData.deliveryTerms}
                            onChange={(e) => setQuoteData(prev => ({ ...prev, deliveryTerms: e.target.value }))}
                            placeholder="Delivery within 7-10 days..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="validUntil">Valid Until</Label>
                        <Input
                            id="validUntil"
                            type="date"
                            value={quoteData.validUntil}
                            onChange={(e) => setQuoteData(prev => ({ ...prev, validUntil: e.target.value }))}
                        />
                    </div>

                    <Button
                        onClick={handleSendQuote}
                        className="w-full gap-2"
                        disabled={!quoteData.productName || !quoteData.quantity || !quoteData.pricePerUnit}
                    >
                        <Send className="h-4 w-4" />
                        Send Quote
                    </Button>
                </CardContent>
            </Card>

            {buyerInfo && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Buyer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">{buyerInfo.full_name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">{buyerInfo.location || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Previous Orders:</span>
                            <Badge variant="secondary">0</Badge>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

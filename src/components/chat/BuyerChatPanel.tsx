import { useState } from 'react';
import { Heart, ShoppingCart, Star, FileQuestion, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { sendMessage } from '@/lib/chat-api';
import { toast } from 'sonner';

interface BuyerChatPanelProps {
    conversationId: string;
    sellerInfo?: any;
}

export function BuyerChatPanel({ conversationId, sellerInfo }: BuyerChatPanelProps) {
    const [requestData, setRequestData] = useState({
        productName: '',
        quantity: '',
        targetPrice: '',
        additionalNotes: '',
    });

    const handleSendRequest = async () => {
        try {
            const requestMessage = {
                type: 'quote' as const,
                content: `Quote Request: ${requestData.productName}`,
                metadata: {
                    productName: requestData.productName,
                    quantity: parseFloat(requestData.quantity),
                    targetPrice: parseFloat(requestData.targetPrice),
                    additionalNotes: requestData.additionalNotes,
                    currency: 'XAF',
                },
            };

            await sendMessage(conversationId, requestMessage.content, requestMessage.type, requestMessage.metadata);

            toast.success('Quote request sent');
            setRequestData({
                productName: '',
                quantity: '',
                targetPrice: '',
                additionalNotes: '',
            });
        } catch (error) {
            console.error('Error sending request:', error);
            toast.error('Failed to send request');
        }
    };

    return (
        <div className="space-y-4 p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Buyer Actions</CardTitle>
                    <CardDescription>Quick actions for this conversation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-2">
                        <Heart className="h-4 w-4" />
                        Follow Seller
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                        <Package className="h-4 w-4" />
                        View Products
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        View Orders
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                        <Star className="h-4 w-4" />
                        Rate Seller
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Request Quote</CardTitle>
                    <CardDescription>Ask for pricing information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="productName">Product Name</Label>
                        <Input
                            id="productName"
                            value={requestData.productName}
                            onChange={(e) => setRequestData(prev => ({ ...prev, productName: e.target.value }))}
                            placeholder="What are you looking for?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity Needed</Label>
                            <Input
                                id="quantity"
                                type="number"
                                value={requestData.quantity}
                                onChange={(e) => setRequestData(prev => ({ ...prev, quantity: e.target.value }))}
                                placeholder="1000 kg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="targetPrice">Target Price (XAF)</Label>
                            <Input
                                id="targetPrice"
                                type="number"
                                value={requestData.targetPrice}
                                onChange={(e) => setRequestData(prev => ({ ...prev, targetPrice: e.target.value }))}
                                placeholder="Optional"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="additionalNotes">Additional Requirements</Label>
                        <Textarea
                            id="additionalNotes"
                            value={requestData.additionalNotes}
                            onChange={(e) => setRequestData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                            placeholder="Delivery location, quality requirements, etc..."
                            rows={3}
                        />
                    </div>

                    <Button
                        onClick={handleSendRequest}
                        className="w-full gap-2"
                        disabled={!requestData.productName || !requestData.quantity}
                    >
                        <FileQuestion className="h-4 w-4" />
                        Send Request
                    </Button>
                </CardContent>
            </Card>

            {sellerInfo && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Seller Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Company:</span>
                            <span className="font-medium">{sellerInfo.company_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">{sellerInfo.location || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Rating:</span>
                            <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                <span className="font-medium">4.8</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Response Time:</span>
                            <Badge variant="secondary">~1 hour</Badge>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

import { useState } from 'react';
import { Shield, AlertTriangle, Ban, Eye, MessageSquare, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { sendMessage } from '@/lib/chat-api';
import { toast } from 'sonner';

interface AdminChatPanelProps {
    conversationId: string;
    participants?: any[];
}

export function AdminChatPanel({ conversationId, participants }: AdminChatPanelProps) {
    const [moderationNote, setModerationNote] = useState('');
    const [systemMessage, setSystemMessage] = useState('');

    const handleSendSystemMessage = async () => {
        if (!systemMessage.trim()) return;

        try {
            await sendMessage(conversationId, systemMessage, 'system', {
                isAdminMessage: true,
                timestamp: new Date().toISOString(),
            });

            toast.success('System message sent');
            setSystemMessage('');
        } catch (error) {
            console.error('Error sending system message:', error);
            toast.error('Failed to send message');
        }
    };

    const handleFreezeConversation = () => {
        toast.info('Conversation frozen (feature coming soon)');
    };

    const handleWarnUser = () => {
        toast.info('Warning sent (feature coming soon)');
    };

    return (
        <div className="space-y-4 p-4">
            <Card className="border-amber-500/50">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-amber-500" />
                        Admin Controls
                    </CardTitle>
                    <CardDescription>Moderation and support tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-2" onClick={handleWarnUser}>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Send Warning
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2" onClick={handleFreezeConversation}>
                        <Ban className="h-4 w-4 text-red-500" />
                        Freeze Conversation
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                        <Eye className="h-4 w-4" />
                        View Full History
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                        <TrendingUp className="h-4 w-4" />
                        View Analytics
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Send System Message</CardTitle>
                    <CardDescription>Send an official message to participants</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="systemMessage">Message</Label>
                        <Textarea
                            id="systemMessage"
                            value={systemMessage}
                            onChange={(e) => setSystemMessage(e.target.value)}
                            placeholder="This conversation is being monitored..."
                            rows={3}
                        />
                    </div>

                    <Button
                        onClick={handleSendSystemMessage}
                        className="w-full gap-2"
                        disabled={!systemMessage.trim()}
                    >
                        <MessageSquare className="h-4 w-4" />
                        Send System Message
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Conversation Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Participants:</span>
                        <Badge variant="secondary">{participants?.length || 0}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant="outline" className="text-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Flags:</span>
                        <Badge variant="secondary">0</Badge>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label htmlFor="moderationNote">Moderation Notes</Label>
                        <Textarea
                            id="moderationNote"
                            value={moderationNote}
                            onChange={(e) => setModerationNote(e.target.value)}
                            placeholder="Internal notes (not visible to users)..."
                            rows={3}
                        />
                        <Button variant="outline" size="sm" className="w-full">
                            Save Note
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {participants && participants.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Participants</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {participants.map((participant) => (
                            <div key={participant.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                                <div>
                                    <p className="text-sm font-medium">{participant.user?.full_name || 'Unknown'}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{participant.user?.app_role || 'user'}</p>
                                </div>
                                <Button variant="ghost" size="sm">
                                    View Profile
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

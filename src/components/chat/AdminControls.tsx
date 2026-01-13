import { useState } from 'react';
import { Shield, Lock, Unlock, VolumeX, Eye, EyeOff, Download, MessageSquarePlus, AlertTriangle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Conversation, moderateChat, joinChatAsAdmin } from '@/lib/chat-api';
import { useToast } from '@/hooks/use-toast';

interface AdminControlsProps { conversation: Conversation; onUpdate: () => void; }

export function AdminControls({ conversation, onUpdate }: AdminControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [systemMessage, setSystemMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const { toast } = useToast();

  const handleFreeze = async () => { await moderateChat(conversation.id, conversation.isFrozen ? 'unfreeze' : 'freeze'); toast({ title: conversation.isFrozen ? 'Chat Unfrozen' : 'Chat Frozen' }); onUpdate(); };
  const handleMuteUser = async () => { if (!selectedUser) return; await moderateChat(conversation.id, 'mute-user', { userId: selectedUser }); toast({ title: 'User Muted' }); };
  const handleInjectMessage = async () => { if (!systemMessage.trim()) return; await moderateChat(conversation.id, 'inject-message', { message: systemMessage }); toast({ title: 'System Message Sent' }); setSystemMessage(''); onUpdate(); };
  const handleJoinChat = async (visible: boolean) => { await joinChatAsAdmin(conversation.id, visible); toast({ title: visible ? 'Joined Chat Visibly' : 'Joined Chat Invisibly' }); };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild><Button variant="outline" size="sm" className="gap-2"><Shield className="w-4 h-4" />Admin Controls</Button></SheetTrigger>
      <SheetContent className="w-96">
        <SheetHeader><SheetTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-red-500" />Admin Controls</SheetTitle><SheetDescription>Moderate this conversation</SheetDescription></SheetHeader>
        <div className="py-6 space-y-6">
          <div className="p-4 bg-muted rounded-lg"><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Chat Status</span><Badge variant={conversation.isFrozen ? 'destructive' : 'default'}>{conversation.isFrozen ? 'Frozen' : 'Active'}</Badge></div><div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="w-4 h-4" /><span>{conversation.participants.length} participants</span></div></div>
          <Separator />
          <div className="space-y-3"><Label className="text-sm font-medium">Quick Actions</Label><Button variant={conversation.isFrozen ? 'default' : 'destructive'} className="w-full justify-start" onClick={handleFreeze}>{conversation.isFrozen ? <><Unlock className="w-4 h-4 mr-2" />Unfreeze Chat</> : <><Lock className="w-4 h-4 mr-2" />Freeze Chat</>}</Button><div className="grid grid-cols-2 gap-2"><Button variant="outline" className="justify-start" onClick={() => handleJoinChat(true)}><Eye className="w-4 h-4 mr-2" />Join Visibly</Button><Button variant="outline" className="justify-start" onClick={() => handleJoinChat(false)}><EyeOff className="w-4 h-4 mr-2" />Join Hidden</Button></div><Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: 'Exporting...' })}><Download className="w-4 h-4 mr-2" />Export Chat Logs</Button></div>
          <Separator />
          <div className="space-y-3"><Label className="text-sm font-medium">Mute User</Label><div className="flex gap-2"><Select value={selectedUser} onValueChange={setSelectedUser}><SelectTrigger className="flex-1"><SelectValue placeholder="Select user" /></SelectTrigger><SelectContent>{conversation.participants.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.role})</SelectItem>)}</SelectContent></Select><Button variant="destructive" size="icon" onClick={handleMuteUser} disabled={!selectedUser}><VolumeX className="w-4 h-4" /></Button></div></div>
          <Separator />
          <div className="space-y-3"><Label className="text-sm font-medium">Send System Message</Label><Textarea value={systemMessage} onChange={(e) => setSystemMessage(e.target.value)} placeholder="Enter official message..." rows={3} /><Button className="w-full" onClick={handleInjectMessage} disabled={!systemMessage.trim()}><MessageSquarePlus className="w-4 h-4 mr-2" />Send System Message</Button></div>
          <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/30"><div className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-destructive mt-0.5" /><div className="text-xs"><p className="font-medium text-destructive mb-1">Moderation Notice</p><p className="text-muted-foreground">All actions are logged for audit.</p></div></div></div>
        </div>
        <SheetFooter><Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

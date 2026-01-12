import { useState } from 'react';
import { AlertTriangle, Shield, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { escalateChat } from '@/lib/chat-api';
import { useToast } from '@/hooks/use-toast';

interface EscalationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
}

const escalationReasons = [
  { id: 'dispute', label: 'Payment or Order Dispute', icon: '💰' },
  { id: 'fraud', label: 'Suspected Fraud', icon: '🚨' },
  { id: 'quality', label: 'Product Quality Issue', icon: '📦' },
  { id: 'delivery', label: 'Delivery Problem', icon: '🚚' },
  { id: 'harassment', label: 'Harassment or Abuse', icon: '⚠️' },
  { id: 'other', label: 'Other Issue', icon: '❓' },
];

export function EscalationDialog({ open, onOpenChange, conversationId }: EscalationDialogProps) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!reason) {
      toast({
        title: "Please select a reason",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await escalateChat(conversationId, `${reason}: ${details}`);
      
      toast({
        title: "Escalation Submitted",
        description: `Ticket #${result.ticketId} created. Our team will respond within 24 hours.`,
      });
      
      onOpenChange(false);
      setReason('');
      setDetails('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit escalation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <DialogTitle>Escalate to Admin</DialogTitle>
              <DialogDescription>
                Report an issue for Harvestá team review
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Reason Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">What's the issue?</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="grid grid-cols-2 gap-2">
              {escalationReasons.map((r) => (
                <Label
                  key={r.id}
                  htmlFor={r.id}
                  className={`
                    flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors
                    ${reason === r.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-muted-foreground'
                    }
                  `}
                >
                  <RadioGroupItem value={r.id} id={r.id} className="sr-only" />
                  <span className="text-xl">{r.icon}</span>
                  <span className="text-sm">{r.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <Label htmlFor="details" className="text-sm font-medium">
              Describe the issue
            </Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide details about your issue..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Include order numbers, dates, and any relevant information
            </p>
          </div>

          {/* Info Box */}
          <div className="p-3 bg-muted rounded-lg flex gap-3">
            <MessageSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">What happens next?</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• A Harvestá admin will review your case</li>
                <li>• You'll receive a response within 24 hours</li>
                <li>• Chat may be frozen during investigation</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-secondary hover:bg-secondary/90"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Escalation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

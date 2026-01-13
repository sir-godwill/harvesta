import { useState, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  Camera as CameraIcon, 
  Image as ImageIcon, 
  FileText, 
  MapPin,
  Package,
  Tag,
  X,
  StopCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onSendAttachment: (type: string, file?: File) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
}

const attachmentOptions = [
  { icon: FileText, label: 'Document', type: 'document', color: 'bg-blue-500', description: 'PDF, DOC, XLS' },
  { icon: CameraIcon, label: 'Camera', type: 'camera', color: 'bg-rose-500', description: 'Take a photo' },
  { icon: ImageIcon, label: 'Gallery', type: 'image', color: 'bg-purple-500', description: 'From gallery' },
  { icon: MapPin, label: 'Location', type: 'location', color: 'bg-green-500', description: 'Share location' },
  { icon: Package, label: 'Product', type: 'product', color: 'bg-green-600', description: 'Share a product' },
  { icon: Tag, label: 'Offer', type: 'offer', color: 'bg-orange-500', description: 'Send an offer' },
];

export function ChatInput({ 
  onSendMessage, 
  onSendAttachment, 
  onTyping, 
  disabled,
  placeholder = "Type a message..."
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      onTyping(false);
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    onTyping(e.target.value.length > 0);
    
    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  };

  const handleAttachmentClick = (type: string) => {
    setShowAttachments(false);
    
    if (type === 'document' || type === 'image') {
      fileInputRef.current?.click();
    } else if (type === 'location') {
      toast({
        title: "Sharing Location",
        description: "Opening location picker...",
      });
      onSendAttachment(type);
    } else if (type === 'offer') {
      toast({
        title: "Create Offer",
        description: "Opening offer creation dialog...",
      });
      onSendAttachment(type);
    } else if (type === 'product') {
      toast({
        title: "Share Product",
        description: "Opening product selector...",
      });
      onSendAttachment(type);
    } else {
      onSendAttachment(type);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "Uploading...",
        description: file.name,
      });
      onSendAttachment(file.type.startsWith('image/') ? 'image' : 'document', file);
    }
    e.target.value = '';
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    toast({
      title: "Recording",
      description: "Recording voice message...",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    
    toast({
      title: "Voice Message",
      description: `Recorded ${formatTime(recordingTime)}`,
    });
    
    setRecordingTime(0);
    onSendAttachment('audio');
  };

  const cancelRecording = () => {
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-background border-t">
      {/* Attachment Picker */}
      {showAttachments && (
        <div className="bg-accent/50 border-b">
          <div className="p-4 grid grid-cols-3 gap-3 max-w-md mx-auto">
            {attachmentOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleAttachmentClick(option.type)}
                className="flex flex-col items-center gap-2 group p-3 rounded-xl hover:bg-background transition-colors active:scale-95"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-105",
                  option.color
                )}>
                  <option.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-medium text-foreground block">{option.label}</span>
                  <span className="text-[10px] text-muted-foreground">{option.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recording UI */}
      {isRecording ? (
        <div className="flex items-center gap-3 p-3 bg-destructive/10">
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/20 rounded-full"
            onClick={cancelRecording}
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
            <span className="font-mono text-lg font-medium text-destructive">
              {formatTime(recordingTime)}
            </span>
            <div className="flex-1 flex items-center gap-0.5">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-destructive/60 rounded-full animate-pulse"
                  style={{ 
                    height: `${Math.random() * 20 + 8}px`,
                    animationDelay: `${i * 0.05}s` 
                  }}
                />
              ))}
            </div>
          </div>
          
          <Button
            size="icon"
            className="w-12 h-12 rounded-full bg-destructive hover:bg-destructive/90 shadow-lg"
            onClick={stopRecording}
          >
            <StopCircle className="w-6 h-6 text-white" />
          </Button>
        </div>
      ) : (
        /* Main Input Area */
        <div className="flex items-end gap-2 p-2">
          {/* Message Input Container */}
          <div className="flex-1 flex items-end gap-1 bg-accent rounded-2xl px-3 py-1.5">
            {/* Emoji Button */}
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-9 w-9 rounded-full hover:bg-background/50 text-muted-foreground mb-0.5"
              disabled={disabled}
            >
              <Smile className="w-5 h-5" />
            </Button>

            {/* Text Input */}
            <textarea
              ref={inputRef}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className="flex-1 bg-transparent py-2 text-[15px] outline-none placeholder:text-muted-foreground/60 disabled:opacity-50 resize-none max-h-[120px] min-h-[40px]"
            />

            {/* Attachment Button */}
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-9 w-9 rounded-full hover:bg-background/50 text-muted-foreground mb-0.5"
              disabled={disabled}
              onClick={() => setShowAttachments(!showAttachments)}
            >
              {showAttachments ? (
                <X className="w-5 h-5" />
              ) : (
                <Paperclip className="w-5 h-5 rotate-45" />
              )}
            </Button>

            {/* Camera Button (visible when no message) */}
            {!message.trim() && (
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 h-9 w-9 rounded-full hover:bg-background/50 text-muted-foreground mb-0.5"
                disabled={disabled}
                onClick={() => handleAttachmentClick('camera')}
              >
                <CameraIcon className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Send / Voice Button */}
          {message.trim() ? (
            <Button
              onClick={handleSend}
              size="icon"
              className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg"
              disabled={disabled}
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          ) : (
            <Button
              onMouseDown={startRecording}
              size="icon"
              className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg"
              disabled={disabled}
            >
              <Mic className="w-5 h-5 text-white" />
            </Button>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleFileSelect}
          />
        </div>
      )}
    </div>
  );
}

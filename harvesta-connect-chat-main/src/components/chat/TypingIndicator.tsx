import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  users: string[];
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
  const text = users.length === 1 
    ? `${users[0]} is typing` 
    : users.length === 2 
      ? `${users[0]} and ${users[1]} are typing`
      : `${users[0]} and ${users.length - 1} others are typing`;

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-chat-bubble-received rounded-2xl rounded-tl-none shadow-sm animate-bubble-in">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-dot" />
        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-dot" />
        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-dot" />
      </div>
      <span className="text-xs text-muted-foreground">{text}</span>
    </div>
  );
}

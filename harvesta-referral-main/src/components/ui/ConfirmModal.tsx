import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'bg-destructive/10 text-destructive',
    warning: 'bg-amber-100 text-amber-600',
    info: 'bg-primary/10 text-primary',
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-card rounded-2xl shadow-elevated max-w-sm w-full animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4',
            variantStyles[variant]
          )}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>
        <div className="p-4 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn-outline flex-1 justify-center"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'flex-1 justify-center inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
              variant === 'danger' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
              variant === 'warning' && 'bg-amber-500 text-white hover:bg-amber-600',
              variant === 'info' && 'btn-primary'
            )}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

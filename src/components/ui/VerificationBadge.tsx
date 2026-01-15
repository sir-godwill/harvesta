import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface VerificationBadgeProps {
    verified: boolean;
    size?: 'sm' | 'md' | 'lg';
    showTooltip?: boolean;
    className?: string;
}

export function VerificationBadge({
    verified,
    size = 'md',
    showTooltip = true,
    className
}: VerificationBadgeProps) {
    if (!verified) return null;

    const sizeClasses = {
        sm: 'h-3.5 w-3.5',
        md: 'h-4 w-4',
        lg: 'h-5 w-5'
    };

    const badge = (
        <div
            className={cn(
                'inline-flex items-center justify-center rounded-full bg-green-500 text-white',
                sizeClasses[size],
                className
            )}
            aria-label="Verified Seller"
        >
            <ShieldCheck className={cn('fill-current', sizeClasses[size])} />
        </div>
    );

    if (!showTooltip) return badge;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {badge}
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-xs font-medium">Verified Seller</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

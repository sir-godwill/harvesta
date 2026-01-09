import { Truck, Package, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { DeliveryOption } from '@/types/marketplace';

interface DeliveryEstimatorProps {
  options: DeliveryOption[];
  selectedOption?: DeliveryOption;
  onSelect: (option: DeliveryOption) => void;
  subtotal?: number;
  className?: string;
}

const deliveryIcons = {
  pickup: Package,
  vendor_delivery: Truck,
  third_party: Truck,
};

export function DeliveryEstimator({ 
  options, 
  selectedOption, 
  onSelect, 
  subtotal = 0,
  className 
}: DeliveryEstimatorProps) {
  const formatEstimate = (days: { min: number; max: number }) => {
    if (days.min === days.max) return `${days.min} day${days.min > 1 ? 's' : ''}`;
    return `${days.min}-${days.max} days`;
  };

  const getDeliveryCost = (option: DeliveryOption) => {
    if (option.freeAbove && subtotal >= option.freeAbove) {
      return 0;
    }
    return option.cost;
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Truck className="w-4 h-4" />
        Delivery Options
      </div>
      <RadioGroup
        value={selectedOption?.id}
        onValueChange={(value) => {
          const option = options.find(o => o.id === value);
          if (option) onSelect(option);
        }}
        className="space-y-2"
      >
        {options.map((option) => {
          const Icon = deliveryIcons[option.type];
          const cost = getDeliveryCost(option);
          const isFreeDelivery = option.freeAbove && subtotal >= option.freeAbove;

          return (
            <Label
              key={option.id}
              htmlFor={option.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                selectedOption?.id === option.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              )}
            >
              <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                selectedOption?.id === option.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{option.name}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatEstimate(option.estimatedDays)}
                </div>
              </div>
              <div className="text-right">
                {cost === 0 ? (
                  <span className="font-semibold text-secondary">FREE</span>
                ) : (
                  <span className="font-semibold">${cost.toFixed(2)}</span>
                )}
                {isFreeDelivery && option.cost > 0 && (
                  <div className="text-xs text-secondary flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Free over ${option.freeAbove}
                  </div>
                )}
              </div>
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
}

interface DeliveryEstimateDisplayProps {
  option: DeliveryOption;
  className?: string;
}

export function DeliveryEstimateDisplay({ option, className }: DeliveryEstimateDisplayProps) {
  const Icon = deliveryIcons[option.type];

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span>{option.name}</span>
      <span className="text-muted-foreground">•</span>
      <span className="text-muted-foreground">
        {option.estimatedDays.min}-{option.estimatedDays.max} days
      </span>
    </div>
  );
}

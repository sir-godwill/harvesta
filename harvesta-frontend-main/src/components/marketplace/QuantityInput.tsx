import { useState, useEffect } from 'react';
import { Minus, Plus, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  moq?: number;
  step?: number;
  unit?: string;
  className?: string;
}

export function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 99999,
  moq,
  step = 1,
  unit,
  className,
}: QuantityInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const validateAndUpdate = (newValue: number) => {
    let validatedValue = newValue;
    let errorMsg: string | null = null;

    if (isNaN(newValue) || newValue < min) {
      validatedValue = min;
      errorMsg = `Minimum quantity is ${min}`;
    } else if (newValue > max) {
      validatedValue = max;
      errorMsg = `Maximum quantity is ${max}`;
    } else if (moq && newValue < moq) {
      errorMsg = `Minimum order quantity is ${moq} ${unit || 'units'}`;
    }

    setError(errorMsg);
    onChange(validatedValue);
    setInputValue(validatedValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(rawValue);
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue, 10);
    validateAndUpdate(isNaN(numValue) ? min : numValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    validateAndUpdate(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    validateAndUpdate(newValue);
  };

  const isBelowMoq = moq && value < moq;

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0"
          onClick={handleDecrement}
          disabled={value <= min}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className={cn(
            'quantity-input',
            isBelowMoq && 'border-warning focus:border-warning'
          )}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0"
          onClick={handleIncrement}
          disabled={value >= max}
        >
          <Plus className="w-4 h-4" />
        </Button>
        {unit && (
          <span className="text-sm text-muted-foreground ml-1">{unit}</span>
        )}
      </div>
      {isBelowMoq && (
        <div className="moq-warning flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          MOQ: {moq} {unit || 'units'}
        </div>
      )}
      {error && !isBelowMoq && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

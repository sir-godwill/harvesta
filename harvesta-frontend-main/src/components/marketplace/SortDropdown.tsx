import { ArrowUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'moq_asc', label: 'MOQ: Low to High' },
  { value: 'rating_desc', label: 'Supplier Rating' },
  { value: 'delivery_asc', label: 'Fastest Delivery' },
  { value: 'newest', label: 'Newest First' },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px] gap-2">
        <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

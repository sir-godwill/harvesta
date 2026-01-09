import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { SearchFilters } from '@/types/marketplace';

interface FilterSidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
  className?: string;
}

const categories = ['Grains', 'Tubers', 'Vegetables', 'Fruits', 'Livestock', 'Agro-inputs'];
const grades = ['Grade A', 'Grade AA', 'Grade B', 'Premium', 'Export Quality', 'Standard'];
const origins = ['Kenya', 'Ghana', 'Nigeria', 'Ethiopia', 'Tanzania', 'Uganda', 'South Africa'];
const certifications = ['Organic', 'GlobalGAP', 'Fair Trade', 'Rainforest Alliance', 'UTZ Certified'];

export function FilterSidebar({ filters, onFiltersChange, onClearFilters, className }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'grade', 'price']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
  };

  const activeFiltersCount = [filters.category, filters.grade?.length, filters.origin?.length, filters.certifications?.length, filters.verifiedOnly, filters.priceRange?.min || filters.priceRange?.max].filter(Boolean).length;

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category: filters.category === category ? undefined : category });
  };

  const handleMultiSelectChange = (key: 'grade' | 'origin' | 'certifications', value: string) => {
    const current = filters[key] || [];
    const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    onFiltersChange({ ...filters, [key]: updated.length > 0 ? updated : undefined });
  };

  return (
    <aside className={cn('bg-card rounded-xl border border-border p-4', className)}>
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Filters</h2>
          {activeFiltersCount > 0 && <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>}
        </div>
        {activeFiltersCount > 0 && <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-primary">Clear all</Button>}
      </div>

      <div className="space-y-2">
        <Collapsible open={expandedSections.includes('category')}>
          <CollapsibleTrigger onClick={() => toggleSection('category')} className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
            Category
            {expandedSections.includes('category') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pb-4">
            {categories.map(category => (
              <button key={category} onClick={() => handleCategoryChange(category)} className={cn('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors', filters.category === category ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>
                {category}
              </button>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={expandedSections.includes('grade')}>
          <CollapsibleTrigger onClick={() => toggleSection('grade')} className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
            Grade / Quality
            {expandedSections.includes('grade') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pb-4">
            {grades.map(grade => (
              <label key={grade} className="flex items-center gap-3 cursor-pointer">
                <Checkbox checked={filters.grade?.includes(grade) || false} onCheckedChange={() => handleMultiSelectChange('grade', grade)} />
                <span className="text-sm">{grade}</span>
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={expandedSections.includes('origin')}>
          <CollapsibleTrigger onClick={() => toggleSection('origin')} className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
            Origin / Location
            {expandedSections.includes('origin') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pb-4">
            {origins.map(origin => (
              <label key={origin} className="flex items-center gap-3 cursor-pointer">
                <Checkbox checked={filters.origin?.includes(origin) || false} onCheckedChange={() => handleMultiSelectChange('origin', origin)} />
                <span className="text-sm">{origin}</span>
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <div className="py-4 border-t border-border">
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox checked={filters.verifiedOnly || false} onCheckedChange={(checked) => onFiltersChange({ ...filters, verifiedOnly: checked as boolean })} />
            <span className="text-sm font-medium">Verified Suppliers Only</span>
          </label>
        </div>
      </div>
    </aside>
  );
}
import { useState, useEffect } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  suggestions?: string[];
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, onSearch, suggestions = [], placeholder = 'Search products, suppliers, categories...', className }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const trendingSearches = ['Arabica Coffee', 'Organic Avocados', 'Yellow Maize', 'Cassava', 'Shea Butter'];

  useEffect(() => {
    if (isFocused && (value.length > 0 || suggestions.length > 0)) {
      setShowSuggestions(true);
    } else if (isFocused && value.length === 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [isFocused, value, suggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={cn('relative flex items-center bg-card border-2 rounded-xl transition-all duration-200', isFocused ? 'border-primary shadow-lg shadow-primary/10' : 'border-border hover:border-primary/50')}>
          <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="pl-12 pr-24 py-6 text-base border-0 focus-visible:ring-0 bg-transparent"
          />
          {value && <Button type="button" variant="ghost" size="sm" className="absolute right-20" onClick={() => onChange('')}><X className="w-4 h-4" /></Button>}
          <Button type="submit" className="absolute right-2 px-6">Search</Button>
        </div>
      </form>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          {suggestions.length > 0 ? (
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <button key={index} onClick={() => handleSuggestionClick(suggestion)} className="w-full px-4 py-2 text-left text-sm hover:bg-muted rounded-lg transition-colors flex items-center gap-3">
                  <Search className="w-4 h-4 text-muted-foreground" /> {suggestion}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3"><TrendingUp className="w-4 h-4" /><span className="font-medium">Trending Searches</span></div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => handleSuggestionClick(term)}>{term}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
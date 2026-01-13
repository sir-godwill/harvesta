import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductDescriptionProps {
  shortDescription: string;
  description: string;
  className?: string;
}

export function ProductDescription({
  shortDescription,
  description,
  className,
}: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if content is long enough to need expansion
  const needsExpansion = description.length > 500;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-primary" />
          Product Description
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Short Description */}
        {shortDescription && (
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">Overview</h4>
            <p className="text-muted-foreground">{shortDescription}</p>
          </div>
        )}

        {/* Full Description */}
        <div className="relative">
          <div 
            className={cn(
              'prose prose-sm max-w-none dark:prose-invert',
              'prose-headings:text-foreground prose-p:text-muted-foreground',
              'prose-strong:text-foreground prose-li:text-muted-foreground',
              !isExpanded && needsExpansion && 'max-h-64 overflow-hidden'
            )}
            dangerouslySetInnerHTML={{ __html: description || '<p>No detailed description available.</p>' }}
          />
          
          {/* Gradient Fade */}
          {needsExpansion && !isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent" />
          )}
        </div>

        {/* Expand/Collapse Button */}
        {needsExpansion && (
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Read More
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

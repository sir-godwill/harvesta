import { Card, CardContent } from '@/components/ui/card';

export function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden animate-pulse">
            <CardContent className="p-0">
                {/* Image Skeleton */}
                <div className="aspect-square bg-muted" />

                {/* Content Skeleton */}
                <div className="p-4 space-y-3">
                    {/* Title */}
                    <div className="h-4 bg-muted rounded w-3/4" />

                    {/* Subtitle */}
                    <div className="h-3 bg-muted rounded w-1/2" />

                    {/* Price and Rating */}
                    <div className="flex items-center justify-between">
                        <div className="h-5 bg-muted rounded w-20" />
                        <div className="h-4 bg-muted rounded w-12" />
                    </div>

                    {/* Button */}
                    <div className="h-9 bg-muted rounded" />
                </div>
            </CardContent>
        </Card>
    );
}

import { Check, Clock, Package, Truck, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TrackingEvent } from '@/types/marketplace';

interface StatusTimelineProps {
  events: TrackingEvent[];
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-5 h-5" />,
  confirmed: <Check className="w-5 h-5" />,
  processing: <Package className="w-5 h-5" />,
  shipped: <Truck className="w-5 h-5" />,
  delivered: <CheckCircle2 className="w-5 h-5" />,
};

export function StatusTimeline({ events, orientation = 'vertical', className }: StatusTimelineProps) {
  if (orientation === 'horizontal') {
    return (
      <div className={cn('w-full', className)}>
        <div className="flex items-start justify-between">
          {events.map((event, index) => (
            <div key={event.status} className="flex flex-col items-center flex-1">
              {/* Icon */}
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center relative z-10 transition-all duration-300',
                  event.isCompleted
                    ? 'bg-secondary text-secondary-foreground'
                    : event.isCurrent
                    ? 'bg-primary text-primary-foreground animate-pulse-soft'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {statusIcons[event.status] || <Clock className="w-5 h-5" />}
              </div>

              {/* Content */}
              <div className="mt-3 text-center">
                <p className={cn(
                  'font-medium text-sm',
                  event.isCompleted || event.isCurrent ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {event.title}
                </p>
                {event.timestamp && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(event.timestamp).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Connector Line */}
              {index < events.length - 1 && (
                <div
                  className={cn(
                    'absolute h-1 top-6 left-1/2 w-full -z-10 transform -translate-y-1/2',
                    event.isCompleted ? 'bg-secondary' : 'bg-muted'
                  )}
                  style={{ width: '100%' }}
                />
              )}
            </div>
          ))}
        </div>
        {/* Progress Line */}
        <div className="relative mt-[-3.5rem] mx-6 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-secondary transition-all duration-500"
            style={{
              width: `${(events.filter(e => e.isCompleted).length / (events.length - 1)) * 100}%`
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {events.map((event, index) => (
        <div key={event.status} className="flex gap-4 pb-8 last:pb-0">
          {/* Timeline */}
          <div className="flex flex-col items-center">
            {/* Icon */}
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                event.isCompleted
                  ? 'bg-secondary text-secondary-foreground'
                  : event.isCurrent
                  ? 'bg-primary text-primary-foreground animate-pulse-soft'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {statusIcons[event.status] || <Clock className="w-4 h-4" />}
            </div>
            {/* Line */}
            {index < events.length - 1 && (
              <div
                className={cn(
                  'w-0.5 flex-1 mt-2',
                  event.isCompleted ? 'bg-secondary' : 'bg-muted'
                )}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-3">
              <h4 className={cn(
                'font-medium',
                event.isCompleted || event.isCurrent ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {event.title}
              </h4>
              {event.isCurrent && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  Current
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {event.description}
            </p>
            {event.timestamp && (
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(event.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

import { motion } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Calendar, Check } from "lucide-react";

interface SeasonalCalendarProps {
  selectedMonths: number[];
  onChange: (months: number[]) => void;
}

const months = [
  { value: 1, label: 'Jan', fullLabel: 'January' },
  { value: 2, label: 'Feb', fullLabel: 'February' },
  { value: 3, label: 'Mar', fullLabel: 'March' },
  { value: 4, label: 'Apr', fullLabel: 'April' },
  { value: 5, label: 'May', fullLabel: 'May' },
  { value: 6, label: 'Jun', fullLabel: 'June' },
  { value: 7, label: 'Jul', fullLabel: 'July' },
  { value: 8, label: 'Aug', fullLabel: 'August' },
  { value: 9, label: 'Sep', fullLabel: 'September' },
  { value: 10, label: 'Oct', fullLabel: 'October' },
  { value: 11, label: 'Nov', fullLabel: 'November' },
  { value: 12, label: 'Dec', fullLabel: 'December' },
];

export function SeasonalCalendar({ selectedMonths, onChange }: SeasonalCalendarProps) {
  const toggleMonth = (month: number) => {
    if (selectedMonths.includes(month)) {
      onChange(selectedMonths.filter(m => m !== month));
    } else {
      onChange([...selectedMonths, month].sort((a, b) => a - b));
    }
  };

  const selectAll = () => {
    onChange(months.map(m => m.value));
  };

  const clearAll = () => {
    onChange([]);
  };

  const isAllSelected = selectedMonths.length === 12;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <Label className="text-sm font-medium">Seasonal Availability</Label>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectAll}
            className={cn(
              "text-xs px-2 py-1 rounded transition-colors",
              isAllSelected 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            All year
          </button>
          {selectedMonths.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Select the months when this product is available. Leave empty for always available.
      </p>

      <div className="grid grid-cols-6 gap-2">
        {months.map((month) => {
          const isSelected = selectedMonths.includes(month.value);
          return (
            <motion.button
              key={month.value}
              type="button"
              onClick={() => toggleMonth(month.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex flex-col items-center justify-center py-3 px-2 rounded-lg border-2 transition-all text-center",
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-2.5 h-2.5 text-primary-foreground" />
                </motion.div>
              )}
              <span className="font-medium text-sm">{month.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Visual Preview */}
      {selectedMonths.length > 0 && selectedMonths.length < 12 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-3 bg-muted/50 rounded-lg"
        >
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Available: </span>
            {selectedMonths.map(m => months.find(mo => mo.value === m)?.fullLabel).join(', ')}
          </p>
        </motion.div>
      )}
    </div>
  );
}

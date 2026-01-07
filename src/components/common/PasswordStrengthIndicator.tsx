import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

interface Requirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export function PasswordStrengthIndicator({ password, className }: PasswordStrengthIndicatorProps) {
  const passedCount = requirements.filter((req) => req.test(password)).length;
  
  const getStrengthLabel = () => {
    if (passedCount === 0) return { label: "", color: "" };
    if (passedCount <= 2) return { label: "Weak", color: "text-destructive" };
    if (passedCount <= 3) return { label: "Fair", color: "text-warning" };
    if (passedCount <= 4) return { label: "Good", color: "text-info" };
    return { label: "Strong", color: "text-success" };
  };

  const strength = getStrengthLabel();

  if (!password) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Strength bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Password strength</span>
          <span className={cn("text-xs font-medium", strength.color)}>
            {strength.label}
          </span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-200",
                i < passedCount
                  ? passedCount <= 2
                    ? "bg-destructive"
                    : passedCount <= 3
                    ? "bg-warning"
                    : passedCount <= 4
                    ? "bg-info"
                    : "bg-success"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Requirements list */}
      <ul className="space-y-1">
        {requirements.map((req, i) => {
          const passed = req.test(password);
          return (
            <li 
              key={i}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors",
                passed ? "text-success" : "text-muted-foreground"
              )}
            >
              {passed ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
              {req.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

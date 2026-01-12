// Currency formatting utilities for XAF (CFA Franc)

export const CURRENCY_CODE = 'XAF';
export const CURRENCY_SYMBOL = 'FCFA';
export const CURRENCY_LOCALE = 'fr-CM';

/**
 * Format amount as XAF currency with full formatting
 * Example: 1,500,000 → "1 500 000 FCFA"
 */
export function formatXAF(amount: number): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: 'currency',
    currency: CURRENCY_CODE,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format amount as compact XAF (for display in cards/charts)
 * Example: 1,500,000 → "1.5M XAF"
 */
export function formatXAFCompact(amount: number): string {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B FCFA`;
  }
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M FCFA`;
  }
  if (amount >= 1000) {
    return `${Math.round(amount / 1000)}K FCFA`;
  }
  return `${amount} FCFA`;
}

/**
 * Format amount as short XAF (no currency code)
 * Example: 1,500,000 → "1 500 000"
 */
export function formatXAFShort(amount: number): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with thousands separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE).format(num);
}

/**
 * Format date in Cameroonian format
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(CURRENCY_LOCALE, options || defaultOptions);
}

/**
 * Format date with time
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString(CURRENCY_LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format time only
 */
export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString(CURRENCY_LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get relative time string (e.g., "2 hours ago", "3 days ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return formatDate(dateString);
}

/**
 * Get days remaining until deadline
 */
export function getDaysRemaining(deadline: string): number {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffMs / 86400000);
}

/**
 * Format days remaining with urgency indicator
 */
export function formatDaysRemaining(deadline: string): { text: string; isUrgent: boolean } {
  const days = getDaysRemaining(deadline);
  if (days < 0) return { text: 'Expiré', isUrgent: true };
  if (days === 0) return { text: 'Aujourd\'hui', isUrgent: true };
  if (days === 1) return { text: 'Demain', isUrgent: true };
  if (days <= 3) return { text: `${days} jours`, isUrgent: true };
  return { text: `${days} jours`, isUrgent: false };
}

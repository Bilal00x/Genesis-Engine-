export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatCredits(credits: number): string {
  if (credits === -1) return "Unlimited";
  return credits.toLocaleString();
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "text-green-500",
    completed: "text-green-500",
    succeeded: "text-green-500",
    pending: "text-yellow-500",
    processing: "text-blue-500",
    failed: "text-red-500",
    cancelled: "text-gray-500",
    canceled: "text-gray-500",
    inactive: "text-gray-500",
    past_due: "text-orange-500",
    unpaid: "text-red-500",
  };
  return colors[status] || "text-gray-500";
}

export function getStatusBg(status: string): string {
  const colors: Record<string, string> = {
    active: "bg-green-500/10",
    completed: "bg-green-500/10",
    succeeded: "bg-green-500/10",
    pending: "bg-yellow-500/10",
    processing: "bg-blue-500/10",
    failed: "bg-red-500/10",
    cancelled: "bg-gray-500/10",
    canceled: "bg-gray-500/10",
    inactive: "bg-gray-500/10",
    past_due: "bg-orange-500/10",
    unpaid: "bg-red-500/10",
  };
  return colors[status] || "bg-gray-500/10";
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

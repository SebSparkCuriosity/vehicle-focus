const DAY = 86_400_000;

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const gbpCompact = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  notation: "compact",
  maximumFractionDigits: 1,
});
const num = new Intl.NumberFormat("en-GB");

export function formatGBP(value: number): string {
  return gbp.format(value);
}

/** £1.2m, £421k */
export function formatGBPCompact(value: number): string {
  return gbpCompact.format(value).replace("M", "m").replace("K", "k");
}

export function formatNumber(value: number): string {
  return num.format(value);
}

export function formatMiles(value: number): string {
  return `${num.format(value)} mi`;
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }): string {
  return new Date(iso).toLocaleDateString("en-GB", opts);
}

export function formatShortDate(iso: string): string {
  return formatDate(iso, { day: "numeric", month: "short" });
}

export function formatDayDate(iso: string): string {
  return formatDate(iso, { weekday: "short", day: "numeric", month: "short" });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function formatDateTime(iso: string): string {
  return `${formatDayDate(iso)}, ${formatTime(iso)}`;
}

/** Whole days from now until `iso` (negative when in the past). */
export function daysUntil(iso: string, now: number = Date.now()): number {
  const target = new Date(iso);
  const start = new Date(now);
  target.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - start.getTime()) / DAY);
}

/** "today", "tomorrow", "in 5 days", "3 days ago", "in 2 months" */
export function relativeDays(iso: string, now: number = Date.now()): string {
  const d = daysUntil(iso, now);
  if (d === 0) return "today";
  if (d === 1) return "tomorrow";
  if (d === -1) return "yesterday";
  const abs = Math.abs(d);
  let unit: string;
  if (abs < 14) unit = `${abs} days`;
  else if (abs < 60) unit = `${Math.round(abs / 7)} weeks`;
  else if (abs < 730) unit = `${Math.round(abs / 30.4)} months`;
  else unit = `${Math.round(abs / 365)} years`;
  return d > 0 ? `in ${unit}` : `${unit} ago`;
}

/** "2h ago", "just now", falls back to a date for older items. */
export function timeAgo(iso: string, now: number = Date.now()): string {
  const diff = now - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatShortDate(iso);
}

export function sizeLabel(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

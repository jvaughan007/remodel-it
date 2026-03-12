import { SERVICES, LEAD_STATUSES, LEAD_SOURCES } from "@/lib/constants";

const STATUS_MAP = Object.fromEntries(
  LEAD_STATUSES.map((s) => [s.value, s.label])
);

const SOURCE_MAP = Object.fromEntries(
  LEAD_SOURCES.map((s) => [s.value, s.label])
);

const SERVICE_MAP = Object.fromEntries(
  SERVICES.map((s) => [s.slug, s.title])
);

export function formatStatus(status: string): string {
  return STATUS_MAP[status] ?? status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatSource(source: string): string {
  return SOURCE_MAP[source] ?? source.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatService(slug: string): string {
  return SERVICE_MAP[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

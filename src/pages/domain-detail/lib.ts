export type TabKey = "overview" | "dns" | "danger";

export type LabelAvailability =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "reserved";

export type NamingMode = "random" | "custom";

export const DEBOUNCE_MS = 500;

export function getLocale(language: string): "de-DE" | "en-US" {
  return language.toLowerCase().startsWith("de") ? "de-DE" : "en-US";
}

export function formatCreatedAt(
  createdAt: string | undefined,
  locale: string,
  fallback: string,
): string {
  if (!createdAt) return fallback;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(createdAt));
}

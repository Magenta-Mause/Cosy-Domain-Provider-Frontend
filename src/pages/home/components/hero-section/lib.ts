export function sanitizeSubdomainInput(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, "");
}

export function sanitizeSubdomainInput(value: string): string {
  return value.toLowerCase().replaceAll(/[^a-z0-9-]/g, "");
}

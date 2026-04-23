export function getUserInitial(userName?: string | null): string {
  return userName?.[0]?.toUpperCase() ?? "?";
}

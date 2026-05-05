export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const PASSWORD_MIN = 8;

export const SUBDOMAIN_LABEL_PATTERN = /^[a-z\d]([a-z\d-]{0,61}[a-z\d])?$/;

export const EMAIL_PATTERN = /^[^\s@]+@([^\s@.]+\.)+[^\s@.]+$/;

export function isValidSubdomainLabel(value: string) {
  return SUBDOMAIN_LABEL_PATTERN.test(value);
}

export function isValidIpv4(value: string): boolean {
  const parts = value.split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => /^\d{1,3}$/.test(p) && Number(p) <= 255);
}

export function isValidIpv6(value: string): boolean {
  if ((value.match(/::/g) ?? []).length > 1) return false;
  const halves = value.split("::");
  const hexGroup = /^[\da-fA-F]{1,4}$/;
  if (halves.length === 2) {
    const left = halves[0] ? halves[0].split(":") : [];
    const right = halves[1] ? halves[1].split(":") : [];
    return (
      left.length + right.length <= 7 &&
      [...left, ...right].every((g) => hexGroup.test(g))
    );
  }
  const groups = value.split(":");
  return groups.length === 8 && groups.every((g) => hexGroup.test(g));
}

export function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value);
}

export function isValidUsername(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= USERNAME_MIN && trimmed.length <= USERNAME_MAX;
}

export function isValidPassword(value: string): boolean {
  return value.length >= PASSWORD_MIN;
}

export function isPasswordWeak(value: string): boolean {
  return value.length > 0 && value.length < PASSWORD_MIN;
}

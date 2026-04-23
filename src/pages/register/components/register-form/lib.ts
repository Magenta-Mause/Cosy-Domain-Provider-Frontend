export function isValidUsername(username: string): boolean {
  return username.trim().length >= 3 && username.trim().length <= 20;
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function isPasswordWeak(password: string): boolean {
  return password.length > 0 && password.length < 8;
}

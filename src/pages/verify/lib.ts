export function sanitizeVerificationCode(verificationCode: string) {
  return verificationCode.replaceAll(" ", "").replaceAll("-", "");
}

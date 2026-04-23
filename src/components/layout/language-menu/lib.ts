export function getLanguageCode(currentLanguage: string): "DE" | "EN" {
  return currentLanguage.toLowerCase().startsWith("de") ? "DE" : "EN";
}

import type { DeepStringSchema } from "@/i18n/schema";

export const legalEn = {
  legal: {
    back: "← Back",
    impressum: {
      title: "Legal Notice",
    },
    datenschutz: {
      title: "Privacy Policy",
    },
    agb: {
      title: "Terms of Service",
    },
  },
} as const;

export const legalDe: DeepStringSchema<typeof legalEn> = {
  legal: {
    back: "← Zurück",
    impressum: {
      title: "Impressum",
    },
    datenschutz: {
      title: "Datenschutzerklärung",
    },
    agb: {
      title: "Allgemeine Geschäftsbedingungen",
    },
  },
};

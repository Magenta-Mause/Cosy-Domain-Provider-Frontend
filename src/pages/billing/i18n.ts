import type { DeepStringSchema } from "@/i18n/schema";

export const billingEn = {
  billing: {
    title: "Subscription",
    manageLink: "Manage →",
    currentPlan: "Current plan",
    free: "Free",
    plus: "Cosy+",
    manageButton: "Manage subscription →",
    upgradeButton: "Upgrade to Cosy+ →",
    redirecting: "Opening billing portal...",
    error: "Could not open billing portal. Please try again.",
    freePlanDesc:
      "You are on the free plan. Upgrade to Cosy+ to choose custom subdomain names and get up to 5 domains.",
    plusPlanDesc: "You are on Cosy+. Thank you for supporting the project!",
    verifyRequired: "You need to verify your account before upgrading.",
    verifyLink: "Verify account →",
  },
} as const;

export const billingDe: DeepStringSchema<typeof billingEn> = {
  billing: {
    title: "Abonnement",
    manageLink: "Verwalten →",
    currentPlan: "Aktueller Plan",
    free: "Kostenlos",
    plus: "Cosy+",
    manageButton: "Abonnement verwalten →",
    upgradeButton: "Auf Cosy+ upgraden →",
    redirecting: "Abrechnungsportal wird geöffnet...",
    error:
      "Das Abrechnungsportal konnte nicht geöffnet werden. Bitte erneut versuchen.",
    freePlanDesc:
      "Du nutzt den kostenlosen Plan. Upgrade auf Cosy+, um eigene Subdomain-Namen zu wählen und bis zu 5 Domains zu erhalten.",
    plusPlanDesc: "Du nutzt Cosy+. Danke, dass du das Projekt unterstützt!",
    verifyRequired:
      "Du musst dein Konto verifizieren, bevor du upgraden kannst.",
    verifyLink: "Konto verifizieren →",
  },
};

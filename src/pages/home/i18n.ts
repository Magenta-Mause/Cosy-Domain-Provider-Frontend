import type { DeepStringSchema } from "@/i18n/schema";

export const homeEn = {
  landingNav: {
    features: "Features",
    pricing: "Pricing",
    myDashboard: "My Dashboard →",
    signUp: "Sign up",
  },
  hero: {
    badge: "✦ Free for every Cosy homestead",
    titleLine1: "Pick a home",
    titleLine2: "on the internet.",
    description:
      "Cosy Domain Provider gives you access to a free subdomain on play.cosy-hosting.net.",
    claimLabel: "Claim your address",
    checkButton: "Check →",
    benefit1: "✓ Get one random adress for free",
  },
  features: {
    title: "Easily setup your own subdomain",
    subtitle: "Get everything done in 3 steps",
    stop1Title: "Claim an address",
    stop1Body: "Create a free subdomain on play.cosy-hosting.net.",
    stop2Title: "Verify & connect",
    stop2Body:
      "One-time token pasted into your Cosy instance. We handle the DNS.",
    stop3Title: "Ride the wire",
    stop3Body: "Use your subdomain.",
  },
  pricing: {
    title: "Two ways to move in",
    subtitle:
      "Every Cosy user gets a free mailbox. Upgrade to pick the name on it.",
    freeBadge: "Free",
    freeTitle: "Random mailbox",
    freePrice: "€0 / forever",
    freeFeature1: "✓ One auto-generated subdomain",
    freeLimitation: "✗ Only random subdomain",
    freeButton: "Get a random address",
    plusBadge: "Cosy+",
    plusTitle: "Custom names",
    plusPrice: "€1 / month",
    plusFeature1: "✓ Pick your exact subdomain",
    plusFeature2: "✓ Up to 5 domains per account",
    plusSupport: "❤️ Your subscription supports the Cosy core team",
    plusButton: "Upgrade to Cosy+",
  },
} as const;

export const homeDe: DeepStringSchema<typeof homeEn> = {
  landingNav: {
    features: "Funktionen",
    pricing: "Preise",
    myDashboard: "Mein Dashboard →",
    signUp: "Registrieren",
  },
  hero: {
    badge: "✦ Kostenlos für jedes Cosy Homestead",
    titleLine1: "Such dir ein Zuhause",
    titleLine2: "im Internet.",
    description:
      "Cosy Domain Provider gibt dir zugriff auf eine kostenlose Adresse auf play.cosy-hosting.net.",
    claimLabel: "Deine Adresse sichern",
    checkButton: "Prüfen →",
    benefit1: "✓ Erhalte eine zufällige Adresse umsonst",
  },
  features: {
    title: "Drei Haltestellen an der Post",
    subtitle:
      "Alles, was du brauchst, um Pakete an deinen Heimserver zu schicken.",
    stop1Title: "Adresse sichern",
    stop1Body: "Erstelle eine kostenlose Subdomain auf play.cosy-hosting.net",
    stop2Title: "Verifizieren & verbinden",
    stop2Body:
      "Einmaliger Token in deine Cosy-Instanz einfügen. Wir kümmern uns um das DNS.",
    stop3Title: "Den Draht nutzen",
    stop3Body: "Die Subdomain nutzen.",
  },
  pricing: {
    title: "Zwei Wege einzuziehen",
    subtitle:
      "Jeder Cosy-Nutzer bekommt einen kostenlosen Briefkasten. Upgrade, um den Namen zu wählen.",
    freeBadge: "Kostenlos",
    freeTitle: "Zufällige Subdomain",
    freePrice: "€0 / für immer",
    freeFeature1: "✓ Eine automatisch generierte Subdomain",
    freeLimitation: "✗ Subdomain nicht frei wählbar",
    freeButton: "Zufällige Adresse erhalten",
    plusBadge: "Cosy+",
    plusTitle: "Eigene Subdomain",
    plusPrice: "€1 / Monat",
    plusFeature1: "✓ Eigene Subdomain wählen",
    plusFeature2: "✓ Bis zu 5 Domains pro Konto",
    plusSupport: "❤️ Dein Abo unterstützt das Cosy-Kernteam",
    plusButton: "Zu Cosy+ wechseln",
  },
};

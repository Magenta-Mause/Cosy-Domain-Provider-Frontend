import type { DeepStringSchema } from "@/i18n/schema";

export const dashboardEn = {
  dashboard: {
    title: "Your domains",
    description: "Subdomains you own on the Cosy network.",
    empty: "You do not have any subdomains yet.",
    emptyUnverified:
      "Your account needs to be verified before you can register subdomains.",
    emptyMfaRequired:
      "Set up two-factor authentication before registering subdomains.",
    verifyAccount: "Verify Account",
    setupMfa: "Setup MFA →",
    register: "Register a domain",
    createNew: "Create new Domain",
    open: "Open",
    columnLabel: "Subdomain",
    columnTarget: "Target IP",
    columnStatus: "Status",
    columnActions: "",
    delete: "Delete",
    deleting: "Deleting...",
    loadError: "Could not load subdomains.",
    postOfficeLabel: "POST OFFICE",
    filterAll: "All",
    notConnected: "not connected",
    noFilterMatch: "No domains match this filter.",
    statsMailboxes: "Mailboxes",
    statsDomainsRegistered: "domains registered",
    statsAllActive: "all active",
    statsOnline: "online",
    statsAwaitingVerification: "awaiting verification",
    planCardVerified: "Account verified",
    planCardNotVerified: "Account not verified",
    planCardSubdomains: "Subdomains",
    planCardManage: "Manage plan →",
    planCardPriceFree: "€0 / month",
    planCardPricePlus: "€1 / month",
    slotsExhaustedFree:
      "You have used all your subdomain slots. Upgrade to Cosy+ to get access to 5 subdomains.",
    slotsExhaustedPlus:
      "You have used all your subdomain slots. If you need more subdomains, please contact the Cosy team.",
    creationDisabled: "Domain registration is currently disabled by the admin.",
  },
} as const;

export const dashboardDe: DeepStringSchema<typeof dashboardEn> = {
  dashboard: {
    title: "Deine Domains",
    description: "Subdomains, die du im Cosy-Netzwerk besitzt.",
    empty: "Du hast noch keine Subdomains.",
    emptyUnverified:
      "Dein Konto muss verifiziert werden, bevor du Subdomains registrieren kannst.",
    emptyMfaRequired:
      "Richte die Zwei-Faktor-Authentifizierung ein, bevor du Subdomains registrierst.",
    verifyAccount: "Konto verifizieren",
    setupMfa: "MFA einrichten →",
    register: "Domain registrieren",
    createNew: "Neue Domain erstellen",
    open: "Öffnen",
    columnLabel: "Subdomain",
    columnTarget: "Ziel-IP",
    columnStatus: "Status",
    columnActions: "",
    delete: "Löschen",
    deleting: "Wird gelöscht...",
    loadError: "Subdomains konnten nicht geladen werden.",
    postOfficeLabel: "POSTAMT",
    filterAll: "Alle",
    notConnected: "nicht verbunden",
    noFilterMatch: "Keine Domains entsprechen diesem Filter.",
    statsMailboxes: "Briefkästen",
    statsDomainsRegistered: "Domains registriert",
    statsAllActive: "alle aktiv",
    statsOnline: "online",
    statsAwaitingVerification: "warten auf Verifizierung",
    planCardVerified: "Konto verifiziert",
    planCardNotVerified: "Konto nicht verifiziert",
    planCardSubdomains: "Subdomains",
    planCardManage: "Plan verwalten →",
    planCardPriceFree: "€0 / Monat",
    planCardPricePlus: "€1 / Monat",
    slotsExhaustedFree:
      "Du hast alle deine Subdomain-Slots belegt. Upgrade auf Cosy+, um Zugang zu 5 Subdomains zu erhalten.",
    slotsExhaustedPlus:
      "Du hast alle deine Subdomain-Slots belegt. Falls du mehr Subdomains benötigst, kontaktiere bitte das Cosy-Team.",
    creationDisabled: "Die Domain-Registrierung wurde vom Admin deaktiviert.",
  },
};

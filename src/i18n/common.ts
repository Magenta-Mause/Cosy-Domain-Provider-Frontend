import type { DeepStringSchema } from "@/i18n/schema";

export const commonEn = {
  appName: "Cosy Frontend",
  appTagline: "Fetch your own Subdomains",
  nav: {
    dashboard: "Domains",
    newSubdomain: "New subdomain",
    login: "Log in",
    logout: "Log out",
    userMenu: "User menu",
    deleteUser: "Delete user",
    notImplemented: "Not implemented",
    billing: "Subscription",
    userSettings: "User Settings",
    userDeletionConfirm:
      "Are you sure you want to delete your account? This will also delete all your dns entries.",
    deleteUserTitle: "Delete account",
    deleteUserConfirm: "Yes, delete my account",
    deleteUserCancel: "Cancel",
  },
  language: {
    label: "Language",
    en: "English",
    de: "German",
  },
  status: {
    pending: "Pending",
    active: "Active",
    failed: "Failed",
    tlsActive: "TLS Active",
    awaitingVerify: "Awaiting verify",
  },
  footer: {
    text: "Made with ❤️ by Medalheads · cosy-hosting.net",
    madeBy: "Made with ❤️ by Medalheads",
    githubLabel: "Medalheads on GitHub",
    legalNav: "Legal",
    impressum: "Legal Notice",
    datenschutz: "Privacy Policy",
    agb: "Terms of Service",
  },
} as const;

export const commonDe: DeepStringSchema<typeof commonEn> = {
  appName: "Cosy Frontend",
  appTagline: "Verwalte deine eigenen Subdomains",
  nav: {
    dashboard: "Domains",
    newSubdomain: "Neue Subdomain",
    login: "Anmelden",
    logout: "Abmelden",
    userMenu: "Benutzermenü",
    deleteUser: "Benutzer löschen",
    notImplemented: "Nicht implementiert",
    billing: "Abonnement",
    userSettings: "Kontoeinstellungen",
    userDeletionConfirm:
      "Bist du dir sicher, dass du deinen Account löschen willst? Dadurch werden auch alle deine Subdomains gelöscht.",
    deleteUserTitle: "Konto löschen",
    deleteUserConfirm: "Ja, Konto löschen",
    deleteUserCancel: "Abbrechen",
  },
  language: {
    label: "Sprache",
    en: "Englisch",
    de: "Deutsch",
  },
  status: {
    pending: "Ausstehend",
    active: "Aktiv",
    failed: "Fehlgeschlagen",
    tlsActive: "TLS Aktiv",
    awaitingVerify: "Überprüfung ausstehend",
  },
  footer: {
    text: "Made with ❤️ by Medalheads · cosy-hosting.net",
    madeBy: "Made with ❤️ by Medalheads",
    githubLabel: "Medalheads auf GitHub",
    legalNav: "Rechtliches",
    impressum: "Impressum",
    datenschutz: "Datenschutz",
    agb: "AGB",
  },
};

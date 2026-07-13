import { authDe, authEn } from "@/components/auth/i18n";
import { commonDe, commonEn } from "@/i18n/common";
import { adminDe, adminEn } from "@/pages/admin/i18n";
import { billingDe, billingEn } from "@/pages/billing/i18n";
import { dashboardDe, dashboardEn } from "@/pages/dashboard/i18n";
import { domainDetailDe, domainDetailEn } from "@/pages/domain-detail/i18n";
import { homeDe, homeEn } from "@/pages/home/i18n";
import { legalDe, legalEn } from "@/pages/legal/i18n";
import { settingsDe, settingsEn } from "@/pages/settings/i18n";

export const defaultNS = "common";

export const resources = {
  en: {
    common: commonEn,
    auth: authEn,
    dashboard: dashboardEn,
    domainDetail: domainDetailEn,
    home: homeEn,
    billing: billingEn,
    legal: legalEn,
    settings: settingsEn,
    admin: adminEn,
  },
  de: {
    common: commonDe,
    auth: authDe,
    dashboard: dashboardDe,
    domainDetail: domainDetailDe,
    home: homeDe,
    billing: billingDe,
    legal: legalDe,
    settings: settingsDe,
    admin: adminDe,
  },
} as const;

export type AppLanguage = keyof typeof resources;

export type AppNamespace = keyof (typeof resources)["en"];

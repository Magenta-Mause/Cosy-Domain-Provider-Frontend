const enCommon = {
  appName: "Cosy Frontend",
  nav: {
    home: "Home",
    about: "About",
    dashboard: "Domains",
    login: "Log in",
    logout: "Log out",
  },
  language: {
    label: "Language",
    en: "EN",
    fi: "FI",
  },
  home: {
    title: "Cosy Domain Provider",
    description:
      "Tailwind + shadcn-style UI, Redux state, and TanStack Router are now wired together.",
    counterLabel: "Redux counter state",
    increment: "Increment",
    decrement: "Decrement",
    reset: "Reset",
  },
  about: {
    title: "About this setup",
    description:
      "The app now follows a scalable frontend composition with isolated UI, pages, routing, and state.",
    points: {
      ui: "• shadcn-style primitives live in components/ui.",
      routing: "• Routing is managed by TanStack Router.",
      state: "• Shared global state is managed by Redux Toolkit.",
      styling:
        "• Styling uses Tailwind utility-first classes and design tokens.",
    },
  },
  login: {
    title: "Welcome back",
    description: "Log in to manage your subdomains.",
    username: "Username",
    password: "Password",
    submit: "Log in",
    submitting: "Logging in...",
    error: "Could not log in. Check your credentials and try again.",
  },
  dashboard: {
    title: "Your domains",
    description: "Subdomains you own on the Cosy network.",
    empty: "You do not have any subdomains yet.",
    register: "Register a domain",
    columnLabel: "Subdomain",
    columnTarget: "Target IP",
    columnStatus: "Status",
    columnActions: "",
    delete: "Delete",
    deleting: "Deleting...",
    loadError: "Could not load subdomains.",
  },
  createSubdomain: {
    title: "Register a new subdomain",
    description:
      "Choose a label and point it at an IPv4 address. The label becomes part of your FQDN.",
    label: "Label",
    labelHint: "Lowercase letters, digits, and hyphens (1-63 chars).",
    targetIp: "Target IP",
    targetIpHint: "IPv4 address, e.g. 203.0.113.42",
    submit: "Register",
    submitting: "Registering...",
    cancel: "Cancel",
    error: "Could not register subdomain.",
  },
  status: {
    pending: "Pending",
    active: "Active",
    failed: "Failed",
  },
} as const;

type DeepStringSchema<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringSchema<T[K]>;
};

type CommonSchema = DeepStringSchema<typeof enCommon>;

const fiCommon: CommonSchema = {
  appName: "Cosy Frontend",
  nav: {
    home: "Koti",
    about: "Tietoa",
    dashboard: "Verkkotunnukset",
    login: "Kirjaudu",
    logout: "Kirjaudu ulos",
  },
  language: {
    label: "Kieli",
    en: "EN",
    fi: "FI",
  },
  home: {
    title: "Cosy Domain Provider",
    description:
      "Tailwind + shadcn-tyylinen UI, Redux-tila ja TanStack Router on nyt kytketty yhteen.",
    counterLabel: "Redux-laskurin tila",
    increment: "Kasvata",
    decrement: "Pienennä",
    reset: "Nollaa",
  },
  about: {
    title: "Tietoa tästä toteutuksesta",
    description:
      "Sovellus noudattaa nyt skaalautuvaa frontend-rakennetta, jossa UI, sivut, reititys ja tila on erotettu.",
    points: {
      ui: "• shadcn-tyyliset primitiivit ovat kansiossa components/ui.",
      routing: "• Reitityksestä vastaa TanStack Router.",
      state: "• Jaettu globaali tila hallitaan Redux Toolkitilla.",
      styling:
        "• Tyylitys käyttää Tailwindin utility-luokkia ja design tokeneita.",
    },
  },
  login: {
    title: "Tervetuloa takaisin",
    description: "Kirjaudu hallitaksesi aliverkkotunnuksiasi.",
    username: "Käyttäjänimi",
    password: "Salasana",
    submit: "Kirjaudu",
    submitting: "Kirjaudutaan...",
    error: "Kirjautuminen epäonnistui. Tarkista tunnukset ja yritä uudelleen.",
  },
  dashboard: {
    title: "Verkkotunnuksesi",
    description: "Aliverkkotunnukset, jotka omistat Cosy-verkossa.",
    empty: "Sinulla ei ole vielä aliverkkotunnuksia.",
    register: "Rekisteröi verkkotunnus",
    columnLabel: "Aliverkkotunnus",
    columnTarget: "Kohde-IP",
    columnStatus: "Tila",
    columnActions: "",
    delete: "Poista",
    deleting: "Poistetaan...",
    loadError: "Aliverkkotunnusten lataaminen epäonnistui.",
  },
  createSubdomain: {
    title: "Rekisteröi uusi aliverkkotunnus",
    description:
      "Valitse tunniste ja osoita se IPv4-osoitteeseen. Tunnisteesta tulee osa FQDN:ää.",
    label: "Tunniste",
    labelHint: "Pieniä kirjaimia, numeroita ja viivoja (1–63 merkkiä).",
    targetIp: "Kohde-IP",
    targetIpHint: "IPv4-osoite, esim. 203.0.113.42",
    submit: "Rekisteröi",
    submitting: "Rekisteröidään...",
    cancel: "Peruuta",
    error: "Aliverkkotunnuksen rekisteröinti epäonnistui.",
  },
  status: {
    pending: "Odottaa",
    active: "Aktiivinen",
    failed: "Epäonnistui",
  },
};

export const defaultNS = "common";

export const resources = {
  en: { common: enCommon },
  fi: { common: fiCommon },
} as const;

export type AppLanguage = keyof typeof resources;

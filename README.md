# Cosy Domain Provider Frontend

React + Vite frontend scaffolded with:
- Tailwind CSS
- shadcn-style component structure
- Redux Toolkit for global state
- TanStack Router for routing
- i18next + react-i18next for localization
- Biome for linting and formatting

## Prerequisites

- [Bun](https://bun.sh/) v1.0 or higher
- Backend running at `http://localhost:8080` (only needed for `bun gen:api`)

## Scripts

- `bun dev` - start development server
- `bun run build` - type-check and build production bundle (`bun build` conflicts with bun's own bundler)
- `bun lint` - run Biome checks
- `bun lint:fix` - apply safe Biome fixes
- `bun format` - format code with Biome
- `bun preview` - preview production build
- `bun gen:api` - fetch backend OpenAPI doc and generate Orval client

## Structure

- `src/components/ui` - reusable shadcn-style primitives
- `src/components/layout` - app shell/layout pieces
- `src/pages` - route-level page components
- `src/store` - Redux store, slice, and typed hooks
- `src/router.tsx` - TanStack Router route tree and router instance
- `src/i18n` - typed i18n resources, init config, and i18next type augmentation
- `src/api` - Orval mutator and generated API client/models

## i18n type safety

Translation keys are compile-time checked:
- `src/i18n/resources.ts` defines the canonical English schema.
- Other languages must satisfy that exact schema (`type CommonSchema = typeof enCommon`).
- `src/i18n/i18next.d.ts` augments `i18next` `CustomTypeOptions` so `t("...")` only accepts valid keys.

## OpenAPI + Orval flow

1. Start the backend so OpenAPI is exposed at `http://localhost:8080/api/v3/api-docs` (see [Backend README](https://github.com/Magenta-Mause/Cosy-Domain-Provider-Backend)).
2. In this frontend, run `bun gen:api`.
3. Orval generates:
   - client: `src/api/generated/domain-provider-api.ts`
   - models: `src/api/generated/model/*`

---

## Related repositories

| Repository | Description |
|---|---|
| [Cosy-Domain-Provider-Backend](https://github.com/Magenta-Mause/Cosy-Domain-Provider-Backend) | Spring Boot backend — start this before running the frontend |
| [Cosy-Domain-Provider-Systemtest](https://github.com/Magenta-Mause/Cosy-Domain-Provider-Systemtest) | Playwright end-to-end tests — requires both backend and frontend to be running |

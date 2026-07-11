# State Management

## Data Flow

```
Component
  ↓
useDataLoading / useDataInteractions  (src/hooks/)
  ↓
axios via API functions  (src/api/generated/ or hand-written src/api/*.ts)
  ↓
Redux dispatch (manually)
  ↓
Redux store → useAppSelector
```

## Rules

- **Reads** go through `useDataLoading`, **mutations** through `useDataInteractions`. This includes transient reads that never touch Redux (e.g. `checkLabelAvailability`, `loadOAuthIdentities`) — the hooks are the single sanctioned HTTP layer for components.
- Never call API functions, `customInstance`, or axios directly from a component or page-level logic hook.
- React Query hooks are intentionally unused — do not use them.
- Use `useAppDispatch` / `useAppSelector` from `src/store/hooks.ts`, not the raw react-redux versions.
- Auth state lives in `auth-slice`, domain data in `subdomains-slice`.

## API modules

- `src/api/generated/` — Orval-generated client. Never edit by hand.
- Endpoints not covered by the OpenAPI spec live in hand-written modules in `src/api/`, one per domain: `billing-api.ts`, `subdomain-api.ts`, `user-api.ts`, `admin-api.ts`, `staging-api.ts`. All of them go through `customInstance` (`src/api/axios-instance.ts`) — never raw `fetch`, never a hand-rolled `axios.create`.

## Admin exception

The `/admin` section authenticates with an `X-Admin-Key` header instead of the user JWT and intentionally bypasses Redux:

- `adminApi` (`src/api/admin-api.ts`) wraps `customInstance`, injects the key header, and normalises errors (`401` → `Error("UNAUTHORIZED")`, otherwise `Error("HTTP <status>")`).
- The key is kept in `sessionStorage`; access it via `getStoredAdminKey()` from `src/pages/admin/lib.ts`.
- Admin detail routes load data in TanStack Router `loader`s and pass it down as props — admin data is request-scoped and never cached in the store.

## Staging gate exception

The `StagingAuthProvider` (`src/providers/`) guards the app behind a Basic-auth gate on staging deployments. Like the admin section, it bypasses the `useDataLoading`/`useDataInteractions` + Redux layer:

- Its endpoints live in `staging-api.ts` and go through `customInstance` — no hand-rolled axios instance.
- `useStagingAuthProviderLogic` calls those functions directly. The gate state is a request-scoped boolean that runs before the app/store is populated, so it never belongs in Redux.

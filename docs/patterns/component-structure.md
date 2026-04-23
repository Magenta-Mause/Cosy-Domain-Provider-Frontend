# Component Structure

## Folder layout

Every component that has logic to extract, exceeds ~100 lines, or contains sub-components lives in its own folder:

```
src/pages/dashboard/
  index.tsx                   ← thin page: consumes hook, renders components
  useDashboardLogic.ts        ← all state, derived values, handlers
  components/
    dashboard-banner.tsx       ← layout sub-component
    subdomain-list/
      index.ts                ← barrel export
      subdomain-list.tsx
      components/
        subdomain-list-item.tsx

src/components/layout/user-menu/
  index.ts                    ← re-exports UserMenu (keeps import paths stable)
  user-menu.tsx               ← component files: kebab-case
  user-menu-dropdown.tsx
  useUserMenuLogic.ts         ← hook files: camelCase
```

## File naming

- **Component files** (`.tsx`) use **kebab-case**: `billing-header.tsx`, `domain-tab-bar.tsx`.
- **Hook files** (`.ts`) use **camelCase**, matching the exported function name: `useDashboardLogic.ts`, `useDropdown.ts`.
- **`index.ts` barrel files** are always lowercase.

## Rules

- **Logic hooks are co-located**, not in `src/hooks/`. A hook that only serves one component lives next to it as `useMyComponentLogic.ts`.
- **`src/hooks/` is for shared hooks** used by more than one component (e.g. `useDropdown`, `useDataLoading`, `useAuthInformation`).
- **Barrel `index.ts`** — every component folder exports through an `index.ts` so callers never need to know the internal file name. Import paths stay stable even if internals are reorganised.
- **Target ~100 lines per file.** If a component or hook exceeds this, split out sub-components or extract a second hook.
- **`useTranslation()` belongs in the component**, not in the logic hook — translation strings are presentation. Exception: hooks that set translated error messages (e.g. `t("form.error")`) may call `useTranslation` for `t()` since the alternative (returning error keys) adds indirection.

## Logic hooks

A logic hook extracts everything that isn't JSX from a component:

```typescript
// useDashboardLogic.ts
export function useDashboardLogic() {
  const subdomains = useAppSelector(...);
  const { isVerified } = useAuthInformation();

  const handleCreateNew = useCallback(() => { ... }, [...]);

  return { subdomains, isVerified, handleCreateNew };
}

// DashboardPage
export function DashboardPage() {
  const { t } = useTranslation();
  const { subdomains, isVerified, handleCreateNew } = useDashboardLogic();
  return (...);
}
```

What goes in the hook: state, derived values, `useMemo`/`useCallback`, API calls, navigation, Redux selectors, `useEffect`.  
What stays in the component: JSX, `useTranslation` for `t()`, `data-testid` attributes.

## Shared utility hooks

Reusable behaviour that doesn't belong to a single component lives in `src/hooks/<name>/<name>.ts`:

```
src/hooks/
  useDropdown/useDropdown.ts        ← open/close + click-outside + Escape
  useDataLoading/useDataLoading.ts
  useDataInteractions/useDataInteractions.ts
  useAuthInformation/useAuthInformation.ts
```

## Validators

Field validation functions and their regex patterns live in `src/lib/validators.ts`:

```typescript
isValidSubdomainLabel(value)   // RFC subdomain rules
isValidIpv4(value)
isValidEmail(value)
```

Import from `@/lib/validators` — do not inline regex patterns in hooks or components.

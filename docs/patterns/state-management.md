# State Management

## Data Flow

```
Component
  ↓
useDataLoading / useDataInteractions  (src/hooks/)
  ↓
axios via generated API functions  (src/api/generated/)
  ↓
Redux dispatch (manually)
  ↓
Redux store → useAppSelector
```

## Rules

- **Reads** go through `useDataLoading`, **mutations** through `useDataInteractions`.
- Never call generated API functions or axios directly from a component.
- React Query hooks are intentionally unused — do not use them.
- Use `useAppDispatch` / `useAppSelector` from `src/store/hooks.ts`, not the raw react-redux versions.
- Auth state lives in `auth-slice`, domain data in `subdomains-slice`.

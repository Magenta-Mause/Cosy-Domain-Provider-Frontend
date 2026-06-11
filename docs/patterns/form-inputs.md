# Form Inputs

## `FormField` component

All form fields use `<FormField>` (`src/components/ui/form-field.tsx`).

```typescript
interface FormFieldProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string | null       // renders ErrorMessage below the input; also sets .invalid class
  invalid?: boolean           // sets .invalid class without showing an error message
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  suffix?: string             // static text overlaid on the right edge (e.g. ".play.cosy-hosting.net")
  responsiveSuffix?: boolean  // hide the suffix below the sm breakpoint (and only pad the input from sm up)
  endDecorator?: React.ReactNode  // arbitrary right-side slot (e.g. a password eye-toggle button)
  hint?: string               // small helper text below the input (hidden when error is set)
  testId?: string
  autoComplete?: string
  minLength?: number
  maxLength?: number
  inputMode?: ...
}
```

## Rules

- **No raw `<input>` with manual label/error wiring** — always use `FormField`.
- **`suffix`** is for static text decorators that overlay the input (the text is absolutely positioned; `paddingRight` is computed automatically from string length).
- **`endDecorator`** is the slot for interactive elements like a password visibility toggle. The input gets `pr-12` automatically when `endDecorator` is set.
- **Both can be used together** if needed, but this is uncommon.
- **Error messages** render via `ErrorMessage` (`src/components/pixel/error-message.tsx`). Pass the error string to `FormField`'s `error` prop — do not render `<ErrorMessage>` separately below the field.
- **`invalid` without `error`** — use when you want the `.invalid` border styling before showing an error string (e.g. after the first submit attempt, while the error string is still `null`).
- Internally `FormField` uses the existing `.pinput` / `.plabel` CSS classes.

## Password fields

Password fields use `<PasswordField>` (`src/components/ui/password-field.tsx`) — a thin wrapper around `FormField` that renders the eye-toggle `endDecorator` and owns its own show/hide state:

```tsx
<PasswordField
  id="password"
  label={t("login.password")}
  autoComplete="current-password"
  required
  value={password}
  onChange={setPassword}
  testId="login-password-input"
  toggleTestId="login-toggle-password-btn"
/>
```

Each `PasswordField` instance manages its **own** visibility state — never share one toggle across multiple password inputs, and do not keep `showPw` state in logic hooks. Do not rebuild the eye toggle by hand with `FormField` + `endDecorator`.

## Validation

- **Validation functions live in `src/lib/validators.ts`** — import from there. Do not define validators inline or in component `lib.ts` files.
- Available validators: `isValidSubdomainLabel`, `isValidIpv4`, `isValidEmail`, `isValidUsername`, `isValidPassword`, `isPasswordWeak`.
- Validation state and error strings belong in the logic hook (`useMyFormLogic.ts`), not in the component.

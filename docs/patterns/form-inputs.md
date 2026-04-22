# Form Inputs

## FormField (not yet implemented)

Every form field gets: `label`, `placeholder`, a `validate` function, a `showError` flag, and optional an `endDecorator` and/or `startDecorator` slot.

- Validation logic lives in the `validate` prop — not scattered in component state. Return an error string or `null`.
- `showError` is controlled by the parent — flip to `true` on the first submit attempt, not on every keystroke.
- `endDecorator` is the slot for things like a password visibility toggle. Replaces the current `PasswordInput` pattern.
- No raw `<input>` with manual label/error wiring.

Refactor existing forms to `FormField` when touching them, not proactively.

# Form Inputs

## FormField (planned — not yet implemented)

The target pattern for form fields is a `FormField` component that wraps: `label`, `placeholder`, a `validate` function, a `showError` flag, and optional `endDecorator`/`startDecorator` slots.

- Validation logic lives in the `validate` prop — not scattered in component state. Return an error string or `null`.
- `showError` is controlled by the parent — flip to `true` on the first submit attempt, not on every keystroke.
- `endDecorator` is the slot for things like a password visibility toggle. This would replace the current `PasswordInput` pattern.

**Current practice:** Existing forms use raw `<input>` elements with manual label/error wiring. This is the interim state while `FormField` does not exist.

When `FormField` is implemented: refactor existing forms to it when touching them, not proactively.

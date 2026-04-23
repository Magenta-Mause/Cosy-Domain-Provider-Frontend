# Styling

## Tailwind first

Always prefer Tailwind utility classes over inline styles. Only use `style={{...}}` for values that have no Tailwind equivalent — see the list below.

```tsx
// Good
<div className="min-h-screen bg-background flex flex-col gap-4 px-7 py-5">

// Bad
<div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", flexDirection: "column", gap: 16, padding: "20px 28px" }}>
```

## Design tokens

The design system's CSS variables are registered as Tailwind tokens in `tailwind.config.ts`. Use the named utilities — never the raw `[var(--x)]` arbitrary syntax.

### Colors

| Token | Tailwind class prefix | CSS variable |
|---|---|---|
| Background | `bg-background` / `text-background` | `--background` |
| Secondary background | `bg-secondary-background` | `--secondary-background` |
| Foreground | `text-foreground` / `border-foreground` / `bg-foreground` | `--foreground` |
| Accent | `bg-accent` / `border-accent` | `--accent` |
| Accent 2 | `border-accent-2` / `bg-accent-2` | `--accent-2` |
| Accent 4 | `text-accent-4` | `--accent-4` |
| Destructive | `text-destructive` / `border-destructive` / `bg-destructive` | `--destructive` |
| Success | `text-success` | `--success` |
| Button primary | `text-btn-primary` / `bg-btn-primary` | `--btn-primary` |
| Button secondary | `text-btn-secondary` / `bg-btn-secondary` | `--btn-secondary` |
| Input background | `bg-input-bg` | `--input-bg` |

```tsx
// Good
<div className="text-destructive border-foreground bg-secondary-background">

// Bad
<div className="text-[var(--destructive)] border-[var(--foreground)] bg-[var(--secondary-background)]">
```

### Border radius

| Token | Tailwind class | CSS variable |
|---|---|---|
| Default radius | `rounded-radius` | `--radius` (8px) |
| Small radius | `rounded-radius-sm` | `--radius-sm` (4px) |
| Large radius | `rounded-radius-lg` | `--radius-lg` (12px) |

These also work with directional modifiers: `rounded-tl-radius-sm`, `rounded-tr-radius`, etc.

### Box shadow

| Token | Tailwind class | Value |
|---|---|---|
| Pixel shadow | `shadow-pixel` | `4px 4px 0 0 var(--shadow)` |

## When inline styles are allowed

Use `style={{...}}` only for values that genuinely cannot be expressed as a Tailwind class:

- **oklch / complex color literals** — e.g. `color: "oklch(0.95 0.08 70)"`, used for themed header text and the sky scene. These are one-off values not registered as tokens.
- **`textShadow`** — no Tailwind utility exists for `text-shadow`.
- **`boxShadow` with inline expressions** — when the shadow uses a literal oklch value or a non-token variable.
- **Gradients** — `background: "linear-gradient(...)"` or `background: "repeating-linear-gradient(...)"`.
- **Dynamic numeric values** — values computed at runtime (e.g. `style={{ maxWidth }}` where `maxWidth` is a prop, or `style={{ transform: \`scale(\${scale})\` }}`).
- **`gridTemplateColumns` with fractional tracks** — e.g. `"80px 1.5fr 2fr 80px"` has no Tailwind equivalent.
- **`fontFamily` overrides** — when applying `'Press Start 2P'` to a single inline element without a utility class available.

```tsx
// Acceptable inline styles
<h1 style={{ color: "oklch(0.95 0.08 70)", textShadow: "3px 3px 0 oklch(0.25 0.08 30)" }}>
<div style={{ gridTemplateColumns: "80px 1.5fr 2fr 80px" }}>
<div className="mx-auto" style={{ maxWidth }}>   {/* dynamic prop */}
<span style={{ transform: `scale(${scale})`, transformOrigin: "bottom left" }}>
```

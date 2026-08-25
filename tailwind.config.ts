import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // NOTE: every colour below resolves to a bare `var(--token)`, so Tailwind's
      // opacity modifiers (`bg-foreground/50`) produce invalid CSS and are dropped
      // silently — the element then renders with no background at all. Pick a token
      // that already has the shade you want instead.
      colors: {
        background: "var(--background)",
        "secondary-background": "var(--secondary-background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        paper: "var(--white)",
        accent: "var(--accent)",
        "accent-2": "var(--accent-2)",
        "accent-3": "var(--accent-3)",
        "accent-4": "var(--accent-4)",
        destructive: "var(--destructive)",
        success: "var(--success)",
        "btn-primary": "var(--btn-primary)",
        "btn-secondary": "var(--btn-secondary)",
        "input-bg": "var(--input-bg)",
      },
      borderRadius: {
        "radius-sm": "var(--radius-sm)",
        radius: "var(--radius)",
        "radius-lg": "var(--radius-lg)",
      },
      boxShadow: {
        pixel: "4px 4px 0 0 var(--shadow)",
        "pixel-fg": "4px 4px 0 0 var(--foreground)",
      },
    },
  },
  plugins: [],
};

export default config;

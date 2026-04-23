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
      colors: {
        background: "var(--background)",
        "secondary-background": "var(--secondary-background)",
        foreground: "var(--foreground)",
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

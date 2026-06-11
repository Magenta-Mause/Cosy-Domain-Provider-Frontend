import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...rest }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a {...rest}>{children}</a>
  ),
}));

vi.mock("@/components/layout/language-menu", () => ({
  LanguageMenu: () => <div data-testid="language-menu" />,
}));

import { AgbPage } from "./agb";
import { DatenschutzPage } from "./datenschutz";
import { ImpressumPage } from "./impressum";

describe("legal pages", () => {
  it("renders the Impressum inside the legal layout", () => {
    render(<ImpressumPage />);
    expect(screen.getByTestId("language-menu")).toBeInTheDocument();
  });

  it("renders the Datenschutz page", () => {
    render(<DatenschutzPage />);
    expect(screen.getByTestId("language-menu")).toBeInTheDocument();
  });

  it("renders the AGB page", () => {
    render(<AgbPage />);
    expect(screen.getByTestId("language-menu")).toBeInTheDocument();
  });
});

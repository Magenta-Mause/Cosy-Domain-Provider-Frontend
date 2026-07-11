import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

const mockOnChangeLanguage = vi.fn();
vi.mock("@/hooks/useLanguageChange/useLanguageChange", () => ({
  useLanguageChange: () => ({ handleLanguageChange: mockOnChangeLanguage }),
}));

const menuState = { menuOpen: false };
const mockSetMenuOpen = vi.fn();
const mockHandleLanguageChange = vi.fn();
vi.mock("./useLanguageMenuLogic", () => ({
  useLanguageMenuLogic: () => ({
    menuOpen: menuState.menuOpen,
    setMenuOpen: mockSetMenuOpen,
    menuRef: { current: null },
    languageCode: "EN",
    handleLanguageChange: mockHandleLanguageChange,
  }),
}));

import { LanguageMenu } from "./language-menu";

beforeEach(() => {
  vi.clearAllMocks();
  menuState.menuOpen = false;
});

describe("LanguageMenu", () => {
  it("renders the toggle button with the current language code and keeps the menu closed", () => {
    render(<LanguageMenu />);
    expect(screen.getByTestId("language-menu-toggle-btn")).toHaveTextContent(
      "EN",
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("toggles the menu open state on click", async () => {
    render(<LanguageMenu />);
    await userEvent.click(screen.getByTestId("language-menu-toggle-btn"));
    expect(mockSetMenuOpen).toHaveBeenCalled();
  });

  it("renders both language options when open and switches language", async () => {
    menuState.menuOpen = true;
    render(<LanguageMenu />);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("language-menu-en-btn"));
    expect(mockHandleLanguageChange).toHaveBeenCalledWith("en");
    await userEvent.click(screen.getByTestId("language-menu-de-btn"));
    expect(mockHandleLanguageChange).toHaveBeenCalledWith("de");
  });
});

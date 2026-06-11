import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...rest }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a {...rest}>{children}</a>
  ),
}));

vi.mock("@/components/auth/auth-page-layout", () => ({
  AuthPageLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const defaultLogic = {
  email: "",
  setEmail: vi.fn(),
  isSubmitting: false,
  success: false,
  error: null as string | null,
  handleSubmit: vi.fn((e: React.SyntheticEvent) => e.preventDefault()),
};

let mockLogic = { ...defaultLogic };

vi.mock("./useForgotPasswordLogic", () => ({
  useForgotPasswordLogic: () => mockLogic,
}));

import { ForgotPasswordPage } from "./index";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogic = { ...defaultLogic };
});

describe("ForgotPasswordPage", () => {
  it("renders the email form", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getAllByText("forgotPassword.title").length).toBeGreaterThan(
      0,
    );
  });

  it("shows the success view after submission", () => {
    mockLogic = { ...defaultLogic, success: true };
    render(<ForgotPasswordPage />);
    expect(screen.getByText("forgotPassword.success")).toBeInTheDocument();
  });

  it("shows the error message on failure", () => {
    mockLogic = { ...defaultLogic, error: "failed" };
    render(<ForgotPasswordPage />);
    expect(screen.getByText(/failed/)).toBeInTheDocument();
  });
});

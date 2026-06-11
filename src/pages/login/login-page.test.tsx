import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/auth/auth-page-layout", () => ({
  AuthPageLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-layout">{children}</div>
  ),
}));

vi.mock("./components/login-form", () => ({
  LoginForm: () => <div data-testid="login-form" />,
}));

import { LoginPage } from "./index";

describe("LoginPage", () => {
  it("renders the login form inside the auth layout", () => {
    render(<LoginPage />);
    expect(screen.getByTestId("auth-layout")).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});

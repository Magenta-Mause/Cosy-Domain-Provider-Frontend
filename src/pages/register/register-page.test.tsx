import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/auth/auth-page-layout", () => ({
  AuthPageLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-layout">{children}</div>
  ),
}));

vi.mock("./components/register-form", () => ({
  RegisterForm: () => <div data-testid="register-form" />,
}));

import { RegisterPage } from "./index";

describe("RegisterPage", () => {
  it("renders the register form inside the auth layout", () => {
    render(<RegisterPage />);
    expect(screen.getByTestId("auth-layout")).toBeInTheDocument();
    expect(screen.getByTestId("register-form")).toBeInTheDocument();
  });
});

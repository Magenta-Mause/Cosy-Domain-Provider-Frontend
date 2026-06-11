import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { makeWrapper } from "@/test/store-utils";

const mockBootstrapAuth = vi.fn();

vi.mock("@/hooks/useDataLoading/useDataLoading", () => ({
  default: () => ({ bootstrapAuth: mockBootstrapAuth }),
}));

import { AuthProvider } from "./auth-provider";

beforeEach(() => {
  vi.clearAllMocks();
  mockBootstrapAuth.mockResolvedValue(true);
});

describe("AuthProvider", () => {
  it("shows a loading screen until bootstrapped and kicks off bootstrap", () => {
    render(
      <AuthProvider>
        <div data-testid="content" />
      </AuthProvider>,
      { wrapper: makeWrapper() },
    );

    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    expect(mockBootstrapAuth).toHaveBeenCalled();
  });

  it("renders children once the store is bootstrapped", () => {
    render(
      <AuthProvider>
        <div data-testid="content" />
      </AuthProvider>,
      {
        wrapper: makeWrapper({
          auth: {
            state: "idle",
            bootstrapped: true,
            identityToken: null,
            user: null,
          },
        } as never),
      },
    );

    expect(screen.getByTestId("content")).toBeInTheDocument();
  });
});

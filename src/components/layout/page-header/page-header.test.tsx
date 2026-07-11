import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const appHeaderProps = vi.fn();
vi.mock("@/components/layout/app-header", () => ({
  AppHeader: (props: { rightSlot?: unknown; logoLinkTo?: string }) => {
    appHeaderProps(props);
    return <div data-testid="app-header" />;
  },
}));

import { PageHeader } from "./page-header";

describe("PageHeader", () => {
  it("renders the header and its children", () => {
    render(
      <PageHeader>
        <span data-testid="child">content</span>
      </PageHeader>,
    );
    expect(screen.getByTestId("app-header")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("applies the default maxWidth to the content container", () => {
    render(
      <PageHeader>
        <span data-testid="child">content</span>
      </PageHeader>,
    );
    const container = screen.getByTestId("child").parentElement;
    expect(container).toHaveStyle({ maxWidth: "1200px" });
  });

  it("applies a custom maxWidth", () => {
    render(
      <PageHeader maxWidth={640}>
        <span data-testid="child">content</span>
      </PageHeader>,
    );
    const container = screen.getByTestId("child").parentElement;
    expect(container).toHaveStyle({ maxWidth: "640px" });
  });

  it("forwards rightSlot and logoLinkTo to the AppHeader", () => {
    render(
      <PageHeader
        headerRightSlot={<span>slot</span>}
        headerLogoLinkTo="/admin/subdomains"
      >
        child
      </PageHeader>,
    );
    expect(appHeaderProps).toHaveBeenLastCalledWith(
      expect.objectContaining({ logoLinkTo: "/admin/subdomains" }),
    );
    const props = appHeaderProps.mock.lastCall?.[0];
    expect(props.rightSlot).toBeTruthy();
  });
});

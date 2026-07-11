import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/components/pixel/panel", () => ({
  FlatPanel: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...rest}>{children}</div>
  ),
}));

import { FeaturesSection } from "./features-section";

describe("FeaturesSection", () => {
  it("renders the section heading and subtitle keys", () => {
    render(<FeaturesSection />);
    expect(screen.getByText("features.title")).toBeInTheDocument();
    expect(screen.getByText("features.subtitle")).toBeInTheDocument();
  });

  it("renders all three stops with their labels", () => {
    render(<FeaturesSection />);
    expect(screen.getByText("STOP 01")).toBeInTheDocument();
    expect(screen.getByText("STOP 02")).toBeInTheDocument();
    expect(screen.getByText("STOP 03")).toBeInTheDocument();
  });

  it("renders each stop's title and body translation keys", () => {
    render(<FeaturesSection />);
    for (const n of [1, 2, 3]) {
      expect(screen.getByText(`features.stop${n}Title`)).toBeInTheDocument();
      expect(screen.getByText(`features.stop${n}Body`)).toBeInTheDocument();
    }
  });

  it("exposes the features section anchor id", () => {
    const { container } = render(<FeaturesSection />);
    expect(container.querySelector("section#features")).not.toBeNull();
  });
});

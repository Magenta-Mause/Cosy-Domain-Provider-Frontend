import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockLogic = {
  subdomain: "",
  handleSubdomainChange: vi.fn(),
  handleCheckAvailability: vi.fn(),
};

vi.mock("./useHeroSectionLogic", () => ({
  useHeroSectionLogic: () => mockLogic,
}));

import { HeroSection } from "./hero-section";

beforeEach(() => vi.clearAllMocks());

describe("HeroSection", () => {
  it("renders the claim form with the domain suffix", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("home-subdomain-input")).toBeInTheDocument();
    expect(screen.getByText(".play.cosy-hosting.net")).toBeInTheDocument();
  });

  it("propagates input changes to the logic hook", async () => {
    render(<HeroSection />);
    await userEvent.type(screen.getByTestId("home-subdomain-input"), "x");
    expect(mockLogic.handleSubdomainChange).toHaveBeenCalledWith("x");
  });

  it("checks availability on button click", async () => {
    render(<HeroSection />);
    await userEvent.click(screen.getByTestId("home-check-btn"));
    expect(mockLogic.handleCheckAvailability).toHaveBeenCalled();
  });
});

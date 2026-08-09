import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { AdminWatchtowerScan } from "@/api/admin-api";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { WatchtowerDetail } from "./watchtower-detail";

function scan(overrides: Partial<AdminWatchtowerScan>): AdminWatchtowerScan {
  return {
    uuid: "s2",
    subdomainUuid: "sd2",
    label: "swift-gecko",
    fqdn: "swift-gecko.play.cosy-hosting.net",
    ownerUuid: "u1",
    ownerUsername: "alice",
    scannedAt: "2026-08-09T03:12:00Z",
    reachable: true,
    httpStatus: 200,
    category: "MALICIOUS",
    riskLevel: "HIGH",
    summary: "Crypto scam pattern",
    visitedPaths: ["/", "/wallet"],
    screenshotUrl: null,
    modelId: "claude-haiku-4-5-20251001",
    reviewStatus: "PENDING",
    reviewNote: null,
    reviewedAt: null,
    ...overrides,
  };
}

describe("WatchtowerDetail", () => {
  it("shows the verdict, owner and crawled paths", () => {
    render(
      <WatchtowerDetail
        scan={scan({})}
        onClose={vi.fn()}
        onSubmitReview={vi.fn()}
      />,
    );

    expect(screen.getByText("Crypto scam pattern")).toBeVisible();
    expect(screen.getByText("alice")).toBeVisible();
    expect(screen.getByText("/ · /wallet")).toBeVisible();
    expect(screen.getByText("claude-haiku-4-5-20251001")).toBeVisible();
  });

  it("falls back to a placeholder when there is no screenshot", () => {
    render(
      <WatchtowerDetail
        scan={scan({})}
        onClose={vi.fn()}
        onSubmitReview={vi.fn()}
      />,
    );

    expect(screen.getByText("watchtower.noScreenshot")).toBeVisible();
  });

  it("renders the screenshot when one is available", () => {
    render(
      <WatchtowerDetail
        scan={scan({ screenshotUrl: "https://minio/presigned.png" })}
        onClose={vi.fn()}
        onSubmitReview={vi.fn()}
      />,
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://minio/presigned.png",
    );
  });

  it("prefills the note with the existing review note", () => {
    render(
      <WatchtowerDetail
        scan={scan({ reviewNote: "checked, it's a parody" })}
        onClose={vi.fn()}
        onSubmitReview={vi.fn()}
      />,
    );

    expect(screen.getByTestId("watchtower-review-note")).toHaveValue(
      "checked, it's a parody",
    );
  });

  it("submits a decision together with the typed note", async () => {
    const onSubmitReview = vi.fn().mockResolvedValue(scan({}));
    render(
      <WatchtowerDetail
        scan={scan({})}
        onClose={vi.fn()}
        onSubmitReview={onSubmitReview}
      />,
    );

    await userEvent.type(
      screen.getByTestId("watchtower-review-note"),
      "looks legit",
    );
    await userEvent.click(screen.getByText("watchtower.actionDismiss"));

    expect(onSubmitReview).toHaveBeenCalledWith(
      "s2",
      "DISMISSED",
      "looks legit",
    );
  });

  it("submits the suspend decision", async () => {
    const onSubmitReview = vi.fn().mockResolvedValue(scan({}));
    render(
      <WatchtowerDetail
        scan={scan({})}
        onClose={vi.fn()}
        onSubmitReview={onSubmitReview}
      />,
    );

    await userEvent.click(screen.getByText("watchtower.actionActioned"));

    expect(onSubmitReview).toHaveBeenCalledWith("s2", "ACTIONED", "");
  });

  it("shows an error when saving the review fails", async () => {
    const onSubmitReview = vi.fn().mockRejectedValue(new Error("boom"));
    render(
      <WatchtowerDetail
        scan={scan({})}
        onClose={vi.fn()}
        onSubmitReview={onSubmitReview}
      />,
    );

    await userEvent.click(screen.getByText("watchtower.actionAcknowledge"));

    expect(await screen.findByText("watchtower.reviewError")).toBeVisible();
  });

  it("closes on the close button", async () => {
    const onClose = vi.fn();
    render(
      <WatchtowerDetail
        scan={scan({})}
        onClose={onClose}
        onSubmitReview={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByText("watchtower.close"));

    expect(onClose).toHaveBeenCalled();
  });

  it("closes on Escape", async () => {
    const onClose = vi.fn();
    render(
      <WatchtowerDetail
        scan={scan({})}
        onClose={onClose}
        onSubmitReview={vi.fn()}
      />,
    );

    await userEvent.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalled();
  });
});

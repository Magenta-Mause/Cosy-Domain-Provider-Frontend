import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts ? `${key}:${JSON.stringify(opts)}` : key,
  }),
}));

import { SendEmailView } from "./send-email-view";

describe("SendEmailView", () => {
  it("renders the title and interpolates the email into the description", () => {
    render(
      <SendEmailView
        userEmail="user@example.com"
        isSending={false}
        sendError={null}
        onSend={vi.fn()}
      />,
    );
    expect(screen.getByText("verify.sendTitle")).toBeInTheDocument();
    expect(
      screen.getByText(/verify.sendDescription.*user@example.com/),
    ).toBeInTheDocument();
  });

  it("calls onSend when the button is clicked", () => {
    const onSend = vi.fn();
    render(
      <SendEmailView
        userEmail="user@example.com"
        isSending={false}
        sendError={null}
        onSend={onSend}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it("disables the button and shows the sending label while sending", () => {
    render(
      <SendEmailView
        userEmail="user@example.com"
        isSending={true}
        sendError={null}
        onSend={vi.fn()}
      />,
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent("verify.sendingBtn");
  });

  it("renders the send error when present", () => {
    render(
      <SendEmailView
        userEmail={null}
        isSending={false}
        sendError="boom"
        onSend={vi.fn()}
      />,
    );
    expect(screen.getByText(/boom/)).toBeInTheDocument();
  });
});

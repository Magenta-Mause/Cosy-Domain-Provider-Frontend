import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import MfaChallengePage from "@/pages/mfa-challenge";

export const Route = createFileRoute("/mfa-challenge")({
  validateSearch: z.object({
    token: z.string(),
  }),
  component: MfaChallengePage,
});

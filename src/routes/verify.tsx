import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import VerifyPage from "@/pages/verify";
import { store } from "@/store/store.ts";

export const Route = createFileRoute("/verify")({
  validateSearch: z.object({
    token: z.string().optional(),
  }),
  beforeLoad: () => {
    const { user } = store.getState().auth;
    if (user?.isVerified && user?.isMfaEnabled)
      throw redirect({ to: "/dashboard" });
    if (user?.isVerified && !user?.isMfaEnabled)
      throw redirect({ to: "/mfa-setup" });
  },
  component: VerifyPage,
});

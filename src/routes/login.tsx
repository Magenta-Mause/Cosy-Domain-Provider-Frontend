import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { LoginPage } from "@/pages/login";
import { store } from "@/store/store";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    oauthError: z.union([z.boolean(), z.literal("emailTaken")]).optional(),
  }),
  beforeLoad: () => {
    const { identityToken } = store.getState().auth;
    if (identityToken) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});

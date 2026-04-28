import { createFileRoute, redirect } from "@tanstack/react-router";
import MfaSetupPage from "@/pages/mfa-setup";
import { store } from "@/store/store.ts";

export const Route = createFileRoute("/mfa-setup")({
  beforeLoad: () => {
    const { identityToken, user } = store.getState().auth;
    if (!identityToken) throw redirect({ to: "/login" });
    if (!user?.isVerified) throw redirect({ to: "/verify" });
    if (user?.isMfaEnabled) throw redirect({ to: "/dashboard" });
  },
  component: MfaSetupPage,
});

import { redirect } from "@tanstack/react-router";
import { store } from "@/store/store";

export function requireFullAuth() {
  const { identityToken, user } = store.getState().auth;
  if (!identityToken) throw redirect({ to: "/login" });
  if (!user?.isVerified) throw redirect({ to: "/verify" });
  if (!user?.isMfaEnabled) throw redirect({ to: "/mfa-setup" });
}

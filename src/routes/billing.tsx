import { createFileRoute, redirect } from "@tanstack/react-router";
import { BillingPage } from "@/pages/billing";
import { store } from "@/store/store";

export const Route = createFileRoute("/billing")({
  beforeLoad: () => {
    const { identityToken } = store.getState().auth;
    if (!identityToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: BillingPage,
});

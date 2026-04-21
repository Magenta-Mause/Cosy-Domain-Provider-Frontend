import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterPage } from "@/pages/register-page";
import { store } from "@/store/store";

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    const { identityToken } = store.getState().auth;
    if (identityToken) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RegisterPage,
});

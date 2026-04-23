import { createFileRoute, redirect } from "@tanstack/react-router";
import { SettingsPage } from "@/pages/settings";
import { store } from "@/store/store";

export const Route = createFileRoute("/settings")({
  beforeLoad: () => {
    const { identityToken } = store.getState().auth;
    if (!identityToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: SettingsPage,
});

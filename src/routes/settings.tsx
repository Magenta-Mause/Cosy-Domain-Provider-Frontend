import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/pages/settings";
import { requireFullAuth } from "@/lib/require-full-auth";

export const Route = createFileRoute("/settings")({
  beforeLoad: requireFullAuth,
  component: SettingsPage,
});

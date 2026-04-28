import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/pages/dashboard";
import { requireFullAuth } from "@/lib/require-full-auth";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: requireFullAuth,
  component: DashboardPage,
});

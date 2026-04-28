import { createFileRoute } from "@tanstack/react-router";
import { BillingPage } from "@/pages/billing";
import { requireFullAuth } from "@/lib/require-full-auth";

export const Route = createFileRoute("/billing")({
  beforeLoad: requireFullAuth,
  component: BillingPage,
});

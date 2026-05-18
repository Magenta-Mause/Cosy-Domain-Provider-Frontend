import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { requireFullAuth } from "@/lib/require-full-auth";
import { SettingsPage } from "@/pages/settings";

export const Route = createFileRoute("/settings")({
  validateSearch: z.object({
    linked: z.boolean().optional(),
    linkError: z.boolean().optional(),
  }),
  beforeLoad: requireFullAuth,
  component: SettingsPage,
});

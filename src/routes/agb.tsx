import { createFileRoute } from "@tanstack/react-router";
import { AgbPage } from "@/pages/legal/agb";

export const Route = createFileRoute("/agb")({
  component: AgbPage,
});

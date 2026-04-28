import { createFileRoute } from "@tanstack/react-router";
import { ImpressumPage } from "@/pages/legal/impressum";

export const Route = createFileRoute("/impressum")({
  component: ImpressumPage,
});

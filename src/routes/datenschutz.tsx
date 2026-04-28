import { createFileRoute } from "@tanstack/react-router";
import { DatenschutzPage } from "@/pages/legal/datenschutz";

export const Route = createFileRoute("/datenschutz")({
  component: DatenschutzPage,
});

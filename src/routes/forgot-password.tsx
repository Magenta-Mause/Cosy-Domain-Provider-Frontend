import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import ForgotPasswordPage from "@/pages/forgot-password";

export const Route = createFileRoute("/forgot-password")({
  validateSearch: z.object({ email: z.string().optional() }),
  component: ForgotPasswordPage,
});

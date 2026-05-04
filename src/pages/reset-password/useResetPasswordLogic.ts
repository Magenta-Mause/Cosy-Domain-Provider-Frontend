import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { Route } from "@/routes/reset-password";

export function useResetPasswordLogic() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = Route.useSearch();
  const { confirmPasswordReset } = useDataInteractions();

  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await confirmPasswordReset(token as string, newPassword);
      setSuccess(true);
      setTimeout(() => void navigate({ to: "/login" }), 2000);
    } catch {
      setError(t("resetPassword.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    token,
    newPassword,
    setNewPassword,
    isSubmitting,
    success,
    error,
    handleSubmit,
  };
}

import { useTranslation } from "react-i18next";

import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";

interface SendEmailViewProps {
  userEmail: string | null | undefined;
  isSending: boolean;
  sendError: string | null;
  onSend: () => void;
}

export function SendEmailView({
  userEmail,
  isSending,
  sendError,
  onSend,
}: SendEmailViewProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <h3>{t("verify.sendTitle")}</h3>
        <div>{t("verify.sendDescription", { email: userEmail ?? "" })}</div>
      </div>
      <div className="flex flex-col gap-3">
        {sendError ? <ErrorMessage>{sendError}</ErrorMessage> : null}
        <Button onClick={onSend} disabled={isSending}>
          {isSending ? t("verify.sendingBtn") : t("verify.sendBtn")}
        </Button>
      </div>
    </div>
  );
}

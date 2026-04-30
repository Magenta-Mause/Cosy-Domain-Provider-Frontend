import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Mailbox } from "@/components/pixel/mailbox";

export function VerifiedView() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center" data-testid="verify-success-message">
      <Mailbox size={64} />
      <div className="flex flex-col gap-2">
        <h3>{t("verify.successTitle")}</h3>
        <div className="text-base opacity-80">
          {t("verify.successDescription")}
        </div>
      </div>
      <Link to="/mfa-setup" className="pbtn lg">
        {t("verify.successBtn")}
      </Link>
    </div>
  );
}

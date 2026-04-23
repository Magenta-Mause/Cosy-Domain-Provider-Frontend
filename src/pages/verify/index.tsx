import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { sanitizeVerificationCode } from "@/pages/verify/lib.ts";
import { SendEmailView } from "./components/send-email-view";
import { VerifiedView } from "./components/verified-view";
import { VerifyForm } from "./components/verify-form";
import { useVerifyLogic } from "./useVerifyLogic";

const VerifyPage = () => {
  const {
    userEmail,
    isVerified,
    stage,
    verificationToken,
    setVerificationToken,
    isVerifying,
    isSending,
    resendSent,
    verifyError,
    setVerifyError,
    sendError,
    resendError,
    isBusy,
    triggerVerification,
    triggerSendEmail,
    triggerResend,
  } = useVerifyLogic();

  if (isVerified) {
    return (
      <AuthPageLayout backButtonLink="/dashboard">
        <VerifiedView />
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout backButtonLink="/dashboard">
      {stage === "send" ? (
        <SendEmailView
          userEmail={userEmail}
          isSending={isSending}
          sendError={sendError}
          onSend={() => void triggerSendEmail()}
        />
      ) : (
        <VerifyForm
          userEmail={userEmail}
          verificationToken={verificationToken}
          isVerifying={isVerifying}
          isSending={isSending}
          resendSent={resendSent}
          verifyError={verifyError}
          resendError={resendError}
          isBusy={isBusy}
          onTokenChange={(code) => {
            const sanitized = sanitizeVerificationCode(code);
            setVerificationToken(sanitized);
            setVerifyError(null);
            if (sanitized.length === 6) {
              void triggerVerification(sanitized);
            }
          }}
          onVerify={() => triggerVerification(verificationToken)}
          onResend={() => void triggerResend()}
        />
      )}
    </AuthPageLayout>
  );
};

export default VerifyPage;

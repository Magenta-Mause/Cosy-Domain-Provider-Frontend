import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { sanitizeVerificationCode } from "@/pages/verify/lib.ts";
import { SendEmailView } from "./components/send-email-view";
import { SetPasswordView } from "./components/set-password-view";
import { VerifiedView } from "./components/verified-view";
import { VerifyForm } from "./components/verify-form";
import { useVerifyLogic } from "./useVerifyLogic";

const VerifyPage = () => {
  const {
    userEmail,
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
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    isSettingPassword,
    triggerPasswordSetup,
  } = useVerifyLogic();

  function renderStage() {
    if (stage === "password") {
      return (
        <SetPasswordView
          password={password}
          confirmPassword={confirmPassword}
          passwordError={passwordError}
          isSettingPassword={isSettingPassword}
          onPasswordChange={setPassword}
          onConfirmChange={setConfirmPassword}
          onSubmit={(e) => void triggerPasswordSetup(e)}
        />
      );
    }
    if (stage === "send") {
      return (
        <SendEmailView
          userEmail={userEmail}
          isSending={isSending}
          sendError={sendError}
          onSend={() => void triggerSendEmail()}
        />
      );
    }
    if (stage === "success") {
      return <VerifiedView />;
    }
    return (
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
    );
  }

  return (
    <AuthPageLayout backButtonLink="/dashboard">{renderStage()}</AuthPageLayout>
  );
};

export default VerifyPage;

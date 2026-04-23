import { AuthPageLayout } from "@/components/auth/auth-page-layout";

import { VerifiedView } from "./components/verified-view";
import { VerifyForm } from "./components/verify-form";
import { useVerifyLogic } from "./useVerifyLogic";

const VerifyPage = () => {
  const {
    userEmail,
    isVerified,
    verificationToken,
    setVerificationToken,
    isVerifying,
    isResending,
    resendSent,
    verifyError,
    setVerifyError,
    resendError,
    isBusy,
    triggerVerification,
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
      <VerifyForm
        userEmail={userEmail}
        verificationToken={verificationToken}
        isVerifying={isVerifying}
        isResending={isResending}
        resendSent={resendSent}
        verifyError={verifyError}
        resendError={resendError}
        isBusy={isBusy}
        onTokenChange={(code) => {
          setVerificationToken(
            code.toUpperCase().replaceAll("-", "").replaceAll(" ", ""),
          );
          setVerifyError(null);
        }}
        onVerify={() => triggerVerification(verificationToken)}
        onResend={() => void triggerResend()}
      />
    </AuthPageLayout>
  );
};

export default VerifyPage;

import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { MfaSetupForm } from "./components/mfa-setup-form";

export const MfaSetupPage = () => {
  return (
    <AuthPageLayout backButtonLink={null}>
      <MfaSetupForm />
    </AuthPageLayout>
  );
};

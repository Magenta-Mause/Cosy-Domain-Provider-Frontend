import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { MfaSetupPage } from "./mfa-setup-page";

const MfaSetupRoute = () => {
  return (
    <AuthPageLayout backButtonLink={null}>
      <MfaSetupPage />
    </AuthPageLayout>
  );
};

export default MfaSetupRoute;

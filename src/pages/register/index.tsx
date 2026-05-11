import { AuthPageLayout } from "@/components/auth/auth-page-layout";

import { RegisterForm } from "./components/register-form";

export function RegisterPage() {
  return (
    <>
      <title>Create account — Cosy Domain Provider</title>
      <AuthPageLayout maxWidth={440}>
        <RegisterForm />
      </AuthPageLayout>
    </>
  );
}

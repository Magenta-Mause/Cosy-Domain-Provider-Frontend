import { useEffect, useState } from "react";
import { checkStagingAuth, submitStagingAuth } from "@/api/staging-api";

export function useStagingAuthProviderLogic() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkStagingAuth()
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false));
  }, []);

  async function login() {
    setSubmitting(true);
    setError(null);
    try {
      await submitStagingAuth(username, password);
      setAuthenticated(true);
    } catch {
      setError("error");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    authenticated,
    checking,
    username,
    setUsername,
    password,
    setPassword,
    error,
    submitting,
    login,
  };
}

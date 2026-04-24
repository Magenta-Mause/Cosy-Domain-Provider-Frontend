import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { ADMIN_KEY_STORAGE } from "./lib";

export function useAdminLogic() {
  const navigate = useNavigate();
  const [key, setKey] = useState<string>(
    () => sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "",
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(ADMIN_KEY_STORAGE)) setIsAuthenticated(true);
  }, []);

  const login = useCallback(async (loginKey: string) => {
    try {
      const res = await fetch("/api/v1/admin/users", {
        headers: { "X-Admin-Key": loginKey },
      });
      if (res.status === 401) {
        setLoginError(true);
        return;
      }
      sessionStorage.setItem(ADMIN_KEY_STORAGE, loginKey);
      setKey(loginKey);
      setIsAuthenticated(true);
      setLoginError(false);
    } catch {
      setLoginError(true);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    setKey("");
    setIsAuthenticated(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);
    await login(inputKey);
    setIsLogging(false);
    await navigate({ to: "/admin/subdomains" });
  };

  return {
    key,
    isAuthenticated,
    loginError,
    login,
    logout,
    inputKey,
    setInputKey,
    isLogging,
    handleLogin,
  };
}

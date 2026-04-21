import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Panel } from "@/components/pixel/panel";
import { Scenery } from "@/components/pixel/scenery";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { useAppSelector } from "@/store/hooks";

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loginUser } = useDataInteractions();
  const authState = useAppSelector((state) => state.auth.state);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submitting = authState === "loading";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    try {
      await loginUser({ username, password });
      await navigate({ to: "/dashboard" });
    } catch {
      setErrorMessage(t("login.error"));
    }
  }

  return (
    <Scenery>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
        }}
      >
        <Panel withRibbon style={{ padding: 32, width: "100%", maxWidth: 420 }}>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h2 style={{ fontSize: 22 }}>{t("login.title")}</h2>
              <p style={{ fontSize: 18 }}>
                New here?{" "}
                <Link to="/register" data-testid="login-register-link">
                  {t("login.registerLink")}
                </Link>
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label className="plabel" htmlFor="username">
                {t("login.username")}
              </label>
              <input
                id="username"
                data-testid="login-username-input"
                className="pinput"
                type="text"
                autoComplete="username"
                required
                placeholder="your-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label className="plabel" htmlFor="password">
                {t("login.password")}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  data-testid="login-password-input"
                  className="pinput"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: 80 }}
                />
                <button
                  type="button"
                  data-testid="login-toggle-password-btn"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 14,
                    opacity: 0.7,
                  }}
                >
                  {showPw ? "[hide]" : "[show]"}
                </button>
              </div>
              {errorMessage ? (
                <div style={{ fontSize: 16, color: "var(--destructive)" }}>
                  ⚠ {errorMessage}
                </div>
              ) : null}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Link
                to="/"
                data-testid="login-forgot-password-link"
                style={{ fontSize: 16 }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              data-testid="login-submit-btn"
              className="pbtn lg"
              disabled={!username || !password || submitting}
              style={{ width: "100%" }}
            >
              {submitting ? t("login.submitting") : "Unlock mailbox →"}
            </button>

            <p style={{ fontSize: 16, textAlign: "center", opacity: 0.7 }}>
              {t("login.noAccount")}{" "}
              <Link to="/register" data-testid="login-register-link-footer">
                {t("login.registerLink")}
              </Link>
            </p>
          </form>
        </Panel>
      </div>
    </Scenery>
  );
}

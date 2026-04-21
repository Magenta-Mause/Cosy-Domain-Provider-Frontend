import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Panel } from "@/components/pixel/panel";
import { Scenery } from "@/components/pixel/scenery";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { useAppSelector } from "@/store/hooks";

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { registerUser } = useDataInteractions();
  const authState = useAppSelector((state) => state.auth.state);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const usernameValid =
    username.trim().length >= 3 && username.trim().length <= 20;
  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email],
  );
  const passwordValid = password.length >= 8;
  const passwordWeak = password.length > 0 && password.length < 8;
  const passwordStrong = password.length >= 12;
  const confirmValid = password === confirmPassword;
  const canSubmit =
    usernameValid &&
    emailValid &&
    passwordValid &&
    confirmValid &&
    agreed &&
    authState !== "loading";

  const submitting = authState === "loading";

  const strengthColor = passwordStrong
    ? "var(--accent-2)"
    : passwordWeak
      ? "var(--destructive)"
      : "var(--accent)";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    if (!canSubmit) return;
    try {
      await registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      await navigate({ to: "/dashboard" });
    } catch {
      setErrorMessage(t("register.error"));
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
        <Panel withRibbon style={{ padding: 32, width: "100%", maxWidth: 440 }}>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h2 style={{ fontSize: 22 }}>Stake your mailbox</h2>
              <p style={{ fontSize: 18 }}>
                Already moved in?{" "}
                <Link to="/login" data-testid="register-login-link">
                  {t("register.loginLink")}
                </Link>
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "4px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 3,
                  background: "var(--foreground)",
                  opacity: 0.4,
                }}
              />
              <span className="pixel" style={{ fontSize: 10, opacity: 0.7 }}>
                OR USE EMAIL
              </span>
              <div
                style={{
                  flex: 1,
                  height: 3,
                  background: "var(--foreground)",
                  opacity: 0.4,
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label className="plabel" htmlFor="username">
                {t("register.username")}
              </label>
              <input
                id="username"
                data-testid="register-username-input"
                className="pinput"
                type="text"
                autoComplete="username"
                required
                minLength={3}
                maxLength={20}
                placeholder="your-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label className="plabel" htmlFor="email">
                {t("register.email")}
              </label>
              <input
                id="email"
                data-testid="register-email-input"
                className="pinput"
                type="email"
                autoComplete="email"
                required
                placeholder="janne@example.net"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label className="plabel" htmlFor="password">
                {t("register.password")}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  data-testid="register-password-input"
                  className="pinput"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: 80 }}
                />
                <button
                  type="button"
                  data-testid="register-toggle-password-btn"
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
              {password.length > 0 ? (
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 8,
                        border: "2px solid var(--foreground)",
                        background:
                          password.length > i * 3
                            ? strengthColor
                            : "var(--input-bg)",
                      }}
                    />
                  ))}
                </div>
              ) : null}
              {passwordWeak ? (
                <div style={{ fontSize: 16, color: "var(--destructive)" }}>
                  ⚠ Needs at least 8 characters
                </div>
              ) : null}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label className="plabel" htmlFor="confirmPassword">
                {t("register.confirmPassword")}
              </label>
              <input
                id="confirmPassword"
                data-testid="register-confirm-password-input"
                className="pinput"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {!confirmValid && confirmPassword.length > 0 ? (
                <div style={{ fontSize: 16, color: "var(--destructive)" }}>
                  ⚠ {t("register.passwordMismatch")}
                </div>
              ) : null}
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              <span
                role="checkbox"
                aria-checked={agreed}
                tabIndex={0}
                data-testid="register-terms-checkbox"
                className={agreed ? "pcheck checked" : "pcheck"}
                onClick={() => setAgreed(!agreed)}
                onKeyDown={(e) =>
                  e.key === " " || e.key === "Enter"
                    ? setAgreed(!agreed)
                    : undefined
                }
              />
              I accept the{" "}
              <a href="#" onClick={(e) => e.preventDefault()}>
                terms
              </a>{" "}
              &{" "}
              <a href="#" onClick={(e) => e.preventDefault()}>
                privacy policy
              </a>
            </label>

            {errorMessage ? (
              <div style={{ fontSize: 16, color: "var(--destructive)" }}>
                ⚠ {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              data-testid="register-submit-btn"
              className="pbtn lg"
              disabled={!canSubmit}
              style={{ width: "100%" }}
            >
              {submitting ? t("register.submitting") : "Create account →"}
            </button>
          </form>
        </Panel>
      </div>
    </Scenery>
  );
}

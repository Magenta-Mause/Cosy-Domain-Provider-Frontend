import {Link, useNavigate} from "@tanstack/react-router";
import {useState} from "react";
import {useTranslation} from "react-i18next";

import {PasswordInput} from "@/components/auth/password-input";
import {ErrorMessage} from "@/components/pixel/error-message";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import {useAppSelector} from "@/store/hooks";

export function LoginForm() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {loginUser} = useDataInteractions();
    const authState = useAppSelector((state) => state.auth.state);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const submitting = authState === "loading";

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage(null);
        try {
            await loginUser({email, password});
            await navigate({to: "/dashboard"});
        } catch {
            setErrorMessage(t("login.error"));
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            style={{display: "flex", flexDirection: "column", gap: 16}}
        >
            <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                <h2 style={{fontSize: 22}}>{t("login.title")}</h2>
            </div>

            <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                <label className="plabel" htmlFor="email">
                    {t("login.email")}
                </label>
                <input
                    id="email"
                    data-testid="login-email-input"
                    className="pinput"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                <label className="plabel" htmlFor="password">
                    {t("login.password")}
                </label>
                <PasswordInput
                    id="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={setPassword}
                    showPw={showPw}
                    onToggleShow={() => setShowPw(!showPw)}
                    testId="login-password-input"
                    toggleTestId="login-toggle-password-btn"
                />
                {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
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
                    style={{fontSize: 16}}
                >
                    {t("login.forgotPassword")}
                </Link>
            </div>

            <button
                type="submit"
                data-testid="login-submit-btn"
                className="pbtn lg"
                disabled={!email || !password || submitting}
                style={{width: "100%"}}
            >
                {submitting ? t("login.submitting") : t("login.submitButton")}
            </button>

            <p style={{fontSize: 16, textAlign: "center", opacity: 0.7}}>
                {t("login.noAccount")}{" "}
                <Link to="/register" data-testid="login-register-link-footer">
                    {t("login.registerLink")}
                </Link>
            </p>
        </form>
    );
}

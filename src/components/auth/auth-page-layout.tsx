import {Link} from "@tanstack/react-router";

import {Panel} from "@/components/pixel/panel";
import {Scenery} from "@/components/pixel/scenery";

interface AuthPageLayoutProps {
    children: React.ReactNode;
    maxWidth?: number;
}

export function AuthPageLayout({
                                   children,
                                   maxWidth = 420,
                               }: AuthPageLayoutProps) {
    return (
        <Scenery>
            <Link
                to="/"
                data-testid="auth-back-link"
                style={{
                    position: "absolute",
                    top: 24,
                    left: 28,
                    fontSize: 16,
                    color: "oklch(0.95 0.08 70)",
                    textDecoration: "none",
                    zIndex: 5,
                    border: "black thin solid"
                }}
            >
                ← Back
            </Link>
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "60px 20px",
                }}
            >
                <Panel style={{padding: 32, width: "100%", maxWidth}}>
                    {children}
                </Panel>
            </div>
        </Scenery>
    );
}

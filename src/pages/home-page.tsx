import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import cosyIcon from "@/assets/cosy-logo.webp";
import { Badge } from "@/components/pixel/badge";
import { FlatPanel, Panel } from "@/components/pixel/panel";
import { Scenery } from "@/components/pixel/scenery";
import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";

function GrassSection({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, oklch(0.55 0.14 145) 0%, oklch(0.5 0.14 150) 100%)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 2px, transparent 2px 6px)",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const [subdomain, setSubdomain] = useState("");
  const { isUserLoggedIn } = useAuthInformation();

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Scenery>
        {/* Landing nav */}
        <header
          style={{
            padding: "20px 32px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            position: "relative",
            zIndex: 3,
          }}
        >
          <Link
            to="/dashboard"
            data-testid="home-logo-link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <img src={cosyIcon} alt={"Cosy"} className={"h-12"} />
            <div style={{ textAlign: "left", paddingTop: "3px" }}>
              <div
                className="pixel"
                style={{ fontSize: 16, color: "oklch(0.95 0.05 70)" }}
              >
                COSY
              </div>
              <div
                style={{
                  fontSize: 14,
                  marginTop: 2,
                  color: "oklch(0.92 0.04 60)",
                  opacity: 0.85,
                }}
              >
                Domain Provider
              </div>
            </div>
          </Link>
          <div style={{ flex: 1 }} />
          <nav style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <a
              href="#features"
              data-testid="home-features-link"
              style={{ color: "oklch(0.95 0.05 70)", fontSize: 18 }}
            >
              Features
            </a>
            <a
              href="#pricing"
              data-testid="home-pricing-link"
              style={{
                color: "oklch(0.95 0.05 70)",
                fontSize: 18,
                marginLeft: 12,
              }}
            >
              Pricing
            </a>
          </nav>
          {isUserLoggedIn ? (
            <Link
              to="/dashboard"
              data-testid="home-dashboard-link"
              className="pbtn sm"
            >
              My Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                data-testid="home-login-link"
                className="pbtn sm secondary"
              >
                Log in
              </Link>
              <Link
                to="/register"
                data-testid="home-signup-link"
                className="pbtn sm"
              >
                Sign up
              </Link>
            </>
          )}
        </header>

        {/* Hero */}
        <section
          style={{
            padding: "60px 32px 40px",
            maxWidth: 1200,
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr",
              gap: 48,
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div
                className="signpost"
                style={{
                  alignSelf: "flex-start",
                  fontSize: 12,
                  padding: "8px 14px",
                }}
              >
                ✦ Free for every Cosy homestead
              </div>
              <h1
                style={{
                  fontSize: 48,
                  color: "oklch(0.95 0.08 70)",
                  lineHeight: 1.3,
                  textShadow: "3px 3px 0 oklch(0.25 0.08 30)",
                }}
              >
                Pick a home
                <br />
                on the internet.
              </h1>
              <p
                style={{
                  fontSize: 22,
                  color: "oklch(0.92 0.04 60)",
                  maxWidth: 480,
                  lineHeight: 1.4,
                }}
              >
                Cosy Domain Provider gives your self-hosted Cosy server a
                friendly address on <b>cosy-hosting.net</b> — with automatic
                TLS, so the little green padlock stays happy.
              </p>

              {/* Quick subdomain check */}
              <FlatPanel style={{ padding: 16, maxWidth: 520 }}>
                <label className="plabel" style={{ marginBottom: 10 }}>
                  Claim your address
                </label>
                <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <input
                      data-testid="home-subdomain-input"
                      className="pinput"
                      value={subdomain}
                      onChange={(e) =>
                        setSubdomain(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, ""),
                        )
                      }
                      placeholder="my-castle"
                      style={{ paddingRight: 170 }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 18,
                        opacity: 0.7,
                        pointerEvents: "none",
                      }}
                    >
                      .cosy-hosting.net
                    </span>
                  </div>
                  <button
                    type={"button"}
                    data-testid="home-check-btn"
                    className="pbtn"
                    onClick={() => void navigate({ to: "/register" })}
                  >
                    Check →
                  </button>
                </div>
              </FlatPanel>

              <div
                style={{
                  display: "flex",
                  gap: 24,
                  flexWrap: "wrap",
                  color: "oklch(0.92 0.04 60)",
                  fontSize: 18,
                }}
              >
                <span>✓ Free tier: 1 random address</span>
                <span>✓ Custom names on Cosy+</span>
                <span>✓ Auto TLS renewal</span>
              </div>
            </div>

            {/* Right: illustration placeholder */}
            <div style={{ position: "relative", height: 440 }}>
              <FlatPanel
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "oklch(0.75 0.08 58)",
                }}
              >
                <div
                  style={{
                    width: "88%",
                    height: "88%",
                    background:
                      "repeating-linear-gradient(45deg, oklch(0.75 0.08 58) 0 8px, oklch(0.8 0.06 58) 8px 16px)",
                    border: "3px dashed var(--foreground)",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    color: "var(--foreground)",
                    padding: 12,
                    textAlign: "center",
                  }}
                >
                  <div className="pixel" style={{ fontSize: 12 }}>
                    [ hero pixel art ]
                  </div>
                  <div style={{ fontSize: 18, opacity: 0.8 }}>
                    A cosy pixel-art post office with
                    <br />
                    mailboxes labeled with subdomains.
                    <br />
                    Cat on the roof is recommended.
                  </div>
                </div>
              </FlatPanel>
            </div>
          </div>
        </section>

        {/* Feature strip on grass */}
        <GrassSection>
          <section
            id="features"
            style={{
              padding: "48px 32px 80px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div
                style={{
                  marginBottom: 32,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <h2 style={{ color: "oklch(0.95 0.08 70)" }}>
                  Three stops at the post office
                </h2>
                <p style={{ color: "oklch(0.95 0.04 60)", fontSize: 20 }}>
                  Everything you need to mail packets to your home server.
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 20,
                }}
              >
                {[
                  {
                    title: "Claim an address",
                    body: "Pick a free subdomain on cosy-hosting.net or bring a custom one with Cosy+.",
                    stop: "STOP 01",
                  },
                  {
                    title: "Verify & connect",
                    body: "One-time token pasted into your Cosy instance. We handle the DNS.",
                    stop: "STOP 02",
                  },
                  {
                    title: "Ride the wire",
                    body: "Automatic Let's Encrypt TLS, renewed while you sleep.",
                    stop: "STOP 03",
                  },
                ].map((f) => (
                  <FlatPanel
                    key={f.stop}
                    className="hover-lift"
                    style={{ padding: 20 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <div
                        className="pixel"
                        style={{ fontSize: 14, color: "var(--btn-primary)" }}
                      >
                        {f.stop}
                      </div>
                      <h3>{f.title}</h3>
                      <p style={{ fontSize: 18, lineHeight: 1.4 }}>{f.body}</p>
                    </div>
                  </FlatPanel>
                ))}
              </div>
            </div>
          </section>
        </GrassSection>

        {/* Pricing */}
        <section
          id="pricing"
          style={{ padding: "60px 32px", background: "var(--background)" }}
        >
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div
              style={{
                marginBottom: 32,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <h2>Two ways to move in</h2>
              <p style={{ fontSize: 20, maxWidth: 520, margin: "0 auto" }}>
                Every Cosy user gets a free mailbox. Upgrade to pick the name on
                it.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 24,
              }}
            >
              <Panel style={{ padding: 28 }}>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <Badge color="gray">Free</Badge>
                  <h3>Random mailbox</h3>
                  <div
                    className="pixel"
                    style={{ fontSize: 26, color: "var(--btn-primary)" }}
                  >
                    €0 / forever
                  </div>
                  <ul
                    style={{ listStyle: "none", padding: 0, margin: 0 }}
                    className="stack-sm"
                  >
                    <li>✓ One auto-generated subdomain</li>
                    <li>✓ Automatic TLS certificates</li>
                    <li>✓ Unlimited renewals</li>
                    <li style={{ opacity: 0.55 }}>✗ Cannot choose the name</li>
                  </ul>
                  <Link
                    to="/register"
                    data-testid="home-register-free-link"
                    className="pbtn secondary"
                    style={{ textAlign: "center" }}
                  >
                    Get a random address
                  </Link>
                </div>
              </Panel>

              <Panel
                style={{ padding: 28, borderColor: "var(--accent)" }}
                withRibbon
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <Badge>Cosy+</Badge>
                  <h3>Custom names</h3>
                  <div
                    className="pixel"
                    style={{ fontSize: 26, color: "var(--btn-primary)" }}
                  >
                    €3 / month
                  </div>
                  <ul
                    style={{ listStyle: "none", padding: 0, margin: 0 }}
                    className="stack-sm"
                  >
                    <li>✓ Pick your exact subdomain</li>
                    <li>✓ Up to 5 domains per account</li>
                    <li>✓ Bring your own domain (CNAME)</li>
                    <li>✓ Priority TLS renewal queue</li>
                    <li
                      style={{ color: "var(--accent-4)", fontWeight: "bold" }}
                    >
                      ♥ Your subscription supports the Cosy core team
                    </li>
                  </ul>
                  <Link
                    to="/register"
                    data-testid="home-register-plus-link"
                    className="pbtn"
                    style={{ textAlign: "center" }}
                  >
                    Upgrade to Cosy+
                  </Link>
                </div>
              </Panel>
            </div>
          </div>
        </section>

        <footer
          style={{
            padding: "32px",
            textAlign: "center",
            fontSize: 16,
            opacity: 0.7,
            background: "var(--background)",
          }}
        >
          Made with ♥ by Medalheads · cosy-hosting.net
        </footer>
      </Scenery>
    </div>
  );
}

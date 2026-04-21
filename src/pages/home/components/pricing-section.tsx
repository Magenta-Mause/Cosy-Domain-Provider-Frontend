import {Link} from "@tanstack/react-router";
import {useTranslation} from "react-i18next";

import {Badge} from "@/components/pixel/badge";
import {Panel} from "@/components/pixel/panel";

export function PricingSection() {
    const {t} = useTranslation();

    return (
        <section
            id="pricing"
            style={{padding: "60px 32px", background: "var(--background)"}}
        >
            <div style={{maxWidth: 1000, margin: "0 auto"}}>
                <div
                    style={{
                        marginBottom: 32,
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                    }}
                >
                    <h2>{t("pricing.title")}</h2>
                    <p style={{fontSize: 20, maxWidth: 520, margin: "0 auto"}}>
                        {t("pricing.subtitle")}
                    </p>
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 24,
                    }}
                >
                    <Panel style={{padding: 28}}>
                        <div style={{display: "flex", flexDirection: "column", gap: 16, justifyContent: "space-between"}} className={"h-full"}>
                            <div className={"w-full flex flex-col gap-3"}>
                                <Badge color="gray">{t("pricing.freeBadge")}</Badge>
                                <h3>{t("pricing.freeTitle")}</h3>
                                <div
                                    className="pixel"
                                    style={{fontSize: 26, color: "var(--btn-primary)"}}
                                >
                                    {t("pricing.freePrice")}
                                </div>
                                <ul
                                    style={{listStyle: "none", padding: 0, margin: 0}}
                                    className="stack-sm"
                                >
                                    <li>{t("pricing.freeFeature1")}</li>
                                    <li>{t("pricing.freeFeature2")}</li>
                                    <li>{t("pricing.freeFeature3")}</li>
                                    <li style={{opacity: 0.55}}>{t("pricing.freeLimitation")}</li>
                                </ul>
                            </div>
                            <Link
                                to="/register"
                                data-testid="home-register-free-link"
                                className="pbtn secondary"
                                style={{textAlign: "center"}}
                            >
                                {t("pricing.freeButton")}
                            </Link>
                        </div>
                    </Panel>

                    <Panel
                        style={{padding: 28, borderColor: "var(--accent)"}}
                    >
                        <div style={{display: "flex", flexDirection: "column", gap: 16}}>
                            <div className={"w-full flex flex-col gap-3"}>
                                <Badge>{t("pricing.plusBadge")}</Badge>
                                <h3>{t("pricing.plusTitle")}</h3>
                                <div
                                    className="pixel"
                                    style={{fontSize: 26, color: "var(--btn-primary)"}}
                                >
                                    {t("pricing.plusPrice")}
                                </div>
                                <ul
                                    style={{listStyle: "none", padding: 0, margin: 0}}
                                    className="stack-sm"
                                >
                                    <li>{t("pricing.plusFeature1")}</li>
                                    <li>{t("pricing.plusFeature2")}</li>
                                    <li>{t("pricing.plusFeature3")}</li>
                                    <li>{t("pricing.plusFeature4")}</li>
                                    <li style={{color: "var(--accent-4)", fontWeight: "bold"}}>
                                        {t("pricing.plusSupport")}
                                    </li>
                                </ul>
                            </div>
                            <Link
                                to="/register"
                                data-testid="home-register-plus-link"
                                className="pbtn"
                                style={{textAlign: "center"}}
                            >
                                {t("pricing.plusButton")}
                            </Link>
                        </div>
                    </Panel>
                </div>
            </div>
        </section>
    );
}

import { useTranslation } from "react-i18next";

import { LegalPageLayout } from "../legal-page-layout";

export function ImpressumPage() {
  const { t } = useTranslation();

  return (
    <LegalPageLayout title={t("legal.impressum.title")}>
      <section>
        <h2 className="font-semibold text-lg mb-2">Angaben gemäß § 5 TMG</h2>
        <p>
          Janne Keipert
          <br />
          Marchlewskistraße 102
          <br />
          10243 Berlin
          <br />
          Deutschland
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">Kontakt</h2>
        <p>
          E-Mail:{" "}
          <a
            href="mailto:cosy-hosting.manliness639@passmail.net"
            className="underline opacity-80 hover:opacity-100"
          >
            cosy-hosting.manliness639@passmail.net
          </a>
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">
          Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
        </h2>
        <p>
          Janne Keipert
          <br />
          Marchlewskistraße 102
          <br />
          10243 Berlin
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">Haftungsausschluss</h2>
        <p>
          Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung
          für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten
          sind ausschließlich deren Betreiber verantwortlich.
        </p>
      </section>
    </LegalPageLayout>
  );
}

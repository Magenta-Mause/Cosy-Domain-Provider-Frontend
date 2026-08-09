import { useTranslation } from "react-i18next";

import { LegalPageLayout } from "../legal-page-layout";

export function DatenschutzPage() {
  const { t } = useTranslation("legal");

  return (
    <LegalPageLayout title={t("legal.datenschutz.title")}>
      <title>{t("legal.datenschutz.title")} — Cosy Domain Provider</title>
      <section>
        <h2 className="font-semibold text-lg mb-2">1. Verantwortlicher</h2>
        <p>
          Janne Keipert, Marchlewskistraße 102, 10243 Berlin —{" "}
          cosy-hosting.manliness639@passmail.net
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">2. Erhobene Daten</h2>
        <p>
          Beim Erstellen eines Kontos und der Nutzung des Dienstes werden
          folgende Daten verarbeitet:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 opacity-80">
          <li>E-Mail-Adresse und Benutzername</li>
          <li>Subdomain-Konfigurationen (Label, Ziel-IP)</li>
          <li>IP-Adresse bei Zugriffen (Server-Logs)</li>
          <li>
            OAuth-Profildaten bei Anmeldung via Google, GitHub oder Discord
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">
          3. Zweck der Verarbeitung
        </h2>
        <ul className="list-disc list-inside space-y-1 opacity-80">
          <li>Erbringung und Verwaltung des Subdomain-Dienstes</li>
          <li>Abwicklung kostenpflichtiger Abonnements (Cosy+)</li>
          <li>Sicherheit und Missbrauchsprävention (Cloudflare Turnstile)</li>
          <li>E-Mail-Verifizierung und Passwort-Reset</li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">4. Drittanbieter</h2>
        <p className="mb-2">Wir setzen folgende Drittanbieter ein:</p>
        <ul className="list-disc list-inside space-y-1 opacity-80">
          <li>
            <strong>Stripe</strong> — Zahlungsabwicklung für Cosy+. Stripe
            verarbeitet Zahlungsdaten gemäß eigener Datenschutzrichtlinie.
          </li>
          <li>
            <strong>Cloudflare Turnstile</strong> — Bot-Schutz bei Registrierung
            und Login.
          </li>
          <li>
            <strong>Google / GitHub / Discord</strong> — OAuth-Login, sofern
            genutzt.
          </li>
          <li>
            <strong>Anthropic</strong> — KI-Auswertung im Rahmen der
            automatisierten Inhaltsprüfung (siehe Abschnitt 5). Übermittelt
            werden Bildschirmfoto und sichtbarer Text der geprüften Seite.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">
          5. Automatisierte Inhaltsprüfung der Subdomains
        </h2>
        <p className="mb-2">
          Wir rufen die öffentlich erreichbaren Seiten hinter den vergebenen
          Subdomains regelmäßig automatisiert ab, erstellen ein Bildschirmfoto
          und lassen den sichtbaren Inhalt durch ein KI-System bewerten.
          Gespeichert werden das Bildschirmfoto, die abgerufenen Pfade, der
          HTTP-Status und eine kurze Einschätzung.
        </p>
        <p className="mb-2">
          <strong>Zweck:</strong> Erkennung von Missbrauch unserer Domain, etwa
          Phishing-, Betrugs- oder Schadsoftware-Seiten.{" "}
          <strong>Rechtsgrundlage:</strong> berechtigtes Interesse an der
          Integrität und Reputation der von uns betriebenen Domain, Art. 6 Abs.
          1 lit. f DSGVO.
        </p>
        <p className="mb-2">
          Abgerufen wird nur, was auch jedem anderen Besucher öffentlich
          zugänglich ist — ohne Anmeldung, ohne Absenden von Formularen, ohne
          zugangsgeschützte Bereiche. Enthält eine geprüfte Seite
          personenbezogene Daten Dritter, werden diese unvermeidbar
          mitgespeichert; wir werten sie nicht gesondert aus und geben sie nicht
          weiter.
        </p>
        <p>
          <strong>Speicherdauer:</strong> Bildschirmfotos und Bewertungen werden
          nach 90 Tagen automatisch gelöscht. Zur KI-Auswertung wird der Inhalt
          an Anthropic übermittelt (siehe Abschnitt 4).
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">6. Speicherdauer</h2>
        <p>
          Daten werden gelöscht, sobald sie für den Verarbeitungszweck nicht
          mehr benötigt werden. Kontodaten werden bei Löschung des Kontos
          entfernt. Zahlungsdaten unterliegen den gesetzlichen
          Aufbewahrungsfristen (10 Jahre).
        </p>
        <p className="mt-2">
          Zur Absicherung gegen Datenverlust und Systemausfälle werden
          regelmäßig Sicherungskopien (Backups) der Datenbank erstellt —
          berechtigtes Interesse an einem sicheren Betrieb, Art. 6 Abs. 1 lit. f
          DSGVO in Verbindung mit Art. 32 DSGVO. Nach einer Löschung können die
          betroffenen Daten in diesen Sicherungen noch längstens 60 Tage
          enthalten sein; sie werden dort nicht mehr aktiv verarbeitet und
          danach automatisch gelöscht. Sicherungen werden ausschließlich zur
          Wiederherstellung nach einem Systemausfall verwendet, nicht zur
          Wiederherstellung einzelner Konten.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">7. Deine Rechte</h2>
        <p>
          Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung
          der Verarbeitung, Datenübertragbarkeit und Widerspruch. Wende dich
          dazu an:{" "}
          <a
            href="mailto:cosy-hosting.manliness639@passmail.net"
            className="underline opacity-80 hover:opacity-100"
          >
            cosy-hosting.manliness639@passmail.net
          </a>
          {
            ". Du hast außerdem das Recht, bei der zuständigen Aufsichtsbehörde Beschwerde einzulegen."
          }
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">8. Cookies</h2>
        <p>
          Wir verwenden ausschließlich technisch notwendige Cookies und
          Session-Token für die Authentifizierung. Es werden keine
          Tracking-Cookies oder Werbe-Cookies eingesetzt.
        </p>
      </section>
    </LegalPageLayout>
  );
}

import { useTranslation } from "react-i18next";

import { LegalPageLayout } from "../legal-page-layout";

export function AgbPage() {
  const { t } = useTranslation();

  return (
    <LegalPageLayout title={t("legal.agb.title")}>
      <section>
        <h2 className="font-semibold text-lg mb-2">1. Geltungsbereich</h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung des
          Subdomain-Dienstes Cosy Domain Provider, betrieben von Janne Keipert
          (nachfolgend „Anbieter"). Mit der Registrierung eines Kontos
          akzeptierst du diese AGB in der jeweils gültigen Fassung.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">2. Leistungsbeschreibung</h2>
        <p className="mb-2">
          Der Anbieter stellt Subdomains unter der Domain{" "}
          <code className="text-sm bg-foreground/10 px-1 rounded">
            play.cosy-hosting.net
          </code>{" "}
          bereit. Es werden zwei Tarife angeboten:
        </p>
        <ul className="list-disc list-inside space-y-1 opacity-80">
          <li>
            <strong>Free</strong>: Eine automatisch generierte Subdomain,
            kostenlos und unbefristet.
          </li>
          <li>
            <strong>Cosy+</strong>: Bis zu 5 frei wählbare Subdomains, gegen
            monatliche Gebühr.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">3. Preise und Zahlung</h2>
        <p className="mb-2">
          Cosy+ kostet <strong>€ 1,00 / Monat</strong> (inkl. gesetzlicher
          MwSt.). Die Abrechnung erfolgt monatlich im Voraus über{" "}
          <strong>Stripe</strong>. Alle Preise in Euro.
        </p>
        <p>
          Die Zahlung wird automatisch verlängert, bis das Abonnement gekündigt
          wird. Bei fehlgeschlagener Zahlung behält sich der Anbieter vor, den
          Zugang zu Cosy+-Funktionen vorübergehend zu sperren.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">
          4. Laufzeit und Kündigung
        </h2>
        <p>
          Das Cosy+-Abonnement läuft monatlich und verlängert sich automatisch.
          Die Kündigung ist jederzeit zum Ende der aktuellen Abrechnungsperiode
          möglich, über das Kundenportal (Stripe Billing Portal) oder per E-Mail
          an cosy-hosting.manliness639@passmail.net. Nach Ablauf des Abonnements
          wechselt das Konto in den Free-Tarif; bestehende Subdomains bleiben
          erhalten, sofern die Anzahl den Free-Limits entspricht.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">5. Widerrufsrecht</h2>
        <p>
          Bei digitalen Inhalten, die sofort bereitgestellt werden, erlischt das
          gesetzliche Widerrufsrecht gemäß § 356 Abs. 5 BGB mit Beginn der
          Ausführung des Vertrags, sofern du ausdrücklich zugestimmt hast, dass
          wir mit der Ausführung vor Ablauf der Widerrufsfrist beginnen, und du
          zur Kenntnis genommen hast, dass dein Widerrufsrecht dadurch erlischt.
          Durch Abschluss des Abonnements erklärst du dich mit diesem Erlöschen
          einverstanden.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">6. Nutzungsbedingungen</h2>
        <p className="mb-2">Es ist untersagt, den Dienst zu nutzen für:</p>
        <ul className="list-disc list-inside space-y-1 opacity-80">
          <li>Rechtswidrige Inhalte oder Aktivitäten</li>
          <li>Spam, Phishing oder andere missbräuchliche Zwecke</li>
          <li>
            Aktivitäten, die die Infrastruktur des Anbieters oder Dritter
            beeinträchtigen
          </li>
        </ul>
        <p className="mt-2">
          Bei Verstößen ist der Anbieter berechtigt, das Konto ohne Vorwarnung
          zu sperren oder zu löschen.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">
          7. Verfügbarkeit und Haftung
        </h2>
        <p>
          Der Anbieter bemüht sich um eine hohe Verfügbarkeit des Dienstes,
          übernimmt jedoch keine Garantie für eine unterbrechungsfreie Nutzung.
          Die Haftung für mittelbare Schäden, entgangenen Gewinn oder
          Datenverlust ist, soweit gesetzlich zulässig, ausgeschlossen.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">8. Änderungen der AGB</h2>
        <p>
          Der Anbieter behält sich vor, diese AGB jederzeit zu ändern. Über
          wesentliche Änderungen wird per E-Mail informiert. Die weitere Nutzung
          des Dienstes nach Inkrafttreten der geänderten AGB gilt als
          Zustimmung.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">9. Anwendbares Recht</h2>
        <p>
          Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.
          Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz des Anbieters.
        </p>
      </section>

      <p className="text-sm opacity-50 mt-8">Stand: April 2026</p>
    </LegalPageLayout>
  );
}

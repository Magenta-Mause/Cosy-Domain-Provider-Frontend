import { useTranslation } from "react-i18next";

export function PageFooter() {
  const { t } = useTranslation();

  return (
    <footer className="p-8 text-center text-base opacity-70 bg-background">
      {t("footer.text")}
    </footer>
  );
}

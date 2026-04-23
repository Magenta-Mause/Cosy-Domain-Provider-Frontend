import { useTranslation } from "react-i18next";

export function OrDivider() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-[3px] opacity-40 bg-foreground" />
      <span className="pixel text-[10px] opacity-70">
        {t("register.orUseEmail")}
      </span>
      <div className="flex-1 h-[3px] opacity-40 bg-foreground" />
    </div>
  );
}

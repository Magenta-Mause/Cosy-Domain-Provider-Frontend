type TabKey = "overview" | "dns" | "danger";

interface DomainTabBarProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

const TABS: Array<[TabKey, string]> = [
  ["overview", "Overview"],
  ["dns", "DNS records"],
  ["danger", "Danger zone"],
];

export function DomainTabBar({ activeTab, onChange }: DomainTabBarProps) {
  return (
    <div className="flex gap-2">
      {TABS.map(([k, l]) => (
        <button
          key={k}
          type="button"
          data-testid={`domain-detail-tab-${k}-btn`}
          className="pixel px-4 py-[10px] text-[11px] relative cursor-pointer border-[3px] border-foreground rounded-tl-radius-sm rounded-tr-radius-sm -mb-[3px]"
          onClick={() => onChange(k)}
          style={{
            background:
              activeTab === k ? "var(--secondary-background)" : "transparent",
            borderBottom:
              activeTab === k
                ? "3px solid var(--secondary-background)"
                : "3px solid var(--foreground)",
            color: activeTab === k ? "var(--btn-primary)" : "var(--foreground)",
            zIndex: activeTab === k ? 2 : 1,
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

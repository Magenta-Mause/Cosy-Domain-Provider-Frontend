import type { SortDir, SortKey } from "../lib";

interface SortBtnProps {
  sortKey: SortKey;
  label: string;
  activeSortBy: SortKey;
  sortDir: SortDir;
  onToggle: (key: SortKey) => void;
}

export function SortBtn({
  sortKey,
  label,
  activeSortBy,
  sortDir,
  onToggle,
}: SortBtnProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(sortKey)}
      className="flex items-center gap-1 hover:opacity-80 transition-opacity"
    >
      {label}
      {activeSortBy === sortKey && (
        <span className="text-[10px] opacity-60">
          {sortDir === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );
}

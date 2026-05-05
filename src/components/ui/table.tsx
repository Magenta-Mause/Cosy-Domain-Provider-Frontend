import { Fragment, type ReactNode, useMemo, useState } from "react";

import { FlatPanel } from "@/components/pixel/panel";

export interface ColumnDef<T> {
  readonly id: string;
  readonly header: ReactNode;
  readonly width?: string;
  readonly compare?: (a: T, b: T) => number;
  readonly cell: (row: T) => ReactNode;
  readonly cellClassName?: string | ((row: T) => string);
}

interface TableProps<T> {
  readonly columns: ColumnDef<T>[];
  readonly rows: T[];
  readonly getRowKey: (row: T) => string;
  readonly onRowClick?: (row: T) => void;
  readonly emptyMessage?: string;
  readonly initialSortColId?: string;
  readonly initialSortDir?: "asc" | "desc";
}

export function Table<T>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  emptyMessage,
  initialSortColId,
  initialSortDir = "asc",
}: TableProps<T>) {
  const [sortColId, setSortColId] = useState<string | null>(
    initialSortColId ?? null,
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">(initialSortDir);

  const toggleSort = (colId: string) => {
    if (sortColId === colId) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColId(colId);
      setSortDir("asc");
    }
  };

  const sortedRows = useMemo(() => {
    if (!sortColId) return rows;
    const col = columns.find((c) => c.id === sortColId);
    if (!col?.compare) return rows;
    const mult = sortDir === "asc" ? 1 : -1;
    const compare = col.compare;
    return [...rows].sort((a, b) => mult * compare(a, b));
  }, [rows, sortColId, sortDir, columns]);

  return (
    <FlatPanel className="p-0 overflow-hidden">
      <div
        className="grid text-sm"
        style={{
          gridTemplateColumns: columns
            .map((col) => col.width ?? "1fr")
            .join(" "),
        }}
      >
        {columns.map((col) => (
          <div
            key={col.id}
            className="px-3 py-2 bg-btn-primary text-btn-secondary font-bold text-left"
          >
            {col.compare ? (
              <button
                type="button"
                onClick={() => toggleSort(col.id)}
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                {col.header}
                {sortColId === col.id && (
                  <span className="text-[10px] opacity-60">
                    {sortDir === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            ) : (
              col.header
            )}
          </div>
        ))}

        {sortedRows.length === 0 && emptyMessage && (
          <div
            className="px-3 py-4 opacity-50 text-center"
            style={{ gridColumn: "1 / -1" }}
          >
            {emptyMessage}
          </div>
        )}

        {sortedRows.map((row) => {
          const rowKey = getRowKey(row);
          const cells = columns.map((col) => {
            const extra =
              typeof col.cellClassName === "function"
                ? col.cellClassName(row)
                : (col.cellClassName ?? "");
            return (
              <div
                key={col.id}
                className={`px-3 py-2.5 border-t border-foreground/10 text-left ${onRowClick ? "group-hover:bg-foreground/5 transition-colors" : ""} ${extra}`}
              >
                {col.cell(row)}
              </div>
            );
          });

          if (onRowClick) {
            return (
              <button
                key={rowKey}
                type="button"
                className="contents group cursor-pointer"
                onClick={() => onRowClick(row)}
              >
                {cells}
              </button>
            );
          }

          return <Fragment key={rowKey}>{cells}</Fragment>;
        })}
      </div>
    </FlatPanel>
  );
}

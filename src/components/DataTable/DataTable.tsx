import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/Card/Card";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ErrorBox } from "@/components/ErrorBox/ErrorBox";
import { Pager } from "@/components/Pager/Pager";
import type { ListResult } from "@/hooks/useList";
import "./DataTable.css";

export interface Column<T> {
  label: string;
  align?: "right";
  render: (row: T) => ReactNode;
}

export function DataTable<T extends { id: number }>({
  list,
  columns,
  empty = "Nothing here yet.",
  emptyIcon,
  className,
}: {
  list: ListResult<T>;
  columns: Column<T>[];
  empty?: string;
  emptyIcon?: LucideIcon;
  className?: string;
}) {
  const { data, loading, error, page, setPage, reload } = list;
  return (
    <Card className={className ? `table-card ${className}` : "table-card"}>
      <ErrorBox message={error} onRetry={reload} />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.label} className={c.align}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && !data && (
              <tr>
                <td colSpan={columns.length} className="muted center">
                  Loading…
                </td>
              </tr>
            )}
            {data && data.items.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="muted center">
                  {emptyIcon ? (
                    <EmptyState icon={emptyIcon}>{empty}</EmptyState>
                  ) : (
                    empty
                  )}
                </td>
              </tr>
            )}
            {data &&
              data.items.map((row) => (
                <tr key={row.id}>
                  {columns.map((c) => (
                    <td key={c.label} className={c.align}>
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Pager data={data} page={page} setPage={setPage} />
    </Card>
  );
}

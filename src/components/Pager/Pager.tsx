import { Button } from "@/components/Button/Button";
import type { Paginated } from "@/lib/types";
import "./Pager.css";

export function Pager<T>({
  data,
  page,
  setPage,
}: {
  data: Paginated<T> | null;
  page: number;
  setPage: (page: number) => void;
}) {
  if (!data || data.pages <= 1) return null;
  return (
    <div className="pager">
      <Button small disabled={page <= 1} onClick={() => setPage(page - 1)}>
        Previous
      </Button>
      <span>
        Page {data.page} of {data.pages} · {data.total} records
      </span>
      <Button
        small
        disabled={page >= data.pages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}

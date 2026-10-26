"use client";

import { useFetch } from "@/hooks/useFetch";
import { money } from "@/lib/format";
import { api } from "@/lib/api";
import type { Loan, LoanBalance as LoanBalanceData } from "@/lib/types";

export function LoanBalance({ loan }: { loan: Loan }) {
  const b = useFetch(
    () => api.get<LoanBalanceData>(`/loans/${loan.id}/balance`),
    [loan.id, loan.status],
  );
  if (b.error) return <span className="muted">—</span>;
  return b.data ? money(b.data.balance) : "…";
}

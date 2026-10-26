"use client";

import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { money } from "@/lib/format";
import type { Loan, LoanBalance as LoanBalanceData } from "@/lib/types";

export function LoanBalance({ loan }: { loan: Loan }) {
  const b = useFetch(
    () => api.get<LoanBalanceData>(`/loans/${loan.id}/balance`),
    [loan.id, loan.status],
  );
  return b.data ? money(b.data.balance) : "…";
}

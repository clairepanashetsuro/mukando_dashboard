"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import type { Loan, Repayment } from "@/lib/types";
import { money } from "@/lib/format";
import { Badge } from "@/components/Badge/Badge";
import { useMembers } from "../shared/useMembers";
import "./LoanDetails.css";

interface RepaymentPage {
  items: Repayment[];
  total: number;
}

interface LoanDetailsProps {
  loan: Loan;
  onClose: () => void;
}

export function LoanDetails({ loan, onClose }: LoanDetailsProps) {
  const members = useMembers();

  const [balance, setBalance] = useState<number | null>(null);
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDetails() {
      try {
        setLoading(true);
        setError("");

        const [balanceData, repaymentData] = await Promise.all([
          api.get<{ loan_id: number; balance: number }>(
            `/loans/${loan.id}/balance`,
          ),
          api.get<RepaymentPage>(
            `/repayments?loan_id=${loan.id}&page=1&size=100`,
          ),
        ]);

        if (!active) return;

        setBalance(balanceData.balance);
        setRepayments(repaymentData.items);
      } catch {
        if (active) {
          setError("Unable to load all loan details. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDetails();

    return () => {
      active = false;
    };
  }, [loan.id]);

  const totalRepaid = repayments.reduce(
    (total, repayment) => total + Number(repayment.amount),
    0,
  );

  return (
    <div
      className="loan-details-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="loan-details-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="loan-details-title"
      >
        <header className="loan-details-header">
          <div>
            <p className="loan-details-eyebrow">Loan overview</p>
            <h2 id="loan-details-title">Loan #{loan.id}</h2>
          </div>

          <button
            className="loan-details-close"
            onClick={onClose}
            aria-label="Close loan details"
          >
            <X size={20} />
          </button>
        </header>

        <div className="loan-details-content">
          <div className="loan-details-summary">
            <div>
              <span>Outstanding balance</span>
              <strong>
                {loading
                  ? "Loading..."
                  : balance !== null
                    ? money(balance)
                    : "Unavailable"}
              </strong>
            </div>

            <Badge value={loan.status} />
          </div>

          {error && <p className="loan-details-error">{error}</p>}

          <section className="loan-details-section">
            <h3>Member information</h3>

            <div className="loan-details-grid">
              <div>
                <span>Member</span>
                <strong>{members.name(loan.member_id)}</strong>
              </div>

              <div>
                <span>Member ID</span>
                <strong>{loan.member_id}</strong>
              </div>
            </div>
          </section>

          <section className="loan-details-section">
            <h3>Loan information</h3>

            <div className="loan-details-grid">
              <div>
                <span>Principal</span>
                <strong>{money(loan.principal)}</strong>
              </div>

              <div>
                <span>Interest rate</span>
                <strong>{Number(loan.interest_rate)}%</strong>
              </div>

              <div>
                <span>Interest amount</span>
                <strong>{money(loan.interest_amount)}</strong>
              </div>

              <div>
                <span>Total payable before penalties</span>
                <strong>
                  {money(Number(loan.principal) + Number(loan.interest_amount))}
                </strong>
              </div>

              <div>
                <span>Due date</span>
                <strong>{loan.due_date}</strong>
              </div>

              <div>
                <span>Loan ID</span>
                <strong>#{loan.id}</strong>
              </div>
            </div>
          </section>

          <section className="loan-details-section">
            <h3>Repayment summary</h3>

            <div className="loan-details-grid">
              <div>
                <span>Total repaid</span>
                <strong>{loading ? "Loading..." : money(totalRepaid)}</strong>
              </div>

              <div>
                <span>Number of repayments</span>
                <strong>{loading ? "Loading..." : repayments.length}</strong>
              </div>
            </div>
          </section>

          <section className="loan-details-section">
            <h3>Repayment history</h3>

            {loading ? (
              <p className="loan-details-muted">Loading repayments...</p>
            ) : repayments.length === 0 ? (
              <p className="loan-details-muted">
                No repayments have been recorded for this loan.
              </p>
            ) : (
              <div className="loan-repayment-list">
                {repayments.map((repayment) => (
                  <div className="loan-repayment-item" key={repayment.id}>
                    <div>
                      <strong>{money(repayment.amount)}</strong>
                      <span>Repayment #{repayment.id}</span>
                    </div>

                    <time>{repayment.paid_at}</time>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}

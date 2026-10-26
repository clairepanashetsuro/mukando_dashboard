import type { ChangeEvent } from "react";

export type Role = "TREASURER" | "MEMBER";
export type LoanStatus = "ACTIVE" | "OVERDUE" | "PAID" | "DEFAULTED";
export type Amount = string | number;
export type FieldEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>;

export interface Tokens {
  access: string;
  refresh: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: Role;
  must_change_password: boolean;
}

export interface Member {
  id: number;
  full_name: string;
  email: string;
  must_change_password: boolean;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pages: number;
  total: number;
}

export interface Group {
  name: string;
  weekly_contribution: Amount;
}

export interface Contribution {
  id: number;
  member_id: number;
  amount: Amount;
  paid_at: string;
}

export interface Loan {
  id: number;
  member_id: number;
  principal: Amount;
  interest_amount: Amount;
  due_date: string;
  status: LoanStatus;
}

export interface Repayment {
  id: number;
  member_id: number;
  loan_id: number;
  amount: Amount;
  paid_at: string;
}

export interface LoanBalance {
  balance: number;
}

export interface AvailableFunds {
  available_funds: Amount;
}

export interface Summary {
  members: number;
  total_contributions: Amount;
  total_repayments: Amount;
  outstanding_loans: Amount;
  active_loans: number;
  overdue_loans: number;
  defaulted_loans: number;
  paid_loans: number;
}

export interface MyReport {
  total_contributions: number;
  total_repayments: Amount;
  outstanding_balance: number;
  outstanding_loans: number;
}

export interface SignupPayload {
  full_name: string;
  email: string;
  password: string;
  group_name: string;
  weekly_contribution: string;
}

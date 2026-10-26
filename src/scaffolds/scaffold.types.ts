import type { User } from "@/lib/types";

export type TabKey =
  | "overview"
  | "members"
  | "contributions"
  | "loans"
  | "repayments"
  | "group"
  | "account";
export type TabTuple = readonly [TabKey, string];

export interface ScaffoldProps {
  user: User;
  setUser: (user: User) => void;
  onLogout: () => Promise<void>;
}

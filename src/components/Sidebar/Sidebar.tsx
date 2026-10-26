import {
  LayoutDashboard,
  HandCoins,
  LogOut,
  PiggyBank,
  Receipt,
  Settings,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Brand } from "@/components/Brand/Brand";
import { Button } from "@/components/Button/Button";
import type { TabKey, TabTuple } from "@/scaffolds/scaffold.types";
import type { User } from "@/lib/types";
import "./Sidebar.css";

const NAV_ICONS: Record<TabKey, LucideIcon> = {
  overview: LayoutDashboard,
  members: Users,
  contributions: PiggyBank,
  loans: HandCoins,
  repayments: Receipt,
  group: Settings,
  account: UserRound,
};

interface SidebarProps {
  user: User;
  roleLabel: string;
  tabs: readonly TabTuple[];
  active: TabKey;
  onSelect: (tab: TabKey) => void;
  onLogout: () => Promise<void>;
}

export function Sidebar({
  user,
  roleLabel,
  tabs,
  active,
  onSelect,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <Brand />
      <div className="role-chip">{roleLabel}</div>
      <nav>
        {tabs.map(([key, label]) => {
          const Icon = NAV_ICONS[key];
          return (
            <button
              key={key}
              className={`nav-item ${active === key ? "active" : ""}`}
              onClick={() => onSelect(key)}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-foot">
        <div className="who">
          <strong>{user.full_name}</strong>
          <span>{user.email}</span>
        </div>
        <Button block icon={LogOut} onClick={onLogout}>
          Sign out
        </Button>
      </div>
    </aside>
  );
}

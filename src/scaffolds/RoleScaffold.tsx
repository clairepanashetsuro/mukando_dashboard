"use client";

import { MemberScaffold } from "./MemberScaffold";
import { TreasurerScaffold } from "./TreasurerScaffold";
import type { ScaffoldProps } from "./scaffold.types";

export function RoleScaffold(props: ScaffoldProps) {
  return props.user.role === "TREASURER" ? (
    <TreasurerScaffold {...props} />
  ) : (
    <MemberScaffold {...props} />
  );
}

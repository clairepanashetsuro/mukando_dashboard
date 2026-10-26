import type { FieldEvent } from "@/lib/types";
import type { MembersState } from "../useMembers";

export function MemberSelect({
  members,
  value,
  onChange,
}: {
  members: MembersState;
  value: string | number;
  onChange: (e: FieldEvent) => void;
}) {
  return (
    <select required value={value} onChange={onChange}>
      <option value="">Select a member…</option>
      {(members.data || []).map((m) => (
        <option key={m.id} value={m.id}>
          {m.full_name}
        </option>
      ))}
    </select>
  );
}

"use client";

import { fetchAll } from "@/lib/api";
import type { Member } from "@/lib/types";
import { useFetch } from "@/hooks/useFetch";

export function useMembers() {
  const members = useFetch(() => fetchAll<Member>("/users/members"), []);
  const byId = Object.fromEntries((members.data || []).map((m) => [m.id, m]));
  const name = (id: number) =>
    byId[id] ? byId[id].full_name : `Member #${id}`;
  return { ...members, byId, name };
}

export type MembersState = ReturnType<typeof useMembers>;

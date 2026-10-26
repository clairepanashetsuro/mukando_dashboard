"use client";

import { Plus, UserX, Users } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/Badge/Badge";
import { Button } from "@/components/Button/Button";
import { DataTable } from "@/components/DataTable/DataTable";
import { FormModal } from "@/components/FormModal/FormModal";
import { PageHead } from "@/components/PageHead/PageHead";
import { RowActions } from "@/components/RowActions/RowActions";
import { useList } from "@/hooks/useList";
import { api } from "@/lib/api";
import type { Member } from "@/lib/types";
import { MemberForm } from "./MemberForm";
import "./MembersPage.css";

export function MembersPage() {
  const list = useList<Member>("/users/members");
  const [modal, setModal] = useState<
    | { type: "add" }
    | { type: "edit"; m: Member }
    | { type: "remove"; m: Member }
    | null
  >(null);
  const close = (changed: boolean) => {
    setModal(null);
    if (changed) list.reload();
  };
  return (
    <>
      <PageHead
        title="Members"
        subtitle="Add members and manage their access"
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setModal({ type: "add" })}
          >
            Add member
          </Button>
        }
      />
      <DataTable
        className="members-table"
        list={list}
        empty="No members yet. Add your first member."
        emptyIcon={Users}
        columns={[
          { label: "Name", render: (m) => m.full_name },
          { label: "Email", render: (m) => m.email },
          {
            label: "Status",
            render: (m) =>
              m.must_change_password ? (
                <Badge value="Pending" />
              ) : (
                <Badge value="Active" />
              ),
          },
          {
            label: "",
            align: "right",
            render: (m) => (
              <RowActions>
                <Button small onClick={() => setModal({ type: "edit", m })}>
                  Edit
                </Button>
                <Button
                  small
                  variant="danger-outline"
                  onClick={() => setModal({ type: "remove", m })}
                >
                  Deactivate
                </Button>
              </RowActions>
            ),
          },
        ]}
      />
      {modal?.type === "add" && <MemberForm onClose={close} />}
      {modal?.type === "edit" && (
        <MemberForm member={modal.m} onClose={close} />
      )}
      {modal?.type === "remove" && (
        <FormModal
          title="Deactivate member"
          submitLabel="Deactivate"
          submitIcon={UserX}
          danger
          onClose={close}
          onSubmit={async () => {
            await api.del(`/users/members/${modal.m.id}`);
            return "Member deactivated";
          }}
        >
          <p>
            {modal.m.full_name} will no longer be able to sign in. Their
            financial records are kept.
          </p>
        </FormModal>
      )}
    </>
  );
}

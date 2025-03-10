"use client";

import { Modal } from "@/components/Modal";
import { UpdateProfileForm } from "@/components/general/_partials/form/UpdateProfileForm";
import { formBasicInfoProfile } from "@/lib/schema";

export default function Page() {
  return (
    <Modal
      onSubmit={async () => {}}
      formSchema={formBasicInfoProfile}
      route="/me"
      defaultValues={{
        gender: "other",
        country: "france",
      }}
      title="Modifier le profil"
    >
      <UpdateProfileForm />
    </Modal>
  );
}

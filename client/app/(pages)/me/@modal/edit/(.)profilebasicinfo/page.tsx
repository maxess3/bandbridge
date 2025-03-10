"use client";

import { Modal } from "@/components/Modal";
import { UpdateProfileForm } from "@/components/general/_partials/form/UpdateProfileForm";
import { formBasicInfoProfile } from "@/lib/schema";

export default function InterceptedPage() {
  console.log("I am the modal that is shown during interception");
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

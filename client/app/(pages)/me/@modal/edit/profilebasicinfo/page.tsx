import { Modal } from "@/components/Modal";
import { UpdateProfileForm } from "@/components/general/_partials/form/UpdateProfileForm";

export default function Page() {
  return (
    <Modal route="/me" title="Modifier le profil">
      <UpdateProfileForm />
    </Modal>
  );
}

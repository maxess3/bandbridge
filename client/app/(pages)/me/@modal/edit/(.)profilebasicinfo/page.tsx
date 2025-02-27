import { Modal } from "@/components/Modal";
import { UpdateProfileForm } from "@/components/general/_partials/form/UpdateProfileForm";

export default function InterceptedPage() {
  console.log("I am the modal that is shown during interception");
  return (
    <Modal title="Modifier le profil">
      <UpdateProfileForm />
    </Modal>
  );
}

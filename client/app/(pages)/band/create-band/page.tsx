import { CreateBandForm } from "@/components/features/band/forms/CreateBandForm";

export default function CreateBandPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-medium">Créer un groupe de musique</h1>
        <p className="mt-2 opacity-80">
          Créez un groupe et commencez à recruter des musiciens
        </p>
      </div>
      <CreateBandForm />
    </div>
  );
}

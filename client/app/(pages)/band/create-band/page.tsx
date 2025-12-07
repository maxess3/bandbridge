import { CreateBandForm } from "@/components/features/band/forms/CreateBandForm";
import { AutocompleteProvider } from "@/contexts/AutocompleteContext";

export default function CreateBandPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-4xl font-medium">Créer un groupe de musique</h1>
        <p className="opacity-80">
          Créez un groupe et commencez à recruter des musiciens
        </p>
      </div>
      <AutocompleteProvider>
        <CreateBandForm />
      </AutocompleteProvider>
    </div>
  );
}

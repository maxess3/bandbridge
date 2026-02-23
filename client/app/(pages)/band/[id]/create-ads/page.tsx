"use client";

import { useParams } from "next/navigation";
import { CreateBandAdForm } from "@/components/features/band/forms/CreateBandAdForm";
import { AutocompleteProvider } from "@/contexts/AutocompleteContext";

export default function CreateBandAdPage() {
  const params = useParams();
  const bandId = typeof params.id === "string" ? params.id : params.id?.[0] ?? "";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-4xl font-medium">Créer une annonce de groupe</h1>
        <p className="opacity-80">
          Publiez une annonce pour recruter des musiciens dans votre groupe
        </p>
      </div>
      <AutocompleteProvider>
        <CreateBandAdForm bandId={bandId} />
      </AutocompleteProvider>
    </div>
  );
}

import BandTable from "@/components/BandTable";

export default function Ads() {
  return (
    <div className="flex flex-col justify-center">
      <div className="my-8">
        <h1 className="text-2xl font-semibold">
          Rejoindre un groupe de musique
        </h1>
        <p className="mt-1">Visualiser l'ensemble des groupes de musique.</p>
      </div>

      <BandTable />
    </div>
  );
}

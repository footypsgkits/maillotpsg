import { SeasonForm, emptySeason } from "@/components/admin/SeasonForm";

export default function NewSeasonPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nouvelle saison</h1>
      <SeasonForm initial={emptySeason} />
    </div>
  );
}

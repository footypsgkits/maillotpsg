import { PlayerForm, emptyPlayer } from "@/components/admin/PlayerForm";

export default function NewPlayerPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nouveau joueur</h1>
      <PlayerForm initial={emptyPlayer} />
    </div>
  );
}

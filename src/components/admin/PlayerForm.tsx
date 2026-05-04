"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";

export type PlayerValues = {
  id?: string;
  name: string;
  slug: string;
  firstName: string;
  lastName: string;
  number: number | null;
  position: string;
  nationality: string;
  era: string;
  bio: string;
  metaTitle: string;
  metaDesc: string;
  imageUrl: string;
  active: boolean;
  position2: number;
};

export const emptyPlayer: PlayerValues = {
  name: "",
  slug: "",
  firstName: "",
  lastName: "",
  number: null,
  position: "",
  nationality: "",
  era: "actuel",
  bio: "",
  metaTitle: "",
  metaDesc: "",
  imageUrl: "",
  active: true,
  position2: 0,
};

export function PlayerForm({ initial }: { initial: PlayerValues }) {
  const router = useRouter();
  const [v, setV] = useState<PlayerValues>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function set<K extends keyof PlayerValues>(k: K, val: PlayerValues[K]) {
    setV((s) => ({ ...s, [k]: val }));
  }

  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append("files", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const j = await res.json();
      set("imageUrl", j.urls[0]);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    const payload = { ...v, slug: v.slug || slugify(v.name) };
    const res = await fetch(v.id ? `/api/admin/players/${v.id}` : "/api/admin/players", {
      method: v.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const j = await res.json();
      router.push(`/admin/players/${j.id}`);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Erreur");
    }
    setSaving(false);
  }

  async function remove() {
    if (!v.id || !confirm("Supprimer ce joueur ?")) return;
    const res = await fetch(`/api/admin/players/${v.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/players");
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Section title="Identité">
        <Grid>
          <Field label="Nom complet *">
            <input required value={v.name} onChange={(e) => {
              setV((s) => ({ ...s, name: e.target.value, slug: s.id ? s.slug : slugify(e.target.value) }));
            }} className={inputCls} />
          </Field>
          <Field label="Slug URL">
            <input value={v.slug} onChange={(e) => set("slug", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Prénom">
            <input value={v.firstName} onChange={(e) => set("firstName", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Nom (pour floquage)">
            <input value={v.lastName} onChange={(e) => set("lastName", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Numéro">
            <input type="number" value={v.number ?? ""} onChange={(e) => set("number", e.target.value ? parseInt(e.target.value) : null)} className={inputCls} />
          </Field>
          <Field label="Poste">
            <input value={v.position} onChange={(e) => set("position", e.target.value)} className={inputCls} placeholder="Attaquant, Gardien…" />
          </Field>
          <Field label="Nationalité">
            <input value={v.nationality} onChange={(e) => set("nationality", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Type">
            <select value={v.era} onChange={(e) => set("era", e.target.value)} className={inputCls}>
              <option value="actuel">Effectif actuel</option>
              <option value="legende">Légende du club</option>
            </select>
          </Field>
          <Field label="Ordre d'affichage">
            <input type="number" value={v.position2} onChange={(e) => set("position2", parseInt(e.target.value) || 0)} className={inputCls} />
          </Field>
        </Grid>
      </Section>

      <Section title="Photo">
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
        {v.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={v.imageUrl} alt="" className="mt-3 h-40 rounded-lg object-cover" />
        )}
      </Section>

      <Section title="Biographie SEO">
        <p className="text-sm text-neutral-500 mb-2">300-500 mots, intègre le nom du joueur, son numéro, ses titres, et l&apos;intérêt SEO du maillot.</p>
        <textarea required value={v.bio} onChange={(e) => set("bio", e.target.value)} rows={10} className={inputCls} />
      </Section>

      <Section title="SEO">
        <Field label="Meta title">
          <input value={v.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} className={inputCls} placeholder="Maillot PSG Mbappé n°7. Floquage personnalisé." />
        </Field>
        <Field label="Meta description">
          <textarea rows={2} value={v.metaDesc} onChange={(e) => set("metaDesc", e.target.value)} className={inputCls} />
        </Field>
      </Section>

      <Section title="Statut">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={v.active} onChange={(e) => set("active", e.target.checked)} />
          <span>Visible sur la boutique</span>
        </label>
      </Section>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="flex gap-3 sticky bottom-0 bg-neutral-50 py-4 border-t border-neutral-200">
        <button disabled={saving} className="bg-psg-blue text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50">
          {saving ? "Enregistrement…" : v.id ? "Mettre à jour" : "Créer"}
        </button>
        {v.id && (
          <button type="button" onClick={remove} className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-lg">
            Supprimer
          </button>
        )}
      </div>
    </form>
  );
}

const inputCls = "w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-psg-blue text-sm";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-neutral-200 rounded-2xl p-6">
      <h2 className="font-semibold mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-3">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-neutral-600 mb-1">{label}</span>
      {children}
    </label>
  );
}

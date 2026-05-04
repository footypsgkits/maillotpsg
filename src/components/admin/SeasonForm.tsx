"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";

export type SeasonValues = {
  id?: string;
  label: string;
  slug: string;
  era: string;
  shirtMaker: string;
  description: string;
  metaTitle: string;
  metaDesc: string;
  imageUrl: string;
  active: boolean;
  position: number;
};

export const emptySeason: SeasonValues = {
  label: "",
  slug: "",
  era: "actuelle",
  shirtMaker: "",
  description: "",
  metaTitle: "",
  metaDesc: "",
  imageUrl: "",
  active: true,
  position: 0,
};

export function SeasonForm({ initial }: { initial: SeasonValues }) {
  const router = useRouter();
  const [v, setV] = useState<SeasonValues>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function set<K extends keyof SeasonValues>(k: K, val: SeasonValues[K]) {
    setV((s) => ({ ...s, [k]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    const payload = { ...v, slug: v.slug || slugify(v.label) };
    const res = await fetch(v.id ? `/api/admin/seasons/${v.id}` : "/api/admin/seasons", {
      method: v.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const j = await res.json();
      router.push(`/admin/seasons/${j.id}`);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Erreur");
    }
    setSaving(false);
  }

  async function remove() {
    if (!v.id || !confirm("Supprimer cette saison ?")) return;
    const res = await fetch(`/api/admin/seasons/${v.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/seasons");
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Libellé saison *">
            <input required value={v.label} onChange={(e) => {
              setV((s) => ({ ...s, label: e.target.value, slug: s.id ? s.slug : slugify(e.target.value) }));
            }} className={inputCls} placeholder="2025-2026" />
          </Field>
          <Field label="Slug URL">
            <input value={v.slug} onChange={(e) => set("slug", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Époque">
            <select value={v.era} onChange={(e) => set("era", e.target.value)} className={inputCls}>
              <option value="actuelle">Saison actuelle</option>
              <option value="recente">Saison récente</option>
              <option value="retro">Rétro / vintage</option>
            </select>
          </Field>
          <Field label="Équipementier">
            <input value={v.shirtMaker} onChange={(e) => set("shirtMaker", e.target.value)} className={inputCls} placeholder="(usage interne)" />
          </Field>
          <Field label="Ordre d'affichage">
            <input type="number" value={v.position} onChange={(e) => set("position", parseInt(e.target.value) || 0)} className={inputCls} />
          </Field>
        </div>
        <Field label="Description SEO (400-800 mots) *">
          <textarea required value={v.description} onChange={(e) => set("description", e.target.value)} rows={10} className={inputCls} />
        </Field>
        <Field label="Meta title">
          <input value={v.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Meta description">
          <textarea rows={2} value={v.metaDesc} onChange={(e) => set("metaDesc", e.target.value)} className={inputCls} />
        </Field>
        <label className="flex items-center gap-2 mt-2">
          <input type="checkbox" checked={v.active} onChange={(e) => set("active", e.target.checked)} />
          <span>Saison visible</span>
        </label>
      </section>

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-neutral-600 mb-1">{label}</span>
      {children}
    </label>
  );
}

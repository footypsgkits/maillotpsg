"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";

export type GuideValues = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDesc: string;
  keywords: string;
  imageUrl: string;
  published: boolean;
};

export const emptyGuide: GuideValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  metaTitle: "",
  metaDesc: "",
  keywords: "",
  imageUrl: "",
  published: true,
};

export function GuideForm({ initial }: { initial: GuideValues }) {
  const router = useRouter();
  const [v, setV] = useState<GuideValues>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function set<K extends keyof GuideValues>(k: K, val: GuideValues[K]) {
    setV((s) => ({ ...s, [k]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    const payload = { ...v, slug: v.slug || slugify(v.title) };
    const res = await fetch(v.id ? `/api/admin/guides/${v.id}` : "/api/admin/guides", {
      method: v.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const j = await res.json();
      router.push(`/admin/guides/${j.id}`);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Erreur");
    }
    setSaving(false);
  }

  async function remove() {
    if (!v.id || !confirm("Supprimer ce guide ?")) return;
    const res = await fetch(`/api/admin/guides/${v.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/guides");
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
        <Field label="Titre *">
          <input required value={v.title} onChange={(e) => {
            setV((s) => ({ ...s, title: e.target.value, slug: s.id ? s.slug : slugify(e.target.value) }));
          }} className={inputCls} />
        </Field>
        <Field label="Slug URL">
          <input value={v.slug} onChange={(e) => set("slug", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Résumé (1-2 phrases) *">
          <textarea required rows={2} value={v.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Contenu HTML (utilise <h2>, <p>, <ul>, <strong>) *">
          <textarea required rows={20} value={v.content} onChange={(e) => set("content", e.target.value)} className={`${inputCls} font-mono text-xs`} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Meta title">
            <input value={v.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Mots-clés">
            <input value={v.keywords} onChange={(e) => set("keywords", e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Meta description">
          <textarea rows={2} value={v.metaDesc} onChange={(e) => set("metaDesc", e.target.value)} className={inputCls} />
        </Field>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={v.published} onChange={(e) => set("published", e.target.checked)} />
          <span>Publié</span>
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

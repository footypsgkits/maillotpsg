"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";

type Cat = {
  id: string;
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDesc: string;
  position: number;
  productCount: number;
};

const empty = {
  name: "",
  slug: "",
  description: "",
  metaTitle: "",
  metaDesc: "",
  position: 0,
};

export function CategoriesAdmin({ initial }: { initial: Cat[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Omit<Cat, "id" | "productCount">>(empty);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...creating, slug: creating.slug || slugify(creating.name) }),
    });
    if (res.ok) {
      setCreating(empty);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Erreur");
    }
    setBusy(false);
  }

  async function save(id: string) {
    setBusy(true);
    setErr(null);
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edit),
    });
    if (res.ok) {
      setEditingId(null);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Erreur");
    }
    setBusy(false);
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette catégorie ?")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else {
      const j = await res.json().catch(() => ({}));
      alert(j.error ?? "Erreur");
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-3">
        <h2 className="font-semibold">Nouvelle catégorie</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            required
            placeholder="Nom (ex: Domicile)"
            value={creating.name}
            onChange={(e) => setCreating({ ...creating, name: e.target.value })}
            className={inputCls}
          />
          <input
            placeholder="Slug (ex: domicile)"
            value={creating.slug}
            onChange={(e) => setCreating({ ...creating, slug: e.target.value })}
            className={inputCls}
          />
          <input
            placeholder="Meta title (SEO)"
            value={creating.metaTitle}
            onChange={(e) => setCreating({ ...creating, metaTitle: e.target.value })}
            className={inputCls}
          />
          <input
            placeholder="Position (0, 1, 2…)"
            type="number"
            value={creating.position}
            onChange={(e) => setCreating({ ...creating, position: parseInt(e.target.value) || 0 })}
            className={inputCls}
          />
        </div>
        <textarea
          placeholder="Description (affichée en haut de la page catégorie)"
          rows={2}
          value={creating.description}
          onChange={(e) => setCreating({ ...creating, description: e.target.value })}
          className={inputCls}
        />
        <textarea
          placeholder="Meta description (SEO)"
          rows={2}
          value={creating.metaDesc}
          onChange={(e) => setCreating({ ...creating, metaDesc: e.target.value })}
          className={inputCls}
        />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button disabled={busy} className="bg-psg-blue text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
          {busy ? "Création…" : "Créer la catégorie"}
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Produits</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {initial.map((c) =>
              editingId === c.id ? (
                <tr key={c.id} className="border-t border-neutral-100 bg-blue-50/40">
                  <td className="px-4 py-3" colSpan={5}>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} className={inputCls} placeholder="Nom" />
                      <input value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} className={inputCls} placeholder="Slug" />
                      <input value={edit.metaTitle} onChange={(e) => setEdit({ ...edit, metaTitle: e.target.value })} className={inputCls} placeholder="Meta title" />
                      <input type="number" value={edit.position} onChange={(e) => setEdit({ ...edit, position: parseInt(e.target.value) || 0 })} className={inputCls} placeholder="Position" />
                    </div>
                    <textarea value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} className={`${inputCls} mt-3`} rows={2} placeholder="Description" />
                    <textarea value={edit.metaDesc} onChange={(e) => setEdit({ ...edit, metaDesc: e.target.value })} className={`${inputCls} mt-3`} rows={2} placeholder="Meta description" />
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => save(c.id)} className="bg-psg-blue text-white px-4 py-1.5 rounded-lg text-sm">Enregistrer</button>
                      <button onClick={() => setEditingId(null)} className="px-4 py-1.5 rounded-lg text-sm border">Annuler</button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={c.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-neutral-500">{c.slug}</td>
                  <td className="px-4 py-3">{c.position}</td>
                  <td className="px-4 py-3">{c.productCount}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setEdit({
                          name: c.name,
                          slug: c.slug,
                          description: c.description,
                          metaTitle: c.metaTitle,
                          metaDesc: c.metaDesc,
                          position: c.position,
                        });
                      }}
                      className="text-psg-blue hover:underline"
                    >
                      Modifier
                    </button>
                    <button onClick={() => remove(c.id)} className="text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ),
            )}
            {initial.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-neutral-500 py-10">Aucune catégorie.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputCls =
  "w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-psg-blue text-sm";

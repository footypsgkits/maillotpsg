"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ADULT_SIZES, KID_AGES, KIND_LABELS, GENDER_LABELS, slugify } from "@/lib/utils";

type Cat = { id: string; name: string };
type SizeRow = { label: string; kind: "adulte" | "enfant"; stock: number };
type ImageRow = { url: string; alt: string };

export type ProductFormValues = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  oldPrice: number | null;
  sku: string;
  stock: number;
  season: string;
  team: string;
  kind: string;
  gender: string;
  flockingAvailable: boolean;
  flockingPrice: number;
  metaTitle: string;
  metaDesc: string;
  keywords: string;
  active: boolean;
  featured: boolean;
  categoryId: string;
  sizes: SizeRow[];
  images: ImageRow[];
};

export function ProductForm({
  initial,
  categories,
}: {
  initial: ProductFormValues;
  categories: Cat[];
}) {
  const router = useRouter();
  const [v, setV] = useState<ProductFormValues>(() => ({
    ...initial,
    sizes: initial.sizes ?? [],
    images: initial.images ?? [],
  }));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof ProductFormValues>(key: K, val: ProductFormValues[K]) {
    setV((s) => ({ ...s, [key]: val }));
  }

  function toggleSize(label: string, kind: "adulte" | "enfant") {
    setV((s) => {
      const exists = s.sizes.find((x) => x.label === label && x.kind === kind);
      if (exists) {
        return { ...s, sizes: s.sizes.filter((x) => !(x.label === label && x.kind === kind)) };
      }
      return { ...s, sizes: [...s.sizes, { label, kind, stock: 10 }] };
    });
  }

  function setSizeStock(label: string, kind: "adulte" | "enfant", stock: number) {
    setV((s) => ({
      ...s,
      sizes: s.sizes.map((x) =>
        x.label === label && x.kind === kind ? { ...x, stock } : x,
      ),
    }));
  }

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const j = await res.json();
      setV((s) => ({
        ...s,
        images: [...s.images, ...j.urls.map((url: string) => ({ url, alt: "" }))],
      }));
    } else {
      setErr("Échec de l'upload de l'image.");
    }
    setUploading(false);
  }

  function removeImage(i: number) {
    setV((s) => ({ ...s, images: s.images.filter((_, idx) => idx !== i) }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    const payload = {
      ...v,
      slug: v.slug || slugify(v.name),
      sku: v.sku || null,
      oldPrice: v.oldPrice || null,
    };
    const res = await fetch(
      v.id ? `/api/admin/products/${v.id}` : "/api/admin/products",
      {
        method: v.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (res.ok) {
      const j = await res.json();
      router.push(`/admin/products/${j.id}`);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Erreur lors de l'enregistrement.");
    }
    setSaving(false);
  }

  async function deleteProduct() {
    if (!v.id) return;
    if (!confirm("Supprimer ce produit ?")) return;
    const res = await fetch(`/api/admin/products/${v.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <Section title="Informations">
        <Grid>
          <Field label="Nom du produit" required>
            <input
              required
              value={v.name}
              onChange={(e) => {
                const name = e.target.value;
                setV((s) => ({
                  ...s,
                  name,
                  slug: s.id ? s.slug : slugify(name),
                }));
              }}
              className={inputCls}
              placeholder="Maillot PSG Domicile 2025-2026"
            />
          </Field>
          <Field label="Slug (URL)">
            <input
              value={v.slug}
              onChange={(e) => set("slug", e.target.value)}
              className={inputCls}
              placeholder="maillot-psg-domicile-2025-2026"
            />
          </Field>
          <Field label="Catégorie" required>
            <select
              required
              value={v.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className={inputCls}
            >
              <option value="">— choisir —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Type">
            <select value={v.kind} onChange={(e) => set("kind", e.target.value)} className={inputCls}>
              {Object.entries(KIND_LABELS).map(([k, l]) => (
                <option key={k} value={k}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="Genre">
            <select value={v.gender} onChange={(e) => set("gender", e.target.value)} className={inputCls}>
              {Object.entries(GENDER_LABELS).map(([k, l]) => (
                <option key={k} value={k}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="Saison">
            <input
              value={v.season}
              onChange={(e) => set("season", e.target.value)}
              className={inputCls}
              placeholder="2025-2026"
            />
          </Field>
        </Grid>
        <Field label="Description courte (résumé en haut de fiche)">
          <textarea
            value={v.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
            className={inputCls}
            rows={2}
          />
        </Field>
        <Field label="Description complète" required>
          <textarea
            required
            value={v.description}
            onChange={(e) => set("description", e.target.value)}
            className={inputCls}
            rows={8}
            placeholder="Détails du maillot, technologie du tissu, écussons, partenaires, etc."
          />
        </Field>
      </Section>

      <Section title="Tarification & stock">
        <Grid>
          <Field label="Prix (€)" required>
            <input
              required
              type="number"
              step="0.01"
              value={v.price}
              onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
              className={inputCls}
            />
          </Field>
          <Field label="Ancien prix barré (€)">
            <input
              type="number"
              step="0.01"
              value={v.oldPrice ?? ""}
              onChange={(e) => set("oldPrice", e.target.value ? parseFloat(e.target.value) : null)}
              className={inputCls}
            />
          </Field>
          <Field label="SKU (référence interne)">
            <input value={v.sku} onChange={(e) => set("sku", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Stock global">
            <input
              type="number"
              value={v.stock}
              onChange={(e) => set("stock", parseInt(e.target.value) || 0)}
              className={inputCls}
            />
          </Field>
        </Grid>
      </Section>

      <Section title="Tailles disponibles">
        <p className="text-sm text-neutral-500 mb-3">
          Cochez les tailles disponibles. Le stock peut être ajusté individuellement.
        </p>
        <SizeGroup
          title="Adulte"
          options={ADULT_SIZES}
          kind="adulte"
          selected={v.sizes}
          onToggle={toggleSize}
          onStockChange={setSizeStock}
        />
        <div className="mt-4">
          <SizeGroup
            title="Enfant (en années)"
            options={KID_AGES}
            kind="enfant"
            selected={v.sizes}
            onToggle={toggleSize}
            onStockChange={setSizeStock}
          />
        </div>
      </Section>

      <Section title="Floquage personnalisé">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={v.flockingAvailable}
            onChange={(e) => set("flockingAvailable", e.target.checked)}
          />
          <span>Permettre le floquage (nom + numéro)</span>
        </label>
        {v.flockingAvailable && (
          <div className="mt-3 max-w-xs">
            <Field label="Prix du floquage (€)">
              <input
                type="number"
                step="0.01"
                value={v.flockingPrice}
                onChange={(e) => set("flockingPrice", parseFloat(e.target.value) || 0)}
                className={inputCls}
              />
            </Field>
          </div>
        )}
      </Section>

      <Section title="Images">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => uploadFiles(e.target.files)}
          className="block text-sm"
        />
        {uploading && <p className="text-sm text-neutral-500 mt-2">Envoi en cours…</p>}
        <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-3">
          {v.images.map((img, i) => (
            <div key={i} className="relative group">
              <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                <Image src={img.url} alt={img.alt || "Image produit"} width={200} height={200} className="object-cover w-full h-full" unoptimized />
              </div>
              <input
                value={img.alt}
                onChange={(e) =>
                  setV((s) => ({
                    ...s,
                    images: s.images.map((im, idx) => (idx === i ? { ...im, alt: e.target.value } : im)),
                  }))
                }
                placeholder="Texte alternatif"
                className="mt-1 w-full text-xs border border-neutral-200 rounded px-1.5 py-1"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="SEO">
        <Grid>
          <Field label="Meta title (60-65 char)">
            <input
              maxLength={120}
              value={v.metaTitle}
              onChange={(e) => set("metaTitle", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Mots-clés (virgule)">
            <input
              value={v.keywords}
              onChange={(e) => set("keywords", e.target.value)}
              className={inputCls}
              placeholder="maillot psg 2026, mbappé, dembele"
            />
          </Field>
        </Grid>
        <Field label="Meta description (150-160 char)">
          <textarea
            maxLength={300}
            rows={2}
            value={v.metaDesc}
            onChange={(e) => set("metaDesc", e.target.value)}
            className={inputCls}
          />
        </Field>
      </Section>

      <Section title="Statut">
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={v.active} onChange={(e) => set("active", e.target.checked)} />
            <span>Visible sur la boutique</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={v.featured} onChange={(e) => set("featured", e.target.checked)} />
            <span>Mettre en vedette sur la home</span>
          </label>
        </div>
      </Section>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="flex items-center gap-3 sticky bottom-0 bg-neutral-50 py-4 border-t border-neutral-200">
        <button
          disabled={saving}
          className="bg-psg-blue hover:bg-psg-dark text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : v.id ? "Mettre à jour" : "Créer le produit"}
        </button>
        {v.id && (
          <button
            type="button"
            onClick={deleteProduct}
            className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-lg"
          >
            Supprimer
          </button>
        )}
      </div>
    </form>
  );
}

const inputCls =
  "w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-psg-blue text-sm";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-neutral-200 rounded-2xl p-6">
      <h2 className="font-semibold mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-neutral-600 mb-1">
        {label}{required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

function SizeGroup({
  title,
  options,
  kind,
  selected,
  onToggle,
  onStockChange,
}: {
  title: string;
  options: string[];
  kind: "adulte" | "enfant";
  selected: SizeRow[];
  onToggle: (label: string, kind: "adulte" | "enfant") => void;
  onStockChange: (label: string, kind: "adulte" | "enfant", stock: number) => void;
}) {
  return (
    <div>
      <div className="text-sm font-medium mb-2">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((label) => {
          const sel = selected.find((s) => s.label === label && s.kind === kind);
          return (
            <div key={label} className={`border rounded-lg p-2 ${sel ? "border-psg-blue bg-blue-50" : "border-neutral-300 bg-white"}`}>
              <button
                type="button"
                onClick={() => onToggle(label, kind)}
                className="text-sm font-medium block"
              >
                {label}
              </button>
              {sel && (
                <input
                  type="number"
                  value={sel.stock}
                  onChange={(e) => onStockChange(label, kind, parseInt(e.target.value) || 0)}
                  className="mt-1 w-16 text-xs border border-neutral-300 rounded px-1.5 py-0.5"
                  placeholder="stock"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const emptyProduct: ProductFormValues = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  price: 0,
  oldPrice: null,
  sku: "",
  stock: 0,
  season: "2025-2026",
  team: "PSG",
  kind: "domicile",
  gender: "homme",
  flockingAvailable: true,
  flockingPrice: 15,
  metaTitle: "",
  metaDesc: "",
  keywords: "",
  active: true,
  featured: false,
  categoryId: "",
  sizes: [],
  images: [],
};

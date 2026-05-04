export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 90);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export const ADULT_SIZES = ["S", "M", "L", "XL", "XXL", "3XL"];
export const KID_AGES = ["2 ans", "3 ans", "4 ans", "5 ans", "6 ans", "7 ans", "8 ans", "9 ans", "10 ans", "11 ans", "12 ans", "13 ans"];

export const KIND_LABELS: Record<string, string> = {
  domicile: "Domicile",
  exterieur: "Extérieur",
  third: "Third",
  gardien: "Gardien",
  training: "Training",
  retro: "Rétro",
  "edition-speciale": "Édition spéciale",
};

export const GENDER_LABELS: Record<string, string> = {
  homme: "Homme",
  femme: "Femme",
  enfant: "Enfant",
};

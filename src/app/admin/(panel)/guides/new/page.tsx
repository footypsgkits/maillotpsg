import { GuideForm, emptyGuide } from "@/components/admin/GuideForm";

export default function NewGuidePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nouveau guide SEO</h1>
      <GuideForm initial={emptyGuide} />
    </div>
  );
}

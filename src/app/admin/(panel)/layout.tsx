import Link from "next/link";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh grid grid-cols-1 md:grid-cols-[260px_1fr] bg-neutral-50 text-neutral-900">
      <aside className="bg-neutral-950 text-white p-5 md:min-h-dvh">
        <Link href="/admin" className="font-black text-xl block mb-6">
          Maillot-PSG <span className="text-xs font-normal text-neutral-400">Admin</span>
        </Link>
        <nav className="space-y-1 text-sm">
          <NavLink href="/admin">Tableau de bord</NavLink>
          <div className="pt-3 pb-1 px-3 text-[10px] uppercase tracking-wider text-neutral-500">Boutique</div>
          <NavLink href="/admin/products">Produits</NavLink>
          <NavLink href="/admin/products/new">+ Nouveau produit</NavLink>
          <NavLink href="/admin/categories">Catégories</NavLink>
          <NavLink href="/admin/orders">Commandes</NavLink>
          <div className="pt-3 pb-1 px-3 text-[10px] uppercase tracking-wider text-neutral-500">Pages SEO</div>
          <NavLink href="/admin/players">Joueurs</NavLink>
          <NavLink href="/admin/seasons">Saisons</NavLink>
          <NavLink href="/admin/guides">Guides</NavLink>
        </nav>
        <div className="mt-8 pt-5 border-t border-white/10 text-sm space-y-2">
          <Link href="/" className="block text-neutral-400 hover:text-white">← Voir la boutique</Link>
          <LogoutButton />
        </div>
      </aside>
      <div className="p-6 md:p-8">{children}</div>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block px-3 py-2 rounded-lg hover:bg-white/10 transition">
      {children}
    </Link>
  );
}

function LogoutButton() {
  async function logout() {
    "use server";
    const { clearAdminCookie } = await import("@/lib/auth");
    const { redirect } = await import("next/navigation");
    await clearAdminCookie();
    redirect("/admin/login");
  }
  return (
    <form action={logout}>
      <button className="text-sm text-neutral-400 hover:text-red-400">Se déconnecter</button>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/maillots/domicile", label: "Domicile" },
  { href: "/maillots/exterieur", label: "Extérieur" },
  { href: "/maillots/third", label: "Third" },
  { href: "/maillots/enfant", label: "Enfant" },
  { href: "/maillots/retro", label: "Rétro" },
  { href: "/maillots/speciale", label: "Spéciale" },
];

const SECONDARY_LINKS = [
  { href: "/saison", label: "Toutes les saisons" },
  { href: "/joueur", label: "Tous les joueurs" },
  { href: "/guide", label: "Guides & conseils" },
  { href: "/guide/tailles", label: "Guide des tailles" },
  { href: "/contact", label: "Contact" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex items-center justify-center h-10 w-10 -ml-2 text-neutral-900 hover:text-psg-red"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setOpen(false)}
        />
        <aside
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
          className={`absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-xl flex flex-col transition-transform duration-200 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 h-14 border-b border-neutral-200">
            <span className="text-sm font-semibold uppercase tracking-[0.15em]">Menu</span>
            <button
              type="button"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center h-10 w-10 -mr-2 text-neutral-900 hover:text-psg-red"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-3">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-3 py-3 text-base font-semibold text-neutral-900 rounded-md hover:bg-neutral-100 hover:text-psg-red"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 mx-3 border-t border-neutral-200" />
            <ul className="flex flex-col mt-2">
              {SECONDARY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-3 py-2.5 text-sm text-neutral-700 rounded-md hover:bg-neutral-100 hover:text-psg-red"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
}

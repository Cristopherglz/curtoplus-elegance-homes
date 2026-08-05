import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";
import { SITE } from "@/lib/site";
import { useSession } from "@/hooks/use-session";

const NAV = [
  { to: "/", label: "Inicio" },
  { to: "/propiedades", label: "Propiedades" },
  { to: "/servicios", label: "Servicios" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 lg:px-8">
        <Logo />

        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="mr-2 hidden items-center gap-1 rounded-full bg-secondary/70 p-1.5 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-navy"
                activeProps={{ className: "bg-card text-navy shadow-[var(--shadow-soft)]" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a
            href={`tel:${SITE.phoneTel}`}
            className="hidden items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground transition-colors hover:bg-navy-deep md:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" />
            {SITE.phoneDisplay}
          </a>

          {session && (
            <Link
              to="/admin"
              aria-label="Panel de administración"
              title="Panel de administración"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent"
            >
              <ShieldCheck className="h-4.5 w-4.5" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary/70 text-navy lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>


      {open && (
        <nav className="border-t border-border bg-background px-5 pb-6 pt-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block border-b border-border/60 py-3 font-display text-xl text-navy"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={`tel:${SITE.phoneTel}`}
            className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
          </a>
        </nav>
      )}
    </header>
  );
}

import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="surface-navy mt-24 rounded-t-[2rem]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <div className="inline-flex">
            <Logo tone="light" />
          </div>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-navy-foreground/70">
            Más de 20 años acompañando a familias e inversores de Misiones y el NEA con
            asesoramiento discreto, documentación al día y operaciones garantizadas.
          </p>
        </div>


        <div>
          <p className="eyebrow text-[0.6rem] text-gold">Navegación</p>
          <ul className="mt-5 space-y-3 text-sm text-navy-foreground/75">
            {[
              { to: "/propiedades", label: "Propiedades" },
              { to: "/servicios", label: "Servicios" },
              { to: "/nosotros", label: "Nosotros" },
              { to: "/contacto", label: "Contacto" },
            ].map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-[0.6rem] text-gold">Contacto</p>
          <ul className="mt-5 space-y-4 text-sm text-navy-foreground/75">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-gold">
                {SITE.address}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`tel:${SITE.phoneTel}`} className="hover:text-gold">
                {SITE.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`mailto:${SITE.email}`} className="break-all hover:text-gold">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-navy-foreground/50 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Curto &amp; De Oliveira. Todos los derechos reservados.</p>
          <p>Posadas · Misiones · Argentina</p>
        </div>
      </div>
    </footer>
  );
}

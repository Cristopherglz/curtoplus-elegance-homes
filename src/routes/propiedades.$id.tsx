import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Bath, BedDouble, Car, Maximize, MapPin, Ruler } from "lucide-react";
import {
  fetchProperty,
  imageUrl,
  labelOf,
  OPERATIONS,
  priceLines,
  PROPERTY_TYPES,
  STATUSES,
} from "@/lib/properties";
import { SITE, waLink } from "@/lib/site";

export const Route = createFileRoute("/propiedades/$id")({
  head: () => ({
    meta: [
      { title: "Detalle de la propiedad | Curto & De Oliveira" },
      {
        name: "description",
        content:
          "Fotos, características, ubicación y precio de la propiedad. Consultá con Curto & De Oliveira Negocios Inmobiliarios en Posadas, Misiones.",
      },
      { property: "og:title", content: "Detalle de la propiedad | Curto & De Oliveira" },
      {
        property: "og:description",
        content: "Fotos, características y precio de la propiedad en Posadas, Misiones.",
      },
    ],
  }),
  component: Detalle,
});

function Detalle() {
  const { id } = Route.useParams();
  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: () => fetchProperty(id),
  });
  const [active, setActive] = useState(0);

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-5 py-32 text-sm text-muted-foreground">Cargando…</div>;
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-32 text-center">
        <h1 className="font-display text-4xl text-navy">Propiedad no disponible</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Es posible que ya se haya vendido o alquilado.
        </p>
        <Link to="/propiedades" className="mt-8 inline-block border border-navy px-6 py-3 text-sm text-navy">
          Ver otras propiedades
        </Link>
      </div>
    );
  }

  const images = property.images?.length ? property.images : [];
  const specs = [
    property.bedrooms ? { icon: BedDouble, label: `${property.bedrooms} dormitorios` } : null,
    property.bathrooms ? { icon: Bath, label: `${property.bathrooms} baños` } : null,
    property.area_m2 ? { icon: Maximize, label: `${property.area_m2} m² cubiertos` } : null,
    property.lot_m2 ? { icon: Ruler, label: `${property.lot_m2} m² de terreno` } : null,
    property.garage ? { icon: Car, label: "Cochera" } : null,
  ].filter(Boolean) as { icon: typeof BedDouble; label: string }[];

  return (
    <article className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <Link
        to="/propiedades"
        className="inline-flex items-center gap-2 text-xs tracking-wide text-muted-foreground transition-colors hover:text-navy"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Volver al catálogo
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
            {images.length ? (
              <img
                src={imageUrl(images[active])}
                alt={property.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center font-display text-4xl text-muted-foreground">
                C&amp;D
              </div>
            )}
            <span className="absolute left-4 top-4 bg-background/90 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-navy">
              {labelOf(OPERATIONS, property.operation)}
            </span>
            {property.status !== "disponible" && (
              <span className="absolute right-4 top-4 bg-navy px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-navy-foreground">
                {labelOf(STATUSES, property.status)}
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-3">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`aspect-[4/3] overflow-hidden border transition-opacity ${
                    i === active ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imageUrl(img)}
                    alt={`${property.title} — foto ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="mt-12">
            <p className="eyebrow text-accent">
              {labelOf(PROPERTY_TYPES, property.property_type)}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-navy sm:text-5xl">
              {property.title}
            </h1>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-gold" />
              {[property.address, property.neighborhood, property.city, property.province]
                .filter(Boolean)
                .join(", ")}
            </p>

            {specs.length > 0 && (
              <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-3">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center gap-3 bg-card px-5 py-4">
                    <spec.icon className="h-4 w-4 shrink-0 text-gold" />
                    <span className="text-sm text-navy">{spec.label}</span>
                  </div>
                ))}
              </div>
            )}

            {property.description && (
              <div className="mt-12">
                <h2 className="hairline font-display text-3xl text-navy">Descripción</h2>
                <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                  {property.description}
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
            {priceLines(property).map((line) => (
              <div key={line.label} className="mb-5 last:mb-0">
                <p className="eyebrow text-[0.55rem] text-muted-foreground">{line.label}</p>
                <p className="mt-1 font-display text-3xl text-navy">{line.value}</p>
              </div>
            ))}

            <div className="mt-8 space-y-3">
              <a
                href={waLink(
                  `Hola! Me interesa la propiedad "${property.title}". ¿Podrían darme más información?`,
                )}
                target="_blank"
                rel="noreferrer"
                className="block bg-navy px-6 py-4 text-center text-sm tracking-wide text-navy-foreground transition-colors hover:bg-navy-deep"
              >
                Consultar por WhatsApp
              </a>
              <a
                href={`tel:${SITE.phoneTel}`}
                className="block border border-navy/25 px-6 py-4 text-center text-sm tracking-wide text-navy transition-colors hover:bg-ivory"
              >
                Llamar {SITE.phoneDisplay}
              </a>
              <a
                href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Consulta: ${property.title}`)}`}
                className="block px-6 py-2 text-center text-xs text-muted-foreground transition-colors hover:text-navy"
              >
                {SITE.email}
              </a>
            </div>

            <p className="mt-8 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
              Atención personalizada en {SITE.address}. Coordinamos visitas de lunes a viernes de 9
              a 18 h y sábados de 9 a 13 h.
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}

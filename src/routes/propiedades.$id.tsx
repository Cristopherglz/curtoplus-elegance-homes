import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Car,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Maximize,
  MapPin,
  Ruler,
  Share2,
  X,
} from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import {
  fetchProperty,
  fetchPublicProperties,
  fullAddress,
  imageUrl,
  labelOf,
  mapsUrl,
  OPERATIONS,
  priceLines,
  PROPERTY_TYPES,
  STATUSES,
} from "@/lib/properties";
import { SITE, waLink } from "@/lib/site";
import { KeyLoader, KeySpinner } from "@/components/site/KeyLoader";


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
  const { data: all } = useQuery({
    queryKey: ["properties", "public"],
    queryFn: fetchPublicProperties,
  });
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const markLoaded = (src: string) => setLoaded((prev) => ({ ...prev, [src]: true }));
  const touchStart = useRef<number | null>(null);


  useEffect(() => {
    setActive(0);
    setLightbox(false);
  }, [id]);

  const images = property?.images?.length ? property.images : [];
  const go = (delta: number) => {
    if (!images.length) return;
    setActive((i) => (i + delta + images.length) % images.length);
  };

  // Precargamos todas las fotos (y la siguiente en alta) para que el cambio sea instantáneo.
  useEffect(() => {
    if (!images.length) return;
    images.forEach((img) => {
      const pre = new Image();
      pre.src = imageUrl(img, 1200);
    });
  }, [images.join("|")]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (isLoading) {
    return <KeyLoader message="Cargando propiedad…" />;
  }


  if (!property) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-32 text-center">
        <h1 className="font-display text-4xl text-navy">Propiedad no disponible</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Es posible que ya se haya vendido o alquilado.
        </p>
        <Link
          to="/propiedades"
          className="mt-8 inline-block rounded-full border border-navy px-6 py-3 text-sm text-navy"
        >
          Ver otras propiedades
        </Link>
      </div>
    );
  }

  const garageLabel = property.garage
    ? property.garage_spaces && property.garage_spaces > 1
      ? `Cochera para ${property.garage_spaces} autos`
      : property.garage_spaces === 1
        ? "Cochera para 1 auto"
        : "Cochera"
    : null;

  const specs = [
    property.bedrooms ? { icon: BedDouble, label: `${property.bedrooms} dormitorios` } : null,
    property.bathrooms ? { icon: Bath, label: `${property.bathrooms} baños` } : null,
    property.area_m2 ? { icon: Maximize, label: `${property.area_m2} m² cubiertos` } : null,
    property.lot_m2 ? { icon: Ruler, label: `${property.lot_m2} m² de terreno` } : null,
    garageLabel ? { icon: Car, label: garageLabel } : null,
    property.mortgage_eligible ? { icon: Landmark, label: "Apto crédito hipotecario" } : null,
  ].filter(Boolean) as { icon: typeof BedDouble; label: string }[];

  const similar = (all ?? [])
    .filter((p) => p.id !== property.id && p.property_type === property.property_type)
    .slice(0, 3);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <article className="mx-auto w-full max-w-7xl overflow-x-hidden px-4 py-8 sm:px-5 sm:py-12 lg:px-8">
      <Link
        to="/propiedades"
        className="inline-flex items-center gap-2 text-xs tracking-wide text-muted-foreground transition-colors hover:text-navy"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Volver al catálogo
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div
            className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-secondary"
            onTouchStart={(e) => {
              touchStart.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStart.current === null) return;
              const dx = e.changedTouches[0].clientX - touchStart.current;
              if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
              touchStart.current = null;
            }}
          >
            {images.length ? (
              <button
                type="button"
                onClick={() => setLightbox(true)}
                aria-label="Ver imagen completa"
                className="h-full w-full cursor-zoom-in"
              >
                <img
                  src={imageUrl(images[active], 1200)}
                  srcSet={`${imageUrl(images[active], 800)} 800w, ${imageUrl(images[active], 1200)} 1200w, ${imageUrl(images[active], 1600)} 1600w`}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  alt={property.title}
                  fetchPriority="high"
                  decoding="async"
                  onLoad={() => markLoaded(images[active])}
                  onError={() => markLoaded(images[active])}
                  className={`h-full w-full object-cover transition-opacity duration-300 ${
                    loaded[images[active]] ? "opacity-100" : "opacity-0"
                  }`}
                />
                {!loaded[images[active]] && (
                  <div className="absolute inset-0">
                    <KeySpinner className="h-16 w-16" />
                  </div>
                )}
              </button>
            ) : (

              <div className="grid h-full place-items-center font-display text-4xl text-muted-foreground">
                C&amp;D
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Foto anterior"
                  className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-navy shadow-md transition-colors hover:bg-background"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Foto siguiente"
                  className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-navy shadow-md transition-colors hover:bg-background"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <span className="absolute bottom-4 right-4 rounded-full bg-background/85 px-3 py-1 text-[0.7rem] text-navy">
                  {active + 1} / {images.length}
                </span>
              </>
            )}

            <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-navy">
              {labelOf(OPERATIONS, property.operation)}
            </span>
            {property.status !== "disponible" && (
              <span className="absolute right-4 top-4 rounded-full bg-navy px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-navy-foreground">
                {labelOf(STATUSES, property.status)}
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`aspect-[4/3] w-28 shrink-0 snap-start overflow-hidden rounded-xl border-2 transition-opacity ${
                    i === active ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imageUrl(img, 240)}
                    alt={`${property.title} — foto ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />

                </button>
              ))}
            </div>
          )}

          <div className="mt-12">
            <p className="eyebrow text-accent">{labelOf(PROPERTY_TYPES, property.property_type)}</p>
            <h1 className="mt-3 font-display text-3xl leading-tight text-navy sm:text-4xl lg:text-5xl">
              {property.title}
            </h1>

            <a
              href={mapsUrl(property)}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-navy/20 px-5 py-3 text-sm text-navy transition-colors hover:bg-ivory"
            >
              <MapPin className="h-4 w-4 shrink-0 text-gold" />
              Ver en Google Maps
            </a>
            <p className="mt-3 text-sm text-muted-foreground">{fullAddress(property)}</p>

            {specs.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
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
          <div className="rounded-[1.5rem] border border-border bg-card p-6 sm:p-8 shadow-[var(--shadow-soft)]">
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
                className="block rounded-full bg-navy px-6 py-4 text-center text-sm tracking-wide text-navy-foreground transition-colors hover:bg-navy-deep"
              >
                Consultar por WhatsApp
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${property.title} — Curto & De Oliveira\n${shareUrl}`,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-navy/25 px-6 py-4 text-center text-sm tracking-wide text-navy transition-colors hover:bg-ivory"
              >
                <Share2 className="h-4 w-4" /> Compartir por WhatsApp
              </a>
              <a
                href={`tel:${SITE.phoneTel}`}
                className="block rounded-full border border-navy/25 px-6 py-4 text-center text-sm tracking-wide text-navy transition-colors hover:bg-ivory"
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

      {similar.length > 0 && (
        <section className="mt-24">
          <h2 className="hairline font-display text-3xl text-navy">Propiedades similares</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

      {lightbox && images.length > 0 && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/95 p-4"
          onClick={() => setLightbox(false)}
          onTouchStart={(e) => {
            touchStart.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStart.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
            touchStart.current = null;
          }}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setLightbox(false)}
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-background/90 text-navy"
          >
            <X className="h-5 w-5" />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Foto anterior"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-navy"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                aria-label="Foto siguiente"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-navy"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <img
            src={imageUrl(images[active], 1600)}
            alt={`${property.title} — foto ${active + 1}`}
            onClick={(e) => e.stopPropagation()}
            decoding="async"
            className="max-h-[88vh] max-w-full rounded-xl object-contain"
          />

          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-background/90 px-4 py-1 text-xs text-navy">
            {active + 1} / {images.length}
          </span>
        </div>
      )}
    </article>
  );
}

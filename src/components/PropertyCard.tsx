import { Link } from "@tanstack/react-router";
import { BedDouble, Bath, Maximize, MapPin } from "lucide-react";
import {
  imageUrl,
  labelOf,
  OPERATIONS,
  priceLines,
  PROPERTY_TYPES,
  type Property,
} from "@/lib/properties";

function StatusTag({ status }: { status: string }) {
  if (status === "disponible") return null;
  const map: Record<string, string> = {
    vendido: "Vendido",
    alquilado: "Alquilado",
    reservado: "Reservado",
  };
  return (
    <span className="absolute right-4 top-4 rounded-full bg-navy px-3 py-1 text-[0.65rem] font-medium text-navy-foreground">
      {map[status] ?? status}
    </span>
  );
}

export function PropertyCard({ property }: { property: Property }) {
  const cover = property.images?.[0];
  const lines = priceLines(property);

  return (
    <Link
      to="/propiedades/$id"
      params={{ id: property.id }}
      className="lift group block overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-[var(--shadow-soft)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
        {cover ? (
          <img
            src={imageUrl(cover)}
            alt={property.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center font-display text-2xl text-muted-foreground">
            C&amp;D
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1 text-[0.65rem] font-medium text-navy">
          {labelOf(OPERATIONS, property.operation)}
        </span>
        <StatusTag status={property.status} />
        {property.mortgage_eligible && (
          <span className="absolute bottom-4 left-4 rounded-full bg-accent px-3 py-1 text-[0.65rem] font-medium text-accent-foreground">
            Apto crédito hipotecario
          </span>
        )}
      </div>


      <div className="p-6">
        <p className="eyebrow text-[0.6rem] text-accent">
          {labelOf(PROPERTY_TYPES, property.property_type)}
        </p>
        <h3 className="mt-2 line-clamp-2 font-display text-2xl leading-snug text-navy">
          {property.title}
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {[property.neighborhood, property.city].filter(Boolean).join(", ")}
          </span>
        </p>

        <div className="mt-5 space-y-1 border-t border-border pt-4">
          {lines.map((line) => (
            <p key={line.label} className="flex items-baseline justify-between gap-3">
              <span className="eyebrow text-[0.55rem] text-muted-foreground">{line.label}</span>
              <span className="font-display text-xl text-navy">{line.value}</span>
            </p>
          ))}
        </div>

        {(property.bedrooms || property.bathrooms || property.lot_m2 || property.area_m2) && (
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            {!!property.bedrooms && (
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-3.5 w-3.5" /> {property.bedrooms} dorm.
              </span>
            )}
            {!!property.bathrooms && (
              <span className="flex items-center gap-1.5">
                <Bath className="h-3.5 w-3.5" /> {property.bathrooms} baños
              </span>
            )}
            {!!(property.lot_m2 ?? property.area_m2) && (
              <span className="flex items-center gap-1.5">
                <Maximize className="h-3.5 w-3.5" /> {property.lot_m2 ?? property.area_m2} m² totales
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

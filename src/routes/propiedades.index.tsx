import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { fetchPublicProperties, OPERATIONS, PROPERTY_TYPES } from "@/lib/properties";

export const Route = createFileRoute("/propiedades/")({
  head: () => ({
    meta: [
      { title: "Propiedades en venta y alquiler en Posadas | Curto & De Oliveira" },
      {
        name: "description",
        content:
          "Catálogo de casas, departamentos, terrenos, locales y galpones en venta y alquiler en Posadas y Misiones. Buscá por operación, tipo y precio.",
      },
      { property: "og:title", content: "Catálogo de propiedades | Curto & De Oliveira" },
      {
        property: "og:description",
        content: "Casas, departamentos, terrenos y locales en Posadas y toda Misiones.",
      },
    ],
  }),
  component: Propiedades,
});

function Propiedades() {
  const { data, isLoading } = useQuery({
    queryKey: ["properties", "public"],
    queryFn: fetchPublicProperties,
  });

  const [q, setQ] = useState("");
  const [operation, setOperation] = useState("todas");
  const [type, setType] = useState("todos");
  const [order, setOrder] = useState("recientes");
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    setLimit(20);
  }, [q, operation, type, order]);

  const results = useMemo(() => {
    let list = [...(data ?? [])];
    if (operation !== "todas") list = list.filter((p) => p.operation === operation);
    if (type !== "todos") list = list.filter((p) => p.property_type === type);
    if (q.trim()) {
      const term = q.toLowerCase();
      list = list.filter((p) =>
        [p.title, p.description, p.neighborhood, p.address, p.city]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(term)),
      );
    }
    const price = (p: (typeof list)[number]) =>
      p.sale_price_usd ?? p.rent_price_usd ?? p.sale_price_ars ?? p.rent_price_ars ?? 0;
    if (order === "menor") list.sort((a, b) => price(a) - price(b));
    if (order === "mayor") list.sort((a, b) => price(b) - price(a));
    return list;
  }, [data, operation, type, q, order]);

  const selectClass =
    "w-full appearance-none border border-border bg-card px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-accent";

  return (
    <>
      <section className="surface-navy">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <p className="eyebrow text-gold">Cartera completa</p>
          <h1 className="mt-4 font-display text-5xl text-navy-foreground sm:text-6xl">
            Propiedades
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-navy-foreground/75">
            Inmuebles verificados en Posadas, Garupá, Candelaria y toda la provincia. Filtrá por
            operación y tipo para encontrar exactamente lo que buscás.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-ivory">
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por barrio, zona o palabra clave…"
                aria-label="Buscar propiedades"
                className="w-full border border-border bg-card py-3 pl-11 pr-4 text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
              />
            </div>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              aria-label="Operación"
              className={selectClass}
            >
              <option value="todas">Todas las operaciones</option>
              {OPERATIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-label="Tipo de propiedad"
              className={selectClass}
            >
              <option value="todos">Todos los tipos</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              aria-label="Ordenar"
              className={selectClass}
            >
              <option value="recientes">Más recientes</option>
              <option value="menor">Menor precio</option>
              <option value="mayor">Mayor precio</option>
            </select>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {isLoading ? "Cargando propiedades…" : `${results.length} propiedades encontradas`}
        </p>

        {results.length > 0 ? (
          <>
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {results.slice(0, limit).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            {results.length > limit && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setLimit((n) => n + 20)}
                  className="rounded-full bg-navy px-10 py-4 text-sm tracking-wide text-navy-foreground transition-colors hover:bg-navy-deep"
                >
                  Ver más propiedades
                </button>
              </div>
            )}
          </>
        ) : (
          !isLoading && (
            <div className="mt-16 border border-dashed border-border p-14 text-center">
              <h2 className="font-display text-3xl text-navy">Sin resultados por ahora</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Probá ampliando los filtros o escribinos: muchas de nuestras oportunidades se
                ofrecen primero de forma privada.
              </p>
            </div>
          )
        )}
      </section>
    </>
  );
}

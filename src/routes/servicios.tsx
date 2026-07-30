import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, ClipboardCheck, KeyRound, TrendingUp } from "lucide-react";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios: tasaciones, ventas, alquileres y administración | Curto & De Oliveira" },
      {
        name: "description",
        content:
          "Tasaciones profesionales, venta y compra de inmuebles, alquileres permanentes y temporales, y administración integral de alquileres en Posadas, Misiones.",
      },
      { property: "og:title", content: "Servicios inmobiliarios en Posadas | Curto & De Oliveira" },
      {
        property: "og:description",
        content:
          "Tasaciones, ventas, alquileres y administración de alquileres con más de 20 años de experiencia.",
      },
    ],
  }),
  component: Servicios,
});

const SERVICIOS = [
  {
    icon: ClipboardCheck,
    title: "Tasaciones",
    lead: "Saber cuánto vale es el primer paso para decidir bien.",
    text: "Analizamos ubicación, estado, superficie, valores comparables de la zona y tendencia del mercado. Entregamos un informe claro que sirve tanto para vender como para negociar, heredar o invertir.",
    items: [
      "Visita e inspección del inmueble",
      "Análisis comparativo de mercado",
      "Informe escrito con rango de valor",
      "Recomendaciones para valorizar la propiedad",
    ],
  },
  {
    icon: TrendingUp,
    title: "Ventas",
    lead: "Del aviso a la escritura, sin sobresaltos.",
    text: "Preparamos la propiedad, la fotografiamos con calidad profesional y la difundimos en los portales líderes. Filtramos consultas, acompañamos las visitas y negociamos para que el precio final sea el mejor posible.",
    items: [
      "Estrategia y precio de salida",
      "Fotografía y publicación profesional",
      "Verificación de documentación",
      "Acompañamiento hasta la escritura",
    ],
  },
  {
    icon: KeyRound,
    title: "Alquileres y alquiler temporal",
    lead: "Contratos sólidos y buenos inquilinos.",
    text: "Publicamos, seleccionamos y verificamos a cada interesado. Redactamos contratos claros, gestionamos garantías y coordinamos el ingreso con inventario y estado del inmueble documentado.",
    items: [
      "Selección y verificación de inquilinos",
      "Contratos permanentes y temporales",
      "Gestión de garantías y seguros de caución",
      "Inventario e inspección de ingreso",
    ],
  },
  {
    icon: Building2,
    title: "Administración de alquileres",
    lead: "Su renta, sin llamados a las 11 de la noche.",
    text: "Nos ocupamos de todo el ciclo mensual: cobranza, rendición, control de impuestos y expensas, mantenimiento, inspecciones periódicas y renovaciones o actualizaciones según la ley vigente.",
    items: [
      "Cobranza y rendición mensual",
      "Control de impuestos, servicios y expensas",
      "Coordinación de reparaciones",
      "Renovaciones y actualizaciones de valor",
    ],
  },
];

function Servicios() {
  return (
    <>
      <section className="surface-navy">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <p className="eyebrow text-gold">Servicios</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl leading-tight text-navy-foreground sm:text-6xl">
            Pensados para que decidas con información
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-navy-foreground/75">
            No vendemos apuro: acompañamos procesos. Cada servicio está diseñado para que la
            operación sea segura, transparente y con el mejor resultado posible.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid gap-px border border-border bg-border lg:grid-cols-2">
          {SERVICIOS.map((servicio) => (
            <article key={servicio.title} className="bg-card p-10 lg:p-12">
              <servicio.icon className="h-7 w-7 text-gold" />
              <h2 className="mt-7 font-display text-3xl text-navy">{servicio.title}</h2>
              <p className="mt-3 font-display text-xl italic text-accent">{servicio.lead}</p>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{servicio.text}</p>
              <ul className="mt-7 space-y-2.5 text-sm text-navy">
                {servicio.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2.5 h-px w-4 shrink-0 bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={waLink(`Hola! Quisiera consultar por el servicio de ${servicio.title}.`)}
                target="_blank"
                rel="noreferrer"
                className="mt-9 inline-block border border-navy/25 px-6 py-3 text-sm tracking-wide text-navy transition-colors hover:bg-navy hover:text-navy-foreground"
              >
                Consultar
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-ivory">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center lg:px-8">
          <h2 className="font-display text-4xl text-navy sm:text-5xl">
            ¿No sabés por dónde empezar?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Contanos tu situación y te decimos con franqueza cuál es el camino más conveniente,
            incluso si la respuesta es esperar.
          </p>
          <Link
            to="/contacto"
            className="mt-9 inline-block bg-navy px-9 py-4 text-sm tracking-wide text-navy-foreground transition-colors hover:bg-navy-deep"
          >
            Hablemos
          </Link>
        </div>
      </section>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  KeyRound,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import posadasImg from "@/assets/posadas.jpg";
import { PropertyCard } from "@/components/PropertyCard";
import { fetchPublicProperties } from "@/lib/properties";
import { SITE, waLink } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Curto & De Oliveira | Inmobiliaria en Posadas, Misiones" },
      {
        name: "description",
        content:
          "Venta, alquiler, alquiler temporal, tasaciones y administración de alquileres en Posadas y toda Misiones. Más de 20 años de trayectoria.",
      },
      { property: "og:title", content: "Curto & De Oliveira | Inmobiliaria en Posadas, Misiones" },
      {
        property: "og:description",
        content:
          "Venta, alquiler, alquiler temporal, tasaciones y administración de alquileres en Posadas y toda Misiones. Más de 20 años de trayectoria.",
      },
    ],
  }),
  component: Home,
});

const SERVICIOS = [
  {
    icon: TrendingUp,
    title: "Venta de propiedades",
    text: "Estrategia de comercialización, fotografía profesional y difusión en los principales portales para encontrar al comprador correcto.",
  },
  {
    icon: KeyRound,
    title: "Alquileres",
    text: "Contratos personalizados, verificación de inquilinos y gestión de garantías. Alquileres permanentes y temporales.",
  },
  {
    icon: ClipboardCheck,
    title: "Tasaciones",
    text: "Valuación profesional basada en datos reales del mercado de Posadas y zona, con informe detallado y sin cargo inicial.",
  },
  {
    icon: Building2,
    title: "Administración de alquileres",
    text: "Cobranza mensual, seguimiento de expensas e impuestos, inspecciones y renovaciones. Su renta, sin preocupaciones.",
  },
];

function Home() {
  const { data: properties } = useQuery({
    queryKey: ["properties", "public"],
    queryFn: fetchPublicProperties,
  });

  const destacadas = (properties ?? []).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <img
          src={heroImg}
          alt="Residencia contemporánea de categoría al atardecer en Posadas, Misiones"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="veil absolute inset-0" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-20 pt-32 lg:px-8">
          <p className="eyebrow text-gold">Posadas · Misiones · Argentina</p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] text-navy-foreground sm:text-6xl lg:text-7xl">
            Propiedades que merecen
            <span className="block italic text-gold-soft">una decisión bien tomada.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-navy-foreground/80">
            Más de 20 años seleccionando inmuebles, cuidando cada documento y acompañando cada
            firma. Compre, venda o alquile con la tranquilidad de estar bien asesorado.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/propiedades"
              className="group inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-sm font-medium text-navy-deep transition-colors hover:bg-gold-soft"
            >
              Ver propiedades
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={waLink("Hola! Quisiera hacer una consulta inmobiliaria.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-navy-foreground/40 px-8 py-4 text-sm font-medium text-navy-foreground transition-colors hover:bg-navy-foreground hover:text-navy"
            >
              Hablar con un asesor
            </a>
          </div>

        </div>
      </section>

      {/* Marca de confianza */}
      <section className="border-b border-border bg-ivory">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-3 lg:px-8">
          {[
            { icon: ShieldCheck, label: "Documentación al día" },
            { icon: Sparkles, label: "Cartera seleccionada" },
            { icon: ClipboardCheck, label: "Operaciones garantizadas" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon className="h-5 w-5 shrink-0 text-gold" />
              <span className="eyebrow text-[0.62rem] text-navy">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Servicios */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow text-accent">Nuestros servicios</p>
          <h2 className="hairline mt-4 font-display text-4xl text-navy sm:text-5xl">
            Un servicio integral, de principio a fin
          </h2>
          <p className="mt-8 text-base leading-relaxed text-muted-foreground">
            Trabajamos con pocas operaciones a la vez y con mucha dedicación en cada una. Esa es la
            diferencia entre publicar una propiedad y realmente venderla.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {SERVICIOS.map((servicio) => (
            <article
              key={servicio.title}
              className="group rounded-3xl border border-border bg-card p-9 transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary">
                <servicio.icon className="h-6 w-6 text-accent" />
              </span>
              <h3 className="mt-6 font-display text-2xl text-navy">{servicio.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{servicio.text}</p>
            </article>
          ))}
        </div>


        <Link
          to="/servicios"
          className="group mt-10 inline-flex items-center gap-3 text-sm tracking-wide text-navy"
        >
          Conocer todos los servicios
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

      {/* Propiedades destacadas */}
      <section className="surface-navy mx-auto max-w-[95rem] rounded-[2rem] py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              <p className="eyebrow text-gold">Cartera</p>
              <h2 className="mt-4 font-display text-4xl text-navy-foreground sm:text-5xl">
                Propiedades destacadas
              </h2>
            </div>
            <Link
              to="/propiedades"
              className="group inline-flex items-center gap-3 rounded-full border border-navy-foreground/30 px-6 py-3 text-sm font-medium text-navy-foreground transition-colors hover:bg-navy-foreground hover:text-navy"
            >
              Ver catálogo completo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>


          {destacadas.length > 0 ? (
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {destacadas.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <p className="mt-14 max-w-lg text-sm leading-relaxed text-navy-foreground/70">
              Estamos actualizando la cartera. Escribinos y te enviamos las oportunidades
              disponibles antes de que se publiquen.
            </p>
          )}
        </div>
      </section>

      {/* Nosotros */}
      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="relative">
          <img
            src={posadasImg}
            alt="Vista aérea de la costanera de Posadas sobre el río Paraná al atardecer"
            width={1600}
            height={912}
            loading="lazy"
            className="w-full rounded-[2rem] object-cover"
          />
          <div className="absolute -bottom-6 -right-2 rounded-3xl bg-gold px-8 py-6 text-navy-deep sm:right-6">
            <p className="font-display text-4xl leading-none">20+</p>
            <p className="eyebrow mt-2 text-[0.55rem]">Años de experiencia</p>
          </div>
        </div>

        <div>
          <p className="eyebrow text-accent">Sobre nosotros</p>
          <h2 className="hairline mt-4 font-display text-4xl text-navy sm:text-5xl">
            Conocemos Posadas como nuestra casa
          </h2>
          <p className="mt-8 text-base leading-relaxed text-muted-foreground">
            Curto &amp; De Oliveira nació en Posadas y creció con la ciudad. Sabemos qué barrio se
            valoriza, qué terreno conviene y qué contrato protege a cada parte. Ese conocimiento
            local, sumado a un trato reservado y profesional, es lo que nos eligen nuestros
            clientes.
          </p>
          <ul className="mt-8 grid gap-3 text-sm text-navy sm:grid-cols-2">
            {[
              "Tasación profesional",
              "Asesoramiento legal integral",
              "Fotografía profesional",
              "Difusión en portales líderes",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-px w-4 bg-gold" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            to="/nosotros"
            className="group mt-10 inline-flex items-center gap-3 text-sm tracking-wide text-navy"
          >
            Nuestra historia
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-8 lg:px-8">
        <div className="grid gap-10 rounded-[2rem] bg-ivory px-8 py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:px-14">
          <div>
            <h2 className="font-display text-4xl text-navy sm:text-5xl">
              ¿Querés saber cuánto vale tu propiedad?
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Coordinamos una visita, analizamos el mercado real de tu zona y te entregamos una
              tasación fundamentada. Sin compromiso.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contacto"
              className="inline-flex items-center gap-3 rounded-full bg-navy px-8 py-4 text-sm font-medium text-navy-foreground transition-colors hover:bg-navy-deep"
            >
              Solicitar tasación
            </Link>
            <a
              href={`tel:${SITE.phoneTel}`}
              className="inline-flex items-center gap-3 rounded-full border border-navy/25 px-8 py-4 text-sm font-medium text-navy transition-colors hover:bg-navy hover:text-navy-foreground"
            >
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

    </>
  );
}

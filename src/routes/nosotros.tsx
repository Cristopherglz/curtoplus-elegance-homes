import { createFileRoute, Link } from "@tanstack/react-router";
import nosotrosImg from "@/assets/nosotros.jpg";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title: "Nosotros | Curto & De Oliveira Negocios Inmobiliarios" },
      {
        name: "description",
        content:
          "Más de 20 años en el mercado inmobiliario de Posadas, Misiones y el NEA. Conocé nuestros valores, nuestro equipo y nuestra forma de trabajar.",
      },
      { property: "og:title", content: "Nosotros | Curto & De Oliveira" },
      {
        property: "og:description",
        content: "Trayectoria, valores y forma de trabajo de nuestra inmobiliaria en Posadas.",
      },
    ],
  }),
  component: Nosotros,
});

const VALORES = [
  {
    title: "Experiencia",
    text: "Más de 20 años operando en Posadas y la región, con historial comprobado de operaciones concretadas.",
  },
  {
    title: "Atención personalizada",
    text: "Cada cliente tiene un asesor de referencia. Nada de circuitos impersonales ni respuestas automáticas.",
  },
  {
    title: "Cartera exclusiva",
    text: "Seleccionamos las propiedades que publicamos. Si algo no está en condiciones, lo decimos.",
  },
  {
    title: "Resultados",
    text: "Familias con casa nueva, inversores con renta estable y propietarios que vuelven a elegirnos.",
  },
];

function Nosotros() {
  return (
    <>
      <section className="surface-navy">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <p className="eyebrow text-gold">Sobre nosotros</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-navy-foreground sm:text-6xl">
            Tu socio confiable en el mercado inmobiliario
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:px-8">
        <img
          src={nosotrosImg}
          alt="Asesores de Curto & De Oliveira cerrando una operación en la oficina"
          width={1200}
          height={1408}
          loading="lazy"
          className="w-full object-cover"
        />
        <div>
          <h2 className="hairline font-display text-4xl text-navy sm:text-5xl">
            Una inmobiliaria de Posadas, para Misiones y el NEA
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Curto &amp; De Oliveira Negocios Inmobiliarios es una firma con amplia trayectoria en
              el mercado inmobiliario de toda la provincia de Misiones y la región del NEA.
            </p>
            <p>
              Nuestro compromiso es brindar un servicio profesional, transparente y personalizado,
              acompañando a cada cliente en todas las etapas del proceso de compra, venta o
              alquiler.
            </p>
            <p>
              Contamos con un equipo de profesionales capacitados y una cartera amplia que se
              adapta a distintas necesidades y presupuestos, desde el primer departamento hasta
              inversiones comerciales de escala.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { n: "20+", l: "Años de trayectoria" },
              { n: "100%", l: "Documentación verificada" },
              { n: "NEA", l: "Cobertura regional" },
            ].map((stat) => (
              <div key={stat.l} className="border-l border-gold pl-4">
                <p className="font-display text-3xl text-navy">{stat.n}</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{stat.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-ivory">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <p className="eyebrow text-accent">Nuestros valores</p>
          <h2 className="mt-4 font-display text-4xl text-navy sm:text-5xl">
            Lo que sostiene cada operación
          </h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {VALORES.map((valor, i) => (
              <div key={valor.title}>
                <p className="font-display text-2xl text-gold">0{i + 1}</p>
                <h3 className="mt-3 font-display text-2xl text-navy">{valor.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{valor.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-24 text-center lg:px-8">
        <h2 className="font-display text-4xl text-navy sm:text-5xl">
          Nos gustaría escuchar tu proyecto
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          Ya sea vender la casa de la familia o encontrar el terreno donde construir la propia,
          empezamos siempre por una conversación.
        </p>
        <Link
          to="/contacto"
          className="mt-9 inline-block bg-navy px-9 py-4 text-sm tracking-wide text-navy-foreground transition-colors hover:bg-navy-deep"
        >
          Contactanos
        </Link>
      </section>
    </>
  );
}

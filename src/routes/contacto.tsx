import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SITE, waLink } from "@/lib/site";
import { useHours } from "@/hooks/use-hours";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto | Curto & De Oliveira Negocios Inmobiliarios" },
      {
        name: "description",
        content:
          "Av. López y Planes 3887, Posadas, Misiones. WhatsApp +54 9 3764 807327 · cydinmobiliariaok@gmail.com. Consultá por tasaciones, ventas y alquileres.",
      },
      { property: "og:title", content: "Contacto | Curto & De Oliveira" },
      {
        property: "og:description",
        content: "Escribinos o visitanos en Av. López y Planes 3887, Posadas, Misiones.",
      },
    ],
  }),
  component: Contacto,
});

function Contacto() {
  const hours = useHours();
  const [form, setForm] = useState({ nombre: "", telefono: "", motivo: "Tasación", mensaje: "" });

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hola! Soy ${form.nombre || "un interesado"}.
Motivo: ${form.motivo}
Teléfono: ${form.telefono}
${form.mensaje}`;
    window.open(waLink(text), "_blank", "noopener");
  };

  const fieldClass =
    "w-full border border-border bg-card px-4 py-3 text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-accent";

  return (
    <>
      <section className="surface-navy">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <p className="eyebrow text-gold">Contacto</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl leading-tight text-navy-foreground sm:text-6xl">
            Estamos a un mensaje de distancia
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-5 py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:px-8">
        <div>
          <h2 className="hairline font-display text-3xl text-navy">Datos de la oficina</h2>
          <ul className="mt-8 space-y-6">
            <li className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <div className="min-w-0">
                <p className="text-sm text-navy">{SITE.address}</p>
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-xs text-accent underline-offset-4 hover:underline"
                >
                  Ver en Google Maps
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <a href={`tel:${SITE.phoneTel}`} className="text-sm text-navy hover:text-accent">
                {SITE.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-4">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <a href={`mailto:${SITE.email}`} className="break-all text-sm text-navy hover:text-accent">
                {SITE.email}
              </a>
            </li>
            <li className="flex gap-4">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <div className="space-y-1">
                {hours.map((h) => (
                  <p key={h.day} className="text-sm text-muted-foreground">
                    <span className="text-navy">{h.day}:</span> {h.time}
                  </p>
                ))}
              </div>
            </li>
          </ul>

          <div className="mt-10 aspect-[4/3] w-full overflow-hidden border border-border">
            <iframe
              title="Ubicación de Curto & De Oliveira en Posadas"
              src="https://www.google.com/maps?q=Av.%20L%C3%B3pez%20y%20Planes%203887,%20Posadas,%20Misiones&output=embed"
              loading="lazy"
              className="h-full w-full"
            />
          </div>
        </div>

        <div className="border border-border bg-card p-9 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-3xl text-navy">Escribinos</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Completá el formulario y te respondemos por WhatsApp a la brevedad.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="nombre" className="eyebrow text-[0.55rem] text-muted-foreground">
                Nombre
              </label>
              <input
                id="nombre"
                required
                maxLength={80}
                value={form.nombre}
                onChange={set("nombre")}
                placeholder="Tu nombre"
                className={`${fieldClass} mt-2`}
              />
            </div>
            <div>
              <label htmlFor="telefono" className="eyebrow text-[0.55rem] text-muted-foreground">
                Teléfono
              </label>
              <input
                id="telefono"
                maxLength={30}
                value={form.telefono}
                onChange={set("telefono")}
                placeholder="3764 000000"
                className={`${fieldClass} mt-2`}
              />
            </div>
            <div>
              <label htmlFor="motivo" className="eyebrow text-[0.55rem] text-muted-foreground">
                Motivo
              </label>
              <select
                id="motivo"
                value={form.motivo}
                onChange={set("motivo")}
                className={`${fieldClass} mt-2 appearance-none`}
              >
                {["Tasación", "Quiero vender", "Quiero comprar", "Alquileres", "Administración", "Otro"].map(
                  (m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div>
              <label htmlFor="mensaje" className="eyebrow text-[0.55rem] text-muted-foreground">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                rows={5}
                maxLength={1000}
                value={form.mensaje}
                onChange={set("mensaje")}
                placeholder="Contanos brevemente qué necesitás"
                className={`${fieldClass} mt-2 resize-none`}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-navy px-6 py-4 text-sm tracking-wide text-navy-foreground transition-colors hover:bg-navy-deep"
            >
              Enviar consulta por WhatsApp
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export const SITE = {
  name: "Curto & De Oliveira",
  tagline: "Negocios Inmobiliarios",
  address: "Av. López y Planes 3887, Posadas, Misiones",
  city: "Posadas, Misiones — Argentina",
  email: "cydinmobiliariaok@gmail.com",
  phoneDisplay: "+54 9 3764 807327",
  phoneTel: "+5493764807327",
  whatsapp: "5493764807327",
  hours: [
    { day: "Lunes a Viernes", time: "9:00 – 18:00" },
    { day: "Sábado", time: "9:00 – 13:00" },
    { day: "Domingo", time: "Cerrado" },
  ],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Av.+L%C3%B3pez+y+Planes+3887,+Posadas,+Misiones",
} as const;

export function waLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

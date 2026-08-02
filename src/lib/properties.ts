import { supabase } from "@/integrations/supabase/client";

export type Property = {
  id: string;
  title: string;
  description: string;
  operation: string;
  property_type: string;
  status: string;
  sale_price_usd: number | null;
  sale_price_ars: number | null;
  rent_price_usd: number | null;
  rent_price_ars: number | null;
  expenses_ars: number | null;
  expenses_usd: number | null;
  address: string | null;
  neighborhood: string | null;
  city: string;
  province: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_m2: number | null;
  lot_m2: number | null;
  garage: boolean;
  garage_spaces: number | null;
  mortgage_eligible: boolean;
  images: string[];
  featured: boolean;
  is_published: boolean;
  created_at: string;
};

export const OPERATIONS = [
  { value: "venta", label: "Venta" },
  { value: "alquiler", label: "Alquiler" },
  { value: "alquiler_temporal", label: "Alquiler temporal" },
] as const;

export const PROPERTY_TYPES = [
  { value: "casa", label: "Casa" },
  { value: "departamento", label: "Departamento" },
  { value: "monoambiente", label: "Monoambiente" },
  { value: "terreno", label: "Terreno" },
  { value: "loteo", label: "Loteo" },
  { value: "chacra", label: "Chacra" },
  { value: "hectareas", label: "Hectáreas" },
  { value: "local", label: "Local comercial" },
  { value: "oficina", label: "Oficina" },
  { value: "galpon", label: "Galpón" },
  { value: "campo", label: "Campo / Chacra" },
  { value: "cochera", label: "Cochera" },
] as const;

export const STATUSES = [
  { value: "disponible", label: "Disponible" },
  { value: "reservado", label: "Reservado" },
  { value: "alquilado", label: "Alquilado" },
  { value: "vendido", label: "Vendido" },
] as const;

export function labelOf(list: readonly { value: string; label: string }[], value: string) {
  return list.find((item) => item.value === value)?.label ?? value;
}

export function imageUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `/api/public/imagen/${path}`;
}

export function fullAddress(property: Property) {
  return [property.address, property.neighborhood, property.city, property.province]
    .filter(Boolean)
    .join(", ");
}

export function mapsUrl(property: Property) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress(property))}`;
}

const money = (value: number, currency: "USD" | "ARS") =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export function priceLines(property: Property) {
  const lines: { label: string; value: string }[] = [];
  const sale: string[] = [];
  if (property.sale_price_usd) sale.push(money(property.sale_price_usd, "USD"));
  if (property.sale_price_ars) sale.push(money(property.sale_price_ars, "ARS"));
  if (sale.length) lines.push({ label: "Venta", value: sale.join("  ·  ") });

  const rent: string[] = [];
  if (property.rent_price_usd) rent.push(money(property.rent_price_usd, "USD"));
  if (property.rent_price_ars) rent.push(money(property.rent_price_ars, "ARS"));
  if (rent.length) {
    lines.push({
      label: property.operation === "alquiler_temporal" ? "Alquiler temporal" : "Alquiler",
      value: rent.join("  ·  "),
    });
  }
  const exp: string[] = [];
  if (property.expenses_usd) exp.push(money(property.expenses_usd, "USD"));
  if (property.expenses_ars) exp.push(money(property.expenses_ars, "ARS"));
  if (exp.length) lines.push({ label: "Expensas", value: exp.join("  ·  ") });

  if (!lines.length) lines.push({ label: "Precio", value: "Consultar" });
  return lines;
}

export async function fetchPublicProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("is_published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Property[];
}

export async function fetchProperty(id: string) {
  const { data, error } = await supabase.from("properties").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data ?? null) as unknown as Property | null;
}

export async function fetchAllProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Property[];
}

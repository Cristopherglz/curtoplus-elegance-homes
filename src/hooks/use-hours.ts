import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

export type Hour = { day: string; time: string };

export async function fetchHours(): Promise<Hour[]> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("id", "hours")
    .maybeSingle();
  if (error) throw error;
  const value = (data?.value ?? null) as unknown;
  if (Array.isArray(value) && value.length) return value as Hour[];
  return [...SITE.hours];
}

export function useHours() {
  const { data } = useQuery({ queryKey: ["site_settings", "hours"], queryFn: fetchHours });
  return data ?? ([...SITE.hours] as Hour[]);
}

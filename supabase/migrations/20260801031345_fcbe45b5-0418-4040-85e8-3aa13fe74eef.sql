ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS garage_spaces integer,
  ADD COLUMN IF NOT EXISTS mortgage_eligible boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.site_settings (
  id text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins can insert site settings" ON public.site_settings
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins can update site settings" ON public.site_settings
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.site_settings (id, value) VALUES (
  'hours',
  '[{"day":"Lunes a Viernes","time":"9:00 – 18:00"},{"day":"Sábado","time":"9:00 – 13:00"},{"day":"Domingo","time":"Cerrado"}]'::jsonb
) ON CONFLICT (id) DO NOTHING;
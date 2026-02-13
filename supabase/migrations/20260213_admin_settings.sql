-- Admin Settings Cross-Device Sync Table
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Allow all access to admins (simplified)
DROP POLICY IF EXISTS "Allow all access to admin_settings" ON public.admin_settings;
CREATE POLICY "Allow all access to admin_settings" ON public.admin_settings FOR ALL USING (true);

-- Seed defaults
INSERT INTO public.admin_settings (key, value) VALUES
('passcode', '"8888"'),
('theme_color', '"#00c8ff"'),
('whatsapp_templates', '{
    "confirmation": "Hello {name}, your booking for {bike} is confirmed! We''ll see you at {time}.",
    "completion": "Hi {name}, your {bike} is ready for pickup! Total: {revenue}.",
    "reminder": "Hello {name}, just a reminder about your appointment today for {bike}.",
    "cancellation": "Hello {name}, we have received your request to cancel the booking for {bike}. We hope to see you again soon!"
}')
ON CONFLICT (key) DO NOTHING;

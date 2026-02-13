-- ======================================
-- SMARTBIKE PRO: NUCLEAR RESET SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR
-- ======================================

-- 1. CLEANUP (Drop existing tables to prevent conflicts)
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.admin_settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. TABLES
CREATE TABLE public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TABLE public.services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  base_price numeric not null,
  category text not null,
  icon text default '🔧',
  created_at timestamptz default now()
);

CREATE TABLE public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade, -- Optional for guest bookings
  name text not null,      -- For guest capture
  phone text not null,     -- For guest capture
  bike_model text not null,
  service_type text not null,
  service_location text not null,
  address text,
  preferred_date date not null,
  preferred_time text not null,
  notes text,
  status text default 'pending' check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  metadata jsonb default '{}'::jsonb, -- For device tracking
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TABLE public.chat_sessions (
    id uuid default gen_random_uuid() primary key,
    customer_name text default 'Guest',
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);

CREATE TABLE public.chat_messages (
    id uuid default gen_random_uuid() primary key,
    session_id uuid references public.chat_sessions on delete cascade not null,
    role text check (role in ('user', 'bot')),
    content text not null,
    created_at timestamptz default now()
);

CREATE TABLE public.admin_settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamptz default now()
);

-- 3. RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES (PERMISSIVE FOR PROTOTYPE)
-- Allow mostly everything for anon/authenticated users to ensure dashboard works
CREATE POLICY "Public full access" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON public.chat_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON public.admin_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- 5. GRANTS (CRITICAL FOR "PERMISSION DENIED" ERRORS)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 6. SEED DATA (FORCE INSERT)
-- Initialize Admin Settings
INSERT INTO public.admin_settings (key, value) VALUES
('passcode', '"8888"'),
('theme_color', '"#00c8ff"'),
('whatsapp_templates', '{
    "confirmation": "Hello {name}, your booking for {bike} is confirmed! We''ll see you at {time}.",
    "completion": "Hi {name}, your {bike} is ready for pickup! Total: {revenue}.",
    "reminder": "Hello {name}, just a reminder about your appointment today for {bike}.",
    "cancellation": "Hello {name}, we have received your request to cancel the booking for {bike}. We hope to see you again soon!"
}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Seed Services
DELETE FROM public.services; -- Clear first
INSERT INTO public.services (name, description, base_price, category, icon) VALUES
('Engine Repair', 'Complete engine overhaul, timing chain, piston repair.', 1500, 'repair', '🔩'),
('Full Servicing', 'Oil change, filter replacement, chain adjustment.', 799, 'servicing', '⚙️'),
('Brake Fix', 'Disc & drum brake pads, fluid change.', 500, 'repair', '🛑'),
('Oil Change', 'Premium synthetic engine oil replacement.', 350, 'servicing', '🛢️'),
('Emergency Repair', 'Roadside assistance and breakdown support.', 299, 'emergency', '🚨'),
('Electrical Work', 'Wiring, headlight, battery, ECU diagnostics.', 400, 'repair', '⚡');

-- Seed Test Bookings
DELETE FROM public.bookings; -- Clear first
INSERT INTO public.bookings (name, phone, bike_model, service_type, service_location, preferred_date, preferred_time, status, metadata) VALUES
('Arjun Sharma', '9811530701', 'Royal Enfield Classic 350', 'Engine Repair', 'workshop', CURRENT_DATE, 'morning', 'confirmed', '{"device": "Desktop"}'),
('Sneha Reddy', '9811530702', 'Honda Activa 6G', 'Full Servicing', 'doorstep', CURRENT_DATE, 'afternoon', 'pending', '{"device": "Mobile"}'),
('Rahul Verma', '9811530703', 'KTM Duke 200', 'Brake Fix', 'workshop', CURRENT_DATE, 'evening', 'completed', '{"device": "Desktop"}');

-- 7. TRIGGERS (Auto-update updated_at)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_admin_settings ON public.admin_settings;
CREATE TRIGGER set_updated_at_admin_settings BEFORE UPDATE ON public.admin_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Verification Output
SELECT count(*) as service_count FROM public.services;
SELECT count(*) as booking_count FROM public.bookings;

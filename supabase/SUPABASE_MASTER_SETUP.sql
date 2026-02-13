-- ======================================
-- SMARTBIKE PRO: COMPLETE SETUP SCRIPT v2
-- RUN THIS IN SUPABASE SQL EDITOR
-- ======================================

-- 1. CLEANUP (Drop existing tables to prevent conflicts)
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
DROP TABLE IF EXISTS public.service_history CASCADE;
DROP TABLE IF EXISTS public.daily_expenses CASCADE;
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
  user_id uuid references auth.users on delete cascade,
  name text not null,
  phone text not null,
  bike_model text not null,
  service_type text not null,
  service_location text not null,
  address text,
  preferred_date date not null,
  preferred_time text not null,
  notes text,
  status text default 'pending' check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  metadata jsonb default '{}'::jsonb,
  -- NEW: Business fields
  vehicle_number text,
  estimated_cost numeric default 0,
  final_cost numeric default 0,
  mechanic_name text,
  started_at timestamptz,
  completed_at timestamptz,
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

-- NEW: Daily Expenses for profit tracking
CREATE TABLE public.daily_expenses (
  id uuid default gen_random_uuid() primary key,
  date date not null default CURRENT_DATE,
  category text not null check (category in ('parts', 'rent', 'utilities', 'wages', 'tools', 'fuel', 'misc')),
  description text not null,
  amount numeric not null,
  created_at timestamptz default now()
);

-- NEW: Vehicle Service History for fleet tracking
CREATE TABLE public.service_history (
  id uuid default gen_random_uuid() primary key,
  vehicle_number text not null,
  bike_model text not null,
  customer_phone text not null,
  customer_name text not null,
  service_type text not null,
  mileage_at_service numeric,
  notes text,
  cost numeric default 0,
  date date not null default CURRENT_DATE,
  created_at timestamptz default now()
);

-- 3. RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_history ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES (PERMISSIVE FOR PROTOTYPE)
CREATE POLICY "Public full access" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON public.chat_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON public.admin_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON public.daily_expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON public.service_history FOR ALL USING (true) WITH CHECK (true);

-- 5. GRANTS
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 6. SEED DATA

-- Admin Settings
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

-- Services
DELETE FROM public.services;
INSERT INTO public.services (name, description, base_price, category, icon) VALUES
('Engine Repair', 'Complete engine overhaul, timing chain, piston repair.', 2500, 'repair', '🔩'),
('Full Servicing', 'Oil change, filter replacement, chain adjustment, full checkup.', 799, 'servicing', '⚙️'),
('Brake Fix', 'Disc & drum brake pads, fluid change, caliper service.', 1200, 'repair', '🛑'),
('Oil Change', 'Premium synthetic engine oil replacement.', 350, 'servicing', '🛢️'),
('Emergency Repair', 'Roadside assistance and breakdown support.', 500, 'emergency', '🚨'),
('Electrical Work', 'Wiring, headlight, battery, ECU diagnostics.', 800, 'repair', '⚡'),
('Chain & Sprocket', 'Chain cleaning, lubing, sprocket replacement.', 700, 'servicing', '🔗'),
('Tyre Replacement', 'Front/rear tyre change with balancing.', 1800, 'repair', '🛞'),
('Body & Paint', 'Dent repair, scratch removal, full paint job.', 3500, 'repair', '🎨'),
('General Checkup', 'Multi-point inspection and health report.', 299, 'servicing', '🩺');

-- Test Bookings (with new business fields)
DELETE FROM public.bookings;
INSERT INTO public.bookings (name, phone, bike_model, service_type, service_location, preferred_date, preferred_time, status, metadata, vehicle_number, estimated_cost, final_cost, mechanic_name) VALUES
('Arjun Sharma',  '9811530701', 'Royal Enfield Classic 350', 'Engine Repair',    'workshop', CURRENT_DATE,     'morning',   'completed',   '{"device": "Desktop"}', 'DL-01-AB-1234', 2500, 2800, 'Ravi Kumar'),
('Sneha Reddy',   '9811530702', 'Honda Activa 6G',          'Full Servicing',   'doorstep',  CURRENT_DATE,     'afternoon', 'confirmed',   '{"device": "Mobile"}',  'TS-09-CD-5678', 799,  0,    'Vikram Singh'),
('Rahul Verma',   '9811530703', 'KTM Duke 200',             'Brake Fix',        'workshop',  CURRENT_DATE,     'evening',   'pending',     '{"device": "Desktop"}', 'MH-02-EF-9012', 1200, 0,    NULL),
('Priya Patel',   '9811530704', 'TVS Jupiter',              'Oil Change',       'doorstep',  CURRENT_DATE - 1, 'morning',   'completed',   '{"device": "Mobile"}',  'GJ-05-GH-3456', 350,  350,  'Ravi Kumar'),
('Vikash Gupta',  '9811530705', 'Bajaj Pulsar 150',         'Chain & Sprocket', 'workshop',  CURRENT_DATE - 1, 'afternoon', 'completed',   '{"device": "Desktop"}', 'UP-14-IJ-7890', 700,  750,  'Amit Yadav'),
('Meera Joshi',   '9811530706', 'Honda CB Shine',           'General Checkup',  'workshop',  CURRENT_DATE - 2, 'morning',   'completed',   '{"device": "Mobile"}',  'RJ-14-KL-2345', 299,  299,  'Vikram Singh'),
('Arjun Sharma',  '9811530701', 'Royal Enfield Classic 350', 'Oil Change',      'workshop',  CURRENT_DATE - 3, 'afternoon', 'completed',   '{"device": "Desktop"}', 'DL-01-AB-1234', 350,  350,  'Ravi Kumar'),
('Karan Malhotra','9811530707', 'Yamaha R15 V4',            'Tyre Replacement', 'workshop',  CURRENT_DATE - 2, 'evening',   'in_progress', '{"device": "Desktop"}', 'HR-26-MN-6789', 1800, 0,    'Amit Yadav'),
('Sneha Reddy',   '9811530702', 'Honda Activa 6G',          'Brake Fix',        'doorstep',  CURRENT_DATE - 4, 'morning',   'completed',   '{"device": "Mobile"}',  'TS-09-CD-5678', 1200, 1100, 'Ravi Kumar'),
('Deepak Singh',  '9811530708', 'Hero Splendor Plus',       'Electrical Work',  'workshop',  CURRENT_DATE - 3, 'afternoon', 'completed',   '{"device": "Mobile"}',  'MP-09-OP-1234', 800,  850,  'Vikram Singh');

-- Sample Expenses
INSERT INTO public.daily_expenses (date, category, description, amount) VALUES
(CURRENT_DATE,     'parts',     'Brake pads bulk order (10 units)',     2500),
(CURRENT_DATE,     'utilities', 'Electricity bill - workshop',         1200),
(CURRENT_DATE - 1, 'wages',     'Daily wage - Helper Suresh',          500),
(CURRENT_DATE - 1, 'parts',     'Engine oil 5L cans x4',              1800),
(CURRENT_DATE - 2, 'fuel',      'Generator diesel',                    600),
(CURRENT_DATE - 2, 'tools',     'Torque wrench replacement',           1500),
(CURRENT_DATE - 3, 'misc',      'Workshop cleaning supplies',          300),
(CURRENT_DATE - 3, 'rent',      'Monthly shop rent (daily portion)',    1000);

-- Sample Vehicle Service History
INSERT INTO public.service_history (vehicle_number, bike_model, customer_phone, customer_name, service_type, mileage_at_service, notes, cost, date) VALUES
('DL-01-AB-1234', 'Royal Enfield Classic 350', '9811530701', 'Arjun Sharma',  'Engine Repair',    15200, 'Piston ring replaced, timing chain adjusted',     2800, CURRENT_DATE),
('DL-01-AB-1234', 'Royal Enfield Classic 350', '9811530701', 'Arjun Sharma',  'Oil Change',       14500, 'Motul 5100 15W50 synthetic',                      350,  CURRENT_DATE - 3),
('DL-01-AB-1234', 'Royal Enfield Classic 350', '9811530701', 'Arjun Sharma',  'General Checkup',  12000, 'All okay, chain tension adjusted',                299,  CURRENT_DATE - 30),
('TS-09-CD-5678', 'Honda Activa 6G',          '9811530702', 'Sneha Reddy',   'Brake Fix',        8200,  'Front brake pads replaced, rotor resurfaced',     1100, CURRENT_DATE - 4),
('TS-09-CD-5678', 'Honda Activa 6G',          '9811530702', 'Sneha Reddy',   'Full Servicing',   7500,  'Regular 5000km service',                          799,  CURRENT_DATE - 60),
('MH-02-EF-9012', 'KTM Duke 200',             '9811530703', 'Rahul Verma',   'Full Servicing',   5000,  'First service at 5000km',                         799,  CURRENT_DATE - 90),
('UP-14-IJ-7890', 'Bajaj Pulsar 150',         '9811530705', 'Vikash Gupta',  'Chain & Sprocket', 22000, 'Chain and both sprockets replaced',               750,  CURRENT_DATE - 1),
('HR-26-MN-6789', 'Yamaha R15 V4',            '9811530707', 'Karan Malhotra','Oil Change',       3000,  'Yamalube 10W40',                                  400,  CURRENT_DATE - 45);

-- 7. TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_bookings ON public.bookings;
CREATE TRIGGER set_updated_at_bookings BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_admin_settings ON public.admin_settings;
CREATE TRIGGER set_updated_at_admin_settings BEFORE UPDATE ON public.admin_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Verification
SELECT 'services' as tbl, count(*) as cnt FROM public.services
UNION ALL SELECT 'bookings', count(*) FROM public.bookings
UNION ALL SELECT 'expenses', count(*) FROM public.daily_expenses
UNION ALL SELECT 'history', count(*) FROM public.service_history;

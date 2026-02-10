-- ======================================
-- SmartBike Pro — Database Schema
-- ======================================

-- 1. PROFILES TABLE
-- Auto-created on user signup via trigger
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. SERVICES TABLE
create table public.services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  base_price numeric not null,
  category text not null,
  icon text default '🔧',
  created_at timestamptz default now()
);

-- 3. BOOKINGS TABLE
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  service_id uuid references public.services on delete set null,
  bike_model text not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  scheduled_at timestamptz not null,
  time_slot text,
  notes text,
  estimated_cost numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- INDEXES
create index idx_bookings_user on public.bookings (user_id);
create index idx_bookings_status on public.bookings (status);
create index idx_bookings_scheduled on public.bookings (scheduled_at);
create index idx_services_category on public.services (category);

-- ======================================
-- ROW LEVEL SECURITY
-- ======================================

-- PROFILES
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- SERVICES (Public read, admin write)
alter table public.services enable row level security;

create policy "Anyone can view services"
  on public.services for select
  using (true);

create policy "Admins can manage services"
  on public.services for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- BOOKINGS
alter table public.bookings enable row level security;

create policy "Users can view their own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can create their own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bookings"
  on public.bookings for update
  using (auth.uid() = user_id);

create policy "Admins can view all bookings"
  on public.bookings for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all bookings"
  on public.bookings for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ======================================
-- TRIGGERS
-- ======================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update `updated_at`
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_updated_at_bookings
  before update on public.bookings
  for each row execute function public.handle_updated_at();

-- ======================================
-- SEED DATA: Services
-- ======================================
insert into public.services (name, description, base_price, category, icon) values
  ('Engine Repair', 'Complete engine overhaul, timing chain, piston repair, and head gasket replacement.', 1500, 'repair', '🔩'),
  ('Full Servicing', 'Oil change, filter replacement, chain adjustment, spark plug — complete care package.', 799, 'servicing', '⚙️'),
  ('Brake Fix', 'Disc & drum brake pads, brake fluid change, ABS diagnostics, and caliper servicing.', 500, 'repair', '🛑'),
  ('Oil Change', 'Premium synthetic & semi-synthetic engine oil with filter replacement.', 350, 'servicing', '🛢️'),
  ('Emergency Repair', 'Roadside assistance, flat tire, towing service, and emergency breakdown support.', 299, 'emergency', '🚨'),
  ('Electrical Work', 'Wiring repair, headlight upgrade, battery replacement, ECU diagnostics.', 400, 'repair', '⚡');

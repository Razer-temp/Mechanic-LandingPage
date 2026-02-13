-- ======================================
-- Fix Chat Storage & Device Tracking
-- ======================================

-- 1. Ensure Tables Exist (if they don't from previous partial attempts)
create table if not exists public.chat_sessions (
    id uuid default gen_random_uuid() primary key,
    customer_name text default 'Guest',
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);

create table if not exists public.chat_messages (
    id uuid default gen_random_uuid() primary key,
    session_id uuid references public.chat_sessions on delete cascade not null,
    role text check (role in ('user', 'bot')),
    content text not null,
    created_at timestamptz default now()
);

-- 2. Add Metadata to Bookings
do $$ 
begin
    if not exists (select 1 from information_schema.columns where table_name='bookings' and column_name='metadata') then
        alter table public.bookings add column metadata jsonb default '{}'::jsonb;
    end if;
end $$;

-- 3. Enable RLS
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- 4. Public Policies (Allowing guests to initiate and message)
-- Note: In a production app, you might want more restriction, but for this proto we need public access.
drop policy if exists "Public insert chat_sessions" on public.chat_sessions;
create policy "Public insert chat_sessions" on public.chat_sessions for insert with check (true);

drop policy if exists "Public select chat_sessions" on public.chat_sessions;
create policy "Public select chat_sessions" on public.chat_sessions for select using (true);

drop policy if exists "Public insert chat_messages" on public.chat_messages;
create policy "Public insert chat_messages" on public.chat_messages for insert with check (true);

drop policy if exists "Public select chat_messages" on public.chat_messages;
create policy "Public select chat_messages" on public.chat_messages for select using (true);

-- Ensure admins can see everything (assuming admin profile check is already globally handled or needed here)
-- For now, public select is easiest for the dashboard to fetch.

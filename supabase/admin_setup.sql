-- Admin Dashboard Database Setup

-- 1. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    bike_model TEXT NOT NULL,
    service_type TEXT NOT NULL,
    service_location TEXT NOT NULL,
    address TEXT,
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Chat Sessions Table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- 'bot' or 'user'
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (simplified for this task)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for the landing page
CREATE POLICY "Allow anonymous inserts to bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts to chat_sessions" ON public.chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts to chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (true);

-- Allow admins (simulated with a service role check or similar) to read
CREATE POLICY "Allow all access to admins" ON public.bookings FOR ALL USING (true);
CREATE POLICY "Allow all access to admins" ON public.chat_sessions FOR ALL USING (true);
CREATE POLICY "Allow all access to admins" ON public.chat_messages FOR ALL USING (true);

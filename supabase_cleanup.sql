-- ======================================
-- SMARTBIKE PRO — COMPLETE CLEANUP SCRIPT
-- Run this in Supabase SQL Editor to remove all integration objects
-- ======================================

-- 1. DROP TRIGGERS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. DROP FUNCTIONS (CASCADE handles dependencies like policies)
DROP FUNCTION IF EXISTS public.is_admin_or_mechanic() CASCADE;
DROP FUNCTION IF EXISTS public.search_customer(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 3. DROP VIEWS
DROP VIEW IF EXISTS public.mechanic_today_schedule CASCADE;
DROP VIEW IF EXISTS public.mechanic_upcoming_bookings CASCADE;
DROP VIEW IF EXISTS public.mechanic_revenue_summary CASCADE;
DROP VIEW IF EXISTS public.mechanic_popular_services CASCADE;
DROP VIEW IF EXISTS public.mechanic_new_inquiries CASCADE;

-- 4. DROP TABLES
DROP TABLE IF EXISTS public.chatbot_conversations CASCADE;
DROP TABLE IF EXISTS public.contact_submissions CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ======================================
-- CLEANUP COMPLETE
-- ======================================

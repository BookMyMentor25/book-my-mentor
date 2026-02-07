-- Add the correct admin users to admin_users table
-- First, delete any orphaned admin entries that don't match valid auth users
DELETE FROM public.admin_users WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Insert bookmymentor.org@gmail.com as admin
INSERT INTO public.admin_users (user_id, role)
VALUES ('824c6f35-99a7-45c8-b17c-c3a775861a59', 'admin')
ON CONFLICT (user_id) DO NOTHING;
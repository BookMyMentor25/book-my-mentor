
-- Create courses table if it doesn't exist with proper structure
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  price integer NOT NULL,
  duration text,
  category text,
  features text[],
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Create orders table with all necessary columns
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  course_id uuid REFERENCES public.courses(id) NOT NULL,
  order_id text NOT NULL,
  student_name text NOT NULL,
  student_email text NOT NULL,
  student_phone text NOT NULL,
  address text,
  city text,
  state text,
  pincode text,
  amount integer NOT NULL,
  coupon_applied text,
  discount_amount integer DEFAULT 0,
  status text DEFAULT 'pending',
  invoice_number text,
  invoice_generated_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL PRIMARY KEY,
  full_name text,
  email text,
  phone text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create inquiries table for contact form submissions
CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  course_interest text,
  message text,
  status text DEFAULT 'new',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones
DROP POLICY IF EXISTS "Anyone can view active courses" ON public.courses;
CREATE POLICY "Anyone can view active courses" 
  ON public.courses 
  FOR SELECT 
  USING (is_active = true);

DROP POLICY IF EXISTS "Users can view their own orders or admin can view all" ON public.orders;
CREATE POLICY "Users can view their own orders or admin can view all" 
  ON public.orders 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    public.is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can update orders" ON public.orders;
CREATE POLICY "Admin can update orders" 
  ON public.orders 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admin can view all inquiries" ON public.inquiries;
CREATE POLICY "Admin can view all inquiries" 
  ON public.inquiries 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Anyone can create inquiries" ON public.inquiries;
CREATE POLICY "Anyone can create inquiries" 
  ON public.inquiries 
  FOR INSERT 
  WITH CHECK (true);

-- Insert some sample courses if the table is empty
INSERT INTO public.courses (title, description, price, duration, category, features, is_active)
SELECT 
  'Product Management Masterclass',
  'Comprehensive course covering product strategy, roadmapping, and execution',
  29900,
  '8 weeks',
  'Product Management',
  ARRAY['Product Strategy', 'Market Research', 'Roadmapping', 'Analytics'],
  true
WHERE NOT EXISTS (SELECT 1 FROM public.courses WHERE title = 'Product Management Masterclass');

INSERT INTO public.courses (title, description, price, duration, category, features, is_active)
SELECT 
  'Lean Startup Methodology',
  'Learn to build and validate products using lean startup principles',
  24900,
  '6 weeks',
  'Entrepreneurship',
  ARRAY['MVP Development', 'Customer Validation', 'Pivot Strategies', 'Metrics'],
  true
WHERE NOT EXISTS (SELECT 1 FROM public.courses WHERE title = 'Lean Startup Methodology');

INSERT INTO public.courses (title, description, price, duration, category, features, is_active)
SELECT 
  'Project Management Professional',
  'Master project management skills with industry best practices',
  34900,
  '10 weeks',
  'Project Management',
  ARRAY['Agile Methodology', 'Risk Management', 'Team Leadership', 'Planning'],
  true
WHERE NOT EXISTS (SELECT 1 FROM public.courses WHERE title = 'Project Management Professional');

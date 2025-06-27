
-- Create admin_users table to manage admin access
CREATE TABLE public.admin_users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to manage themselves
CREATE POLICY "Admin users can view admin status" 
  ON public.admin_users 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_uuid
  );
$$;

-- Update orders table RLS policies to allow admin access
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;

-- Enable RLS on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create new policies for orders
CREATE POLICY "Users can view their own orders or admin can view all" 
  ON public.orders 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    public.is_admin(auth.uid())
  );

CREATE POLICY "Users can create orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can update orders" 
  ON public.orders 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

-- Add invoice generation functionality
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS invoice_number text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS invoice_generated_at timestamp with time zone;

-- Create function to generate invoice numbers
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  invoice_num text;
  year_part text;
  sequence_num integer;
BEGIN
  year_part := EXTRACT(YEAR FROM NOW())::text;
  
  -- Get the next sequence number for this year
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 'INV-' || year_part || '-(.*)') AS integer)), 0) + 1
  INTO sequence_num
  FROM public.orders
  WHERE invoice_number LIKE 'INV-' || year_part || '-%';
  
  invoice_num := 'INV-' || year_part || '-' || LPAD(sequence_num::text, 4, '0');
  
  RETURN invoice_num;
END;
$$;

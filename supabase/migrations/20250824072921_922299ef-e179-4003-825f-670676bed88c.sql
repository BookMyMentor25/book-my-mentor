-- Enable Row Level Security on customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to view all customers
CREATE POLICY "Admin users can view all customers" 
ON public.customers 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Create policy for admin users to insert customers
CREATE POLICY "Admin users can insert customers" 
ON public.customers 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

-- Create policy for admin users to update customers
CREATE POLICY "Admin users can update customers" 
ON public.customers 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Create policy for admin users to delete customers
CREATE POLICY "Admin users can delete customers" 
ON public.customers 
FOR DELETE 
USING (is_admin(auth.uid()));
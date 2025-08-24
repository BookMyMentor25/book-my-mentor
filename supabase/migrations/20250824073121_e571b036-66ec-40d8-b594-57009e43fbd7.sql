-- Enable Row Level Security on Referral table
ALTER TABLE public."Referral" ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to view all referral codes
CREATE POLICY "Admin users can view all referral codes" 
ON public."Referral" 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Create policy for admin users to insert referral codes
CREATE POLICY "Admin users can insert referral codes" 
ON public."Referral" 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

-- Create policy for admin users to update referral codes
CREATE POLICY "Admin users can update referral codes" 
ON public."Referral" 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Create policy for admin users to delete referral codes
CREATE POLICY "Admin users can delete referral codes" 
ON public."Referral" 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Create policy to allow authenticated users to validate active referral codes
-- This allows users to check if a referral code is valid during checkout
CREATE POLICY "Users can validate active referral codes" 
ON public."Referral" 
FOR SELECT 
USING (
  auth.role() = 'authenticated' AND
  (valid_from IS NULL OR valid_from <= CURRENT_DATE) AND
  (valid_until IS NULL OR valid_until >= CURRENT_DATE)
);
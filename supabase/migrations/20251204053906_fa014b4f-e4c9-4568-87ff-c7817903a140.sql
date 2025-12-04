-- Drop the existing function first
DROP FUNCTION IF EXISTS public.validate_coupon(text);

-- Create improved validate_coupon function with correct column name
CREATE OR REPLACE FUNCTION public.validate_coupon(input_code text)
RETURNS TABLE(
  is_valid boolean, 
  discount_percent numeric, 
  discount_amount numeric,
  discount_type text,
  error_message text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE 
            WHEN c.is_active = false THEN false
            WHEN c.valid_from IS NOT NULL AND CURRENT_TIMESTAMP < c.valid_from THEN false
            WHEN c.valid_until IS NOT NULL AND CURRENT_TIMESTAMP > c.valid_until THEN false
            WHEN c.max_uses IS NOT NULL AND c.current_uses >= c.max_uses THEN false
            ELSE true
        END AS is_valid,
        COALESCE(c.discount_percent, 0::numeric) AS discount_percent,
        COALESCE(c.discount_amount, 0::numeric) AS discount_amount,
        COALESCE(c.discount_type, 'percentage') AS discount_type,
        CASE 
            WHEN c.is_active = false THEN 'Coupon is not active'
            WHEN c.valid_from IS NOT NULL AND CURRENT_TIMESTAMP < c.valid_from THEN 'Coupon is not yet valid'
            WHEN c.valid_until IS NOT NULL AND CURRENT_TIMESTAMP > c.valid_until THEN 'Coupon has expired'
            WHEN c.max_uses IS NOT NULL AND c.current_uses >= c.max_uses THEN 'Coupon usage limit reached'
            ELSE NULL
        END AS error_message
    FROM coupons c
    WHERE LOWER(c.coupon_code) = LOWER(input_code);
    
    -- If no coupon found, return invalid result
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 0::numeric, 0::numeric, ''::text, 'Invalid coupon code'::text;
    END IF;
END;
$$;

-- Add RLS policy for authenticated users to validate coupons (read-only for active coupons)
CREATE POLICY "Authenticated users can validate coupons"
ON public.coupons
FOR SELECT
USING (
  auth.role() = 'authenticated' 
  AND is_active = true
  AND (valid_from IS NULL OR valid_from <= CURRENT_TIMESTAMP)
  AND (valid_until IS NULL OR valid_until >= CURRENT_TIMESTAMP)
);
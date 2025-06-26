
-- Add missing columns to orders table for coupon functionality
ALTER TABLE public.orders 
ADD COLUMN coupon_applied text,
ADD COLUMN discount_amount integer DEFAULT 0;

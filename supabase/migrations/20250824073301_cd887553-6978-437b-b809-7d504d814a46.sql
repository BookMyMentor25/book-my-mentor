-- Update all existing coupon codes to have lifetime validity
UPDATE public.coupons 
SET valid_until = NULL, 
    valid_from = CURRENT_DATE
WHERE valid_until IS NOT NULL;

-- Also update referral codes to have lifetime validity
UPDATE public."Referral" 
SET valid_until = NULL,
    valid_from = CURRENT_DATE
WHERE valid_until IS NOT NULL;
-- Update First30 coupon to provide Rs 3000 fixed discount instead of 30% percentage discount
UPDATE coupons 
SET discount_percent = NULL, 
    discount_amount = 3000.00,
    discount_type = 'fixed',
    description = 'Rs 3000 off discount'
WHERE coupon_code = 'First30';
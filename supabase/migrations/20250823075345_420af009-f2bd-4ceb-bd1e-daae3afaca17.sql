-- Create Unstop30 coupon code with Rs 3000 fixed discount, unlimited uses, and no expiry
INSERT INTO coupons (
    coupon_code,
    discount_percent,
    discount_amount,
    discount_type,
    description,
    is_active,
    is_reusable,
    valid_from,
    valid_until,
    max_uses,
    current_uses,
    minimum_purchase_amount
) VALUES (
    'Unstop30',
    0.00,
    3000.00,
    'fixed',
    'Rs 3000 off discount - unlimited uses',
    true,
    true,
    now(),
    NULL,
    NULL,
    0,
    NULL
);
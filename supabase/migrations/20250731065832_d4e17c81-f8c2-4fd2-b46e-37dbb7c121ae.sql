-- Add FIRST50 coupon code to the database
INSERT INTO coupons (coupon_code, discount_percent, description, is_active, is_reusable, valid_from, valid_until)
VALUES ('FIRST50', 50.00, '50% off for new users', true, true, NOW(), NOW() + INTERVAL '1 year');
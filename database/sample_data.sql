USE inventory_db;

INSERT INTO coupons (code, discount_percent) VALUES
('ABC', 10.00),
('XYZ', 15.00),
('WELCOME', 5.00),
('SUMMER20', 20.00),
('SAVE10', 10.00),
('NEWUSER', 25.00)
ON DUPLICATE KEY UPDATE discount_percent = VALUES(discount_percent);

INSERT INTO invoices (subtotal, coupon_code, discount_percent, discount_amount, final_price, created_at) VALUES
(100.00, 'ABC', 10.00, 10.00, 90.00, NOW()),
(250.00, 'XYZ', 15.00, 37.50, 212.50, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(75.50, NULL, 0.00, 0.00, 75.50, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(500.00, 'SUMMER20', 20.00, 100.00, 400.00, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(150.00, 'WELCOME', 5.00, 7.50, 142.50, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(320.00, NULL, 0.00, 0.00, 320.00, DATE_SUB(NOW(), INTERVAL 5 DAY));

INSERT INTO invoice_items (invoice_id, item_name, quantity, price, total) VALUES
(1, 'Laptop', 1, 80.00, 80.00),
(1, 'Mouse', 2, 10.00, 20.00),

(2, 'Keyboard', 3, 25.00, 75.00),
(2, 'Monitor', 1, 150.00, 150.00),
(2, 'Webcam', 1, 25.00, 25.00),

(3, 'USB Cable', 5, 5.00, 25.00),
(3, 'HDMI Cable', 2, 15.00, 30.00),
(3, 'Adapter', 1, 20.50, 20.50),

(4, 'Tablet', 2, 200.00, 400.00),
(4, 'Stylus', 2, 50.00, 100.00),

(5, 'Headphones', 1, 80.00, 80.00),
(5, 'Speaker', 1, 70.00, 70.00),

(6, 'SSD Drive', 2, 100.00, 200.00),
(6, 'RAM Module', 2, 60.00, 120.00);


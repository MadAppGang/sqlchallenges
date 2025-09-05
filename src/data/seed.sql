-- Insert categories
INSERT INTO categories VALUES
(1, 'Electronics', 'Electronic devices and gadgets'),
(2, 'Clothing', 'Fashion and apparel'),
(3, 'Books', 'Books and educational materials'),
(4, 'Home & Garden', 'Home improvement and gardening'),
(5, 'Sports', 'Sports and fitness equipment');

-- Insert products
INSERT INTO products VALUES
(1, 'Smartphone Pro', 1, 899.99, 50, '2024-01-15'),
(2, 'Laptop Ultra', 1, 1299.99, 25, '2024-01-20'),
(3, 'Wireless Headphones', 1, 199.99, 100, '2024-02-01'),
(4, 'Designer Jeans', 2, 89.99, 75, '2024-01-10'),
(5, 'Cotton T-Shirt', 2, 24.99, 200, '2024-01-05'),
(6, 'SQL Mastery Book', 3, 49.99, 30, '2024-02-15'),
(7, 'Garden Hose', 4, 34.99, 40, '2024-01-25'),
(8, 'Running Shoes', 5, 129.99, 60, '2024-02-10'),
(9, 'Yoga Mat', 5, 39.99, 80, '2024-01-30'),
(10, 'Coffee Maker', 4, 159.99, 20, '2024-02-05');

-- Insert customers
INSERT INTO customers VALUES
(1, 'John', 'Smith', 'john.smith@email.com', '2023-06-15', 'New York', 'USA'),
(2, 'Sarah', 'Johnson', 'sarah.j@email.com', '2023-08-22', 'London', 'UK'),
(3, 'Mike', 'Davis', 'mike.davis@email.com', '2023-09-10', 'Toronto', 'Canada'),
(4, 'Emma', 'Wilson', 'emma.w@email.com', '2023-11-05', 'Sydney', 'Australia'),
(5, 'Alex', 'Brown', 'alex.brown@email.com', '2024-01-12', 'Berlin', 'Germany'),
(6, 'Lisa', 'Garcia', 'lisa.garcia@email.com', '2024-02-08', 'Madrid', 'Spain'),
(7, 'David', 'Lee', 'david.lee@email.com', '2023-12-20', 'Seoul', 'South Korea'),
(8, 'Anna', 'Taylor', 'anna.taylor@email.com', '2024-01-25', 'Paris', 'France');

-- Insert orders
INSERT INTO orders VALUES
(1, 1, '2024-08-15', 'completed', 1099.98),
(2, 2, '2024-08-20', 'completed', 1349.98),
(3, 1, '2024-08-25', 'completed', 89.99),
(4, 3, '2024-08-28', 'completed', 234.97),
(5, 4, '2024-09-01', 'pending', 199.99),
(6, 2, '2024-09-02', 'completed', 159.99),
(7, 5, '2024-09-03', 'completed', 169.98),
(8, 1, '2024-09-04', 'completed', 49.99),
(9, 6, '2024-09-05', 'pending', 74.98),
(10, 3, '2024-08-18', 'completed', 899.99),
(11, 7, '2024-08-22', 'completed', 129.99),
(12, 8, '2024-08-30', 'completed', 194.98);

-- Insert order items
INSERT INTO order_items VALUES
(1, 1, 1, 1, 899.99),  -- John's first order: Smartphone
(2, 1, 3, 1, 199.99),  -- John's first order: Headphones
(3, 2, 2, 1, 1299.99), -- Sarah's first order: Laptop
(4, 2, 5, 2, 24.99),   -- Sarah's first order: 2x T-Shirts
(5, 3, 4, 1, 89.99),   -- John's second order: Jeans
(6, 4, 5, 3, 24.99),   -- Mike's order: 3x T-Shirts
(7, 4, 9, 4, 39.99),   -- Mike's order: 4x Yoga Mats
(8, 5, 3, 1, 199.99),  -- Emma's order: Headphones
(9, 6, 10, 1, 159.99), -- Sarah's second order: Coffee Maker
(10, 7, 8, 1, 129.99), -- Alex's order: Running Shoes
(11, 7, 9, 1, 39.99),  -- Alex's order: Yoga Mat
(12, 8, 6, 1, 49.99),  -- John's third order: SQL Book
(13, 9, 5, 3, 24.99),  -- Lisa's order: 3x T-Shirts
(14, 10, 1, 1, 899.99),-- Mike's second order: Smartphone
(15, 11, 8, 1, 129.99),-- David's order: Running Shoes
(16, 12, 3, 1, 199.99),-- Anna's order: Headphones
(17, 12, 9, 2, 39.99); -- Anna's order: 2x Yoga Mats - this should make total 279.97 but order shows 194.98 (intentional data issue for testing)
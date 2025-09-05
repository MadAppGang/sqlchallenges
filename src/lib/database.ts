import { PGlite } from "@electric-sql/pglite";

let db: PGlite | null = null;

// SQL for creating tables
const dbSchema = `
-- Create tables
CREATE TABLE categories (
    category_id INT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(200) NOT NULL,
    category_id INT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    created_at DATE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    registration_date DATE,
    city VARCHAR(50),
    country VARCHAR(50)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
`;

// SQL for seed data
const seedData = `
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
`;

/**
 * Initialize the PGlite database with schema and seed data
 */
export async function initializeDatabase(): Promise<PGlite> {
	if (db) {
		return db;
	}

	try {
		// Create a new PGlite instance without any filesystem dependencies
		db = new PGlite();

		console.log("Initializing database schema...");
		// Create tables
		await db.exec(dbSchema);

		console.log("Seeding database with initial data...");
		// Insert seed data
		await db.exec(seedData);

		console.log("Database initialized successfully!");
		return db;
	} catch (error) {
		console.error("Failed to initialize database:", error);
		throw error;
	}
}

/**
 * Get the current database instance
 */
export function getDatabase(): PGlite | null {
	return db;
}

/**
 * Execute a SQL query and return results
 */
export async function executeQuery(
	sql: string,
): Promise<{
	results: Record<string, string | number | null>[];
	error?: string;
	executionTime: number;
}> {
	const startTime = performance.now();

	try {
		if (!db) {
			await initializeDatabase();
		}

		const result = await db!.query(sql);
		const executionTime = Math.round(performance.now() - startTime);

		// Convert the result to our expected format
		const formattedResults = result.rows.map((row) => {
			const formattedRow: Record<string, string | number | null> = {};
			for (const [key, value] of Object.entries(row)) {
				formattedRow[key] = value as string | number | null;
			}
			return formattedRow;
		});

		return {
			results: formattedResults,
			executionTime,
		};
	} catch (error) {
		const executionTime = Math.round(performance.now() - startTime);
		return {
			results: [],
			error: error instanceof Error ? error.message : "Query execution failed",
			executionTime,
		};
	}
}

/**
 * Get table schemas information for display
 */
export async function getTableSchemas() {
	if (!db) {
		await initializeDatabase();
	}

	const schemaQuery = `
		SELECT 
			t.table_name,
			json_agg(
				json_build_object(
					'name', c.column_name,
					'type', c.data_type,
					'nullable', c.is_nullable = 'YES',
					'default', c.column_default,
					'primaryKey', EXISTS (
						SELECT 1 FROM information_schema.table_constraints tc
						JOIN information_schema.key_column_usage kcu
						ON tc.constraint_name = kcu.constraint_name
						WHERE tc.table_name = t.table_name
						AND tc.constraint_type = 'PRIMARY KEY'
						AND kcu.column_name = c.column_name
					),
					'foreignKey', EXISTS (
						SELECT 1 FROM information_schema.table_constraints tc
						JOIN information_schema.key_column_usage kcu
						ON tc.constraint_name = kcu.constraint_name
						WHERE tc.table_name = t.table_name
						AND tc.constraint_type = 'FOREIGN KEY'
						AND kcu.column_name = c.column_name
					)
				) ORDER BY c.ordinal_position
			) as columns
		FROM information_schema.tables t
		JOIN information_schema.columns c ON t.table_name = c.table_name
		WHERE t.table_schema = 'public'
		GROUP BY t.table_name
		ORDER BY t.table_name;
	`;

	const result = await db!.query(schemaQuery);
	return result.rows;
}

/**
 * Reset the database to initial state
 */
export async function resetDatabase() {
	if (db) {
		await db.close();
		db = null;
	}
	await initializeDatabase();
}
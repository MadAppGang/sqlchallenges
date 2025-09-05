export interface TableSchema {
	tableName: string;
	columns: {
		name: string;
		type: string;
		description?: string;
	}[];
	sampleData: Record<string, any>[];
}

export interface ChallengeData {
	id: number;
	title: string;
	difficulty: "Easy" | "Medium" | "Hard";
	description: string;
	tables: TableSchema[];
	expectedOutput?: string;
	status: "completed" | "current" | "locked";
}

export const mockChallenges: ChallengeData[] = [
	{
		id: 1,
		title: "Basic SELECT Statement",
		difficulty: "Easy",
		status: "current",
		description: `Write a SQL query to select all customers from the customers table who are located in 'New York'.

Your query should return the customer ID, name, and email for all customers in New York.`,
		tables: [
			{
				tableName: "customers",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique customer identifier",
					},
					{
						name: "name",
						type: "VARCHAR(100)",
						description: "Customer full name",
					},
					{
						name: "email",
						type: "VARCHAR(100)",
						description: "Customer email address",
					},
					{ name: "city", type: "VARCHAR(50)", description: "Customer city" },
					{ name: "state", type: "VARCHAR(50)", description: "Customer state" },
				],
				sampleData: [
					{
						id: 1,
						name: "John Doe",
						email: "john@email.com",
						city: "New York",
						state: "NY",
					},
					{
						id: 2,
						name: "Jane Smith",
						email: "jane@email.com",
						city: "Los Angeles",
						state: "CA",
					},
					{
						id: 3,
						name: "Bob Johnson",
						email: "bob@email.com",
						city: "New York",
						state: "NY",
					},
					{
						id: 4,
						name: "Alice Brown",
						email: "alice@email.com",
						city: "Chicago",
						state: "IL",
					},
					{
						id: 5,
						name: "Charlie Wilson",
						email: "charlie@email.com",
						city: "New York",
						state: "NY",
					},
				],
			},
		],
		expectedOutput: `id | name          | email
1  | John Doe      | john@email.com
3  | Bob Johnson   | bob@email.com
5  | Charlie Wilson| charlie@email.com`,
	},
	{
		id: 2,
		title: "JOIN Operations",
		difficulty: "Medium",
		status: "locked",
		description: `Write a SQL query to find all orders along with customer information.

Join the orders and customers tables to show:
- Order ID
- Customer name
- Order date
- Total amount

Sort the results by order date in descending order.`,
		tables: [
			{
				tableName: "customers",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique customer identifier",
					},
					{
						name: "name",
						type: "VARCHAR(100)",
						description: "Customer full name",
					},
					{
						name: "email",
						type: "VARCHAR(100)",
						description: "Customer email address",
					},
				],
				sampleData: [
					{ id: 1, name: "John Doe", email: "john@email.com" },
					{ id: 2, name: "Jane Smith", email: "jane@email.com" },
					{ id: 3, name: "Bob Johnson", email: "bob@email.com" },
				],
			},
			{
				tableName: "orders",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique order identifier",
					},
					{
						name: "customer_id",
						type: "INTEGER",
						description: "Foreign key to customers table",
					},
					{
						name: "order_date",
						type: "DATE",
						description: "Date when order was placed",
					},
					{
						name: "total_amount",
						type: "DECIMAL(10,2)",
						description: "Total order amount",
					},
				],
				sampleData: [
					{
						id: 101,
						customer_id: 1,
						order_date: "2024-01-15",
						total_amount: 299.99,
					},
					{
						id: 102,
						customer_id: 2,
						order_date: "2024-01-16",
						total_amount: 149.5,
					},
					{
						id: 103,
						customer_id: 1,
						order_date: "2024-01-17",
						total_amount: 75.25,
					},
					{
						id: 104,
						customer_id: 3,
						order_date: "2024-01-18",
						total_amount: 520.0,
					},
				],
			},
		],
	},
	{
		id: 3,
		title: "Advanced Aggregations",
		difficulty: "Hard",
		status: "locked",
		description: `Write a SQL query to analyze sales performance by product category.

Your query should return:
- Product category
- Total revenue
- Number of orders
- Average order value
- Best selling product in each category

Only include categories with more than 5 orders and sort by total revenue descending.`,
		tables: [
			{
				tableName: "customers",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique customer identifier",
					},
					{
						name: "name",
						type: "VARCHAR(100)",
						description: "Customer full name",
					},
					{
						name: "email",
						type: "VARCHAR(100)",
						description: "Customer email address",
					},
					{ name: "city", type: "VARCHAR(50)", description: "Customer city" },
				],
				sampleData: [
					{
						id: 1,
						name: "John Doe",
						email: "john@email.com",
						city: "New York",
					},
					{
						id: 2,
						name: "Jane Smith",
						email: "jane@email.com",
						city: "Los Angeles",
					},
					{
						id: 3,
						name: "Bob Johnson",
						email: "bob@email.com",
						city: "Chicago",
					},
				],
			},
			{
				tableName: "orders",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique order identifier",
					},
					{
						name: "customer_id",
						type: "INTEGER",
						description: "Foreign key to customers table",
					},
					{
						name: "order_date",
						type: "DATE",
						description: "Date when order was placed",
					},
					{
						name: "total_amount",
						type: "DECIMAL(10,2)",
						description: "Total order amount",
					},
				],
				sampleData: [
					{
						id: 101,
						customer_id: 1,
						order_date: "2024-01-15",
						total_amount: 299.99,
					},
					{
						id: 102,
						customer_id: 2,
						order_date: "2024-01-16",
						total_amount: 149.5,
					},
					{
						id: 103,
						customer_id: 1,
						order_date: "2024-01-17",
						total_amount: 75.25,
					},
					{
						id: 104,
						customer_id: 3,
						order_date: "2024-01-18",
						total_amount: 520.0,
					},
				],
			},
			{
				tableName: "products",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique product identifier",
					},
					{ name: "name", type: "VARCHAR(100)", description: "Product name" },
					{
						name: "category_id",
						type: "INTEGER",
						description: "Foreign key to categories table",
					},
					{
						name: "price",
						type: "DECIMAL(10,2)",
						description: "Product price",
					},
					{
						name: "supplier_id",
						type: "INTEGER",
						description: "Foreign key to suppliers table",
					},
				],
				sampleData: [
					{
						id: 1,
						name: "Laptop",
						category_id: 1,
						price: 999.99,
						supplier_id: 1,
					},
					{
						id: 2,
						name: "T-Shirt",
						category_id: 2,
						price: 29.99,
						supplier_id: 2,
					},
					{
						id: 3,
						name: "Coffee Maker",
						category_id: 3,
						price: 149.99,
						supplier_id: 1,
					},
				],
			},
			{
				tableName: "categories",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique category identifier",
					},
					{ name: "name", type: "VARCHAR(50)", description: "Category name" },
					{
						name: "description",
						type: "TEXT",
						description: "Category description",
					},
				],
				sampleData: [
					{
						id: 1,
						name: "Electronics",
						description: "Electronic devices and gadgets",
					},
					{ id: 2, name: "Clothing", description: "Apparel and fashion items" },
					{
						id: 3,
						name: "Appliances",
						description: "Home and kitchen appliances",
					},
				],
			},
			{
				tableName: "suppliers",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique supplier identifier",
					},
					{
						name: "name",
						type: "VARCHAR(100)",
						description: "Supplier company name",
					},
					{
						name: "contact_email",
						type: "VARCHAR(100)",
						description: "Supplier contact email",
					},
				],
				sampleData: [
					{ id: 1, name: "TechCorp Ltd", contact_email: "sales@techcorp.com" },
					{
						id: 2,
						name: "Fashion Hub",
						contact_email: "orders@fashionhub.com",
					},
				],
			},
			{
				tableName: "order_items",
				columns: [
					{
						name: "order_id",
						type: "INTEGER",
						description: "Foreign key to orders table",
					},
					{
						name: "product_id",
						type: "INTEGER",
						description: "Foreign key to products table",
					},
					{
						name: "quantity",
						type: "INTEGER",
						description: "Quantity ordered",
					},
					{
						name: "unit_price",
						type: "DECIMAL(10,2)",
						description: "Price per unit at time of order",
					},
				],
				sampleData: [
					{ order_id: 101, product_id: 1, quantity: 1, unit_price: 999.99 },
					{ order_id: 102, product_id: 2, quantity: 3, unit_price: 29.99 },
					{ order_id: 103, product_id: 3, quantity: 1, unit_price: 149.99 },
					{ order_id: 104, product_id: 1, quantity: 2, unit_price: 999.99 },
				],
			},
			{
				tableName: "reviews",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique review identifier",
					},
					{
						name: "product_id",
						type: "INTEGER",
						description: "Foreign key to products table",
					},
					{
						name: "customer_id",
						type: "INTEGER",
						description: "Foreign key to customers table",
					},
					{
						name: "rating",
						type: "INTEGER",
						description: "Rating from 1 to 5",
					},
					{ name: "comment", type: "TEXT", description: "Review comment" },
					{
						name: "created_at",
						type: "TIMESTAMP",
						description: "Review creation date",
					},
				],
				sampleData: [
					{
						id: 1,
						product_id: 1,
						customer_id: 1,
						rating: 5,
						comment: "Excellent laptop!",
						created_at: "2024-01-20 10:30:00",
					},
					{
						id: 2,
						product_id: 2,
						customer_id: 2,
						rating: 4,
						comment: "Good quality shirt",
						created_at: "2024-01-21 14:15:00",
					},
					{
						id: 3,
						product_id: 3,
						customer_id: 3,
						rating: 5,
						comment: "Perfect coffee maker",
						created_at: "2024-01-22 09:45:00",
					},
				],
			},
			{
				tableName: "inventory",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique inventory identifier",
					},
					{
						name: "product_id",
						type: "INTEGER",
						description: "Foreign key to products table",
					},
					{
						name: "warehouse_id",
						type: "INTEGER",
						description: "Foreign key to warehouses table",
					},
					{
						name: "quantity",
						type: "INTEGER",
						description: "Current stock quantity",
					},
					{
						name: "reorder_level",
						type: "INTEGER",
						description: "Minimum stock before reorder",
					},
					{
						name: "last_updated",
						type: "TIMESTAMP",
						description: "Last inventory update",
					},
				],
				sampleData: [
					{
						id: 1,
						product_id: 1,
						warehouse_id: 1,
						quantity: 50,
						reorder_level: 10,
						last_updated: "2024-01-19 16:00:00",
					},
					{
						id: 2,
						product_id: 2,
						warehouse_id: 2,
						quantity: 200,
						reorder_level: 50,
						last_updated: "2024-01-19 16:00:00",
					},
					{
						id: 3,
						product_id: 3,
						warehouse_id: 1,
						quantity: 25,
						reorder_level: 5,
						last_updated: "2024-01-19 16:00:00",
					},
				],
			},
			{
				tableName: "warehouses",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique warehouse identifier",
					},
					{ name: "name", type: "VARCHAR(100)", description: "Warehouse name" },
					{
						name: "address",
						type: "VARCHAR(255)",
						description: "Warehouse address",
					},
					{ name: "city", type: "VARCHAR(50)", description: "Warehouse city" },
					{
						name: "state",
						type: "VARCHAR(50)",
						description: "Warehouse state",
					},
					{
						name: "manager_id",
						type: "INTEGER",
						description: "Foreign key to employees table",
					},
				],
				sampleData: [
					{
						id: 1,
						name: "Main Warehouse",
						address: "123 Industrial Ave",
						city: "Newark",
						state: "NJ",
						manager_id: 1,
					},
					{
						id: 2,
						name: "West Coast Hub",
						address: "456 Commerce Blvd",
						city: "Los Angeles",
						state: "CA",
						manager_id: 2,
					},
				],
			},
			{
				tableName: "employees",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique employee identifier",
					},
					{
						name: "first_name",
						type: "VARCHAR(50)",
						description: "Employee first name",
					},
					{
						name: "last_name",
						type: "VARCHAR(50)",
						description: "Employee last name",
					},
					{
						name: "email",
						type: "VARCHAR(100)",
						description: "Employee email",
					},
					{
						name: "department_id",
						type: "INTEGER",
						description: "Foreign key to departments table",
					},
					{
						name: "position",
						type: "VARCHAR(100)",
						description: "Employee position",
					},
					{
						name: "hire_date",
						type: "DATE",
						description: "Employee hire date",
					},
					{
						name: "salary",
						type: "DECIMAL(10,2)",
						description: "Employee salary",
					},
				],
				sampleData: [
					{
						id: 1,
						first_name: "Mike",
						last_name: "Johnson",
						email: "mike.j@company.com",
						department_id: 1,
						position: "Warehouse Manager",
						hire_date: "2023-01-15",
						salary: 65000.0,
					},
					{
						id: 2,
						first_name: "Sarah",
						last_name: "Davis",
						email: "sarah.d@company.com",
						department_id: 1,
						position: "Warehouse Manager",
						hire_date: "2023-03-01",
						salary: 67000.0,
					},
					{
						id: 3,
						first_name: "Tom",
						last_name: "Wilson",
						email: "tom.w@company.com",
						department_id: 2,
						position: "Sales Representative",
						hire_date: "2023-02-10",
						salary: 55000.0,
					},
				],
			},
			{
				tableName: "departments",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique department identifier",
					},
					{
						name: "name",
						type: "VARCHAR(100)",
						description: "Department name",
					},
					{
						name: "description",
						type: "TEXT",
						description: "Department description",
					},
					{
						name: "budget",
						type: "DECIMAL(12,2)",
						description: "Department annual budget",
					},
				],
				sampleData: [
					{
						id: 1,
						name: "Operations",
						description: "Warehouse and logistics operations",
						budget: 500000.0,
					},
					{
						id: 2,
						name: "Sales",
						description: "Customer sales and relations",
						budget: 300000.0,
					},
					{
						id: 3,
						name: "Marketing",
						description: "Product marketing and advertising",
						budget: 250000.0,
					},
				],
			},
			{
				tableName: "promotions",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique promotion identifier",
					},
					{ name: "name", type: "VARCHAR(100)", description: "Promotion name" },
					{
						name: "description",
						type: "TEXT",
						description: "Promotion description",
					},
					{
						name: "discount_percent",
						type: "DECIMAL(5,2)",
						description: "Discount percentage",
					},
					{
						name: "start_date",
						type: "DATE",
						description: "Promotion start date",
					},
					{ name: "end_date", type: "DATE", description: "Promotion end date" },
					{
						name: "category_id",
						type: "INTEGER",
						description: "Foreign key to categories table",
					},
				],
				sampleData: [
					{
						id: 1,
						name: "Summer Electronics Sale",
						description: "20% off all electronics",
						discount_percent: 20.0,
						start_date: "2024-06-01",
						end_date: "2024-08-31",
						category_id: 1,
					},
					{
						id: 2,
						name: "Back to School",
						description: "15% off clothing items",
						discount_percent: 15.0,
						start_date: "2024-08-15",
						end_date: "2024-09-15",
						category_id: 2,
					},
				],
			},
			{
				tableName: "shipping",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique shipping identifier",
					},
					{
						name: "order_id",
						type: "INTEGER",
						description: "Foreign key to orders table",
					},
					{
						name: "carrier",
						type: "VARCHAR(50)",
						description: "Shipping carrier",
					},
					{
						name: "tracking_number",
						type: "VARCHAR(100)",
						description: "Package tracking number",
					},
					{
						name: "shipped_date",
						type: "DATE",
						description: "Date package was shipped",
					},
					{
						name: "estimated_delivery",
						type: "DATE",
						description: "Estimated delivery date",
					},
					{
						name: "actual_delivery",
						type: "DATE",
						description: "Actual delivery date",
					},
				],
				sampleData: [
					{
						id: 1,
						order_id: 101,
						carrier: "UPS",
						tracking_number: "1Z999AA1234567890",
						shipped_date: "2024-01-16",
						estimated_delivery: "2024-01-18",
						actual_delivery: "2024-01-18",
					},
					{
						id: 2,
						order_id: 102,
						carrier: "FedEx",
						tracking_number: "8004-5555-6666",
						shipped_date: "2024-01-17",
						estimated_delivery: "2024-01-19",
						actual_delivery: null,
					},
				],
			},
			{
				tableName: "payments",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique payment identifier",
					},
					{
						name: "order_id",
						type: "INTEGER",
						description: "Foreign key to orders table",
					},
					{
						name: "payment_method",
						type: "VARCHAR(50)",
						description: "Payment method used",
					},
					{
						name: "transaction_id",
						type: "VARCHAR(100)",
						description: "External transaction ID",
					},
					{
						name: "amount",
						type: "DECIMAL(10,2)",
						description: "Payment amount",
					},
					{
						name: "status",
						type: "VARCHAR(20)",
						description: "Payment status",
					},
					{
						name: "processed_at",
						type: "TIMESTAMP",
						description: "Payment processing time",
					},
				],
				sampleData: [
					{
						id: 1,
						order_id: 101,
						payment_method: "Credit Card",
						transaction_id: "txn_abc123",
						amount: 299.99,
						status: "completed",
						processed_at: "2024-01-15 12:30:00",
					},
					{
						id: 2,
						order_id: 102,
						payment_method: "PayPal",
						transaction_id: "txn_def456",
						amount: 149.5,
						status: "completed",
						processed_at: "2024-01-16 09:15:00",
					},
				],
			},
			{
				tableName: "addresses",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique address identifier",
					},
					{
						name: "customer_id",
						type: "INTEGER",
						description: "Foreign key to customers table",
					},
					{
						name: "type",
						type: "VARCHAR(20)",
						description: "Address type (billing, shipping)",
					},
					{
						name: "street",
						type: "VARCHAR(255)",
						description: "Street address",
					},
					{ name: "city", type: "VARCHAR(100)", description: "City name" },
					{
						name: "state",
						type: "VARCHAR(50)",
						description: "State or province",
					},
					{ name: "zip_code", type: "VARCHAR(20)", description: "Postal code" },
					{ name: "country", type: "VARCHAR(50)", description: "Country name" },
				],
				sampleData: [
					{
						id: 1,
						customer_id: 1,
						type: "shipping",
						street: "123 Main St",
						city: "New York",
						state: "NY",
						zip_code: "10001",
						country: "USA",
					},
					{
						id: 2,
						customer_id: 1,
						type: "billing",
						street: "123 Main St",
						city: "New York",
						state: "NY",
						zip_code: "10001",
						country: "USA",
					},
					{
						id: 3,
						customer_id: 2,
						type: "shipping",
						street: "456 Oak Ave",
						city: "Los Angeles",
						state: "CA",
						zip_code: "90210",
						country: "USA",
					},
				],
			},
			{
				tableName: "product_images",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique image identifier",
					},
					{
						name: "product_id",
						type: "INTEGER",
						description: "Foreign key to products table",
					},
					{
						name: "image_url",
						type: "VARCHAR(500)",
						description: "Image file URL",
					},
					{
						name: "alt_text",
						type: "VARCHAR(255)",
						description: "Alt text for accessibility",
					},
					{
						name: "display_order",
						type: "INTEGER",
						description: "Image display priority",
					},
					{
						name: "is_primary",
						type: "BOOLEAN",
						description: "Primary product image flag",
					},
				],
				sampleData: [
					{
						id: 1,
						product_id: 1,
						image_url: "/images/laptop_main.jpg",
						alt_text: "Gaming laptop front view",
						display_order: 1,
						is_primary: true,
					},
					{
						id: 2,
						product_id: 1,
						image_url: "/images/laptop_side.jpg",
						alt_text: "Gaming laptop side view",
						display_order: 2,
						is_primary: false,
					},
					{
						id: 3,
						product_id: 2,
						image_url: "/images/tshirt_blue.jpg",
						alt_text: "Blue cotton t-shirt",
						display_order: 1,
						is_primary: true,
					},
				],
			},
			{
				tableName: "coupons",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique coupon identifier",
					},
					{ name: "code", type: "VARCHAR(50)", description: "Coupon code" },
					{
						name: "description",
						type: "TEXT",
						description: "Coupon description",
					},
					{
						name: "discount_type",
						type: "VARCHAR(20)",
						description: "Discount type (percentage, fixed)",
					},
					{
						name: "discount_value",
						type: "DECIMAL(10,2)",
						description: "Discount amount or percentage",
					},
					{
						name: "min_order_amount",
						type: "DECIMAL(10,2)",
						description: "Minimum order amount",
					},
					{
						name: "usage_limit",
						type: "INTEGER",
						description: "Maximum usage count",
					},
					{
						name: "used_count",
						type: "INTEGER",
						description: "Current usage count",
					},
					{
						name: "valid_from",
						type: "DATE",
						description: "Coupon valid start date",
					},
					{
						name: "valid_until",
						type: "DATE",
						description: "Coupon expiration date",
					},
				],
				sampleData: [
					{
						id: 1,
						code: "SAVE20",
						description: "20% off orders over $100",
						discount_type: "percentage",
						discount_value: 20.0,
						min_order_amount: 100.0,
						usage_limit: 1000,
						used_count: 45,
						valid_from: "2024-01-01",
						valid_until: "2024-03-31",
					},
					{
						id: 2,
						code: "FIRST10",
						description: "$10 off first order",
						discount_type: "fixed",
						discount_value: 10.0,
						min_order_amount: 50.0,
						usage_limit: 500,
						used_count: 23,
						valid_from: "2024-01-01",
						valid_until: "2024-12-31",
					},
				],
			},
			{
				tableName: "order_coupons",
				columns: [
					{
						name: "order_id",
						type: "INTEGER",
						description: "Foreign key to orders table",
					},
					{
						name: "coupon_id",
						type: "INTEGER",
						description: "Foreign key to coupons table",
					},
					{
						name: "discount_applied",
						type: "DECIMAL(10,2)",
						description: "Actual discount amount applied",
					},
				],
				sampleData: [
					{ order_id: 101, coupon_id: 1, discount_applied: 59.99 },
					{ order_id: 102, coupon_id: 2, discount_applied: 10.0 },
				],
			},
			{
				tableName: "return_requests",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique return request identifier",
					},
					{
						name: "order_id",
						type: "INTEGER",
						description: "Foreign key to orders table",
					},
					{
						name: "customer_id",
						type: "INTEGER",
						description: "Foreign key to customers table",
					},
					{
						name: "reason",
						type: "VARCHAR(100)",
						description: "Return reason",
					},
					{
						name: "description",
						type: "TEXT",
						description: "Detailed return description",
					},
					{
						name: "status",
						type: "VARCHAR(20)",
						description: "Return request status",
					},
					{
						name: "requested_at",
						type: "TIMESTAMP",
						description: "Return request date",
					},
					{
						name: "processed_by",
						type: "INTEGER",
						description: "Foreign key to employees table",
					},
					{
						name: "refund_amount",
						type: "DECIMAL(10,2)",
						description: "Approved refund amount",
					},
				],
				sampleData: [
					{
						id: 1,
						order_id: 103,
						customer_id: 1,
						reason: "Defective",
						description: "Coffee maker not working properly",
						status: "approved",
						requested_at: "2024-01-20 14:30:00",
						processed_by: 3,
						refund_amount: 149.99,
					},
					{
						id: 2,
						order_id: 102,
						customer_id: 2,
						reason: "Wrong size",
						description: "T-shirt too small",
						status: "pending",
						requested_at: "2024-01-22 10:15:00",
						processed_by: null,
						refund_amount: null,
					},
				],
			},
			{
				tableName: "audit_logs",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique audit log identifier",
					},
					{
						name: "table_name",
						type: "VARCHAR(50)",
						description: "Table that was modified",
					},
					{
						name: "record_id",
						type: "INTEGER",
						description: "ID of modified record",
					},
					{
						name: "action",
						type: "VARCHAR(20)",
						description: "Action performed (INSERT, UPDATE, DELETE)",
					},
					{
						name: "old_values",
						type: "JSON",
						description: "Previous values before change",
					},
					{
						name: "new_values",
						type: "JSON",
						description: "New values after change",
					},
					{
						name: "changed_by",
						type: "INTEGER",
						description: "Foreign key to employees table",
					},
					{
						name: "changed_at",
						type: "TIMESTAMP",
						description: "When the change occurred",
					},
				],
				sampleData: [
					{
						id: 1,
						table_name: "orders",
						record_id: 101,
						action: "UPDATE",
						old_values: '{"status":"pending"}',
						new_values: '{"status":"shipped"}',
						changed_by: 1,
						changed_at: "2024-01-16 15:30:00",
					},
					{
						id: 2,
						table_name: "inventory",
						record_id: 1,
						action: "UPDATE",
						old_values: '{"quantity":52}',
						new_values: '{"quantity":50}',
						changed_by: 2,
						changed_at: "2024-01-15 12:45:00",
					},
				],
			},
			{
				tableName: "tags",
				columns: [
					{ name: "id", type: "INTEGER", description: "Unique tag identifier" },
					{ name: "name", type: "VARCHAR(50)", description: "Tag name" },
					{ name: "description", type: "TEXT", description: "Tag description" },
					{
						name: "color",
						type: "VARCHAR(7)",
						description: "Tag color (hex code)",
					},
					{
						name: "created_at",
						type: "TIMESTAMP",
						description: "Tag creation date",
					},
				],
				sampleData: [
					{
						id: 1,
						name: "Gaming",
						description: "Gaming products",
						color: "#FF5722",
						created_at: "2024-01-01 00:00:00",
					},
					{
						id: 2,
						name: "Wireless",
						description: "Wireless technology",
						color: "#2196F3",
						created_at: "2024-01-01 00:00:00",
					},
					{
						id: 3,
						name: "Eco-Friendly",
						description: "Environmentally friendly products",
						color: "#4CAF50",
						created_at: "2024-01-01 00:00:00",
					},
				],
			},
			{
				tableName: "product_tags",
				columns: [
					{
						name: "product_id",
						type: "INTEGER",
						description: "Foreign key to products table",
					},
					{
						name: "tag_id",
						type: "INTEGER",
						description: "Foreign key to tags table",
					},
					{
						name: "created_at",
						type: "TIMESTAMP",
						description: "Assignment date",
					},
				],
				sampleData: [
					{ product_id: 1, tag_id: 1, created_at: "2024-01-10 12:00:00" },
					{ product_id: 1, tag_id: 2, created_at: "2024-01-10 12:00:00" },
					{ product_id: 2, tag_id: 3, created_at: "2024-01-10 12:00:00" },
				],
			},
			{
				tableName: "wishlists",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique wishlist identifier",
					},
					{
						name: "customer_id",
						type: "INTEGER",
						description: "Foreign key to customers table",
					},
					{ name: "name", type: "VARCHAR(100)", description: "Wishlist name" },
					{
						name: "is_public",
						type: "BOOLEAN",
						description: "Whether wishlist is public",
					},
					{
						name: "created_at",
						type: "TIMESTAMP",
						description: "Wishlist creation date",
					},
				],
				sampleData: [
					{
						id: 1,
						customer_id: 1,
						name: "My Wishlist",
						is_public: false,
						created_at: "2024-01-10 10:00:00",
					},
					{
						id: 2,
						customer_id: 2,
						name: "Birthday Gifts",
						is_public: true,
						created_at: "2024-01-12 14:30:00",
					},
				],
			},
			{
				tableName: "wishlist_items",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique wishlist item identifier",
					},
					{
						name: "wishlist_id",
						type: "INTEGER",
						description: "Foreign key to wishlists table",
					},
					{
						name: "product_id",
						type: "INTEGER",
						description: "Foreign key to products table",
					},
					{
						name: "added_at",
						type: "TIMESTAMP",
						description: "Item addition date",
					},
					{
						name: "priority",
						type: "INTEGER",
						description: "Item priority (1-5)",
					},
				],
				sampleData: [
					{
						id: 1,
						wishlist_id: 1,
						product_id: 1,
						added_at: "2024-01-10 10:30:00",
						priority: 5,
					},
					{
						id: 2,
						wishlist_id: 1,
						product_id: 3,
						added_at: "2024-01-11 09:15:00",
						priority: 3,
					},
					{
						id: 3,
						wishlist_id: 2,
						product_id: 2,
						added_at: "2024-01-12 15:00:00",
						priority: 4,
					},
				],
			},
			{
				tableName: "shopping_carts",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique cart identifier",
					},
					{
						name: "customer_id",
						type: "INTEGER",
						description: "Foreign key to customers table",
					},
					{
						name: "session_id",
						type: "VARCHAR(100)",
						description: "Session identifier for guest users",
					},
					{
						name: "created_at",
						type: "TIMESTAMP",
						description: "Cart creation date",
					},
					{
						name: "updated_at",
						type: "TIMESTAMP",
						description: "Last cart update",
					},
					{
						name: "expires_at",
						type: "TIMESTAMP",
						description: "Cart expiration date",
					},
				],
				sampleData: [
					{
						id: 1,
						customer_id: 1,
						session_id: null,
						created_at: "2024-01-20 10:00:00",
						updated_at: "2024-01-20 10:30:00",
						expires_at: "2024-01-27 10:00:00",
					},
					{
						id: 2,
						customer_id: null,
						session_id: "sess_abc123",
						created_at: "2024-01-20 14:00:00",
						updated_at: "2024-01-20 14:15:00",
						expires_at: "2024-01-27 14:00:00",
					},
				],
			},
			{
				tableName: "cart_items",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique cart item identifier",
					},
					{
						name: "cart_id",
						type: "INTEGER",
						description: "Foreign key to shopping_carts table",
					},
					{
						name: "product_id",
						type: "INTEGER",
						description: "Foreign key to products table",
					},
					{ name: "quantity", type: "INTEGER", description: "Item quantity" },
					{
						name: "unit_price",
						type: "DECIMAL(10,2)",
						description: "Price per unit when added",
					},
					{
						name: "added_at",
						type: "TIMESTAMP",
						description: "Item addition date",
					},
				],
				sampleData: [
					{
						id: 1,
						cart_id: 1,
						product_id: 1,
						quantity: 1,
						unit_price: 999.99,
						added_at: "2024-01-20 10:15:00",
					},
					{
						id: 2,
						cart_id: 1,
						product_id: 2,
						quantity: 2,
						unit_price: 29.99,
						added_at: "2024-01-20 10:30:00",
					},
					{
						id: 3,
						cart_id: 2,
						product_id: 3,
						quantity: 1,
						unit_price: 149.99,
						added_at: "2024-01-20 14:15:00",
					},
				],
			},
			{
				tableName: "notifications",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique notification identifier",
					},
					{
						name: "customer_id",
						type: "INTEGER",
						description: "Foreign key to customers table",
					},
					{
						name: "type",
						type: "VARCHAR(50)",
						description: "Notification type",
					},
					{
						name: "title",
						type: "VARCHAR(200)",
						description: "Notification title",
					},
					{
						name: "message",
						type: "TEXT",
						description: "Notification message",
					},
					{
						name: "is_read",
						type: "BOOLEAN",
						description: "Whether notification was read",
					},
					{
						name: "created_at",
						type: "TIMESTAMP",
						description: "Notification creation date",
					},
					{
						name: "read_at",
						type: "TIMESTAMP",
						description: "Notification read date",
					},
				],
				sampleData: [
					{
						id: 1,
						customer_id: 1,
						type: "order_shipped",
						title: "Order Shipped",
						message: "Your order #101 has been shipped",
						is_read: true,
						created_at: "2024-01-16 16:00:00",
						read_at: "2024-01-16 18:30:00",
					},
					{
						id: 2,
						customer_id: 2,
						type: "promotion",
						title: "Special Offer",
						message: "20% off electronics this week!",
						is_read: false,
						created_at: "2024-01-22 09:00:00",
						read_at: null,
					},
				],
			},
			{
				tableName: "tax_rates",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique tax rate identifier",
					},
					{ name: "country", type: "VARCHAR(50)", description: "Country name" },
					{
						name: "state",
						type: "VARCHAR(50)",
						description: "State or province",
					},
					{ name: "city", type: "VARCHAR(100)", description: "City name" },
					{
						name: "zip_code",
						type: "VARCHAR(20)",
						description: "ZIP/postal code",
					},
					{
						name: "tax_rate",
						type: "DECIMAL(5,4)",
						description: "Tax rate percentage",
					},
					{
						name: "tax_type",
						type: "VARCHAR(50)",
						description: "Type of tax (sales, VAT, etc)",
					},
					{
						name: "effective_date",
						type: "DATE",
						description: "When tax rate becomes effective",
					},
				],
				sampleData: [
					{
						id: 1,
						country: "USA",
						state: "NY",
						city: "New York",
						zip_code: "10001",
						tax_rate: 0.0825,
						tax_type: "Sales Tax",
						effective_date: "2024-01-01",
					},
					{
						id: 2,
						country: "USA",
						state: "CA",
						city: "Los Angeles",
						zip_code: "90210",
						tax_rate: 0.095,
						tax_type: "Sales Tax",
						effective_date: "2024-01-01",
					},
					{
						id: 3,
						country: "USA",
						state: "IL",
						city: "Chicago",
						zip_code: "60601",
						tax_rate: 0.1025,
						tax_type: "Sales Tax",
						effective_date: "2024-01-01",
					},
				],
			},
			{
				tableName: "subscription_plans",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique subscription plan identifier",
					},
					{ name: "name", type: "VARCHAR(100)", description: "Plan name" },
					{
						name: "description",
						type: "TEXT",
						description: "Plan description",
					},
					{
						name: "price",
						type: "DECIMAL(10,2)",
						description: "Monthly price",
					},
					{
						name: "billing_cycle",
						type: "VARCHAR(20)",
						description: "Billing frequency (monthly, yearly)",
					},
					{
						name: "features",
						type: "JSON",
						description: "Plan features as JSON array",
					},
					{
						name: "is_active",
						type: "BOOLEAN",
						description: "Whether plan is currently offered",
					},
					{
						name: "created_at",
						type: "TIMESTAMP",
						description: "Plan creation date",
					},
				],
				sampleData: [
					{
						id: 1,
						name: "Premium",
						description: "Premium membership with free shipping",
						price: 9.99,
						billing_cycle: "monthly",
						features:
							'["free_shipping", "priority_support", "exclusive_deals"]',
						is_active: true,
						created_at: "2024-01-01 00:00:00",
					},
					{
						id: 2,
						name: "VIP",
						description: "VIP membership with all benefits",
						price: 99.99,
						billing_cycle: "yearly",
						features:
							'["free_shipping", "priority_support", "exclusive_deals", "early_access", "personal_shopper"]',
						is_active: true,
						created_at: "2024-01-01 00:00:00",
					},
				],
			},
			{
				tableName: "customer_subscriptions",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique subscription identifier",
					},
					{
						name: "customer_id",
						type: "INTEGER",
						description: "Foreign key to customers table",
					},
					{
						name: "plan_id",
						type: "INTEGER",
						description: "Foreign key to subscription_plans table",
					},
					{
						name: "status",
						type: "VARCHAR(20)",
						description: "Subscription status",
					},
					{
						name: "started_at",
						type: "TIMESTAMP",
						description: "Subscription start date",
					},
					{
						name: "ends_at",
						type: "TIMESTAMP",
						description: "Subscription end date",
					},
					{
						name: "auto_renew",
						type: "BOOLEAN",
						description: "Whether subscription auto-renews",
					},
					{
						name: "payment_method_id",
						type: "INTEGER",
						description: "Default payment method",
					},
				],
				sampleData: [
					{
						id: 1,
						customer_id: 1,
						plan_id: 1,
						status: "active",
						started_at: "2024-01-01 00:00:00",
						ends_at: "2024-02-01 00:00:00",
						auto_renew: true,
						payment_method_id: 1,
					},
					{
						id: 2,
						customer_id: 3,
						plan_id: 2,
						status: "active",
						started_at: "2024-01-01 00:00:00",
						ends_at: "2025-01-01 00:00:00",
						auto_renew: true,
						payment_method_id: 2,
					},
				],
			},
			{
				tableName: "loyalty_points",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique points transaction identifier",
					},
					{
						name: "customer_id",
						type: "INTEGER",
						description: "Foreign key to customers table",
					},
					{
						name: "order_id",
						type: "INTEGER",
						description: "Foreign key to orders table",
					},
					{
						name: "points",
						type: "INTEGER",
						description: "Points earned or spent",
					},
					{
						name: "transaction_type",
						type: "VARCHAR(20)",
						description: "earned, spent, expired",
					},
					{
						name: "description",
						type: "VARCHAR(255)",
						description: "Transaction description",
					},
					{
						name: "created_at",
						type: "TIMESTAMP",
						description: "Transaction date",
					},
					{
						name: "expires_at",
						type: "TIMESTAMP",
						description: "Points expiration date",
					},
				],
				sampleData: [
					{
						id: 1,
						customer_id: 1,
						order_id: 101,
						points: 300,
						transaction_type: "earned",
						description: "Points earned from order #101",
						created_at: "2024-01-15 12:30:00",
						expires_at: "2025-01-15 12:30:00",
					},
					{
						id: 2,
						customer_id: 1,
						order_id: null,
						points: -100,
						transaction_type: "spent",
						description: "Points redeemed for discount",
						created_at: "2024-01-17 14:00:00",
						expires_at: null,
					},
					{
						id: 3,
						customer_id: 2,
						order_id: 102,
						points: 150,
						transaction_type: "earned",
						description: "Points earned from order #102",
						created_at: "2024-01-16 09:15:00",
						expires_at: "2025-01-16 09:15:00",
					},
				],
			},
			{
				tableName: "support_tickets",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique ticket identifier",
					},
					{
						name: "customer_id",
						type: "INTEGER",
						description: "Foreign key to customers table",
					},
					{
						name: "order_id",
						type: "INTEGER",
						description: "Foreign key to orders table",
					},
					{
						name: "subject",
						type: "VARCHAR(200)",
						description: "Ticket subject",
					},
					{
						name: "description",
						type: "TEXT",
						description: "Ticket description",
					},
					{
						name: "priority",
						type: "VARCHAR(20)",
						description: "Ticket priority (low, medium, high, urgent)",
					},
					{ name: "status", type: "VARCHAR(20)", description: "Ticket status" },
					{
						name: "assigned_to",
						type: "INTEGER",
						description: "Foreign key to employees table",
					},
					{
						name: "created_at",
						type: "TIMESTAMP",
						description: "Ticket creation date",
					},
					{
						name: "resolved_at",
						type: "TIMESTAMP",
						description: "Ticket resolution date",
					},
				],
				sampleData: [
					{
						id: 1,
						customer_id: 1,
						order_id: 103,
						subject: "Defective coffee maker",
						description: "The coffee maker I received is not working properly",
						priority: "high",
						status: "resolved",
						assigned_to: 3,
						created_at: "2024-01-20 10:00:00",
						resolved_at: "2024-01-21 15:30:00",
					},
					{
						id: 2,
						customer_id: 2,
						order_id: null,
						subject: "Account login issues",
						description: "Cannot log into my account",
						priority: "medium",
						status: "open",
						assigned_to: 3,
						created_at: "2024-01-22 09:30:00",
						resolved_at: null,
					},
				],
			},
			{
				tableName: "currencies",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique currency identifier",
					},
					{
						name: "code",
						type: "VARCHAR(3)",
						description: "ISO currency code",
					},
					{ name: "name", type: "VARCHAR(100)", description: "Currency name" },
					{
						name: "symbol",
						type: "VARCHAR(10)",
						description: "Currency symbol",
					},
					{
						name: "decimal_places",
						type: "INTEGER",
						description: "Number of decimal places",
					},
					{
						name: "is_active",
						type: "BOOLEAN",
						description: "Whether currency is accepted",
					},
				],
				sampleData: [
					{
						id: 1,
						code: "USD",
						name: "US Dollar",
						symbol: "$",
						decimal_places: 2,
						is_active: true,
					},
					{
						id: 2,
						code: "EUR",
						name: "Euro",
						symbol: "€",
						decimal_places: 2,
						is_active: true,
					},
					{
						id: 3,
						code: "GBP",
						name: "British Pound",
						symbol: "£",
						decimal_places: 2,
						is_active: true,
					},
					{
						id: 4,
						code: "JPY",
						name: "Japanese Yen",
						symbol: "¥",
						decimal_places: 0,
						is_active: true,
					},
				],
			},
			{
				tableName: "exchange_rates",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique exchange rate identifier",
					},
					{
						name: "from_currency_id",
						type: "INTEGER",
						description: "Foreign key to currencies table",
					},
					{
						name: "to_currency_id",
						type: "INTEGER",
						description: "Foreign key to currencies table",
					},
					{ name: "rate", type: "DECIMAL(10,6)", description: "Exchange rate" },
					{
						name: "effective_date",
						type: "DATE",
						description: "Rate effective date",
					},
					{
						name: "created_at",
						type: "TIMESTAMP",
						description: "Rate creation timestamp",
					},
				],
				sampleData: [
					{
						id: 1,
						from_currency_id: 1,
						to_currency_id: 2,
						rate: 0.85,
						effective_date: "2024-01-22",
						created_at: "2024-01-22 00:00:00",
					},
					{
						id: 2,
						from_currency_id: 1,
						to_currency_id: 3,
						rate: 0.79,
						effective_date: "2024-01-22",
						created_at: "2024-01-22 00:00:00",
					},
					{
						id: 3,
						from_currency_id: 1,
						to_currency_id: 4,
						rate: 149.5,
						effective_date: "2024-01-22",
						created_at: "2024-01-22 00:00:00",
					},
				],
			},
			{
				tableName: "api_keys",
				columns: [
					{
						name: "id",
						type: "INTEGER",
						description: "Unique API key identifier",
					},
					{
						name: "name",
						type: "VARCHAR(100)",
						description: "API key name/description",
					},
					{
						name: "key_hash",
						type: "VARCHAR(255)",
						description: "Hashed API key",
					},
					{
						name: "permissions",
						type: "JSON",
						description: "API permissions as JSON array",
					},
					{
						name: "customer_id",
						type: "INTEGER",
						description: "Foreign key to customers table",
					},
					{
						name: "is_active",
						type: "BOOLEAN",
						description: "Whether API key is active",
					},
					{
						name: "last_used_at",
						type: "TIMESTAMP",
						description: "Last usage timestamp",
					},
					{
						name: "created_at",
						type: "TIMESTAMP",
						description: "Key creation date",
					},
					{
						name: "expires_at",
						type: "TIMESTAMP",
						description: "Key expiration date",
					},
				],
				sampleData: [
					{
						id: 1,
						name: "Mobile App Integration",
						key_hash: "sha256:abc123...",
						permissions: '["orders.read", "products.read"]',
						customer_id: null,
						is_active: true,
						last_used_at: "2024-01-22 10:30:00",
						created_at: "2024-01-01 00:00:00",
						expires_at: "2025-01-01 00:00:00",
					},
					{
						id: 2,
						name: "Third-party Analytics",
						key_hash: "sha256:def456...",
						permissions: '["analytics.read"]',
						customer_id: null,
						is_active: true,
						last_used_at: "2024-01-22 09:15:00",
						created_at: "2024-01-01 00:00:00",
						expires_at: "2025-01-01 00:00:00",
					},
				],
			},
		],
	},
];

// Mock function to simulate SQL query execution
export const executeSqlQuery = async (query: string): Promise<any[]> => {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 1000));

	// Simple mock responses based on query content
	if (
		query.toLowerCase().includes("select") &&
		query.toLowerCase().includes("customers")
	) {
		if (query.toLowerCase().includes("new york")) {
			return [
				{ id: 1, name: "John Doe", email: "john@email.com" },
				{ id: 3, name: "Bob Johnson", email: "bob@email.com" },
				{ id: 5, name: "Charlie Wilson", email: "charlie@email.com" },
			];
		}
		return [
			{ id: 1, name: "John Doe", email: "john@email.com", city: "New York" },
			{
				id: 2,
				name: "Jane Smith",
				email: "jane@email.com",
				city: "Los Angeles",
			},
			{ id: 3, name: "Bob Johnson", email: "bob@email.com", city: "New York" },
		];
	}

	if (query.toLowerCase().includes("join")) {
		return [
			{
				order_id: 104,
				customer_name: "Bob Johnson",
				order_date: "2024-01-18",
				total_amount: 520.0,
			},
			{
				order_id: 103,
				customer_name: "John Doe",
				order_date: "2024-01-17",
				total_amount: 75.25,
			},
			{
				order_id: 102,
				customer_name: "Jane Smith",
				order_date: "2024-01-16",
				total_amount: 149.5,
			},
			{
				order_id: 101,
				customer_name: "John Doe",
				order_date: "2024-01-15",
				total_amount: 299.99,
			},
		];
	}

	// Default response
	return [{ message: "Query executed successfully", rows_affected: 0 }];
};

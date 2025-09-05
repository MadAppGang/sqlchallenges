export interface Challenge {
	id: number;
	title: string;
	difficulty: "Easy" | "Medium" | "Hard";
	description: string;
	tables: {
		tableName: string;
		columns: {
			name: string;
			type: string;
			description?: string;
		}[];
		sampleData: Record<string, string | number | null>[];
	}[];
	expectedOutput?: string;
	hint?: string;
}

export const mockChallenges: Challenge[] = [
	{
		id: 1,
		title: "Find Top Selling Products",
		difficulty: "Easy",
		description: `Write a query to find the top 5 best-selling products by total quantity sold.
		
Your query should return:
- product_name
- total_quantity (sum of all quantities sold)

Order the results by total_quantity in descending order.`,
		tables: [
			{
				tableName: "products",
				columns: [
					{ name: "product_id", type: "INT", description: "Primary key" },
					{
						name: "product_name",
						type: "VARCHAR(200)",
						description: "Product name",
					},
					{
						name: "category_id",
						type: "INT",
						description: "Foreign key to categories",
					},
					{
						name: "price",
						type: "DECIMAL(10,2)",
						description: "Product price",
					},
					{ name: "stock_quantity", type: "INT", description: "Current stock" },
					{ name: "created_at", type: "DATE", description: "Creation date" },
				],
				sampleData: [],
			},
			{
				tableName: "order_items",
				columns: [
					{ name: "order_item_id", type: "INT", description: "Primary key" },
					{
						name: "order_id",
						type: "INT",
						description: "Foreign key to orders",
					},
					{
						name: "product_id",
						type: "INT",
						description: "Foreign key to products",
					},
					{ name: "quantity", type: "INT", description: "Quantity ordered" },
					{
						name: "unit_price",
						type: "DECIMAL(10,2)",
						description: "Price per unit",
					},
				],
				sampleData: [],
			},
		],
		hint: "Use JOIN to connect products with order_items, then GROUP BY and aggregate.",
	},
	{
		id: 2,
		title: "Customer Order Summary",
		difficulty: "Medium",
		description: `Find all customers who have placed orders, along with their order statistics.

Your query should return:
- customer full name (concatenated first_name and last_name as 'full_name')
- email
- total_orders (count of orders)
- total_spent (sum of all order amounts)

Include only customers who have spent more than $500 in total.
Order by total_spent descending.`,
		tables: [
			{
				tableName: "customers",
				columns: [
					{ name: "customer_id", type: "INT", description: "Primary key" },
					{
						name: "first_name",
						type: "VARCHAR(50)",
						description: "First name",
					},
					{ name: "last_name", type: "VARCHAR(50)", description: "Last name" },
					{
						name: "email",
						type: "VARCHAR(100)",
						description: "Email (unique)",
					},
					{
						name: "registration_date",
						type: "DATE",
						description: "Registration date",
					},
					{ name: "city", type: "VARCHAR(50)", description: "City" },
					{ name: "country", type: "VARCHAR(50)", description: "Country" },
				],
				sampleData: [],
			},
			{
				tableName: "orders",
				columns: [
					{ name: "order_id", type: "INT", description: "Primary key" },
					{
						name: "customer_id",
						type: "INT",
						description: "Foreign key to customers",
					},
					{ name: "order_date", type: "DATE", description: "Order date" },
					{ name: "status", type: "VARCHAR(20)", description: "Order status" },
					{
						name: "total_amount",
						type: "DECIMAL(10,2)",
						description: "Total amount",
					},
				],
				sampleData: [],
			},
		],
		hint: "Use concatenation for full name, GROUP BY with HAVING clause for filtering aggregates.",
	},
	{
		id: 3,
		title: "Category Revenue Analysis",
		difficulty: "Medium",
		description: `Analyze revenue by category, showing each category's performance.

Your query should return:
- category_name
- product_count (number of products in the category)
- total_revenue (sum of quantity * unit_price for all orders in that category)
- avg_product_price (average price of products in the category)

Order by total_revenue descending.
Round monetary values to 2 decimal places.`,
		tables: [
			{
				tableName: "categories",
				columns: [
					{ name: "category_id", type: "INT", description: "Primary key" },
					{
						name: "category_name",
						type: "VARCHAR(100)",
						description: "Category name",
					},
					{
						name: "description",
						type: "TEXT",
						description: "Category description",
					},
				],
				sampleData: [],
			},
			{
				tableName: "products",
				columns: [
					{ name: "product_id", type: "INT", description: "Primary key" },
					{
						name: "product_name",
						type: "VARCHAR(200)",
						description: "Product name",
					},
					{
						name: "category_id",
						type: "INT",
						description: "Foreign key to categories",
					},
					{
						name: "price",
						type: "DECIMAL(10,2)",
						description: "Product price",
					},
				],
				sampleData: [],
			},
			{
				tableName: "order_items",
				columns: [
					{ name: "order_item_id", type: "INT", description: "Primary key" },
					{
						name: "product_id",
						type: "INT",
						description: "Foreign key to products",
					},
					{ name: "quantity", type: "INT", description: "Quantity ordered" },
					{
						name: "unit_price",
						type: "DECIMAL(10,2)",
						description: "Price per unit",
					},
				],
				sampleData: [],
			},
		],
		hint: "Multiple JOINs needed. Use aggregate functions with GROUP BY.",
	},
	{
		id: 4,
		title: "Find Order Discrepancies",
		difficulty: "Hard",
		description: `Identify orders where the total_amount in the orders table doesn't match 
the calculated sum from order_items.

Your query should return:
- order_id
- customer_id
- recorded_total (from orders.total_amount)
- calculated_total (sum of quantity * unit_price from order_items)
- discrepancy (difference between recorded and calculated)

Only show orders with a discrepancy (where the amounts don't match).
Order by the absolute value of discrepancy descending.`,
		tables: [
			{
				tableName: "orders",
				columns: [
					{ name: "order_id", type: "INT", description: "Primary key" },
					{
						name: "customer_id",
						type: "INT",
						description: "Foreign key to customers",
					},
					{
						name: "total_amount",
						type: "DECIMAL(10,2)",
						description: "Recorded total",
					},
				],
				sampleData: [],
			},
			{
				tableName: "order_items",
				columns: [
					{ name: "order_item_id", type: "INT", description: "Primary key" },
					{
						name: "order_id",
						type: "INT",
						description: "Foreign key to orders",
					},
					{ name: "quantity", type: "INT", description: "Quantity ordered" },
					{
						name: "unit_price",
						type: "DECIMAL(10,2)",
						description: "Price per unit",
					},
				],
				sampleData: [],
			},
		],
		hint: "Use subquery or CTE to calculate totals, then compare with HAVING clause.",
	},
	{
		id: 5,
		title: "Customer Purchase Patterns",
		difficulty: "Hard",
		description: `Analyze customer purchase patterns to find customers who have bought from multiple categories.

Your query should return:
- customer full name (as 'customer_name')
- email
- categories_purchased (count of distinct categories)
- favorite_category (the category they've spent the most money in)
- total_spent

Include only customers who have purchased from at least 2 different categories.
Order by categories_purchased descending, then by total_spent descending.`,
		tables: [
			{
				tableName: "customers",
				columns: [
					{ name: "customer_id", type: "INT", description: "Primary key" },
					{
						name: "first_name",
						type: "VARCHAR(50)",
						description: "First name",
					},
					{ name: "last_name", type: "VARCHAR(50)", description: "Last name" },
					{ name: "email", type: "VARCHAR(100)", description: "Email" },
				],
				sampleData: [],
			},
			{
				tableName: "orders",
				columns: [
					{ name: "order_id", type: "INT", description: "Primary key" },
					{
						name: "customer_id",
						type: "INT",
						description: "Foreign key to customers",
					},
				],
				sampleData: [],
			},
			{
				tableName: "order_items",
				columns: [
					{
						name: "order_id",
						type: "INT",
						description: "Foreign key to orders",
					},
					{
						name: "product_id",
						type: "INT",
						description: "Foreign key to products",
					},
					{ name: "quantity", type: "INT", description: "Quantity" },
					{
						name: "unit_price",
						type: "DECIMAL(10,2)",
						description: "Unit price",
					},
				],
				sampleData: [],
			},
			{
				tableName: "products",
				columns: [
					{ name: "product_id", type: "INT", description: "Primary key" },
					{
						name: "category_id",
						type: "INT",
						description: "Foreign key to categories",
					},
				],
				sampleData: [],
			},
			{
				tableName: "categories",
				columns: [
					{ name: "category_id", type: "INT", description: "Primary key" },
					{
						name: "category_name",
						type: "VARCHAR(100)",
						description: "Category name",
					},
				],
				sampleData: [],
			},
		],
		hint: "Complex query with window functions or correlated subqueries for favorite category.",
	},
];

// Legacy function for compatibility
export async function executeSqlQuery(
	query: string,
): Promise<Record<string, string | number | null>[]> {
	throw new Error("Use executeQuery from lib/database instead");
}

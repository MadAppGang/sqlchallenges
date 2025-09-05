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

export const challenges: Challenge[] = [
	{
		id: 1,
		title: "Recent Customer Orders",
		difficulty: "Easy",
		description: `Write a query to find all customers who have placed orders in the last 30 days, showing customer name and order date.

Requirements:
- Show customer's full name (concatenate first_name and last_name)
- Show the order date
- Only include orders from the last 30 days
- Order results by order date (most recent first)`,
		tables: [
			{
				tableName: "customers",
				columns: [
					{ name: "customer_id", type: "INT", description: "Primary key" },
					{ name: "first_name", type: "VARCHAR(50)", description: "Customer's first name" },
					{ name: "last_name", type: "VARCHAR(50)", description: "Customer's last name" },
					{ name: "email", type: "VARCHAR(100)", description: "Customer's email" },
					{ name: "registration_date", type: "DATE", description: "When customer registered" },
					{ name: "city", type: "VARCHAR(50)", description: "Customer's city" },
					{ name: "country", type: "VARCHAR(50)", description: "Customer's country" },
				],
				sampleData: [],
			},
			{
				tableName: "orders",
				columns: [
					{ name: "order_id", type: "INT", description: "Primary key" },
					{ name: "customer_id", type: "INT", description: "Foreign key to customers" },
					{ name: "order_date", type: "DATE", description: "When the order was placed" },
					{ name: "status", type: "VARCHAR(20)", description: "Order status (pending/completed)" },
					{ name: "total_amount", type: "DECIMAL(10,2)", description: "Total order amount" },
				],
				sampleData: [],
			},
		],
		hint: "Use JOIN to connect customers and orders tables. Use DATE functions to filter recent orders.",
	},
	{
		id: 2,
		title: "Top Customers Analysis",
		difficulty: "Medium",
		description: `Given tables customers, orders, and products, write a query to find the top 3 customers by total purchase amount, but only include customers who have made at least 5 orders.

Requirements:
- Calculate total purchase amount per customer
- Only include customers with 5 or more orders
- Show customer name, number of orders, and total spent
- Return only the top 3 customers by total purchase amount
- Order by total purchase amount (descending)

Also explain what indexes you'd recommend for optimal query performance.`,
		tables: [
			{
				tableName: "customers",
				columns: [
					{ name: "customer_id", type: "INT", description: "Primary key" },
					{ name: "first_name", type: "VARCHAR(50)", description: "Customer's first name" },
					{ name: "last_name", type: "VARCHAR(50)", description: "Customer's last name" },
					{ name: "email", type: "VARCHAR(100)", description: "Customer's email" },
				],
				sampleData: [],
			},
			{
				tableName: "orders",
				columns: [
					{ name: "order_id", type: "INT", description: "Primary key" },
					{ name: "customer_id", type: "INT", description: "Foreign key to customers" },
					{ name: "order_date", type: "DATE", description: "Order date" },
					{ name: "status", type: "VARCHAR(20)", description: "Order status" },
					{ name: "total_amount", type: "DECIMAL(10,2)", description: "Total order amount" },
				],
				sampleData: [],
			},
			{
				tableName: "order_items",
				columns: [
					{ name: "order_item_id", type: "INT", description: "Primary key" },
					{ name: "order_id", type: "INT", description: "Foreign key to orders" },
					{ name: "product_id", type: "INT", description: "Foreign key to products" },
					{ name: "quantity", type: "INT", description: "Quantity ordered" },
					{ name: "unit_price", type: "DECIMAL(10,2)", description: "Price per unit at time of order" },
				],
				sampleData: [],
			},
			{
				tableName: "products",
				columns: [
					{ name: "product_id", type: "INT", description: "Primary key" },
					{ name: "product_name", type: "VARCHAR(200)", description: "Product name" },
					{ name: "category_id", type: "INT", description: "Foreign key to categories" },
					{ name: "price", type: "DECIMAL(10,2)", description: "Current price" },
					{ name: "stock_quantity", type: "INT", description: "Current stock" },
				],
				sampleData: [],
			},
		],
		hint: "Use GROUP BY with HAVING clause for filtering on aggregate conditions. Consider using LIMIT to get top 3.",
		expectedOutput: `Recommended indexes:
- orders(customer_id) - for JOIN performance
- order_items(order_id) - for JOIN performance
- Composite index on orders(customer_id, total_amount) for covering index`,
	},
	{
		id: 3,
		title: "Sales Analysis with Window Functions",
		difficulty: "Hard",
		description: `Explain the difference between different isolation levels and write a query using window functions to calculate a running total of sales by month, along with the percentage change from the previous month.

Part 1: Explain these isolation levels:
- READ UNCOMMITTED
- READ COMMITTED  
- REPEATABLE READ
- SERIALIZABLE

Part 2: Write a query that shows:
- Year and month
- Monthly total sales
- Running total of sales (cumulative)
- Percentage change from previous month
- Rank of month by sales amount within each year

How would you optimize this for a table with 100 million rows?`,
		tables: [
			{
				tableName: "orders",
				columns: [
					{ name: "order_id", type: "INT", description: "Primary key" },
					{ name: "customer_id", type: "INT", description: "Foreign key to customers" },
					{ name: "order_date", type: "DATE", description: "When order was placed" },
					{ name: "total_amount", type: "DECIMAL(10,2)", description: "Total order amount" },
					{ name: "status", type: "VARCHAR(20)", description: "Order status" },
				],
				sampleData: [],
			},
			{
				tableName: "order_items",
				columns: [
					{ name: "order_item_id", type: "INT", description: "Primary key" },
					{ name: "order_id", type: "INT", description: "Foreign key to orders" },
					{ name: "product_id", type: "INT", description: "Foreign key to products" },
					{ name: "quantity", type: "INT", description: "Quantity ordered" },
					{ name: "unit_price", type: "DECIMAL(10,2)", description: "Price per unit" },
				],
				sampleData: [],
			},
		],
		hint: `Window functions to consider:
- SUM() OVER() for running totals
- LAG() for previous month comparison
- RANK() or DENSE_RANK() for ranking
- Consider using CTEs for readability`,
		expectedOutput: `Optimization strategies for 100M rows:
1. Partition the table by date (monthly or yearly partitions)
2. Create a materialized view or summary table for monthly aggregates
3. Add indexes on order_date and total_amount
4. Consider using columnar storage for analytical queries
5. Pre-aggregate data in a data warehouse for reporting`,
	},
];
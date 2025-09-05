export interface TableColumn {
	name: string;
	type: string;
	description?: string;
}

export interface TableSchema {
	tableName: string;
	columns: TableColumn[];
}

export const databaseSchema: TableSchema[] = [
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
			{ name: "price", type: "DECIMAL(10,2)", description: "Product price" },
			{
				name: "stock_quantity",
				type: "INT",
				description: "Current stock quantity",
			},
			{ name: "created_at", type: "DATE", description: "Creation date" },
		],
	},
	{
		tableName: "customers",
		columns: [
			{ name: "customer_id", type: "INT", description: "Primary key" },
			{
				name: "first_name",
				type: "VARCHAR(50)",
				description: "Customer first name",
			},
			{
				name: "last_name",
				type: "VARCHAR(50)",
				description: "Customer last name",
			},
			{
				name: "email",
				type: "VARCHAR(100)",
				description: "Email address (unique)",
			},
			{
				name: "registration_date",
				type: "DATE",
				description: "Registration date",
			},
			{ name: "city", type: "VARCHAR(50)", description: "Customer city" },
			{ name: "country", type: "VARCHAR(50)", description: "Customer country" },
		],
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
			{ name: "order_date", type: "DATE", description: "Date of order" },
			{
				name: "status",
				type: "VARCHAR(20)",
				description: "Order status (pending/completed)",
			},
			{
				name: "total_amount",
				type: "DECIMAL(10,2)",
				description: "Total order amount",
			},
		],
	},
	{
		tableName: "order_items",
		columns: [
			{ name: "order_item_id", type: "INT", description: "Primary key" },
			{ name: "order_id", type: "INT", description: "Foreign key to orders" },
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
	},
];

// Run this script with: node scripts/populateFirestore.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC2k3Gaujp680hFD5nM2OzNlWnpt2DhHYc",
  authDomain: "sqlinterview-437f9.firebaseapp.com",
  projectId: "sqlinterview-437f9",
  storageBucket: "sqlinterview-437f9.firebasestorage.app",
  messagingSenderId: "737374943681",
  appId: "1:737374943681:web:e1150ef738c75b09e7d740",
  measurementId: "G-KRRJ33NNQS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const dbSchema = `-- Create tables
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
);`;

const seedData = `-- Insert categories
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
(1, 1, 1, 1, 899.99),
(2, 1, 3, 1, 199.99),
(3, 2, 2, 1, 1299.99),
(4, 2, 5, 2, 24.99),
(5, 3, 4, 1, 89.99),
(6, 4, 5, 3, 24.99),
(7, 4, 9, 4, 39.99),
(8, 5, 3, 1, 199.99),
(9, 6, 10, 1, 159.99),
(10, 7, 8, 1, 129.99),
(11, 7, 9, 1, 39.99),
(12, 8, 6, 1, 49.99),
(13, 9, 5, 3, 24.99),
(14, 10, 1, 1, 899.99),
(15, 11, 8, 1, 129.99),
(16, 12, 3, 1, 199.99),
(17, 12, 9, 2, 39.99);`;

const tasks = [
  {
    title: "Basic Product Query",
    difficulty: "Easy",
    category: "Basic SQL",
    timeEstimate: "5-10 minutes",
    description: `# Task 1: Basic Product Query

## Problem Statement

Given the \`products\` table, write a query to find all products that cost more than $100 and are currently in stock (stock_quantity > 0).

## Requirements

1. Select products with a price greater than $100
2. Only include products that are in stock (stock_quantity > 0)
3. Sort the results by price in descending order
4. Display all columns from the products table

## Expected Output Columns

All columns from the products table:
- product_id
- product_name
- category_id
- price
- stock_quantity
- created_at

## Hints

- Use the WHERE clause to filter results
- Use AND to combine multiple conditions
- Use ORDER BY to sort the results`,
    requirements: [
      "Select products with price > $100",
      "Only include products with stock_quantity > 0",
      "Sort by price descending",
    ],
    expectedColumns: [
      "product_id",
      "product_name",
      "category_id",
      "price",
      "stock_quantity",
      "created_at",
    ],
    sampleOutput: `product_id | product_name        | category_id | price   | stock_quantity | created_at
-----------|-------------------|-------------|---------|----------------|------------
2          | Laptop Ultra       | 1           | 1299.99 | 25             | 2024-01-20
1          | Smartphone Pro     | 1           | 899.99  | 50             | 2024-01-15
3          | Wireless Headphones| 1           | 199.99  | 100            | 2024-02-01`,
    hints: [
      "Use WHERE clause with AND operator",
      "Remember to use ORDER BY DESC for descending order",
    ],
    tables: ["products"],
    skills: ["SELECT", "WHERE", "AND", "ORDER BY"],
    isPublic: true,
    dbSchema,
    seedData,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Top Customers by Purchase Amount",
    difficulty: "Medium",
    category: "Aggregation & Analysis",
    timeEstimate: "15-20 minutes",
    description: `# Task 2: Top Customers Analysis

## Problem Statement

Given tables \`customers\`, \`orders\`, \`order_items\`, and \`products\`, write a query to find the top 3 customers by total purchase amount, but only include customers who have made at least 2 orders.

## Requirements

1. Calculate the total purchase amount for each customer
2. Count the number of orders per customer
3. Filter to only include customers with **2 or more orders**
4. Return only the **top 3 customers** by total purchase amount
5. Display results in descending order by total amount

## Expected Output Columns

1. \`customer_id\` - Customer identifier
2. \`customer_name\` - Full name (first_name + last_name)
3. \`email\` - Customer's email
4. \`order_count\` - Total number of orders
5. \`total_spent\` - Sum of all order amounts (formatted to 2 decimal places)

## Hints

- Use GROUP BY with customer information
- Apply HAVING clause for filtering aggregate results (not WHERE)
- Consider whether you need to JOIN all tables or if some are unnecessary
- Use LIMIT 3 to get only top 3 results
- The total_amount column in orders table might simplify your query`,
    requirements: [
      "Calculate total purchase amount per customer",
      "Count orders per customer",
      "Filter customers with >= 2 orders",
      "Return top 3 by total amount",
      "Sort descending by total spent",
    ],
    expectedColumns: [
      "customer_id",
      "customer_name",
      "email",
      "order_count",
      "total_spent",
    ],
    tables: ["customers", "orders", "order_items", "products"],
    skills: ["GROUP BY", "HAVING", "Aggregate functions", "Multiple JOINs", "LIMIT"],
    isPublic: true,
    dbSchema,
    seedData,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Inventory Management Report",
    difficulty: "Hard",
    category: "Advanced Analytics",
    timeEstimate: "20-30 minutes",
    description: `# Task 3: Comprehensive Inventory Management Report

## Problem Statement

Create an inventory management report that shows product performance metrics. For each product category, display the category name, total revenue generated, average product price, total units sold, and the best-selling product in that category.

## Requirements

1. Group results by product category
2. Calculate total revenue (sum of quantity * unit_price from order_items)
3. Calculate average product price within each category
4. Count total units sold per category
5. Identify the best-selling product (by quantity) in each category
6. Only include categories that have generated revenue (exclude categories with no sales)
7. Sort by total revenue in descending order

## Expected Output Columns

1. \`category_name\` - Name of the product category
2. \`total_revenue\` - Total revenue generated by the category
3. \`avg_price\` - Average price of products in the category
4. \`units_sold\` - Total number of units sold in the category
5. \`best_selling_product\` - Name of the product with highest quantity sold in that category

## Hints

- You'll need to use subqueries or window functions
- Consider using CTEs (Common Table Expressions) for clarity
- The best-selling product requires finding the MAX within each category group`,
    requirements: [
      "Group by product category",
      "Calculate total revenue per category",
      "Calculate average price per category",
      "Count total units sold",
      "Find best-selling product per category",
      "Exclude categories with no sales",
      "Sort by revenue descending",
    ],
    expectedColumns: [
      "category_name",
      "total_revenue",
      "avg_price",
      "units_sold",
      "best_selling_product",
    ],
    tables: ["categories", "products", "order_items", "orders"],
    skills: [
      "Complex JOINs",
      "Subqueries",
      "Window functions",
      "CTEs",
      "Advanced aggregation",
    ],
    isPublic: true,
    dbSchema,
    seedData,
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

async function populateFirestore() {
  console.log('Starting Firestore population...');
  
  try {
    for (const task of tasks) {
      const docRef = await addDoc(collection(db, 'tasks'), task);
      console.log(`✅ Added task: "${task.title}" with ID: ${docRef.id}`);
    }
    
    console.log('\n🎉 Successfully populated Firestore with all tasks!');
    console.log('You can now remove the hardcodedTasks.ts file.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating Firestore:', error);
    process.exit(1);
  }
}

populateFirestore();
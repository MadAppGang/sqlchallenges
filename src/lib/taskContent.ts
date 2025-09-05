export const task1Content = `---
id: 1
title: Recent Customer Orders
difficulty: Easy
category: Basic Queries
timeEstimate: 5-10 minutes
tables:
  - customers
  - orders
skills:
  - JOIN operations
  - Date filtering
  - String concatenation
---

# Task 1: Recent Customer Orders

## Problem Statement

Write a query to find all customers who have placed orders in the last 30 days, showing customer name and order date.

## Requirements

- Show customer's full name (concatenate \`first_name\` and \`last_name\` as \`customer_name\`)
- Include the \`order_date\` for each order
- Only include orders from the last 30 days from the current date
- Order results by \`order_date\` (most recent first)
- Include customer's email in the output

## Expected Output Columns

1. \`customer_name\` - Full name of the customer
2. \`email\` - Customer's email address
3. \`order_date\` - Date when the order was placed
4. \`order_id\` - Order identifier

## Sample Output

\`\`\`
customer_name    | email                | order_date  | order_id
----------------|---------------------|------------|----------
John Smith      | john.smith@email.com | 2024-09-05 | 9
Lisa Garcia     | lisa.garcia@email.com| 2024-09-05 | 9
John Smith      | john.smith@email.com | 2024-09-04 | 8
Alex Brown      | alex.brown@email.com | 2024-09-03 | 7
\`\`\`

## Hints

- Use \`CONCAT()\` or the \`||\` operator to combine first and last names
- Use \`CURRENT_DATE\` or \`NOW()\` for date calculations
- The \`INTERVAL\` keyword can help with date arithmetic
- Remember to JOIN the appropriate tables

## Validation Query

To verify your answer, your result count should match:
\`\`\`sql
SELECT COUNT(DISTINCT o.order_id) as expected_rows
FROM orders o
WHERE o.order_date >= CURRENT_DATE - INTERVAL '30 days';
\`\`\``;

export const task2Content = `---
id: 2
title: Top Customers by Purchase Amount
difficulty: Medium
category: Aggregation & Analysis
timeEstimate: 15-20 minutes
tables:
  - customers
  - orders
  - order_items
  - products
skills:
  - GROUP BY
  - HAVING clause
  - Aggregate functions
  - Multiple JOINs
  - LIMIT clause
  - Index optimization
---

# Task 2: Top Customers Analysis

## Problem Statement

Given tables \`customers\`, \`orders\`, \`order_items\`, and \`products\`, write a query to find the top 3 customers by total purchase amount, but only include customers who have made at least 5 orders.

## Requirements

1. Calculate the total purchase amount for each customer
2. Count the number of orders per customer
3. Filter to only include customers with **5 or more orders**
4. Return only the **top 3 customers** by total purchase amount
5. Display results in descending order by total amount

## Expected Output Columns

1. \`customer_id\` - Customer identifier
2. \`customer_name\` - Full name (first_name + last_name)
3. \`email\` - Customer's email
4. \`order_count\` - Total number of orders
5. \`total_spent\` - Sum of all order amounts (formatted to 2 decimal places)

## Sample Output Format

\`\`\`
customer_id | customer_name | email                | order_count | total_spent
------------|---------------|---------------------|-------------|------------
1           | John Smith    | john.smith@email.com | 3           | 1239.96
2           | Sarah Johnson | sarah.j@email.com    | 2           | 1509.97
3           | Mike Davis    | mike.davis@email.com | 2           | 1134.96
\`\`\`

## Database Performance Considerations

After writing your query, also explain what indexes you'd recommend for optimal performance:

### Suggested Index Analysis
Consider indexes for:
- Foreign key relationships
- Columns used in JOIN conditions
- Columns used in WHERE/HAVING clauses
- Columns used in GROUP BY
- Covering indexes for frequently accessed column combinations

## Hints

- Use \`GROUP BY\` with customer information
- Apply \`HAVING\` clause for filtering aggregate results (not WHERE)
- Consider whether you need to JOIN all tables or if some are unnecessary
- Use \`LIMIT 3\` to get only top 3 results
- The \`total_amount\` column in orders table might simplify your query

## Bonus Questions

1. How would your query change if you needed to exclude cancelled orders?
2. What if you wanted to show the average order value as well?
3. How would you modify the query to show top customers by product category?

## Validation

Your query should return exactly 3 rows (or fewer if less than 3 customers meet the criteria).

\`\`\`sql
-- Check how many customers have 5+ orders
SELECT COUNT(*) as eligible_customers
FROM (
    SELECT customer_id, COUNT(*) as order_count
    FROM orders
    GROUP BY customer_id
    HAVING COUNT(*) >= 5
) AS qualified_customers;
\`\`\``;

export const task3Content = `---
id: 3
title: Advanced Sales Analysis with Window Functions
difficulty: Hard
category: Advanced Analytics
timeEstimate: 30-45 minutes
tables:
  - orders
  - order_items
  - products
  - categories
skills:
  - Window functions
  - CTEs
  - Isolation levels
  - Performance optimization
  - LAG/LEAD functions
  - Running totals
  - Ranking functions
---

# Task 3: Advanced Sales Analysis

## Part 1: Database Isolation Levels (Theory)

Explain the differences between these isolation levels and provide an example scenario where each would be appropriate:

### Isolation Levels to Explain:

1. **READ UNCOMMITTED**
   - Definition and characteristics
   - Potential issues (dirty reads)
   - Use cases

2. **READ COMMITTED** 
   - Definition and characteristics
   - How it prevents dirty reads
   - Default in many databases

3. **REPEATABLE READ**
   - Definition and characteristics
   - Prevents non-repeatable reads
   - Potential phantom reads

4. **SERIALIZABLE**
   - Definition and characteristics
   - Highest isolation level
   - Performance implications

## Part 2: Window Functions Query

Write a comprehensive query using window functions to analyze monthly sales trends.

### Requirements:

Create a query that produces the following analytics:

1. **Year and Month** - Extract from order_date
2. **Monthly Total Sales** - Sum of all orders in that month
3. **Running Total** - Cumulative sum of sales from the beginning
4. **Month-over-Month Change** - Percentage change from previous month
5. **Monthly Rank** - Rank of each month by sales within its year
6. **3-Month Moving Average** - Rolling average of current and previous 2 months

### Expected Output Columns:

\`\`\`
sale_year | sale_month | monthly_sales | running_total | mom_change_pct | yearly_rank | moving_avg_3m
----------|------------|---------------|---------------|----------------|-------------|---------------
2024      | 9          | 2829.89       | 11574.74      | -41.23%        | 2           | 3524.74
2024      | 8          | 4814.85       | 8744.85       | 242.49%        | 1           | 2808.24
2023      | 12         | 1405.97       | 3930.00       | NULL           | 3           | NULL
\`\`\`

### SQL Template Structure:

\`\`\`sql
WITH monthly_sales AS (
    -- First, aggregate sales by month
    SELECT 
        EXTRACT(YEAR FROM order_date) as sale_year,
        EXTRACT(MONTH FROM order_date) as sale_month,
        SUM(total_amount) as monthly_total
    FROM orders
    WHERE status = 'completed'
    GROUP BY 1, 2
)
SELECT 
    sale_year,
    sale_month,
    monthly_total,
    -- Add your window functions here
    SUM(monthly_total) OVER (...) as running_total,
    -- More window functions...
FROM monthly_sales
ORDER BY sale_year, sale_month;
\`\`\`

## Part 3: Performance Optimization

### Scenario:
You need to run this analysis on a table with **100 million orders**. Explain your optimization strategy:

### Areas to Address:

1. **Partitioning Strategy**
   - How would you partition the tables?
   - Benefits of partitioning for this query

2. **Indexing Strategy**
   - What indexes would you create?
   - Consider covering indexes

3. **Materialized Views**
   - Would you use materialized views?
   - What would they contain?

4. **Query Optimization**
   - How would you rewrite the query for better performance?
   - Consider pre-aggregation strategies

5. **Alternative Approaches**
   - Data warehouse/OLAP solutions
   - Columnar storage benefits
   - Batch processing vs real-time

## Hints

### Window Function Syntax Reminders:
- \`SUM() OVER (ORDER BY ... ROWS UNBOUNDED PRECEDING)\` - Running total
- \`LAG(column, 1) OVER (ORDER BY ...)\` - Previous row value
- \`RANK() OVER (PARTITION BY year ORDER BY sales DESC)\` - Ranking within groups
- \`AVG() OVER (ORDER BY ... ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)\` - Moving average

### Performance Considerations:
- Consider the cost of sorting for window functions
- Think about whether CTEs or subqueries are more efficient
- Remember that window functions can't be used in WHERE clauses

## Validation Queries

\`\`\`sql
-- Check total sales calculation
SELECT SUM(total_amount) as total_sales
FROM orders
WHERE status = 'completed';

-- Verify monthly aggregation
SELECT 
    DATE_TRUNC('month', order_date) as month,
    COUNT(*) as order_count,
    SUM(total_amount) as month_total
FROM orders
WHERE status = 'completed'
GROUP BY 1
ORDER BY 1;
\`\`\`

## Expected Knowledge Areas

- Understanding of ACID properties
- Transaction isolation in concurrent environments  
- Complex analytical SQL with window functions
- Query optimization techniques
- Database architecture for analytics`;

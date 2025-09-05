---
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

Given tables `customers`, `orders`, `order_items`, and `products`, write a query to find the top 3 customers by total purchase amount, but only include customers who have made at least 5 orders.

## Requirements

1. Calculate the total purchase amount for each customer
2. Count the number of orders per customer
3. Filter to only include customers with **5 or more orders**
4. Return only the **top 3 customers** by total purchase amount
5. Display results in descending order by total amount

## Expected Output Columns

1. `customer_id` - Customer identifier
2. `customer_name` - Full name (first_name + last_name)
3. `email` - Customer's email
4. `order_count` - Total number of orders
5. `total_spent` - Sum of all order amounts (formatted to 2 decimal places)

## Sample Output Format

```
customer_id | customer_name | email                | order_count | total_spent
------------|---------------|---------------------|-------------|------------
1           | John Smith    | john.smith@email.com | 3           | 1239.96
2           | Sarah Johnson | sarah.j@email.com    | 2           | 1509.97
3           | Mike Davis    | mike.davis@email.com | 2           | 1134.96
```

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

- Use `GROUP BY` with customer information
- Apply `HAVING` clause for filtering aggregate results (not WHERE)
- Consider whether you need to JOIN all tables or if some are unnecessary
- Use `LIMIT 3` to get only top 3 results
- The `total_amount` column in orders table might simplify your query

## Bonus Questions

1. How would your query change if you needed to exclude cancelled orders?
2. What if you wanted to show the average order value as well?
3. How would you modify the query to show top customers by product category?

## Validation

Your query should return exactly 3 rows (or fewer if less than 3 customers meet the criteria).

```sql
-- Check how many customers have 5+ orders
SELECT COUNT(*) as eligible_customers
FROM (
    SELECT customer_id, COUNT(*) as order_count
    FROM orders
    GROUP BY customer_id
    HAVING COUNT(*) >= 5
) AS qualified_customers;
```
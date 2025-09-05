---
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

- Show customer's full name (concatenate `first_name` and `last_name` as `customer_name`)
- Include the `order_date` for each order
- Only include orders from the last 30 days from the current date
- Order results by `order_date` (most recent first)
- Include customer's email in the output

## Expected Output Columns

1. `customer_name` - Full name of the customer
2. `email` - Customer's email address
3. `order_date` - Date when the order was placed
4. `order_id` - Order identifier

## Sample Output

```
customer_name    | email                | order_date  | order_id
----------------|---------------------|------------|----------
John Smith      | john.smith@email.com | 2024-09-05 | 9
Lisa Garcia     | lisa.garcia@email.com| 2024-09-05 | 9
John Smith      | john.smith@email.com | 2024-09-04 | 8
Alex Brown      | alex.brown@email.com | 2024-09-03 | 7
```

## Hints

- Use `CONCAT()` or the `||` operator to combine first and last names
- Use `CURRENT_DATE` or `NOW()` for date calculations
- The `INTERVAL` keyword can help with date arithmetic
- Remember to JOIN the appropriate tables

## Validation Query

To verify your answer, your result count should match:
```sql
SELECT COUNT(DISTINCT o.order_id) as expected_rows
FROM orders o
WHERE o.order_date >= CURRENT_DATE - INTERVAL '30 days';
```
---
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

```
sale_year | sale_month | monthly_sales | running_total | mom_change_pct | yearly_rank | moving_avg_3m
----------|------------|---------------|---------------|----------------|-------------|---------------
2024      | 9          | 2829.89       | 11574.74      | -41.23%        | 2           | 3524.74
2024      | 8          | 4814.85       | 8744.85       | 242.49%        | 1           | 2808.24
2023      | 12         | 1405.97       | 3930.00       | NULL           | 3           | NULL
```

### SQL Template Structure:

```sql
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
```

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
- `SUM() OVER (ORDER BY ... ROWS UNBOUNDED PRECEDING)` - Running total
- `LAG(column, 1) OVER (ORDER BY ...)` - Previous row value
- `RANK() OVER (PARTITION BY year ORDER BY sales DESC)` - Ranking within groups
- `AVG() OVER (ORDER BY ... ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)` - Moving average

### Performance Considerations:
- Consider the cost of sorting for window functions
- Think about whether CTEs or subqueries are more efficient
- Remember that window functions can't be used in WHERE clauses

## Validation Queries

```sql
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
```

## Expected Knowledge Areas

- Understanding of ACID properties
- Transaction isolation in concurrent environments  
- Complex analytical SQL with window functions
- Query optimization techniques
- Database architecture for analytics
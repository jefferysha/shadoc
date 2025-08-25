一级部门 存储统计
```sql 
SELECT
    ui.dept1_name,
    SUM(ts.total_size) as total_storage_size,
    COUNT(DISTINCT CONCAT(ts.database_name, '.', ts.table_name)) as table_count,
    COUNT(DISTINCT tor.create_by_name) as owner_count
FROM fsimagedb.jd_table_size_stats ts
-- 关联表owner记录表
LEFT JOIN hive.ods.s100_t_query_table_owner_record tor
    ON ts.database_name = tor.db_name
    AND ts.table_name = tor.table_name
    AND tor.is_valid = 1
-- 关联用户信息表获取部门信息
LEFT JOIN ods.s102_t_company_user_info ui
    ON tor.create_by_name = ui.email
WHERE
    ts.process_date = '2025-08-25'
GROUP BY ui.dept1_name
ORDER BY total_storage_size DESC;
```
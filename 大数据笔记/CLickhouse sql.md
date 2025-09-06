```sql
clickhouse-client --query=" 1112222
SELECT
  dt AS \`日期\`,
  etl_date AS \`ETL日期\`,
  dept1_name AS \`一级部门\`,
  dept2_name AS \`二级部门\`,
  real_name AS \`真实姓名\`,
  dag_id AS \`DAG_ID\`,
  task_id AS \`Task_ID\`,
  dag_owners AS \`DAG所有者\`,
  dag_fileloc AS \`DAG文件位置\`,
  dag_is_paused AS \`DAG是否暂停\`,
  dag_schedule_interval AS \`DAG调度间隔\`,
  dag_timetable_description AS \`DAG时间表描述\`,
  task_state AS \`任务状态\`,
  task_duration_min AS \`任务执行时长分钟\`,
  task_priority AS \`任务优先级\`,
  task_pool AS \`任务池\`,
  task_queue AS \`任务队列\`,
  query AS \`查询SQL\`,
  formatDateTime(start_time, '%Y-%m-%d %H:%M:%S') AS \`开始时间\`,
  formatDateTime(end_time, '%Y-%m-%d %H:%M:%S') AS \`结束时间\`,
  formatDateTime(create_time, '%Y-%m-%d %H:%M:%S') AS \`创建时间\`,
  query_type AS \`查询类型\`,
  user AS \`用户\`,
  source AS \`数据源\`,
  catalog AS \`目录\`,
  resource_group AS \`资源组\`,
  environment AS \`环境\`,
  cluster_name AS \`集群名称\`,
  output_catalog AS \`输出目录\`,
  output_schema AS \`输出模式\`,
  output_table AS \`输出表\`,
  output_rows AS \`输出行数\`,
  ROUND(output_bytes/1024/1024, 2) AS \`输出字节数MB\`,
  ROUND(written_output_bytes/1024/1024, 2) AS \`写入输出字节数MB\`,
  ROUND(peak_user_memory_bytes/1024/1024/1024, 2) AS \`峰值用户内存GB\`,
  ROUND(cumulative_memory/1024/1024/1024, 2) AS \`累积内存GB\`,
  ROUND(total_bytes/1024/1024/1024, 2) AS \`总字节数GB\`,
  total_rows AS \`总行数\`,
  hdfs_path AS \`HDFS路径\`,
  hdfs_file_count AS \`HDFS文件数量\`,
  ROUND(hdfs_total_size/1024/1024/1024, 2) AS \`HDFS总大小GB\`,
  ROUND(hdfs_avg_file_size/1024/1024, 2) AS \`HDFS平均文件大小MB\`,
  hdfs_file_count_lt_10M AS \`HDFS小于10M文件数量\`
FROM orion.airflow_task_query_metrics_mv
WHERE dt = yesterday()
  AND end_time IS NOT NULL
ORDER BY end_time DESC
LIMIT 10000
" --format=CSVWithNames > /tmp/airflow_tasks_detail_yesterday.csv
```
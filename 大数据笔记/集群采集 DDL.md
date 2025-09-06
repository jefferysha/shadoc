```sql
-- =============================================================================
-- 大数据平台分层建模 - ClickHouse完整DDL
-- 架构：集群元数据层 -> 节点资产层 -> 监控指标层
-- =============================================================================

-- 删除旧的视图和表（如果存在）
DROP VIEW IF EXISTS yarn_队列指标_view;
DROP VIEW IF EXISTS yarn_集群指标_view;
DROP VIEW IF EXISTS Cluster指标_view;
DROP VIEW IF EXISTS NN指标_view;
DROP VIEW IF EXISTS DN指标_view;
DROP VIEW IF EXISTS 节点_资源信息_view;
DROP VIEW IF EXISTS 大数据节点_配置信息_view;

DROP TABLE IF EXISTS yarn_queue_metrics;
DROP TABLE IF EXISTS namenode_metrics;
DROP TABLE IF EXISTS datanode_metrics;
DROP TABLE IF EXISTS node_system_metrics;
DROP TABLE IF EXISTS yarn_cluster_metrics;
DROP TABLE IF EXISTS hdfs_cluster_metrics;
DROP TABLE IF EXISTS node_service_deployments;
DROP TABLE IF EXISTS cluster_features;
DROP TABLE IF EXISTS node_assets;
DROP TABLE IF EXISTS cluster_metadata;

-- =============================================================================
-- 第一层：集群元数据层
-- =============================================================================

-- 集群元数据表
CREATE TABLE orion.cluster_metadata (
        cluster_id UInt64,
        cluster_name String,
        cluster_type String,
        hostname String,
        ip String,
        sn String,
        node_config String,
        cpu_cores Nullable(UInt32),
        memory_gb Nullable(UInt32),
        disk_total_tb Nullable(Float64),
        bandwidth_gbps Nullable(Float64),
        brand String,
        device_status String,
        warranty_end Nullable(DateTime),
        warranty_start Nullable(DateTime),
        created_date DateTime DEFAULT now(),
        updated_date DateTime DEFAULT now()
    )
    ENGINE = MergeTree()
    ORDER BY (cluster_id, hostname, ip)
-- =============================================================================
-- 第二层：节点资产层
-- =============================================================================

-- =============================================================================
-- 第三层：监控指标层 - 集群级别指标
-- =============================================================================

-- YARN集群指标
CREATE TABLE orion.yarn_cluster_metrics (
    cluster_id String COMMENT '集群ID',
    num_active_nms UInt32 DEFAULT 0 COMMENT '活跃NodeManager数量',
    num_lost_nms UInt32 DEFAULT 0 COMMENT '丢失NodeManager数量',
    num_unhealthy_nms UInt32 DEFAULT 0 COMMENT '不健康NodeManager数量',
    num_rebooted_nms UInt32 DEFAULT 0 COMMENT '重启NodeManager数量',
    num_shutdown_nms UInt32 DEFAULT 0 COMMENT '关闭NodeManager数量',
    num_decommissioned_nms UInt32 DEFAULT 0 COMMENT '下线NodeManager数量',
    num_decommissioning_nms UInt32 DEFAULT 0 COMMENT '下线中NodeManager数量',
    am_launchdelay_avgtime Decimal64(3) DEFAULT 0.000 COMMENT 'AM启动延迟平均时间',
    am_launchdelay_numops UInt32 DEFAULT 0 COMMENT 'AM启动延迟操作数',
    am_registerdelay_avgtime Decimal64(3) DEFAULT 0.000 COMMENT 'AM注册延迟平均时间',
    am_registerdelay_numops UInt64 DEFAULT 0 COMMENT 'AM注册延迟操作数',
    rpc_queuetime_avgtime Decimal64(3) DEFAULT 0.000 COMMENT 'RPC队列平均时间',
    rpc_queuetime_numops UInt64 DEFAULT 0 COMMENT 'RPC队列操作数',
    rpc_processingtime_avgtime Decimal64(3) DEFAULT 0.000 COMMENT 'RPC处理平均时间',
    rpc_processingtime_numops UInt64 DEFAULT 0 COMMENT 'RPC处理操作数',
    call_queue_length UInt64 DEFAULT 0 COMMENT '调用队列长度',
    num_open_connections UInt64 DEFAULT 0 COMMENT '开放连接数',
    received_bytes Decimal64(3) DEFAULT 0.000 COMMENT '接收字节数',
    sent_bytes Decimal64(3) DEFAULT 0.000 COMMENT '发送字节数',
    etl_time DateTime COMMENT 'ETL时间',
    process_date Date COMMENT '处理日期'
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(process_date)
ORDER BY (cluster_id, process_date, etl_time)
PRIMARY KEY (cluster_id, process_date, etl_time);

-- HDFS集群指标
CREATE TABLE hdfs_cluster_metrics (
    cluster_id String COMMENT '集群ID',
    capacity_total Decimal64(3) DEFAULT 0.000 COMMENT '总容量',
    capacity_used Decimal64(3) DEFAULT 0.000 COMMENT '已用容量',
    capacity_remaining Decimal64(3) DEFAULT 0.000 COMMENT '剩余容量',
    capacity_used_percent Decimal32(2) DEFAULT 0.00 COMMENT '容量使用率',
    blocks_total UInt64 DEFAULT 0 COMMENT '总块数',
    files_total UInt64 DEFAULT 0 COMMENT '总文件数',
    missing_blocks UInt32 DEFAULT 0 COMMENT '丢失块数',
    corrupt_blocks UInt32 DEFAULT 0 COMMENT '损坏块数',
    live_datanodes_num UInt32 DEFAULT 0 COMMENT '活跃DataNode数量',
    dead_datanodes_num UInt32 DEFAULT 0 COMMENT '死亡DataNode数量',
    etl_time DateTime COMMENT 'ETL时间',
    process_date Date COMMENT '处理日期'
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(process_date)
ORDER BY (cluster_id, process_date, etl_time)
PRIMARY KEY (cluster_id, process_date, etl_time);

-- =============================================================================
-- 第三层：监控指标层 - 队列级别指标
-- =============================================================================

-- YARN队列指标
CREATE TABLE IF NOT EXISTS orion.yarn_queue_metrics (
    cluster_id String COMMENT '集群ID',
    queue_name String COMMENT '队列名称',
    mem_min_gb UInt32 DEFAULT 0 COMMENT '最小内存GB',
    vcores_min UInt32 DEFAULT 0 COMMENT '最小虚拟核数',
    mem_max_gb UInt32 DEFAULT 0 COMMENT '最大内存GB',
    vcores_max UInt32 DEFAULT 0 COMMENT '最大虚拟核数',
    allocated_gb UInt64 DEFAULT 0 COMMENT '已分配内存GB',
    pending_gb UInt64 DEFAULT 0 COMMENT '待分配内存GB',
    available_gb UInt64 DEFAULT 0 COMMENT '可用内存GB',
    reserved_gb UInt64 DEFAULT 0 COMMENT '预留内存GB',
    reserved_vcores UInt64 DEFAULT 0 COMMENT '预留虚拟核数',
    available_vcores UInt64 DEFAULT 0 COMMENT '可用虚拟核数',
    allocated_vcores UInt64 DEFAULT 0 COMMENT '已分配虚拟核数',
    pending_vcores UInt64 DEFAULT 0 COMMENT '待分配虚拟核数',
    allocated_containers UInt64 DEFAULT 0 COMMENT '已分配容器数',
    pending_containers UInt64 DEFAULT 0 COMMENT '待分配容器数',
    reserved_containers UInt64 DEFAULT 0 COMMENT '预留容器数',
    apps_running UInt32 DEFAULT 0 COMMENT '运行中应用数',
    apps_submitted UInt32 DEFAULT 0 COMMENT '已提交应用数',
    apps_pending UInt32 DEFAULT 0 COMMENT '待运行应用数',
    apps_completed UInt32 DEFAULT 0 COMMENT '已完成应用数',
    apps_failed UInt32 DEFAULT 0 COMMENT '失败应用数',
    apps_killed UInt32 DEFAULT 0 COMMENT '被杀死应用数',
    etl_time DateTime COMMENT 'ETL时间',
    process_date Date COMMENT '处理日期'
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(process_date)
ORDER BY (cluster_id, queue_name, process_date, etl_time)
PRIMARY KEY (cluster_id, queue_name, process_date, etl_time)

-- =============================================================================
-- 第三层：监控指标层 - 节点级别指标
-- =============================================================================

-- NameNode节点指标
CREATE TABLE namenode_metrics (
    node_id String COMMENT '节点ID',
    cluster_id String COMMENT '集群ID',
    ip_address String COMMENT 'IP地址',
    call_queue_length UInt32 DEFAULT 0 COMMENT '调用队列长度',
    nn_read_ops UInt64 DEFAULT 0 COMMENT 'NameNode读操作数',
    nn_write_ops UInt64 DEFAULT 0 COMMENT 'NameNode写操作数',
    rpc_process_time_avg Decimal64(3) DEFAULT 0.000 COMMENT 'RPC平均处理时间',
    rpc_queue_time_avg Decimal64(3) DEFAULT 0.000 COMMENT 'RPC平均队列时间',
    gc_count UInt32 DEFAULT 0 COMMENT 'GC次数',
    gc_time_ms UInt32 DEFAULT 0 COMMENT 'GC时间毫秒',
    heap_mem_used Decimal64(3) DEFAULT 0.000 COMMENT '堆内存使用量',
    non_heap_mem_used Decimal64(3) DEFAULT 0.000 COMMENT '非堆内存使用量',
    etl_time DateTime COMMENT 'ETL时间',
    process_date Date COMMENT '处理日期'
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(process_date)
ORDER BY (node_id, process_date, etl_time)
PRIMARY KEY (node_id, process_date, etl_time);

-- DataNode节点指标
CREATE TABLE datanode_metrics (
    node_id String COMMENT '节点ID',
    ip_address String COMMENT 'IP地址',
    rpc_process_time_avg Decimal64(3) DEFAULT 0.000 COMMENT 'RPC平均处理时间',
    rpc_queue_time_avg Decimal64(3) DEFAULT 0.000 COMMENT 'RPC平均队列时间',
    bytes_written Float64 DEFAULT 0 COMMENT '写入字节数',
    bytes_read Float64 DEFAULT 0 COMMENT '读取字节数',
    block_write_io_time_avg Decimal64(3) DEFAULT 0.000 COMMENT '块写IO平均时间',
    block_read_io_time_avg Decimal64(3) DEFAULT 0.000 COMMENT '块读IO平均时间',
    packet_ack_trip_time_nanos_avg Decimal64(3) DEFAULT 0.000 COMMENT '包确认往返时间纳秒平均值',
    volume_failures UInt32 DEFAULT 0 COMMENT '卷故障数',
    etl_time DateTime COMMENT 'ETL时间',
    process_date Date COMMENT '处理日期'
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(process_date)
ORDER BY (node_id, process_date, etl_time)
PRIMARY KEY (node_id, process_date, etl_time);

-- 节点系统资源指标
    CREATE TABLE IF NOT EXISTS orion.node_system_metrics (
        id UInt64,
        ip String,
        hostname String,
        cpu_usage Nullable(Float64),
        memory_usage Nullable(Float64),
        load1 Nullable(Float64),
        disk_iops Nullable(Float64),
        disk_read_mib_s Nullable(Float64),
        disk_write_mib_s Nullable(Float64),
        disk_usage Nullable(Float64),
        disk_iowait Nullable(Float64),
        net_recv_mib_s Nullable(Float64),
        net_transmit_mib_s Nullable(Float64),
        net_recv_drop_percent Nullable(Float64),
        net_transmit_drop_percent Nullable(Float64),
        disk_capacity_detail Nullable(String),
        etl_date Date,
        ts DateTime,
    )
    ENGINE = MergeTree()
    PARTITION BY toYYYYMM(etl_date)
    ORDER BY (etl_date, ip)
    SETTINGS index_granularity = 8192
-- =============================================================================
-- 向后兼容视图
-- =============================================================================

-- 原yarn队列指标视图
CREATE VIEW yarn_队列指标_view AS
SELECT 
    cm.cluster_name as cluser_name,  -- 保持原有字段名（包括拼写错误）
    yqm.queue_name,
    yqm.mem_min_gb,
    yqm.vcores_min,
    yqm.mem_max_gb,
    yqm.vcores_max,
    yqm.allocated_gb,
    yqm.pending_gb,
    yqm.available_gb,
    yqm.reserved_gb,
    yqm.reserved_vcores,
    yqm.available_vcores,
    yqm.allocated_vcores,
    yqm.pending_vcores,
    yqm.apps_running,
    yqm.apps_submitted,
    yqm.apps_pending,
    yqm.apps_completed,
    yqm.apps_failed,
    yqm.apps_killed,
    yqm.etl_time,
    yqm.process_date
FROM yarn_queue_metrics yqm
INNER JOIN cluster_metadata cm ON yqm.cluster_id = cm.cluster_id;

-- 原yarn集群指标视图
CREATE VIEW yarn_集群指标_view AS
SELECT 
    cm.cluster_name as cluser_name,
    ycm.num_active_nms,
    ycm.num_lost_nms,
    ycm.num_unhealthy_nms,
    ycm.num_rebooted_nms,
    ycm.num_shutdown_nms,
    ycm.num_decommissioned_nms,
    ycm.num_decommissioning_nms,
    ycm.am_launchdelay_avgtime,
    ycm.am_launchdelay_numops,
    ycm.am_registerdelay_avgtime,
    ycm.am_registerdelay_numops,
    ycm.rpc_queuetime_avgtime,
    ycm.rpc_queuetime_numops,
    ycm.rpc_processingtime_avgtime,
    ycm.rpc_processingtime_numops,
    ycm.call_queue_length,
    ycm.num_open_connections,
    ycm.received_bytes,
    ycm.sent_bytes,
    ycm.etl_time,
    ycm.process_date
FROM yarn_cluster_metrics ycm
INNER JOIN cluster_metadata cm ON ycm.cluster_id = cm.cluster_id;

-- 原Cluster指标视图
CREATE VIEW Cluster指标_view AS
SELECT 
    cm.cluster_name as cluser_name,
    hcm.capacity_total,
    hcm.capacity_used,
    hcm.capacity_remaining,
    hcm.capacity_used_percent,
    hcm.blocks_total,
    hcm.files_total,
    hcm.missing_blocks,
    hcm.corrupt_blocks,
    hcm.live_datanodes_num,
    hcm.dead_datanodes_num,
    hcm.etl_time,
    hcm.process_date
FROM hdfs_cluster_metrics hcm
INNER JOIN cluster_metadata cm ON hcm.cluster_id = cm.cluster_id;

-- 原NN指标视图
CREATE VIEW NN指标_view AS
SELECT 
    cm.cluster_name as cluster_name,
    nm.ip_address as ip,
    nm.call_queue_length,
    nm.nn_read_ops,
    nm.nn_write_ops,
    nm.rpc_process_time_avg,
    nm.rpc_queue_time_avg,
    nm.gc_count,
    nm.gc_time_ms,
    nm.heap_mem_used,
    nm.non_heap_mem_used,
    nm.etl_time,
    nm.process_date
FROM namenode_metrics nm
INNER JOIN cluster_metadata cm ON nm.cluster_id = cm.cluster_id;

-- 原DN指标视图
CREATE VIEW DN指标_view AS
SELECT 
    na.ip_address as ip,
    dm.rpc_process_time_avg,
    dm.rpc_queue_time_avg,
    dm.bytes_written,
    dm.bytes_read,
    dm.block_write_io_time_avg,
    dm.block_read_io_time_avg,
    dm.packet_ack_trip_time_nanos_avg,
    dm.volume_failures,
    dm.etl_time,
    dm.process_date
FROM datanode_metrics dm
INNER JOIN node_assets na ON dm.node_id = na.node_id;

-- 原节点资源信息视图
CREATE VIEW 节点_资源信息_view AS
SELECT 
    na.ip_address as ip,
    nsm.cpu_usage,
    nsm.load_usage,
    nsm.mem_usage,
    nsm.disk_iops,
    nsm.disk_io_rate,
    nsm.disk_usage,
    nsm.disk_usage_iowait,
    nsm.network_bandwidth,
    nsm.network_loss_rate,
    nsm.etl_time,
    nsm.process_date
FROM node_system_metrics nsm
INNER JOIN node_assets na ON nsm.node_id = na.node_id;

-- 原大数据节点配置信息视图
CREATE VIEW 大数据节点_配置信息_view AS
SELECT 
    na.ip_address as ip,
    na.hostname,
    multiIf(
        position(na.node_services, 'namenode') > 0, 'namenode',
        position(na.node_services, 'datanode') > 0, 'datanode',
        'worker'
    ) as node_type,
    na.cluster_id as cluster_name,
    na.cpu_cores as cpu_config,
    na.memory_gb as mem_config,
    na.disk_config,
    toString(na.asset_status) as node_status,
    toDate(na.created_date) as create_date,
    toDate(na.updated_date) as update_date
FROM node_assets na;

-- =============================================================================
-- 示例数据插入语句（可选）
-- =============================================================================

-- 插入集群元数据示例
-- INSERT INTO cluster_metadata VALUES 
-- ('cluster_001', 'hadoop-prod-01', 'HADOOP', 'PROD', 'data-analytics', 'bigdata-team', 'Production Hadoop Cluster', 'DC1', '3.3.1', 'ACTIVE', now(), now());

-- 插入集群功能配置示例
-- INSERT INTO cluster_features VALUES 
-- ('cluster_001', 'YARN', 1, '{"resourcemanager.ha": true, "capacity-scheduler": true}', '3.3.1', now(), now()),
-- ('cluster_001', 'HDFS', 1, '{"namenode.ha": true, "block.replication": 3}', '3.3.1', now(), now());

-- 插入节点资产示例
-- INSERT INTO node_assets VALUES 
-- ('node_001', '192.168.1.10', 'hadoop-master-01', 'cluster_001', 'MASTER', '["namenode", "resourcemanager"]', 'ACTIVE', 32, 128, '[{"path": "/data1", "size": "2TB", "type": "SSD"}]', '{}', 'ASSET001', 'RACK01', '2023-01-01', '2026-01-01', 'Dell', 'R740', now(), now());

-- =============================================================================
-- 建模完成说明
-- =============================================================================
-- 1. 三层架构：集群元数据层 -> 节点资产层 -> 监控指标层
-- 2. ClickHouse优化：使用MergeTree引擎，按时间分区，合理设置主键和排序键
-- 3. 数据类型优化：使用合适的数值类型，Decimal指定精度
-- 4. 保持向后兼容：通过视图保持原有表结构的访问方式
-- 5. 扩展性：支持多种集群类型和服务类型，JSON字段存储复杂配置
-- =============================================================================

```
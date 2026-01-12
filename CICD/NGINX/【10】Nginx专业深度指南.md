# Nginx 深度专业指南：从原理到生产级实战

> **前言**：不仅仅是文档，更是一份 Nginx 的“烹饪指南”。我们将枯燥的配置指令转化为生动的场景，带你从“切菜”（安装）到“烹饪满汉全席”（高并发生产架构）。

---

## 1. 核心架构： Nginx 的“餐厅经营哲学”

### 1.1 为什么 Nginx 能抗住 C10K ？(高并发原理)

想象一家火爆的餐厅：

*   **Apache (传统模式)**：每一个客人进门，都必须安排一个**专属服务员**全程陪同。客人看菜单发呆时，服务员也只能干等。如果有1万个客人，就需要1万个服务员，餐厅直接挤爆（内存耗尽）。
*   **Nginx (异步非阻塞 + Epoll)**：只有几个**超级服务员**（Worker 进程）。
    *   客人A进门，服务员记下“点餐中”，然后立刻转身去接待客人B。
    *   客人A点好菜了，举手示意（事件回调），服务员立刻回来下单。
    *   **结果**：1个服务员可以同时接待成千上万个即使在“发呆”（等待I/O）的客人。效率极高，资源占用极低。

### 1.2 进程模型图解

```mermaid
graph TD
    M[Master 进程 (大堂经理)] -->|管理/重启/加载配置| W1[Worker 进程 1 (超级服务员)]
    M --> W2[Worker 进程 2 (超级服务员)]
    M --> W3[Worker 进程 3 (超级服务员)]
    
    W1 -->|处理| C1[Client A]
    W1 -->|处理| C2[Client B]
    W1 -->|处理| C3[Client ...]
```

---

## 2. 极速安装与启动 (CentOS 7)

我们不讲废话，直接上生产环境最常用的**源码编译**步骤，确保支持 SSL 和 Stub Status。

```bash
# 1. 准备"食材" (安装依赖)
yum install -y gcc pcre pcre-devel zlib zlib-devel openssl openssl-devel

# 2. 下载"菜谱" (下载源码)
wget http://nginx.org/download/nginx-1.24.0.tar.gz
tar -zxvf nginx-1.24.0.tar.gz
cd nginx-1.24.0

# 3. 定制口味 (预编译配置)
# --prefix: 安装位置
# --with-http_ssl_module: 开启 HTTPS 支持 (必选)
# --with-http_stub_status_module: 开启状态监控 (必选)
./configure --prefix=/usr/local/nginx \
            --with-http_ssl_module \
            --with-http_stub_status_module \
            --with-stream

# 4. 开火烹饪 (编译并安装)
make && make install
```

---

## 3. Rewrite 规则： Nginx 的“交通指挥官”

Rewrite 是 Nginx 最强大的功能之一，它像一个交通指挥官，把请求“骗”到它该去的地方，或者强制它换条路走。

### 3.1 核心指令与 Flag 的“传送门”效应

`rewrite regex replacement [flag];`

最容易晕的是 Flag，我们用**“大楼办事”**来比喻：

| Flag | 隐喻 | 真实含义 | 场景举例 |
| :--- | :--- | :--- | :--- |
| **last** | **重新排队** | 结束当前指令，**跳出当前 location**，带着新的 URI 重新在 server 里找 location 匹配。 | “你这个业务不在我这办，去大厅重新领号，按新规则办。” (用于伪静态) |
| **break** | **就地解决** | 结束当前指令，**不跳出 location**，直接在当前目录下找文件。 | “你就在这等着，我去后库房给你拿货。” (用于下载、静态资源) |
| **redirect** | **临时出门** | 返回 302。浏览器地址栏会变。 | “我们这暂停服务，你去隔壁柜台临时办一下。” (维护期间跳转) |
| **permanent**| **永久搬家** | 返回 301。浏览器地址栏会变。搜索引擎会更新记录。 | “在这个旧地址找不到我了，请记住我的新地址。” (HTTP转HTTPS) |

### 3.2 实战案例

#### 案例 A：HTTP 自动转 HTTPS (SEO 必做)
```nginx
server {
    listen 80;
    server_name example.com;
    # 无论用户访问什么，强行拽到 HTTPS 安全通道
    rewrite ^(.*)$ https://$host$1 permanent; 
}
```

#### 案例 B：优雅的伪静态 (让 URL 看起来像静态文件)
用户访问 `/product/1001.html`，实际处理的是 `/product.php?id=1001`。
```nginx
location / {
    # 只要不是真实存在的文件或目录，统统重写
    if (!-e $request_filename) {
        rewrite ^/product/(\d+)\.html$ /product.php?id=$1 last;
    }
}
```

---

## 4. 多服务混合架构： Nginx 的“总前台” (Multi-Service Proxy)

这是微服务或混合部署中最常见的场景。Nginx 作为流量入口，根据 URL 将请求分发给后端不同的服务。

### 4.1 场景描述
我们有一个域名 `portal.com`：
*   访问 `portal.com/aaa/` -> 转发给 **Java 服务 A** (端口 8080)
*   访问 `portal.com/bbb/` -> 转发给 **Node 服务 B** (端口 3000)

### 4.2 关键陷阱： `proxy_pass` 的“斜杠之谜”

这是 Nginx 配置中最大的坑，**请务必仔细阅读**。

#### 写法一：代理地址**带**斜杠 (绝对路径)
```nginx
location /aaa/ {
    # 注意 8080 后面有个 /
    proxy_pass http://127.0.0.1:8080/; 
}
```
*   **行为**：Nginx 会把 `/aaa/` 切掉。
*   用户访问：`/aaa/index.html`
*   后端收到：`/index.html`
*   **适用**：后端服务不知道自己被挂在 `/aaa/` 下，认为自己就在根目录。

#### 写法二：代理地址**不带**斜杠 (相对路径)
```nginx
location /aaa/ {
    # 注意 8080 后面没有 /
    proxy_pass http://127.0.0.1:8080; 
}
```
*   **行为**：Nginx 会把 `/aaa/` 完整传过去。
*   用户访问：`/aaa/index.html`
*   后端收到：`/aaa/index.html`
*   **适用**：后端服务明确知道自己部署在 `/aaa/` 路径下。

### 4.3 完整配置示例

```nginx
server {
    listen 80;
    server_name portal.com;

    # 服务 A：Java 应用 (假设应用本身不包含 /aaa 前缀)
    location /aaa/ {
        proxy_pass http://127.0.0.1:8080/;  # 关键：带斜杠，剥离前缀
        
        # 解决 Cookie 路径问题：把后端种在 / 的 cookie 路径修改为 /aaa/
        proxy_cookie_path / /aaa/; 
    }

    # 服务 B：Node 应用 (假设应用本身适配了 /bbb 前缀)
    location /bbb/ {
        proxy_pass http://127.0.0.1:3000;   # 关键：不带斜杠，保留前缀
    }
}
```

---

## 5. WebSocket： “保持通话”

WebSocket 需要长连接，而 Nginx 默认是 HTTP 短连接（请求-响应-断开）。我们需要显式告诉 Nginx：“这是一通电话，别挂断”。

### 5.1 配置原理
HTTP 升级协议握手：
*   Client -> Server: `Upgrade: websocket`
*   Server -> Client: `HTTP/1.1 101 Switching Protocols`

### 5.2 生产配置
```nginx
location /ws/ {
    proxy_pass http://backend_socket_server;

    # 1. 协议升级三板斧 (必须)
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    # 2. 从“短聊”变“长聊” (超时时间)
    # 默认只有 60秒，超过60秒没数据发 Nginx 就会挂断
    proxy_read_timeout 3600s; 
    proxy_send_timeout 3600s;
}
```

---

## 6. 生产级全配置清单 (Copy & Paste Ready)

这是一份经过调优的配置，可以直接用于生产环境。

**文件**: `/usr/local/nginx/conf/nginx.conf`

```nginx
# ================= 全局块 (Global Block) =================
# 这里的配置影响 Nginx 全局

# 运行用户，安全起见不要用 root
user nginx;

# 核心工作进程数
# 【生产建议】：设置为 auto，自动匹配 CPU 核心数，发挥最大性能
worker_processes auto;

# 错误日志级别
# 【生产建议】：warn 或 error，避免 info 产生大量无用日志
error_log  logs/error.log  warn;

# 进程 PID 文件
pid        logs/nginx.pid;

# 系统资源限制：最大打开文件数
# 必须先在 Linux 系统层面设置 ulimit -n 65535 才能生效
worker_rlimit_nofile 65535;


# ================= 事件块 (Events Block) =================
events {
    # 使用 Linux 最强网络模型 IO 多路复用
    use epoll;
    
    # 每个 Worker 能处理的最大连接数
    # 总并发能力 ≈ worker_processes * worker_connections
    worker_connections 10240;
}


# ================= HTTP 块 (HTTP Block) =================
http {
    include       mime.types;
    default_type  application/octet-stream;

    # --- 日志格式优化 ---
    # 定义 json 格式日志，方便 ELK/Splunk 收集分析
    log_format  json_main  '{"@timestamp":"$time_iso8601",'
                           '"client_ip":"$remote_addr",'
                           '"method":"$request_method",'
                           '"url":"$request_uri",'
                           '"status":$status,'
                           '"size":$body_bytes_sent,'
                           '"resp_time":$request_time,'
                           '"upstream_time":"$upstream_response_time"}';

    access_log  logs/access.log  json_main;

    # --- 传输优化 ---
    # 开启零拷贝，文件直接从磁盘到网卡，不经过 CPU 拷贝，静态资源神技
    sendfile        on;
    # 只有包填满了再发，减少网络报文数量
    tcp_nopush      on;
    # 禁用 Nagle 算法，见包就发，降低延迟 (对实时应用重要)
    tcp_nodelay     on;

    # --- 长连接设置 ---
    # 客户端与 Nginx 保持连接的时间，减少 TCP 握手开销
    keepalive_timeout  65;

    # --- 缓冲区设置 ---
    # 防止 Header 过大导致 400 错误
    client_header_buffer_size 32k;
    large_client_header_buffers 4 32k;
    # 限制上传文件大小 (默认只有 1M，上传图片视频必须改)
    client_max_body_size 100m;


    # --- Gzip 压缩 (省带宽，耗 CPU) ---
    gzip on;
    gzip_min_length 1k;     # 太小的文件压缩反而变大，1k以上才压
    gzip_comp_level 4;      # 压缩率 1-9，推荐 4-6，平衡 CPU 和大小
    gzip_types text/plain application/javascript application/json text/css application/xml;

    # --- 负载均衡集群定义 ---
    upstream backend_cluster_java {
        # ip_hash; # 如果需要 Session 粘滞，取消注释
        server 192.168.1.101:8080 weight=1;
        server 192.168.1.102:8080 weight=1;
        
        # 主备模式：当两台主挂了，才用 backup
        server 192.168.1.103:8080 backup;
    }

    # ================= Server 块 (虚拟主机) =================
    
    # 1. 强制 HTTP 转 HTTPS
    server {
        listen 80;
        server_name example.com;
        return 301 https://$server_name$request_uri;
    }

    # 2. HTTPS 主服务
    server {
        listen 443 ssl http2; # 开启 HTTP2，速度飞起
        server_name example.com;

        # SSL 证书配置
        ssl_certificate      certs/example.com.pem;
        ssl_certificate_key  certs/example.com.key;
        
        # 安全优化：只允许安全协议
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_session_cache shared:SSL:10m; # SSL 握手缓存，复用 Session 减少 CPU 消耗
        ssl_session_timeout 10m;

        # 根目录
        root /www/example/dist;
        index index.html;

        # --- 动静分离策略 ---
        # 静态资源 Nginx 自己扛
        location ~ .*\.(gif|jpg|jpeg|png|css|js|ico)$ {
            expires 7d; # 浏览器缓存 7 天
            
            # 防盗链配置
            valid_referers none blocked example.com *.example.com;
            if ($invalid_referer) {
                return 403;
            }
        }

        # --- 多服务代理策略 ---
        
        # 场景 A: 核心 API -> 后端集群
        location /api/ {
            proxy_pass http://backend_cluster_java;
            
            # 标准反代头 (必加)
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            
            # 失败重试：如果后端 101 死机了，自动转给 102，用户无感知
            proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        }

        # 场景 B: WebSocket 聊天服务
        location /chat/ {
            proxy_pass http://127.0.0.1:9090;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_read_timeout 3600s;
        }

        # 错误页兜底
        error_page 404 /404.html;
        error_page 500 502 503 504 /50x.html;
    }
}
```

---

## 7. 真实案例解析：AI 数据平台网关配置

本章节采用**逐行注解**的方式，详细解读这份生产环境配置。

### 7.1 第一部分：全局掌控 (Global)

```nginx
# 将 Nginx 的运行用户设置为 'nginx'。
# 【为什么要设置？】安全！如果用 root 跑，一旦 Nginx 被黑，黑客就拥有了整个服务器的 root 权限。
# 改成普通用户，黑客就被困在小黑屋里了。
user nginx;

# 工作进程数设置为 'auto'。
# 【这是啥？】Nginx 的大脑数量。 'auto' 意味着 Nginx 会自动检测你的服务器有几个 CPU 核心，
# 如果你有 8 核，它就启动 8 个 Worker。这是性能最大化的不二法门。
# 注：在 Docker 容器里，它会自动读取 Docker 分配的 CPU 限额。
worker_processes auto;

# 进程 ID 文件的存放路径。
# 【干嘛用的？】当你执行 'nginx -s reload' (重启) 时，系统需要知道去哪里找 Nginx 进程的身份证号(PID)来发送信号。
pid /run/nginx.pid;
```

### 7.2 第二部分：连接处理 (Events)

```nginx
events {
    # 每个 Worker 进程允许同时处理的最大连接数。
    # 【数学题】总并发能力 = worker_processes * worker_connections。
    # 如果是 auto (比如4核) * 1024 = 4096 并发。对于 AI 内部平台足够，对公网高并发建议调大到 10240。
    worker_connections 1024;
}
```

### 7.3 第三部分：HTTP 核心逻辑 (HTTP)

```nginx
http {
    # 引入文件类型字典。
    # 告诉浏览器：.html 是网页，.jpg 是图片，.json 是数据。没这个配置，浏览器下载文件会变成乱码。
    include /etc/nginx/mime.types;
    
    # 默认类型。如果文件后缀不认识，就当做"二进制流"处理（浏览器通常会弹出下载框）。
    default_type application/octet-stream;

    # --- 日志配置 ---
    # 访问日志：记录谁来过，查 IP、查流量用。
    access_log /var/log/nginx/access.log;
    # 错误日志：记录报错信息，排查 500/502 错误的关键线索。
    error_log /var/log/nginx/error.log;

    # --- 性能优化三剑客 ---
    # 1. 开启零拷贝。文件从硬盘读出来，不经过 CPU 直接传给网卡。下片、下模型速度飞快。
    sendfile on;
    # 2. 只有数据包填满了才发。减少网络上的小包数量，就像攒够一车货再发车，省油（省带宽）。
    tcp_nopush on;
    # 3. 禁用延迟算法。有数据马上发，不等待。对于 API 接口响应速度至关重要。
    tcp_nodelay on;
    
    # 长连接超时时间 65秒。
    # 允许客户端连着不走，65秒内发新请求不用重新握手。省去 TCP 三次握手的开销。
    keepalive_timeout 65;
    
    # 类型哈希表大小。防止因为 mime.types 文件太大了导致内存溢出报错。
    types_hash_max_size 2048;
    
    # 【关键配置】最大请求体大小 100M。
    # 默认只有 1M。AI 平台经常要上传数据集、大图片，如果不改这个，上传时 Nginx 直接报 413 Request Entity Too Large。
    client_max_body_size 100M;

    # --- Gzip 压缩 ---
    # 开启压缩。就像寄快递打包压缩一样，省带宽，传得快。
    gzip on;
    # 给响应头加个 Vary: Accept-Encoding。告诉中间的缓存服务器：给支持压缩的喂压缩包，不支持的喂原包。
    gzip_vary on;
    # 如果文件小于 1KB 就不压了。因为太小的文件压缩完加上头信息反而变大了。
    gzip_min_length 1024;
    # 指定哪些类型的文件需要压缩。图片/视频一般不需要压（因为已经压过了），主要是文本、代码、JSON。
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # --- 上游服务 (Docker DNS 解析) ---
    # 【重点解释】什么是 upstream label-base-agent？
    # 在 Docker Compose 网络中，容器之间通过"服务名"（Service Name）互相通信。
    # Docker 内部有个 DNS 服务器。当 Nginx 问 "label-base-agent 在哪？"
    # Docker 会回答："在 IP 172.18.0.x"。
    # 所以这里写 server label-base-agent:8000，就是指向了那个容器的 8000 端口。
    upstream label-base-agent {
        server label-base-agent:8000;
    }

    server {
        # 监听 80 端口，HTTP 的标准入口。
        listen 80;
        server_name localhost;

        # --- 静态资源托管 ---
        location / {
            root /usr/share/nginx/html; # 静态文件根目录
            
            # 【SPA 核心配置】try_files
            # 浏览器请求 /dashboard，Nginx 先找 /dashboard 文件？没有。
            # 再找 /dashboard/ 目录？没有。
            # 最后统统返回 /index.html。
            # 为什么？因为这是单页应用(Vue/React)，路由是在前端 JS 里处理的，必须返回 index.html 让 JS 启动。
            try_files $uri $uri/ /index.html;
            
            # 静态资源强缓存
            # 对图片、字体、JS 设置 1年 过期时间。
            # immutable：告诉浏览器，这文件这辈子都不会变了，千万别发 304 问我变没变，直接用缓存！
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        # --- Analytics 前端代理 ---
        location /analytics {
            proxy_pass http://analytics-frontend;
            # 强制使用 HTTP 1.1，因为 1.0 不支持 Keep-Alive 和 WebSocket
            proxy_http_version 1.1;
            # 下面这三行是标准的 WebSocket 升级头，即使是普通代理，加上也没坏处，防止某些库用 WS 热更。
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            # 各种设头，目的是告诉后端：
            # "虽然请求是我 Nginx 发给你的，但真实的客户 IP 是 xxx，域名是 xxx，协议是 http/https"
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            # 绕过缓存直接请求
            proxy_cache_bypass $http_upgrade;
            # 读超时 300秒。防止后端处理慢导致 504 Gateway Time-out。
            proxy_read_timeout 300s;
            proxy_connect_timeout 75s;
        }

        # --- 后端接口正则转发 ---
        # 需求：把 /analytics/api/v1/xxx 转发给 label-base-agent/xxx
        # 正则解析：
        # ^/analytics/  -> 匹配以 /analytics/ 开头
        # (api/v1/.*)   -> 括号是捕获组。比如请求 /analytics/api/v1/user，这里就捕获到 api/v1/user
        location ~ ^/analytics/(api/v1/.*)$ {
            # $1 就是上面捕获到的 api/v1/user
            # 效果：去掉了 /analytics 前缀，直接发给后端
            proxy_pass http://label-base-agent/$1;
            include /etc/nginx/proxy_params; # 包含公共代理参数(是个好习惯)
        }

        # --- 各种微服务路径映射 ---
        # 这些都是普通反代，把不同的 URL 路径，映射给同一个后端服务 label-base-agent
        # 这样做的好处是前后端解耦，前端只认路径，不管后端怎么部署。
        
        location /api/datasets {
            proxy_pass http://label-base-agent;
            include /etc/nginx/proxy_params;
        }

        # ... (省略重复的 location，原理同上) ...

        # 健康检查接口。使用 = 精确匹配，优先级最高，速度最快。
        location = /api/health {
            proxy_pass http://label-base-agent;
            include /etc/nginx/proxy_params;
        }

        # --- WebSocket 进度推送 ---
        location /ws/ {
            proxy_pass http://label-base-agent;
            # 升级协议为 WebSocket
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            
            # 【核心重点】读写超时设置为 86400秒（24小时）
            # AI 训练任务一跑就是几小时。如果用默认的 60秒，Nginx 会认为连接空闲把它切断。
            # 导致前端进度条卡死，用户以为训练挂了。所以必须设得超级长。
            proxy_read_timeout 86400s;
            proxy_send_timeout 86400s;
            
            # 传递真实 IP
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # --- 兜底接口 ---
        # 如果上面的 /history, /apps 等都没匹配上，但是是以 /api/v1 开头的
        # 就转发给 label-base-backend (注意这是另一个后端服务，端口8080)
        location /api/v1 {
            proxy_pass http://label-base-backend:8080;
            # ... 标准反代头 ...
        }

    }
}
```

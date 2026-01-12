# Docker 全栈权威指南：从入门到生产级微服务实战

> **前言**：本指南集成了基础原理、全命令字典、SpringBoot 实战案例以及复杂的微服务项目剖析。旨在帮助开发者从零开始，构建“知其然亦知其所以然”的 Docker 知识体系。

---

## 目录

1.  **第一性原理：容器的本质**
2.  **环境准备：CentOS 7 安装与加速**
3.  **核心操作：Docker 命令全字典 (生存指南)**
4.  **实战案例 I：SpringBoot + Redis 单体应用部署**
5.  **核心进阶：Docker Compose 编排之美**
6.  **架构深度：网络与存储详解**
7.  **实战案例 II：生产级微服务项目逐行剖析**

---

## 1. 第一性原理：容器的本质

很多人认为 Docker 是一个“小虚拟机”，这是错误的。**Docker 的本质是：进程级隔离。**

### 1.1 三大基石 (The Trinity of Isolation)

Docker 的魔法建立在 Linux 内核的三大特性之上：

#### 1. Namespace (命名空间) - 障眼法
*   **作用**：**隔离 (Isolation)**。让进程“以为”自己拥有独立的操作系统。
*   **PID Namespace**：进程进去后，发现自己是 PID 1（上帝进程）。
*   **Net Namespace**：进程拥有独立的 eth0 网卡和 IP。
*   **Mnt Namespace**：进程看到的是独立的文件系统根目录 `/`。

#### 2. Cgroups (Control Groups) - 紧箍咒
*   **作用**：**限制 (Limitation)**。防止某个容器把宿主机的 CPU 吃光或内存撑爆。

#### 3. UnionFS (联合文件系统) - 千层饼
*   **作用**：**分层 (Layering)**。
*   **原理**：镜像由多个**只读层**叠加，容器启动时在最上面盖一层**可读写层**。修改文件时触发**写时复制 (CoW)**。

---

## 2. 环境准备：CentOS 7 安装与加速

> **注意**：建议使用 CentOS 7.x 以上版本。

### 2.1 卸载旧版本
```bash
sudo yum remove docker*
```

### 2.2 配置 Yum 源
```bash
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

### 2.3 安装 Docker
```bash
sudo yum install -y docker-ce docker-ce-cli containerd.io
```

### 2.4 启动与自启
```bash
systemctl enable docker --now
```

### 2.5 配置阿里云镜像加速 (必做)
国内拉取 Docker Hub 极慢，必须配置加速器。

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://6c6b34mj.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

---

## 3. 核心操作：Docker 命令全字典 (生存指南)

本章是为了照顾“Docker 小白”准备的详细字典。我们将按照**使用顺序**来讲解。所有命令都在宿主机终端执行。

### 3.1 预检命令 (Doctor)
装好 Docker 后，先检查身体是否健康。

*   `docker version`: 查看客户端和服务端版本。
*   `docker info`: 查看 CPU、内存、容器数量等详情。
*   `docker system df`: 查看 Docker 占用了多少磁盘空间 (镜像、容器、缓存)。

### 3.2 镜像管理 (Store) -> "下载游戏光盘"

#### 1. 搜索镜像 `search`
*   **命令**: `docker search [关键词]`
*   **作用**: 在 Docker Hub 上找现成的镜像。
*   **例子**:
    ```bash
    docker search nginx
    ```

#### 2. 拉取镜像 `pull`
*   **命令**: `docker pull [镜像名]:[标签]`
*   **作用**: 从远程仓库下载镜像到本地。如果不写标签，默认是 `latest`。
*   **例子**:
    ```bash
    docker pull nginx:1.20.1  # 下载指定版本
    docker pull mysql         # 下载最新版
    ```

#### 3. 查看本地镜像 `images`
*   **命令**: `docker images`
*   **作用**: 看看家里下载了哪些光盘。重点关注 **IMAGE ID** 和 **TAG**。
*   **例子**:
    ```bash
    [root@host ~]# docker images
    REPOSITORY   TAG       IMAGE ID       SIZE
    nginx        1.20.1    c8d50f64e232   133MB
    ```

#### 4. 删除镜像 `rmi`
*   **命令**: `docker rmi [镜像名或ID]`
*   **前提**: 必须确保没有容器在使用这个镜像(即使容器停止了也不行，要先删容器)。
*   **例子**:
    ```bash
    docker rmi c8d50f64e232
    ```

### 3.3 容器生命周期 (Runtime) -> "安装并运行游戏"

#### 1. 启动容器 (重中之重) `run`
*   **命令**: `docker run [参数] [镜像名] [启动命令]`
*   **详解参数**:
    *   `-d`: **后台运行**。不加这个，容器会霸占你的控制台。
    *   `--name`: **给容器起名**。不写的话 Docker 会随机起个名字(如 `hungry_tesla`)，很难管。
    *   `-p`: **端口映射**。`-p 宿主机端口:容器端口`。也就是“外部访问端口:内部服务端口”。
    *   `-v`: **挂载卷**。`-v 宿主机路径:容器路径`。让数据存在外面，容器删了数据不丢。
    *   `-e`: **环境变量**。比如设置 MySQL 密码 `-e MYSQL_ROOT_PASSWORD=123`。
    *   `--restart=always`: **开机自启**。Docker 重启或容器意外挂了，自动救活。
*   **终极例子**:
    ```bash
    docker run -d \
      --name my-nginx \
      -p 88:80 \
      -v /data/html:/usr/share/nginx/html \
      --restart=always \
      nginx:1.20.1
    ```

#### 2. 查看容器状态 `ps` (操作容器前的第一步)
*   **命令**: `docker ps` (看活着的) / `docker ps -a` (看所有的，包括死的)。
*   **作用**: **这步至关重要！** 后面所有操作(停止、进入、日志)都需要容器的 **CONTAINER ID** 或 **NAMES**。你必须先用这个命令查出来。
*   **例子**:
    ```bash
    [root@host ~]# docker ps
    CONTAINER ID   IMAGE          STATUS          PORTS                NAMES
    a1b2c3d4e5f6   nginx:1.20.1   Up 5 minutes    0.0.0.0:88->80/tcp   my-nginx
    ```
    *(在此例中，ID是 `a1b2c3d4e5f6`，Name是 `my-nginx`。后面用哪个都行)*

#### 3. 停止/启动/重启
*   **命令**:
    *   `docker stop [ID/Name]`
    *   `docker start [ID/Name]`
    *   `docker restart [ID/Name]`
*   **场景**: 修改了配置文件（如挂载的 nginx.conf），需要重启容器生效。

#### 4. 删除容器 `rm`
*   **命令**: `docker rm [ID/Name]`
*   **注意**: 正在运行的容器不能删。
    *   方法一：先 `docker stop`，再 `docker rm`。
    *   方法二：强制删除 `docker rm -f` (不推荐，太暴力)。
*   **清理所有停止的容器**: `docker container prune` (慎用!)

### 3.4 容器内部交互 (Interaction) -> "进入游戏内部"

#### 1. 查看容器日志 `logs`
*   **命令**: `docker logs -f --tail 100 [ID/Name]`
*   **场景**: 容器启动失败了（`docker ps` 看不到），或者程序报错了。
*   **参数**:
    *   `-f`: Follow，像 `tail -f` 一样实时刷新。
    *   `--tail 100`: 只看最后 100 行，否则之前的历史日志会刷屏。
*   **例子**:
    ```bash
    docker logs -f my-nginx
    ```

#### 2. 查看容器详情 `inspect`
*   **命令**: `docker inspect [ID/Name]`
*   **作用**: 也就是容器的“体检报告”。可以看到 IP 地址、挂载路径、环境变量等所有元数据。
*   **技巧**: 配合 grep 使用。
    ```bash
    docker inspect my-nginx | grep IPAddress
    ```

#### 3. 进入容器终端 `exec`
*   **命令**: `docker exec -it [ID/Name] /bin/bash`
*   **小白痛点**: “我怎么知道 [ID/Name] 是啥？”
    *   **答**: 先执行 `docker ps`，第一列就是 ID，最后一列就是 Name。
*   **作用**: 相当于 SSH 连进了容器里面。你可以在里面 `ls`, `vi`, `cat`。
*   **参数**:
    *   `-i`: 保持输入流开放。
    *   `-t`: 分配一个伪终端。
    *   `/bin/bash`: 你要在里面执行的程序（也就是 Shell）。如果是 Alpine 镜像，可能没有 bash，要换成 `/bin/sh`。
*   **例子**:
    ```bash
    # 假设通过 docker ps 查到 ID 为 a1b2c3d4e5f6
    docker exec -it a1b2c3d4e5f6 /bin/bash
    
    # 进去后提示符会变：
    root@a1b2c3d4e5f6:/# ls
    ```

#### 4. 文件拷贝 `cp`
*   **命令**:
    *   把东西拿出来：`docker cp [容器ID]:[容器内路径] [宿主机路径]`
    *   把东西塞进去：`docker cp [宿主机路径] [容器ID]:[容器内路径]`
*   **场景**: 想改 Nginx 配置，又没挂载卷。
*   **例子**:
    ```bash
    # 把容器里的 nginx.conf 拷贝到当前目录
    docker cp my-nginx:/etc/nginx/nginx.conf ./
    
    # (在外面改完后) 塞回去
    docker cp ./nginx.conf my-nginx:/etc/nginx/nginx.conf
    # (别忘了)
    docker restart my-nginx
    ```

---

## 4. 实战案例 I：SpringBoot + Redis 单体应用部署

本案例演示如何从零开发一个 SpringBoot 应用，并将其容器化，连接 Redis 容器。

### 4.1 准备 Redis 容器

1.  **宿主机准备目录**:
    ```bash
    mkdir -p /data/redis/data
    # 假设你已经把 redis.conf 放到了 /data/redis/ 下
    ```

2.  **启动 Redis**:
    ```bash
    docker run -d \
      --name myredis \
      -p 6379:6379 \
      -v /data/redis/redis.conf:/etc/redis/redis.conf \
      -v /data/redis/data:/data \
      --restart=always \
      redis:latest \
      redis-server /etc/redis/redis.conf
    ```
3.  **注意**: redis.conf 中必须配置 `requirepass 123456`，生产环境裸奔极其危险。

### 4.2 SpringBoot 项目开发

1.  **Maven 依赖**:
    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    ```

2.  **Controller 代码 (`CounterController.java`)**:
    ```java
    @RestController
    public class CounterController {
        @Autowired
        StringRedisTemplate redisTemplate;

        @GetMapping("/hello")
        public String count(){
            // 简单计数器
            Long increment = redisTemplate.opsForValue().increment("count-people");
            return "有"+ increment + "人访问了这个页面";
        }
    }
    ```

3.  **Dockerfile 编写**:
    在项目根目录新建名为 `Dockerfile` 的文件 (无后缀)。
    ```dockerfile
    # 基础镜像：找一个装好 Java 8 的环境
    FROM openjdk:8-jdk-slim
    
    # 作者信息
    LABEL maintainer="user"
    
    # 拷贝 jar 包：将 target 目录下的 jar 包复制进容器，并改名为 app.jar
    COPY target/*.jar /app.jar
    
    # 启动命令：等同于 java -jar /app.jar
    ENTRYPOINT ["java","-jar","/app.jar"]
    ```

### 4.3 构建与运行 (详细剖析)

#### 1. 构建镜像 (Build)
```bash
docker build -t my-springboot-app:v1 .
```
**小白详细拆解**:
*   `docker build`: 告诉 Docker "我要造个镜像"。
*   `-t my-springboot-app:v1`: 给这个新镜像起个名 (Tag)，叫 `my-springboot-app`，版本是 `v1`。
*   **`.` (最重要的一个点)**:
    *   **字面意思**: 代表“当前目录”。
    *   **深层含义 (Context)**: 告诉 Docker 引擎：“把当前目录下所有的文件（包括 Dockerfile, target 目录, jar 包等）全部打包，发送给你，作为构建的素材”。
    *   **避坑**: 千万别在 `/` (根目录) 下执行 `docker build .`，那样会把整个硬盘的文件都发给 Docker 引擎，这会导致死机！必须在一个干净的项目文件夹里执行。

#### 2. 运行容器 (Run)
```bash
docker run -d \
  --name sb-app \
  -p 8080:8080 \
  --link myredis:redis \
  my-springboot-app:v1
```
**关键参数拆解**:
*   `--link myredis:redis`: **这是核心魔法**。
    *   **含义**: 告诉 Docker，“把现有的 `myredis` 容器连接到我现在这个新容器里来，并且给它起个外号叫 `redis`”。
    *   **效果**: Docker 会悄悄修改新容器里的 `/etc/hosts` 文件，加一行记录：`[myredis的IP]  redis`。
    *   **代码对应**: 所以你的 Java 代码里写 `host: redis` 时，系统其实是去查这个 hosts 文件，找到了 Redis 真正的 IP。如果没有这一步，你的代码必须写死 IP（但 IP 是会变的！），或者报错。

---

## 5. 核心进阶：Docker Compose 编排之美

前面都是一个一个容器跑 (`docker run`)，如果微服务有 10 个容器，每次手敲命令会累死。
**Docker Compose** 允许我们用一个 `yaml` 文件定义整个应用栈，一键启动。

### 5.1 核心结构

文件名为 `docker-compose.yml`。

```yaml
version: '3.8'

# 1. 服务 (Services): 集装箱清单
services:
  # 服务 A
  web:
    image: nginx
    ports:
      - "80:80"
    depends_on:
      - redis # 等 redis 启动了再启动我

  # 服务 B
  redis:
    image: redis

# 2. 网络 (Networks): 定义局域网
networks:
  app_net:
    driver: bridge # 桥接模式

# 3. 存储 (Volumes): 定义硬盘
volumes:
  db_data:
```

### 5.2 常用命令 (必须在 docker-compose.yml 所在目录执行)
*   **启动**: `docker-compose up -d` (后台启动所有服务)。
*   **停止**: `docker-compose down` (销毁容器和网络)。
*   **查看**: `docker-compose ps` (看当前目录下编排的容器状态)。
*   **日志**: `docker-compose logs -f` (聚合看所有服务的日志)。

### 5.3 生产级日常运维流 (Golden Workflow)
这是开发和运维中最经典的一套“组合拳”，用于**彻底重构并重启**服务，确保不留旧缓存。

#### 1. 彻底清除旧环境
```bash
# --rmi all: 删除所有容器的同时，也把它们使用的镜像删掉。
# 场景: 你刚改了代码，想重新 build 镜像，不希望旧镜像占用空间。
docker compose down --rmi all
```

#### 2. 重新构建并启动
```bash
# docker-compose 会检测到镜像没了，自动重新 build，然后启动。
docker compose up -d
```

#### 3. 检查存活状态
```bash
docker ps
# 确认 Status 是 Up，而不是 Exited。
```

#### 4. 实时监控核心日志
```bash
# 就像看电视一样盯着特定服务的输出来排错
docker logs -f label-base-agent
```

---

## 6. 架构深度：网络与存储

### 6.1 网络架构 (Networking)

Docker 默认使用 **Bridge (网桥)** 模式。
*   **Docker DNS**:
    *   在自定义网络中 (如 `docker-compose` 创建的网络)，容器可以**直接通过 "服务名"** 互相访问。
    *   **小白解释**: 你不需要知道 Redis 容器的 IP 是 172.18.0.2 还是 0.3，你只要在代码里写 `redis`，Docker 自动帮你转接到对应的 IP。

### 6.2 存储架构 (Storage)

1.  **Bind Mount (绑定挂载)**:
    *   命令: `-v /home/code:/app`
    *   **特点**: 宿主机路径你自己定。容器里通过 `/app` 就能看到你宿主机 `/home/code` 里的文件。
    *   **场景**: 开发环境。你在宿主机改代码，容器里立马生效。

2.  **Volume (卷)**:
    *   命令: `-v my_data:/var/lib/mysql`
    *   **特点**: 你不指定宿主机路径，Docker 帮你存在 `/var/lib/docker/volumes/` 下。
    *   **场景**: 生产环境数据库。性能更好，不容易被手误删。

---

## 7. 实战案例 II：生产级微服务项目逐行剖析

本章节将对您提供的 `docker-analyze-label` 项目文件进行**代码级**的逐行深度解读。这展示了企业级部署的最佳实践。

### 7.1 后端构建：`Dockerfile-backend` (终极详解版)

您问的问题非常核心！为什么先 COPY pom？为什么编译要全量包？jar 包怎么跑去 target 的？
请看下面这个**完整的、不拆分的** Dockerfile，所有答案都在注释里：

```dockerfile
# ================= 阶段一：构建环境 (Builder) =================
# 问：为什么编译的时候要全量包(maven)？
# 答：因为 Java 代码 (src) 必须有 JDK 和 Maven 工具才能编译成 Jar 包。
#     这就好比煮饭必须要有电饭煲。Maven 镜像就是那个“很大的电饭煲”。
FROM maven:3-eclipse-temurin-8-alpine AS backend-builder

WORKDIR /app

# 问：为什么要先 COPY pom.xml，后面才 COPY src 源代码？
# 答：这是 Docker 的【缓存黄金法则】。
#     Docker 构建是一层层来的。如果某一层文件没变，它就会直接用缓存。
#     1. 你的项目里，源代码 (src) 每天都在变，但依赖 (pom.xml) 不常变。
#     2. 如果写成一行 `COPY . .`，只要 src 变了，缓存失效，Docker 就会重新下载几百兆的 Maven 依赖，慢死！
#     3. 把 pom.xml 单独拿出来先 COPY，只要我不改依赖，这一步就永远走缓存，几秒钟就过。
COPY backend/pom.xml ./
COPY backend/settings.xml /root/.m2/

# 这一步虽没写，但通常建议加：RUN mvn dependency:go-offline (提前下依赖)

# 依赖准备好了，这才把经常变化的源代码搬进来
COPY backend/src ./src

# [执行打包]
# 问：jar 包是怎么识别到 target 目录的？
# 答：这不是 Docker 的魔法，是 Maven 的规定。
#     运行 `mvn package` 后，Maven 默认就会在当前目录下生成一个 `/target` 文件夹，
#     并把编译好的 jar 包放在里面。Docker 只是默默地记录了这个文件的生成。
RUN mvn clean package -DskipTests -P aliyun

# ================= 阶段二：运行环境 (Runtime) =================
# 问：为什么后面只能用了少的镜像(JRE)？
# 答：因为饭(Jar包)已经煮熟了！
#     运行 Java 程序只需要 JRE (Java Runtime)，不再需要 JDK (编译器) 和 Maven (构建工具) 了。
#     JRE 只有 JDK 的十分之一大小。生产环境镜像越小，越快，越安全。
FROM eclipse-temurin:8-jre-alpine

WORKDIR /app

# 问：怎么把 jar 包拿过来的？
# 答：COPY --from=backend-builder 意思就是从“阶段一”那个容器里去“偷”文件。
#     /app/target/label-base-1.0.0.jar 是 Maven 在上一阶段生成的标准路径。
COPY --from=backend-builder /app/target/label-base-1.0.0.jar ./

ENV TZ="Asia/Shanghai"

CMD ["java", "-jar", "label-base-1.0.0.jar"]
```

### 7.2 前端构建：`Dockerfile-frontend` (终极详解版)

前端构建涉及到很多 Linux 命令（如 `sed`, `apk`），小白容易晕。请看详细拆解：

```dockerfile
# ================= 阶段一：构建环境 (Builder) =================
# 问：node:22-alpine 是什么？
# 答：这是一个装好了 Node.js 22 版本的超轻量级 Linux 系统 (Alpine)。
FROM node:22-alpine AS frontend-builder

WORKDIR /frontend

COPY frontend/. .

# [高能预警：复杂命令逐行拆解]
# 为了让构建速度从 10分钟 -> 30秒，我们需要做一系列的“换源”操作。
# Docker 每一行 RUN 都会生成一层镜像。为了减少层数，我们用 "&&" 把命令连起来写。

RUN \
    # 1. sed 命令: Linux 下的文本替换工具。
    #    作用：修改 /etc/apk/repositories 文件，把默认的国外源替换成清华大学镜像源。
    #    为什么：alpine 默认源在国外，apk install 安装软件会卡死。
    sed -i 's#https\?://dl-cdn.alpinelinux.org/alpine#https://mirrors.tuna.tsinghua.edu.cn/alpine#g' /etc/apk/repositories && \
    
    # 2. apk add: Alpine 系统的软件安装命令 (类似 CentOS 的 yum, Ubuntu 的 apt)。
    #    作用：安装 pnpm 这个包管理工具。
    #    注意：新版 Node 镜像可能不自带 pnpm，所以要手动装。
    apk add pnpm && \
    
    # 3. npm config set: 设置 npm 的下载源。
    #    作用：把 npm 的源切换到国内镜像，加速 npm 包的下载。
    npm config set registry https://registry.npmmirror.com && \
    
    # 4. pnpm i: 也就是 pnpm install。
    #    作用：读取 package.json，下载所有项目依赖。
    pnpm i && \
    
    # 5. pnpm run build:prod
    #    作用：执行 package.json 里定义的构建脚本。
    #    结果：通常会在当前目录下生成一个 /dist 文件夹，里面全是 html/css/js 静态文件。
    pnpm run build:prod

# ================= 阶段二：运行环境 (Nginx) =================
# 问：为什么前端构建完要换成 Nginx 镜像？
# 答：因为构建出来的 html/js 只是静态文件，Node.js 主要是用来开发的，
#     真正在生产环境 24h 提供 HTTP 服务，Nginx 才是最强王者（快、稳、省内存）。
FROM nginx:1.29-alpine

# 问：frontend/dist 又是哪里来的？
# 答：这是阶段一 (frontend-builder) 刚刚生成的。
#     我们将这些造好的静态文件，搬运到 Nginx 的默认“网站根目录”下。
COPY --from=frontend-builder /frontend/dist /usr/share/nginx/html

# 问：nginx.conf 和 proxy_params 是啥？
# 答：这是你自己写的 Nginx 配置文件。
#     默认的 Nginx 配置太简单，不满足反向代理接口的需求，所以我们要用自己的配置覆盖掉它默认的。
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/proxy_params /etc/nginx/proxy_params

EXPOSE 80

ENV TZ="Asia/Shanghai"

# 问：daemon off 是什么意思？
# 答：Nginx 默认是“后台运行”的。
#     但在 Docker 容器里，如果主进程转后台了，Docker 就会认为“没事做了”，然后自动关闭容器。
#     所以必须强制 Nginx 在“前台运行”，就像这里的保安一样，必须站在门口（前台），容器才不会挂。
CMD ["nginx", "-g", "daemon off;"]
```

### 7.3 编排总控：`docker-compose.yml` (终极详解版)

这个文件是总指挥，所有的陌生的命令，其实都是为了告诉 Docker：**怎么启动**、**怎么联网**、**怎么重启**。

```yaml
version: '3.8' # Docker Compose 文件的版本语法

services:
  # ==================== 后端服务 ====================
  label-base-backend:
    # [构建指令]
    build:
      # context: 构建上下文。
      # 意思是：Docker，请你往上走一级 (../)，把那个目录下的所有文件打包作为构建素材。
      # 为什么是 ../ ？因为 docker-compose.yml 在 docker/ 目录下，而源码在上一级。
      context: ../ 
      # 指定用哪个 Dockerfile。
      dockerfile: docker/Dockerfile-backend
      
    # [容器名称]
    # 指定运行后的容器名叫什么。对应 docker ps 看到的 NAMES 列。
    container_name: label-base-backend
    
    # [重启策略]
    # unless-stopped: 除非我手动 docker stop，否则只要容器挂了（例如报错崩溃、服务器重启），
    # Docker 都会无脑帮我自动重启它。这是生产环境的“免死金牌”。
    restart: unless-stopped
    
    # [网络配置]
    # 加入 label-base-network 这个局域网。
    # 问：这个 label-base-network 是哪里来的？
    # 答：请往下看！在文件最底部的 "networks:" 模块里定义的。
    #     只有这里先声明加入了，下面才能定义它具体的模式（bridge）。
    networks:
      - label-base-network

  # ==================== 前端服务 ====================
  label-base-frontend:
    build:
      context: ../
      dockerfile: docker/Dockerfile-frontend
    container_name: label-base-frontend
    
    # [端口映射]
    # 格式："宿主机端口:容器端口"
    # 8090:80 -> 意思是访问这台服务器的:8090，就等于访问这个容器的:80。
    # 为什么后端没有 ports？因为后端只需要在内部被前端访问，不需要暴露给外网，安全！
    ports:
      - "8090:80"
      
    restart: unless-stopped
    networks:
      - label-base-network

# ==================== 网络定义 (这里定义了上面用到的网络) ====================
networks:
  # 这里的名字必须和上面 services 里写的名字一模一样！
  label-base-network:
    # driver: bridge (桥接模式)
    # 这是最常用的模式。Docker 会在宿主机上虚拟出一块网卡。
    # 魔法效果：在这个网络里的所有服务，通过“服务名”就能互相 ping 通。
    # 比如：前端 Nginx 配置里写 http://label-base-backend:8080，
    # Docker DNS 会自动把它解析成后端容器的真实 IP。
    driver: bridge

### 7.4 网关配置：`nginx.conf` (终极详解版)

这个 Nginx 不仅仅是伺候前端页面的，它更是整个微服务系统的 **API 网关**。它负责把流量精准地分发给后端、Agent、Websocket 等不同服务。

```nginx
# [全局配置]
# user nginx: 启动 Nginx 的用户。出于安全考虑，不用 root。
user nginx;
# worker_processes auto: 工作进程数。auto 表示自动检测 CPU 核心数，有几核就开几个进程，性能拉满。
worker_processes auto;
# pid: 记录 Nginx 主进程 ID 的文件位置。
pid /run/nginx.pid;

events {
    # worker_connections: 每个工人(worker)能同时接待多少客人(连接)。
    # 总并发能力 ≈ worker_processes * worker_connections
    worker_connections 1024;
}

http {
    # 引入文件类型定义 (比如告诉浏览器 .html 是网页, .jpg 是图片)
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # [日志] 记录谁来过(access)和出了什么错(error)
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # [性能优化三剑客]
    # sendfile on: "零拷贝"传输。文件直接从硬盘读到网卡，不经过 CPU 倒手，传文件极快。
    sendfile on;
    # tcp_nopush/nodelay: 网络包传输策略，为了更低延迟。
    tcp_nopush on;
    tcp_nodelay on;
    # keepalive_timeout: 长连接超时。客人办完事别急着赶走，65秒内再来不用重新握手。
    keepalive_timeout 65;
    # 允许最大的请求体 (上传文件限制)。默认只有 1M，这里改成 100M，避免上传文件报 413 错误。
    client_max_body_size 100M;

    # [Gzip 压缩] - 给流量瘦身
    gzip on;
    gzip_min_length 1024; # 小于 1k 的文件不压，压了反而变大。
    # 只有这些文本文件才压缩，图片视频本身压过了就不要压了。
    gzip_types text/plain text/css text/xml text/javascript application/json;

    # [上游服务定义] (最重要的通讯录)
    # 定义了一个叫 label-base-agent 的服务组。
    # "server label-base-agent:8000" 里的 hostname 对应 docker-compose 里的 service name。
    upstream label-base-agent {
        server label-base-agent:8000;
    }

    server {
        listen 80;
        server_name localhost;

        # [前端静态文件托管]
        location / {
            root /usr/share/nginx/html; # 静态文件在哪
            # [核心配置] try_files: 单页应用 (SPA) 必配！
            # 意思是：用户访问 /about，先找 /about 文件？没。再找 /about/ 目录？没。
            # 最后统统返回 /index.html。让前端路由 (Vue/React Router) 去处理。
            try_files $uri $uri/ /index.html;
            
            # [缓存策略] 图片字体一年都不变，告诉浏览器存缓存里，别老来问服务器。
            location ~* \.(js|css|png|jpg|gif|ico|svg|woff|ttf|eot)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        # [后端反向代理]
        # 当请求以 /analytics 开头时，转发给 analytics-frontend 服务
        location /analytics {
            proxy_pass http://analytics-frontend;
            include /etc/nginx/proxy_params; 
        }

        # [正则路由] 
        # 把 /analytics/api/v1/xxx 转给 label-base-agent/api/v1/xxx
        # $1 代表正则括号里匹配到的内容。
        location ~ ^/analytics/(api/v1/.*)$ {
            proxy_pass http://label-base-agent/$1;
            include /etc/nginx/proxy_params;
        }

        # [WebSocket 长连接]
        location /ws/ {
            proxy_pass http://label-base-agent;
            # WebSocket 必须配这两个 Header！告诉 Nginx 这是一个升级协议的请求。
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            
            # [长连接核心] 读写超时设为 1 天 (86400s)。
            # AI 训练时间长，如果默认 60s 超时，训练一半连接断了就前功尽弃。
            proxy_read_timeout 86400s; 
            proxy_send_timeout 86400s;
        }
    }
}
```

#### 7.4.1 公共代理参数详解 (`proxy_params`)

在配置中，您多次看到了 `include` 以及手写的 `proxy_set_header`。这些参数是**反向代理的灵魂**，也就是告诉后端“谁在调用它”。

| 参数 | 解释 (人话版) |
| :--- | :--- |
| `proxy_http_version 1.1;` | **用新协议**。默认是 1.0，不支持长连接。微服务内部通信建议全开 1.1，性能更好。 |
| `proxy_set_header Host $host;` | **传递真实域名**。后端如果是个多租户系统，需要根据域名区分租户，这个必传。 |
| `proxy_set_header X-Real-IP $remote_addr;` | **传递真实IP**。<br>告诉后端：“老大，这个请求虽然是 Nginx 转给你的，但真正的用户 IP 是这个”。 |
| `proxy_set_header X-Forwarded-For ...` | **传递IP链**。<br>如果经过了好几层代理 (CDN -> SLB -> Nginx -> App)，这个字段会记录一串 IP。 |
| `proxy_set_header X-Forwarded-Proto $scheme;` | **传递协议**。<br>告诉后端用户是是用 http 还是 https 进来的。不然后端重定向时容易出错。 |
| `proxy_read_timeout 300s;` | **后端太慢怎么办？**<br>默认 60s。如果你的后端接口生成报表要 2 分钟，不改这个 Nginx 60s 就会切断连接报 504 错误。 |
| `proxy_connect_timeout 75s;` | **后端挂了怎么办？**<br>这是 Nginx 尝试连接后端的超时时间。如果 75s 还没连上，说明后端可能挂了。 |
```

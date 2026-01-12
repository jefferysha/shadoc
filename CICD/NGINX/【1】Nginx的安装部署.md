#### 文章目录

- - [虚拟机安装](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#_6)
    - - [虚拟机安装CentOS7.4](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#CentOS74_12)
        - - [1 新建虚拟机](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#1__14)
            - [2 选择典型](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#2__18)
            - [3 选择CentOS镜像](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#3_CentOS_22)
            - [4 存储位置](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#4__28)
            - [5 虚拟机磁盘配置](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#5__32)
            - [6 自定义其他配置](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#6__36)
        - [电脑配置](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#_44)
        - [系统安装](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#_50)
        - - [1 虚拟机配置完成之后进入系统安装界面](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#1__52)
            - [2 选择安装语言](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#2__60)
            - [3 分区选择](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#3__64)
            - [4 开始安装](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#4__74)
            - [5 安装完成](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#5__82)
        - [Linux配置](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#Linux_94)
        - - [配置上网](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#_96)
            - [配置静态ip](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#ip_120)
            - [不能上网的错误排查](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#_183)
            - [一些公网DNS服务器](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#DNS_191)
        - [Centos7 防火墙的关闭](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#Centos7__210)
    - [宝塔Linux面板安装教程](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#Linux_246)
    - [Nginx的安装](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#Nginx_283)
    - - [使用源码编译安装](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#_307)
        - - [如果出现警告或报错](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#_322)
            - [安装成系统服务](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#_389)
        - [使用宝塔面板安装](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#_440)
    - [参考文档](https://hashnode.blog.csdn.net/article/details/124502959?spm=1001.2014.3001.5502#_450)

### [虚拟机安装](https://so.csdn.net/so/search?q=%E8%99%9A%E6%8B%9F%E6%9C%BA%E5%AE%89%E8%A3%85&spm=1001.2101.3001.7020)

- 虚拟机：vmware
- 操作系统：CentOS-7.4

#### [虚拟机安装CentOS7](https://so.csdn.net/so/search?q=%E8%99%9A%E6%8B%9F%E6%9C%BA%E5%AE%89%E8%A3%85CentOS7&spm=1001.2101.3001.7020).4

##### 1 [新建虚拟机](https://so.csdn.net/so/search?q=%E6%96%B0%E5%BB%BA%E8%99%9A%E6%8B%9F%E6%9C%BA&spm=1001.2101.3001.7020)

![(img-0Y8cBNy9-1651289700668)](https://i-blog.csdnimg.cn/blog_migrate/5313efffaec296ec9e916991cb202522.png)

##### 2 选择典型

![image-20220429103817610](https://i-blog.csdnimg.cn/blog_migrate/e54c78358e31d6b7386eeffe340ff1c5.png)

##### 3 选择CentOS镜像

我们在这次学习时使用mini版操作系统镜像，安装速度快，也去除了我们用不到的软件。

![image-20220429104028241](https://i-blog.csdnimg.cn/blog_migrate/b91601512b347e8e433a970bac5586d0.png)

##### 4 存储位置

![image-20220429104123522](https://i-blog.csdnimg.cn/blog_migrate/3354405e0b7eff6a7d5cf35063ae8361.png)

##### 5 虚拟机磁盘配置

![image-20220429104252587](https://i-blog.csdnimg.cn/blog_migrate/0a76f20726b6b8522a5493a3538a5cc2.png)

##### 6 自定义其他配置

![(img-cv7EL99h-1651289700688)](https://i-blog.csdnimg.cn/blog_migrate/4ba76278eba09602fbea3e705f02e3df.png)

在自定义硬件中，我们可以再次配置虚拟机的内存、cpu等硬件属性：

![image-20220429104532662](https://i-blog.csdnimg.cn/blog_migrate/885132e7f46cb46a12f9279681fda25e.png)

#### 电脑配置

内存：建议8G以上

CPU：4核以上主流即可

#### 系统安装

##### 1 虚拟机配置完成之后进入系统安装界面

![image-20220429104742575](https://i-blog.csdnimg.cn/blog_migrate/d03ea58d718b2bbdcb3d6f507b525ea6.png)

出现此界面后敲“回车”进入安装程序

![image-20220429104809556](https://i-blog.csdnimg.cn/blog_migrate/4b92b2c19bb4c3a37a9c3f7423bdeef4.png)

##### 2 选择安装语言

![image-20220429105000623](https://i-blog.csdnimg.cn/blog_migrate/dd1b1d8a9eec9ab724925d612a56dce3.png)

##### 3 分区选择

虽然默认会自动帮我们格式化磁盘，但也需要点击确认一下。

![image-20220429105138184](https://i-blog.csdnimg.cn/blog_migrate/0fb8f8cbb7f9c18ef5175706a0f17e53.png)

点击左上角完成即可

![image-20220429105205236](https://i-blog.csdnimg.cn/blog_migrate/2b9c580c4a60b3b1124abc16f260b3c6.png)

##### 4 开始安装

![image-20220429105238902](https://i-blog.csdnimg.cn/blog_migrate/2508fae9d93c273fff89b3f38cd78e64.png)

安装过程中我们可以设置密码

![image-20220429105355312](https://i-blog.csdnimg.cn/blog_migrate/b5d1f5be55a62974a6b72797fd399b71.png)

##### 5 安装完成

当出现 重启 按钮时，说明系统已经安装完成

![image-20220429105511251](https://i-blog.csdnimg.cn/blog_migrate/d9238f2a71cb887d84e5c95305b9cc82.png)

重启后的样子

![image-20220429105531308](https://i-blog.csdnimg.cn/blog_migrate/924c21b572e131c1ea10f0e550da41c6.png)

至此，我们在VMware中对CentOS的基本安装已经完成。

#### Linux配置

##### 配置上网

- 修改配置网卡配置文件

vi /etc/sysconfig/network-scripts/ifcfg-ens33

![image-20220429111029259](https://i-blog.csdnimg.cn/blog_migrate/eba11903356df45548b07bca694fedda.png)

- 修改ONBOOT=yes
    
- 重启网络服务
    

systemctl restart network

- 测试
    
    ping qq.com
    
    ![image-20220429111845497](https://i-blog.csdnimg.cn/blog_migrate/7ce0fcb1939ae22b5f9f0384e96841c7.png)
    
    至此，我们的虚拟机就可以访问互联网了。
    

##### 配置静态ip

查看本地ip:

![image-20220429112527136](https://i-blog.csdnimg.cn/blog_migrate/3b0371b51f304e710c142e69da30f3c5.png)

之前的网络配置是使用dhcp方式分配ip地址，这种方式会在系统每次联网的时候分配一个ip给我们用，也就是说有可能系统下次启动的时候ip会变，这样非常不方便我们管理。

网段和网关可以通过以下方式查看：

![(img-TXTOdh17-1651289700735)](https://i-blog.csdnimg.cn/blog_migrate/4cd9100ab9ba230efc4682858f4bcbb6.png)

![image-20220429115544902](https://i-blog.csdnimg.cn/blog_migrate/c6de91e8a6ea298143484042a5ea202c.png)

配置静态ip首先需要打开网卡配置文件

```bash
vi /etc/sysconfig/network-scripts/ifcfg-ens33
```

- 修改启动协议 BOOTPROTO=static
- 手动配置ip地址

```properties
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=static
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens33
UUID=d768f819-cfc1-4a6d-8bf5-cd7359a86c75
DEVICE=ens33
ONBOOT=yes
# IP地址 （根据自己的环境修改）
IPADDR=192.168.8.101
# 子网掩码
NETMASK=255.255.255.0
# 网关（根据自己的环境修改）
GATEWAY=192.168.8.2
#DNS
DNS1=223.5.5.5
```

完整配置截图如下：

![image-20220429115226394](https://i-blog.csdnimg.cn/blog_migrate/9f9e62b0b9ba427fa1ab9040527c0043.png)

环境不同，ip地址可能不同，所以需要安装自己的ip网段和网关地址进行配置。

- 接下来重启网络服务

systemctl restart network

查看ip地址，发现ip地址已经变成固定ip 192.168.8.101：

![image-20220429113917631](https://i-blog.csdnimg.cn/blog_migrate/18a64bfbd02c811f5802a9f4594b656b.png)

##### 不能上网的错误排查

•vmware中网关是否正确

•直接ping ip是否能通（物理连接排查）

•卸载重装

##### 一些公网DNS服务器

```cmd
#阿里
223.5.5.5
223.6.6.6
#腾讯
119.29.29.29
182.254.118.118
#百度
180.76.76.76
#114 DNS
114.114.114.114
114.114.115.115
#谷歌
8.8.8.8
8.8.4.4
```

#### Centos7 防火墙的关闭

CentOS 7.0默认使用的是firewall作为防火墙

查看防火墙状态

```
firewall-cmd --state
```

停止firewall

```
systemctl stop firewalld.service
```

禁止firewall开机启动

```
systemctl disable firewalld.service
```

放行端口

```bash
firewall-cmd --zone=public --add-port=80/tcp --permanent
```

重启防火墙

```bash
firewall-cmd --reload
```

### 宝塔Linux面板安装教程

参考：[https://www.bt.cn/bbs/thread-19376-1-1.html](https://www.bt.cn/bbs/thread-19376-1-1.html)

安装命令：

```bash
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh
```

安装成功的截图如下：

![image-20220429140421939](https://i-blog.csdnimg.cn/blog_migrate/eb7df158797feb74c5fccbf0ddabd907.png)

一定要保管好链接和用户名、密码。

```bash
外网面板地址: http://183.208.21.74:8888/f5ec0b77
内网面板地址: http://192.168.8.101:8888/f5ec0b77
username: 5ano3drc
password: cd9e6a03
```

安装好进行访问：

![image-20220429140613371](https://i-blog.csdnimg.cn/blog_migrate/2a811073f1caf86b3cd02fd0c7e9e6cb.png)

![image-20220429140830710](https://i-blog.csdnimg.cn/blog_migrate/c869c02e927cf5b5072dc67cd6c3c2e5.png)

面板卸载：

```bash
/etc/init.d/bt stop && chkconfig --del bt && rm -f /etc/init.d/bt && rm -rf /www/server/panel
```

### Nginx的安装

版本区别

常用版本分为四大阵营

- Nginx开源版

http://nginx.org/

- Nginx plus 商业版

https://www.nginx.com

- openresty

http://openresty.org/cn/

- Tengine

http://tengine.taobao.org

Nginx的安装可以选择源码编译的方式也可以使用宝塔面板安装，本文采用的是源码编译安装。

#### 使用源码编译安装

![(img-EauVlNXu-1651289700752)](https://i-blog.csdnimg.cn/blog_migrate/b11a6070642dfa43d8e567f554ff0d50.png)

![image-20220429185907815](https://i-blog.csdnimg.cn/blog_migrate/eee59c920c49446c26a9c7c5c49f5123.png)

```bash
tar zxvf nginx-1.21.6.tar.gz
cd nginx-1.21.6
./configure --prefix=/usr/local/nginx  # --prefix=/usr/local/nginx 指安装路径是/usr/local/nginx，如果前面安装了宝塔Linux面板，这一步应该不会出现环境问题。

make
make install
```

##### 如果出现警告或报错

提示：

```bash
checking for OS
+ Linux 3.10.0-693.el7.x86_64 x86_64
checking for C compiler ... not found
./configure: error: C compiler cc is not found
```

安装gcc

```bash
yum install -y gcc
```

提示：

```bash
/configure: error: the HTTP rewrite module requires the PCRE library.
You can either disable the module by using --without-http_rewrite_module
option, or install the PCRE library into the system, or build the PCRE library
statically from the source with nginx by using --with-pcre=<path> option.
```

安装perl库

```bash
yum install -y pcre pcre-devel
```

提示：

```bash
./configure: error: the HTTP gzip module requires the zlib library.
You can either disable the module by using --without-http_gzip_module
option, or install the zlib library into the system, or build the zlib library
statically from the source with nginx by using --with-zlib=<path> option.
```

安装zlib库:

```bash
yum install -y zlib zlib-devel
```

接下来执行

```bash
make
make install
```

启动nginx

进入安装好的目录 /usr/local/nginx/sbin

```bash
./nginx					    # 启动
./nginx -s stop			 	#快速停止
./nginx -s quit 			#优雅关闭，在退出前完成已经接受的连接请求
./nginx -s reload 			#重新加载配置
```

安装成功的截图如下：  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/1b3323e580c5c05f767fd609e2c233ec.png)

##### 安装成系统服务

在如下位置创建服务脚本nginx.service

```bash
vi /usr/lib/systemd/system/nginx.service
```

服务脚本内容如下(注意路径要对应，这里的路径是/usr/local/nginx/sbin)：

```bash
[Unit]
Description=nginx - web server
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
PIDFile=/usr/local/nginx/logs/nginx.pid
ExecStartPre=/usr/local/nginx/sbin/nginx -t -c /usr/local/nginx/conf/nginx.conf
ExecStart=/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s stop
ExecQuit=/usr/local/nginx/sbin/nginx -s quit
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

重新加载系统服务

```bash
systemctl daemon-reload
```

启动服务

```bash
systemctl start nginx.service
```

开机启动

```bash
systemctl enable nginx.service
```

测试，访问http://192.168.8.101/：

![image-20220430113130276](https://i-blog.csdnimg.cn/blog_migrate/9fcbcb87953584acc41e4afaeeb59112.png)

#### 使用宝塔面板安装

宝塔面板安装的版本不是nginx的开源版本，作为学习，建议使用源码编译安装，熟练了再使用宝塔版的nginx。

![image-20220429141216233](https://i-blog.csdnimg.cn/blog_migrate/1f4ef41733ceb3b7eccff9bfbc259e70.png)

![image-20220429141248750](https://i-blog.csdnimg.cn/blog_migrate/8ffd81473cc76e97c22cbdb9ddafb3a4.png)

### 参考文档

Nginx参考文档：https://www.w3cschool.cn/nginx/nginx-d1aw28wa.html
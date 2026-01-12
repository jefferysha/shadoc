#### 文章目录

- - [使用阿里云配置https](https://hashnode.blog.csdn.net/article/details/124555303#https_5)
    - - [实战](https://hashnode.blog.csdn.net/article/details/124555303#_76)
    - [](https://hashnode.blog.csdn.net/article/details/124555303#_179)

### 使用阿里云配置https

阿里云免费证书购买在如下位置：

![image-20220502180114579](https://i-blog.csdnimg.cn/blog_migrate/bc9c534523db3ce795ae1b35de6e732a.png)

![image-20220502180214498](https://i-blog.csdnimg.cn/blog_migrate/7f8473917a90958e1c98008a19c645c8.png)

![image-20220502180253209](https://i-blog.csdnimg.cn/blog_migrate/c40e01d21cebc914fdd12529dd339995.png)

购买完成后在如下位置创建证书并申请证书：

![image-20220502180721249](https://i-blog.csdnimg.cn/blog_migrate/0b358e57dd857a7a499f876062aae616.png)

填写验证信息

![image-20220502180746873](https://i-blog.csdnimg.cn/blog_migrate/c8e9b8b929c6017bc62a9ebbf23d5a27.png)

![image-20220502180905706](https://i-blog.csdnimg.cn/blog_migrate/b5d28c0ff98db22988bf141a9f6baf60.png)

DNS对应的记录在如下页面：

![image-20220502185442580](https://i-blog.csdnimg.cn/blog_migrate/876c37266c1f99e586ad002b329d93a6.png)

证书签发后，选择下载：

![image-20220502185524886](https://i-blog.csdnimg.cn/blog_migrate/f0d1f294a37b79c58f93f69efcd5246c.png)

![image-20220502185354484](https://i-blog.csdnimg.cn/blog_migrate/75850b454eee7dc3c524d47f29e0fd54.png)

下载后的文件如图所示：

![image-20220502185627427](https://i-blog.csdnimg.cn/blog_migrate/9e0e37b00d768dc8d7bc158d9ce63c4a.png)

接下来需要将这两个文件上传到nginx目录下的conf目录下：

![image-20220502185843137](https://i-blog.csdnimg.cn/blog_migrate/b9f85bfc0749db668e13ad0a95915738.png)

[nginx配置](https://so.csdn.net/so/search?q=nginx%E9%85%8D%E7%BD%AE&spm=1001.2101.3001.7020)证书：

```bash
server {
	listen 443 ssl;
	server_name localhost;  # 接收所有访问443端口的请求
	ssl_certificate 7706851_www.xzj520520.cn.pem;
	ssl_certificate_key 7706851_www.xzj520520.cn.key;
}
```

配置完之后，重启nginx:

```bash
systemctl restart nginx
```

由于http协议默认的端口是80，而https默认的端口是443，如果想让http的访问跳转到https的访问，可以做如下配置：

```bash
server {

	listen 80;
	server_name www.xzj520520.cn xzj520520.cn; # 换成自己的域名
	...

	return 301 https://$server_name$request_uri;	

}
```

至此，已经完成https的配置。

#### 实战

配置nginx.cfg

```bash
user  www www;
worker_processes auto;
error_log  /www/wwwlogs/nginx_error.log  crit;
pid        /www/server/nginx/logs/nginx.pid;
worker_rlimit_nofile 51200;

events
    {
        use epoll;
        worker_connections 51200;
        multi_accept on;
    }

http
    {
        include       mime.types;

		include proxy.conf;

        default_type  application/octet-stream;

        server_names_hash_bucket_size 512;
        client_header_buffer_size 32k;
        large_client_header_buffers 4 32k;
        client_max_body_size 50m;

        sendfile   on;
        tcp_nopush on;

        keepalive_timeout 60;

        tcp_nodelay on;

        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
        fastcgi_buffer_size 64k;
        fastcgi_buffers 4 64k;
        fastcgi_busy_buffers_size 128k;
        fastcgi_temp_file_write_size 256k;
		fastcgi_intercept_errors on;

        gzip on;
        gzip_min_length  1k;
        gzip_buffers     4 16k;
        gzip_http_version 1.1;
        gzip_comp_level 2;
        gzip_types     text/plain application/javascript application/x-javascript text/javascript text/css application/xml;
        gzip_vary on;
        gzip_proxied   expired no-cache no-store private auth;
        gzip_disable   "MSIE [1-6]\.";

        limit_conn_zone $binary_remote_addr zone=perip:10m;
		limit_conn_zone $server_name zone=perserver:10m;

        server_tokens off;
        access_log off;

server {
	listen 443 ssl;
	server_name localhost;  
	ssl_certificate 7706851_www.xzj520520.cn.pem;
	ssl_certificate_key 7706851_www.xzj520520.cn.key;
	
	#配置根目录以及默认页面
        location / {
            root   html;
            index  index.html index.htm index.php;
        }

	#出错页面配置
        error_page   500 502 503 504  /50x.html;
        #/50x.html文件所在位置
        location = /50x.html {
            root   html;
        }
}

server {
	listen 80;
# 	server_name localhost www.xzj520520.cn xzj520520.cn; 
  server_name www.xzj520520.cn xzj520520.cn;

	# 重定向，会显示跳转的地址server_name,如果访问的地址没有匹配会默认使用第一个，即www.xzj520520.cn
	return 301 https://$server_name$request_uri;	
}

}
```

访问http://xzj520520.cn, 发现自动变成https访问：

![image-20220503091752269](https://i-blog.csdnimg.cn/blog_migrate/bf86aacb6f76eaefa5edfa22f51afd28.png)

访问https://a.xzj520520.cn,显示安全提示页面:

![image-20220503091912018](https://i-blog.csdnimg.cn/blog_migrate/b834ffac634bace795a077e80078c7bb.png)
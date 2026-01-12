#### 文章目录

- - [防盗链](https://hashnode.blog.csdn.net/article/details/124530514#_5)
    - - [nginx防盗链配置](https://hashnode.blog.csdn.net/article/details/124530514#nginx_9)
        - - [valid_referers解释](https://hashnode.blog.csdn.net/article/details/124530514#valid_referers_222)
        - [使用curl测试](https://hashnode.blog.csdn.net/article/details/124530514#curl_270)
        - [配置错误提示页面](https://hashnode.blog.csdn.net/article/details/124530514#_282)
        - - [返回错误页面](https://hashnode.blog.csdn.net/article/details/124530514#_284)
            - [返回出错图片](https://hashnode.blog.csdn.net/article/details/124530514#_378)

### 防盗链

盗链是指服务提供商自己不提供服务的内容，通过技术手段绕过其它有利益的最终用户界面（如广告），直接在自己的网站上向最终用户提供其它服务提供商的服务内容，骗取最终用户的浏览和点击率。受益者不提供资源或提供很少的资源，而真正的服务提供商却得不到任何的收益。

#### nginx防盗链配置

为了模拟盗链，在这里让101为服务站点，102为网关服务器，103访问102进行盗链。

101的nginx.cfg

```bash
worker_processes  1; #允许进程数量，建议设置为cpu核心数或者auto自动检测，注意Windows服务器上虽然可以启动多个processes，但是实际只会用其中一个

events {
    #单个进程最大连接数（最大连接数=连接数*进程数）
    #根据硬件调整，和前面工作进程配合起来用，尽量大，但是别把cpu跑到100%就行。
    worker_connections  1024;
}


http {
    #文件扩展名与文件类型映射表(是conf目录下的一个文件)
    include       mime.types;
    #默认文件类型，如果mime.types预先定义的类型没匹配上，默认使用二进制流的方式传输
    default_type  application/octet-stream;

    #sendfile指令指定nginx是否调用sendfile 函数（zero copy 方式）来输出文件，对于普通应用，必须设为on。如果用来进行下载等应用磁盘IO重负载应用，可设置为off，以平衡磁盘与网络IO处理速度。
    sendfile        on;
    
     #长连接超时时间，单位是秒
    keepalive_timeout  65;

#定义一组服务器
upstream httpds{
    server 192.168.8.102 weight=10;
    server 192.168.8.103 weight=1;
}

 #虚拟主机的配置
    server {
    #监听端口
        listen       80;
        #域名，可以有多个，用空格隔开
        server_name  test80.xzj520520.cn;

	#配置根目录以及默认页面
        location / {
            proxy_pass http://httpds;
            # root   /www/test80;
            # index  index.html index.htm;
        }

	#出错页面配置
        error_page   500 502 503 504  /50x.html;
        #/50x.html文件所在位置
        location = /50x.html {
            root   html;
        }
        
    }
    

}
```

102的nginx.cfg

```bash
worker_processes  1;



events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;

    keepalive_timeout  65;


    server {
        listen       80;
        server_name  localhost;


        location / {
            proxy_pass http://192.168.8.101:8080;
        }
        
        
        location ^~/images/ {
            root   /www/resources;
        }
       
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }

}

```

103的nginx.cfg

```bash
worker_processes  1;



events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;


    server {
        listen       80;
        server_name  localhost;

        location / {
            proxy_pass http://192.168.8.102;
        }
         
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

    }

}
```

访问http://192.168.8.103/：

![image-20220501163618594](https://i-blog.csdnimg.cn/blog_migrate/54c3047045a7d0ee38f6bd4fa675fa66.png)

如果不想被盗链，可以对网关服务器102做如下配置：

nginx.cfg

```bash
worker_processes  1;



events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;


    sendfile        on;
    
    keepalive_timeout  65;


    server {
        listen       80;
        server_name  localhost;


        location / {
            proxy_pass http://192.168.8.101:8080;
        }
        
        
        
        location ^~/images/ {
            valid_referers 192.168.8.102;  #valid_referers 指令，配置是否允许 referer 头部以及允许哪些 referer 访问。192.168.8.102不是ip而是域名（去掉http:// 前缀）
            if ($invalid_referer) {  # 注意这里if后要加空格
                return 403; ## 返回错误码
            }
            
            root   /www/resources;
        }
        

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

    }


}

```

![image-20220501170655802](https://i-blog.csdnimg.cn/blog_migrate/7cd20ad85269b34734d3ba946d283264.png)

![image-20220501170754065](https://i-blog.csdnimg.cn/blog_migrate/89cd4d728b359120e0b3aa0bb607a7a0.png)

测试，访问http://192.168.8.103/：

![image-20220501173200034](https://i-blog.csdnimg.cn/blog_migrate/0acbea83ba0817c5a6da0dbc71d8604f.png)

##### valid_referers解释

可以同时携带多个参数，表示多个 referer 头部都生效。

**参数值**

- none：允许没有 referer 信息的请求访问，即直接通过url访问。
- blocked：请求头Referer字段不为空（即存在Referer），但是值可以为空（值被代理或者防火墙删除了），并且允许refer不以“http://”或“https://”开头，通俗点说就是允许“http://”或"https//"以外的请求。
- server_names：若 referer 中站点域名与 server_name 中本机域名某个匹配，则允许该请求访问
- 其他字符串类型：检测referer与字符串是否匹配，如果匹配则允许访问，可以采用通配符*
- 正则表达式：若 referer 的值匹配上了正则，就允许访问

**invalid_referer 变量**

- 允许访问时变量值为空
- 不允许访问时变量值为 1

例

```bash
server {
    server_name referer.test.com;
    listen 80;

    error_log logs/myerror.log debug;
    root html;
    location / {
        valid_referers none server_names
                       *.test.com www.test.org.cn/nginx/;
        if ($invalid_referer) {
                return 403; # 返回错误码
        }
        return 200 'valid\n';
    }
}

# none：表示没有 referer 的可以访问
# server_names：表示本机 server_name 也就是 referer.test.com 可以访问
# *.test.com：匹配上了正则的可以访问
# www.test.org.cn/nginx/：该页面发起的请求可以访问
```

设置为none的情况：

![image-20220501174036398](https://i-blog.csdnimg.cn/blog_migrate/7b61b094202e511dca7a16b7a17a5035.png)

![image-20220501174009132](https://i-blog.csdnimg.cn/blog_migrate/de2341f240c8518fe4632247c5d98b04.png)

#### 使用curl测试

![image-20220501175110561](https://i-blog.csdnimg.cn/blog_migrate/f6507cd2fc72998b2852f2363febbc09.png)

从baidu访问过来的请求：

![image-20220501175433326](https://i-blog.csdnimg.cn/blog_migrate/15a9b99f2b065a1fa4065f44a74d7bc4.png)

如果添加了baidu.com，发现访问成功：

![image-20220501175824843](https://i-blog.csdnimg.cn/blog_migrate/20e2f5bb71366ebfe1eb4f62577c2834.png)

#### 配置错误提示页面

##### 返回错误页面

在102nginx的html目录中添加[403](https://so.csdn.net/so/search?q=403&spm=1001.2101.3001.7020).html

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Error</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>An error occurred.</h1>
<p>非法请求.</p>

</body>
</html>

```

修改nginx.conf

![image-20220501180853897](https://i-blog.csdnimg.cn/blog_migrate/e1b80d866c110d861df8aa1ce13e9814.png)

代码如下:

```bash
worker_processes  1;



events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

   

    sendfile        on;

    keepalive_timeout  65;



    server {
        listen       80;
        server_name  localhost;

        location / {
            proxy_pass http://192.168.8.101:8080;
        }
        
        
        location ^~/images/ {
            valid_referers 192.168.8.102 baidu.com;
            if ($invalid_referer) {
                return 403; # 返回错误码
            }
            
            root   /www/resources;
        }
        

        error_page   403  /403.html;
        location = /403.html {
            root   html;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        
    }

}

```

访问http://192.168.8.103/images/bg.jpg

![image-20220501180531243](https://i-blog.csdnimg.cn/blog_migrate/33b45e984595533c910efe7fb84449a8.png)

##### 返回出错图片

修改网关服务器102

![image-20220501181602775](https://i-blog.csdnimg.cn/blog_migrate/954e60d5006715192d46b2d0d48669c8.png)

将403.png保存到/www/resources/images中

![image-20220501182639312](https://i-blog.csdnimg.cn/blog_migrate/92169984e16177c90e5c09e460dcaad8.png)

访问192.168.8.103:

![image-20220501182707030](https://i-blog.csdnimg.cn/blog_migrate/83a587c35861583745aded9c374cf399.png)
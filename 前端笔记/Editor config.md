### Editor Config

在项目根目录下再增加一个名为 `.editorconfig` 的文件。

这个文件的作用是强制编辑器以该配置来进行编码，比如缩进统一为空格而不是 Tab ，每次缩进都是 2 个空格而不是 4 个等等。

文件内容如下：


```js
# http://editorconfig.org
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
max_line_length = 80
trim_trailing_whitespace = true

[*.md]
max_line_length = 0
trim_trailing_whitespace = false
```

具体的参数说明可参考：[项目代码风格统一神器 editorconfig 的作用与配置说明](https://chengpeiquan.com/article/editorconfig.html)
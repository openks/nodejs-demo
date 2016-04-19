Nodejs中使用Log4js

1.先配置log4js的配置文件

conf\log4js_conf.json
```js
{
    "appenders": [
        {
            "type": "console" //如果取消这个则不在控制台显示
        },
        {
            "type": "file",
            "filename": "logs/login.log",
            "category": "login",//创建登陆log
            "maxLogSize": 1048576,
            "backup": 3
        },
        {
            "type": "file",
            "filename": "logs/signup.log",
            "category": "signup",//创建注册log
            "maxLogSize": 1048576,
            "backup": 3
        },
        {
            "type": "file",
            "filename": "logs/api.log",//创建api调用log
            "category": "api",
            "maxLogSize": 1048576,
            "backup": 3
        }
    ],
    "levels": {
        "login": "INFO",//各个log的启用等级
        "signup": "INFO",
        "api": "INFO"
    }
}
//json文件中不能包含注释，如果使用需全部去掉
```
2.在项目中调用
```js
var log4js = require("log4js");
//项目目录下面建conf\log4js_conf.json文件
log4js.configure(__dirname + "\conf\log4js_conf.json");
var loginLoger = log4js.getLogger('login');
//可重新对该文件的loginLoger设置级别
loginLoger.setLevel("INFO");
//执行到这里时会把日志信息打印在conf\log4js_conf.json文件里配置的logs/login.log文件里
loginLoger.info("loginInfo--log");
```
3.连接http-log及设置输出格式
```js
//使用log4js输出http log
var HTTP_LOG_FORMAT_DEV = ':method :url :status :response-time ms - :res[content-length]';
app.use(log4js.connectLogger(loginLoger, { level: 'auto', format: HTTP_LOG_FORMAT_DEV }));
```
通过这样的配置就可快速的查看登录的相关信息，其他包括退出，修改密码之类的都可以单独做logger这样就可以快速定位问题
[log4js github](https://github.com/nomiddlename/log4js-node)
[关于log4js更多信息](http://blog.csdn.net/heiantianshi1/article/details/43984601)

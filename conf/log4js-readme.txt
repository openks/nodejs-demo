
//// 使用说明：
//var log4js = require("log4js");
//log4js.configure(__dirname + "\conf\log4js_conf.json");
//var loginLoger = log4js.getLogger('login');
//var log4jsLoger = log4js.getLogger('log4js');
////可重新设置级别
//loginLoger.setLevel("INFO");
//loginLoger.info("loginInfo--log");


////如何使用log4js输出http log
//var log4js = require("log4js");
//log4js.configure(__dirname + "\conf\log4js_conf.json");
//var log4jsLoger = log4js.getLogger('log4js');
//app.use(log4js.connectLogger(log4jsLoger, { level: 'auto', format: ':method :url :status :response-time ms - :res[content-length]' }));

var express = require('express');
var SHA256 = require("crypto-js/sha256");
var router = express.Router();
//数据操作对象
var User = require('../public/javascripts/user');
var log4js = require("log4js");
log4js.configure('conf/log4js_conf.json');
var loginLogger = log4js.getLogger("login");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: '登陆页' });
});
router.get('/users', function(req, res, next) {
	console.log(User);
	User.find().exec(function(err,data){
		res.render('showUsers', {
			user: data,
			title:"用户列表"
		})
	})  
});
router.all('/login2', function(req, res, next) {
		User.find({"userName":req.body.uname,"passWord":req.body.pwd}).exec(function(err,data){
			var result;
			if(data.length!=0){
				result="登陆成功！！";
			}else{
				result="用户名或密码错误请重试";
			}
			loginLogger.info("--userName:"+req.body.uname+"--"+result);
			res.json({"result":result});
	})  
});
module.exports = router;

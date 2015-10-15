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
	res.render('index', {
		title: 'Express'
	});
});
router.get('/login', function(req, res, next) {
	res.render('login', {
		title: '登陆页'
	});
});
//获取用户列表
router.get('/users', function(req, res, next) {
	res.render('showUsers', {
		title: "用户列表"
	});
});
router.get('/userDetail', function(req, res, next) {
	var user = {};
	user.userName = "张三";
	user.birthday = "2015-05-01";
	user.age = 20;
	res.render('userDetail', {
		user: user,
		title: user.userName + "的详细信息"
	})
});
//登录
router.all('/login2', function(req, res, next) {
	User.find({
		"userName": req.body.uname,
		"passWord": req.body.pwd
	}).exec(function(err, data) {
		var result;
		if (data.length != 0) {
			result = "登陆成功！！";
		} else {
			result = "用户名或密码错误请重试";
		}
		loginLogger.info("--userName:" + req.body.uname + "--" + result);
		res.json({
			"result": result
		});
	})
});
//注册
router.all('/regiest', function(req, res, next) {
	var newUser = new User({
		"userName": req.body.uname,
		"passWord": req.body.pwd
	});
	newUser.save(function(err, data) {
		loginLogger.info("--userName:" + req.body.uname + "--" + result);
		var result;
		if (err != null && err.code == "11000") {
			result = "用户名已存在！";
		} else {
			result = "注册成功！！";
		}
		res.json({
			"result": result
		});
	})
});
//searchUsers
router.all('/searchUsers', function(req, res, next) {
	console.log(req.body.uname);
	User.find({
		"userName": new RegExp(req.body.uname),
	}).exec(function(err, data) {
		console.error(err);
		res.json({
			"result": data
		});
	})
});
module.exports = router;
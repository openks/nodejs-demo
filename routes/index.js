var express = require('express');
var SHA256 = require("crypto-js/sha256");
var router = express.Router();

var url = require('url');
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
	if (JSON.stringify(req.session.user) == "{}") {
		res.render('login', {
			title: '登陆页'
		});
	} else {
		res.redirect("/home");
	}
});
//主页
router.all('/home', function(req, res, next) {
	if (JSON.stringify(req.session.user) == "{}") {
		res.redirect("/login");
	} else {
		//		console.log("home::"+req.session.user.userName);
		res.render('home', {
			title: '用户已登录页',
			user: req.session.user
		});
	}
});

function loginFilter(req, res, next) {
	if (JSON.stringify(req.session.user) == "{}") {
		res.redirect("/login");
	}
};

//获取用户列表
router.get('/users', function(req, res, next) {
	loginFilter(req, res, next);
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
		var result, code = 0;
		if (data.length != 0) {
			req.session.user = data[0];
			//			console.log(JSON.stringify(data));
			//			result = "登陆成功！！";
		} else {
			result = "用户名或密码错误请重试!";
			code = "E001";
		}
		loginLogger.info("--userName:" + req.body.uname + "--" + result);
		res.json({
			"result": result,
			"code": code
		});
	})
});
//退出
router.all('/logout', function(req, res, next) {
	req.session.destroy(function(err) {
		// cannot access session here
	});
	res.redirect("/login");
});
//注册
router.all('/regiest', function(req, res, next) {
	var newUser = new User({
		"userName": req.body.uname,
		"passWord": req.body.pwd
	});
	newUser.save(function(err, data) {
		loginLogger.info("--userName:" + req.body.uname + "--" + result);
		var result, code = 0;
		if (err != null && err.code == "11000") {
			result = "用户名已存在！";
			code = "E002";
		} else {
			result = "注册成功！！";
		}
		res.json({
			"result": result,
			"code": code
		});
	})
});
//searchUsers
router.all('/searchUsers', function(req, res, next) {
	console.log(req.body.uname);
	User.find({
		"userName": new RegExp(req.body.uname),
	}).exec(function(err, data) {
		//		console.error(err);
		res.json({
			"result": data
		});
	})
});
//修改用户名
router.all('/editUser', function(req, res, next) {
	//	console.log("修改用户信息：" + req.body.uid);
	if (req.body.editType == "uName") {
		User.find({
			"userName": req.body.uname,
		}).exec(function(err, data) {
			if (data.length == 0) {
				User.update({
					_id: req.body.uid
				}, {
					$set: {
						"userName": req.body.uname
					}
				}).exec(
					function(err1, data1) {
						if (err1 == null) {
							res.json({
								"result": "新用户名已保存！",
								"code": 0
							});
						} else {
							res.json({
								"result": "更新失败",
								"code": "U002"
							});
						}
					}
				);
			} else {
				res.json({
					"result": "用户名已存在！",
					"code": "E002"
				});
			}
		});
	} else {
		var obj = {};
		if (!!req.body.birthday) {
			obj["birthday"] = req.body.birthday;
		}
		if (!!req.body.gender) {
			obj["gender"] = req.body.gender;
		}
		User.update({
			_id: req.body.uid
		}, {
			$set: obj
		}).exec(
			function(err1, data1) {
				if (err1 == null) {
					res.json({
						"result": "更新成功",
						"code": 0
					});
				} else {
					res.json({
						"result": "更新失败",
						"code": "U001"
					});
				}
			}
		);
	}
});
module.exports = router;
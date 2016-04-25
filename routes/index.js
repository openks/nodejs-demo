var express = require('express');
var SHA256 = require("crypto-js/sha256");
var router = express.Router();

var url = require('url');
//数据操作对象
//var User = require('../public/javascripts/user');
var User = require('../public/javascripts/database');
var util = require('../public/javascripts/util');
var log4js = require("log4js");
log4js.configure('conf/log4js_conf.json');
var loginLogger = log4js.getLogger("login");
var apiLogger = log4js.getLogger("api");

function loginFilter(req, res, next) {
	if (JSON.stringify(req.session.user) == "{}") {
		res.redirect("/login");
	} else {
		return true;
	}
};

//test
router.all('/test', function(req, res, next) {
	User.find({
		"userName": "zs",
	}).exec(function(err, data) {
		apiLogger.info("test--",data);
		res.json({
			"result": data[0]._id
		});
	})
});


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});
router.get('/login', function(req, res, next) {
	// console.log("user",req.session.user);
	if (JSON.stringify(req.session.user) == "{}") {
		// console.log("render");
		res.render('login', {
			title: '登陆页'
		});
	} else {
		res.redirect("/home");
	}
});
//主页
router.all('/home', function(req, res, next) {
	if (loginFilter(req, res, next)) {
		User.find({
			"_id": req.session.user._id,
		}).exec(function(err, data) {
			var result, code = 0;
			if (data.length != 0) {
				req.session.user = data[0];
				res.render('home', {
					title: '用户已登录页',
					user: req.session.user
				});
			}
		})
	}
});

//修改信息
router.all('/userInfo', function(req, res, next) {
	if (loginFilter(req, res, next)) {
		var sex=req.session.user.gender;
		switch(sex){
			case 0:
				sex="男";
				// console.log("性别男");
				break;
			case 1:
				sex="女";
					// console.log("性别nv");
				break;
			case 2:
				sex="保密";
				// console.log("性别bm");
				break;
		}
		res.render('userInfo', {
			gender:sex,
			age:util.getAgeByBirthday(req.session.user.birthday),
			user: req.session.user
		});

	}
});
router.all('/editPassWord', function(req, res, next) {
	if (loginFilter(req, res, next)) {
		res.render('editPass', {
			uid: req.session.user._id
		});
	}
});


//获取用户列表
router.get('/users', function(req, res, next) {
	if (loginFilter(req, res, next)) {
		res.render('showUsers', {
			title: "用户列表"
		});
	};
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

//退出
router.all('/logout', function(req, res, next) {
	req.session.destroy(function(err) {
		// cannot access session here
	});
	loginLogger.info("--userName:" + req.body.uname + "退出了");
	res.redirect("/login");
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
			console.log("session.user",JSON.stringify(data[0]));
			//			result = "登陆成功！！";
		} else {
			result = "用户名或密码错误请重试!";
			code = "E001";
		}
		loginLogger.info("--userName:" + req.body.uname + "登陆了");
		res.json({
			"result": result,
			"code": code
		});
	})
});
//修改密码
router.all('/editPwd', function(req, res, next) {
	User.update({
		"_id": req.body.uid,
		"passWord": req.body.oldpwd,
	}, {
		$set: {
			"passWord": req.body.newpwd,
		}
	}).exec(function(err, data) {
		var result, code = 0;
		console.log(data);
		if (data['nModified'] == 1) {
			result = "修改成功！";
		} else if (data['n'] == 1) {
			result = "原密码与新密码相同！";
		} else {
			result = "原密码错误请重试!";
			code = "E002";
		}
		res.json({
			"result": result,
			"code": code
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
		var result, code = 0;
		if (err != null && err.code == "11000") {
			result = "用户名已存在！";
			code = "E003";
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
								"result": "更新失败!",
								"code": "E004"
							});
						}
					}
				);
			} else {
				res.json({
					"result": "用户名已存在！",
					"code": "E003"
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

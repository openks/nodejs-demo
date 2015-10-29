$(function() {
	//新密码重复输入框离开事件
	$("#editPwdRep").on("blur", function() {
		var new_pw1 = $("#editPwdRep").val();
		var new_pw = $("#editPwd").val();
		if (new_pw1.length > 0 && new_pw1.length > 0 && new_pw != new_pw1) {
			Zepto.toast("两次输入的密码不一致，请重新输入！");
		}
	});
	//登陆页enter键默认登录
	$(document).on('keyup', function(event) {
		event = document.all ? window.event : event;
		if ((event.keyCode || event.which) == 13) {
			$("#bt-login").trigger("click");
		}
	});
	//登陆按钮事件
	$("#bt-login").on("click", function() {
		var uname = $("#userName").val();
		var pwd = $("#password").val();
		$.ajax({
			type: "post",
			url: "login2",
			dataType: 'json',
			data: {
				"uname": uname,
				"pwd": CryptoJS.SHA256(pwd).toString()
			},
			async: true, //设置为同步操作就可以给全局变量赋值成功 
			success: function(data) {
				if (data.code == 0) {
					location.href = "home";
				} else {
					Zepto.alert(data.result);
				}
			},
			error: function(data) {
				Zepto.alert(data.result);
			}
		});
	});
	//注册按钮事件
	$("#bt-reg").on("click", function() {
		var uname = $("#userName").val();
		var pwd = $("#password").val();
		$.ajax({
			type: "post",
			url: "regiest",
			dataType: 'json',
			data: {
				"uname": uname,
				"pwd": CryptoJS.SHA256(pwd).toString()
			},
			async: true, //设置为同步操作就可以给全局变量赋值成功 
			success: function(data) {
				Zepto.alert(data.result);
			},
			error: function(data) {
				Zepto.alert(data.result);
			}
		});
	});
	//修改密码保存按钮事件
	$("#bt-changePwd").on("click", checkChangePwd);
	$(".user-editPwd-back").on("click", function() {
		location.href = "home";
	});

	//修改密码提交校验
	function checkChangePwd() {
		var old_pw = $("#oldPwd").val();
		var new_pw = $("#editPwd").val();
		var new_pw1 = $("#editPwdRep").val();
		var tips = "";
		if (old_pw.length < 1) {
			tips += "请输入原密码！";
			Zepto.toast("请输入原密码！");
			return;
		}
		if (new_pw.length < 1) {
			tips += "请输入新密码！";
			Zepto.toast("请输入新密码！");
			return;
		}
		if (new_pw1.length < 1) {
			tips += "请再次输入新密码！";
			Zepto.toast("请再次输入新密码！");
			return;
		}
		if (new_pw1.length > 0 && new_pw.length > 0 && new_pw != new_pw1) {
			tips += "两次输入的密码不一致，请重新输入！";
			Zepto.toast("两次输入的密码不一致，请重新输入！");
			return;
		}
		$.ajax({
			type: "post",
			url: "editPwd",
			dataType: 'json',
			data: {
				"uid": $("#oldPwd").attr("data-uid"),
				"oldpwd": CryptoJS.SHA256(old_pw).toString(),
				"newpwd": CryptoJS.SHA256(new_pw).toString(),
			},
			async: true, //设置为同步操作就可以给全局变量赋值成功 
			success: function(data) {
				Zepto.alert(data.result);
			},
			error: function(data) {
				Zepto.alert(data.result);
			}
		});
	}

});
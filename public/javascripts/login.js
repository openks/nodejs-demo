$(function() {
	$("#bt-login").on("click", function() {
		var uname = $("#userName").val();
		var pwd = $("#password").val();
		$.ajax({
			type: "post",
			url: "login2",
			dataType: 'json',
			data:{"uname":uname,"pwd":CryptoJS.SHA256(pwd).toString()},
			async: true, //设置为同步操作就可以给全局变量赋值成功 
			success: function(data) {
				if(data.code==0){
					location.href="home";
				}else{
					Zepto.alert(data.result);
				}
			},
			error: function(data) {
				Zepto.alert(data.result);
			}
		});
	});
	//登陆页enter键默认登录
	$(document).on('keyup', function(event) {
		event = document.all ? window.event : event;
		if ((event.keyCode || event.which) == 13) {
			$("#bt-login").trigger("click");
		}
	});
	$("#bt-reg").on("click", function() {
		var uname = $("#userName").val();
		var pwd = $("#password").val();
		$.ajax({
			type: "post",
			url: "regiest",
			dataType: 'json',
			data:{"uname":uname,"pwd":CryptoJS.SHA256(pwd).toString()},
			async: true, //设置为同步操作就可以给全局变量赋值成功 
			success: function(data) {
				Zepto.alert(data.result);
			},
			error: function(data) {
				Zepto.alert(data.result);
			}
		});
	})
});

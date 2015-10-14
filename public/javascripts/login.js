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
				Zepto.alert(data.result);
			},
			error: function(data) {
				Zepto.alert(data.result);
			}
		});
	})
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

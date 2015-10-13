$(function() {
	$("#bt-login").on("click", function() {
		var uname = $("#userName").val();
		var pwd = $("#password").val();
		$.ajax({
			type: "post",
			url: "login2",
			dataType: 'json',
			data:{"uname":uname,"pwd":pwd},
			async: true, //设置为同步操作就可以给全局变量赋值成功 
			success: function(data) {
				console.warn(data);
				$(".result").text(data.result);
			},
			error: function(data) {
				console.error(data)
			}
		});
		console.log("clicked：" + uname + "--" + pwd);
	})
})
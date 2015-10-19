$(function() {
	//用户列表页搜索事件
	$("#search").on('keyup', function(event) {
		event = document.all ? window.event : event;
		if ((event.keyCode || event.which) == 13) {
			getAndShowUsers();
		}
	});

	function getAndShowUsers() {
		var str = "";
		$.ajax({
			type: "post",
			url: "searchUsers",
			dataType: 'json',
			data: {
				"uname": $("#search").val(),
			},
			async: true, //设置为同步操作就可以给全局变量赋值成功 
			success: function(data) {
				//	console.log(data);
				if (data.result.length == 0) {
					Zepto.alert("未搜索到结果");
				} else {
					for (var i = 0; i < data.result.length; i++) {
						str += '<li class="item-content  item-link" data-id=' + data.result[i]._id + '>' +
							'<div class="item-media"></div><div class="item-inner"><div class="item-title">用户名</div>' +
							'<div class="item-after">' + data.result[i].userName + '</div></div></li>';
					}
					$(".js-user-search-result").empty().append(str);
					sessionStorage.setItem("users", JSON.stringify(data.result));
				}
			},
			error: function(data) {
				console.error(data);
			}
		});
	};
	getAndShowUsers();
	//用户列表页点击用户所在行触发事件
	$(".js-user-search-result").on("click", ".item-content", function() {
		var id = $(this).attr("data-id");
		var obj = getObjByProperty("users", "_id", id, "s");
		$("#detailPage .title,.js-show-uName").text(obj.userName);
		$("#uname-change").val(obj.userName).attr({
			"data-uid": id,
			"data-old": obj.userName
		});
		Zepto.router.loadPage("#detailPage");
	});
	//用户详情页返回按钮点击事件触发
	$(".user-detail-back").on("click", function() {
		Zepto.router.back("#usersPage");
	});
	//用户名修改页返回按钮点击事件触发
	$(".user-uname-back").on("click", function() {
		Zepto.router.back("#detailPage");
	});
	//用户详情页点击用户名行触发事件
	$(".js-item-uname").on("click", function() {
		Zepto.router.loadPage("#unamePage");
	});
	//用户详情页点击性别行触发事件
	$(".js-item-uSex").on("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		if (!e.target.classList.contains("js-show-uSex")) {
			Zepto(".js-show-uSex").triggerHandler("click");
		}
	});
	//用户详情页点击生日行触发事件
	$(".js-item-uBirthday").on("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		if (!e.target.classList.contains("js-show-uBirthday")) {
			Zepto(".js-show-uBirthday").triggerHandler("click");
		}
	});
	//生日变化时计算年龄
	$(".js-show-uBirthday").on("change", function() {
		var year = parseInt((new Date() - new Date($(this).val())) / (365 * 24 * 60 * 60 * 1000), 10);
		$(".js-show-uAge").val(year);
	});
	//用户名修改完成后保存
	$("#bt-edit-uname").on("click", function() {
		var newName = $("#uname-change").val(),
			uid = $("#uname-change").attr("data-uid");
		if (newName == $("#uname-change").attr("data-old")) {
			Zepto.toast("用户名修改成功！");
			return;
		}
		$.ajax({
			type: "post",
			url: "editUser",
			dataType: 'json',
			data: {
				"uid": uid,
				"uname": newName
			},
			async: true, //设置为同步操作就可以给全局变量赋值成功 
			success: function(data) {
				console.log(data);
				if (data.result == "新用户名已保存！") {
					$("#uname-change").attr("data-old", newName);
					$(".js-detail-title,.js-show-uName").text(newName);
					$("[data-id=" + uid + "]").find(".item-after").text(newName);
					setObjByProperty("users", "_id", uid, "userName", newName, "s");
					Zepto.toast("用户名修改成功！");
					Zepto.router.back("#detailPage");
				} else {
					Zepto.toast(data.result);
				}
			},
			error: function(data) {
				console.error(data);
			}
		});
	});
	//picker
	$(document).on("pageInit", "#detailPage", function(e, id, page) {
		Zepto(".js-show-uSex").picker({
			toolbarTemplate: '<header class="bar bar-nav">\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">请选择您的性别</h1>\
      </header>',
			cols: [{
				textAlign: 'center',
				values: ['男', '女', '保密']
			}]
		});
		$(".js-show-uBirthday").val("2010-01-01");
		Zepto(".js-show-uBirthday").calendar({
			maxDate: new Date(),
			value:[$(".js-show-uBirthday").val()]
		});
	});
	Zepto.init();
	//设置默认值 性别默认设为女
	Zepto(".js-show-uSex").picker("setValue", ["女"]);
})
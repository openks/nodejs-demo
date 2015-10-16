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
		$("#uname-change").val(obj.userName);
		Zepto.router.loadPage("#detailPage");
	});
	//用户详情页返回按钮点击事件触发
	$(".user-detail-back").on("click", function() {
		Zepto.router.back("#usersPage")
	});
	//用户名修改页返回按钮点击事件触发
	$(".user-uname-back").on("click", function() {
		Zepto.router.back("#detailPage")
	});
	//用户详情页点击用户名行触发事件
	$(".js-item-uname").on("click",  function() {
		Zepto.router.loadPage("#unamePage");
	});
	//修改姓名
	//	$(".js-item-uname").on("click", function() {
	//		Zepto.prompt('请输入您的新名称', function(value) {
	////			Zepto.alert('Your name is "' + value + '". You clicked Ok button');
	//		}, function(value) {
	////			Zepto.alert('Your name is "' + value + '". You clicked Cancel button');
	//		});
	//	});
	//生日变化时计算年龄
	$(".js-show-uBirthday").on("change", function() {
		var year = parseInt((new Date() - new Date($(this).val())) / (365 * 24 * 60 * 60 * 1000), 10);
		$(".js-show-uAge").val(year);
	});
	//picker
	$(document).on("pageInit", "#detailPage", function(e, id, page) {
		Zepto(".js-show-usex").picker({
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
		Zepto(".js-show-uBirthday").calendar();
	});
	Zepto.init();

})
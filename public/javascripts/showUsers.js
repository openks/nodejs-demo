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
		Zepto.router.loadPage("#detailPage");
	});
	//用户详情页返回按钮点击事件触发
	$(".user-detail-back").on("click", function() {
		Zepto.router.back("#usersPage")
	});
	//修改姓名
	$(".js-item-uname").on("click", function() {
		Zepto.prompt('请输入您的新名称', function(value) {
			Zepto.alert('Your name is "' + value + '". You clicked Ok button');
		}, function(value) {
			Zepto.alert('Your name is "' + value + '". You clicked Cancel button');
		});
	});
	//修改生日
//	$(".js-item-uBirthday").on("click", function() {
//			Zepto("#js-show-uBirthday").calendar();
//	});
	
	  //picker
  $(document).on("pageInit", "#detailPage", function(e, id, page) {
    Zepto(".js-show-uBirthday").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">标题</h1>\
      </header>',
      cols: [
        {
          textAlign: 'center',
          values: ['iPhone 4', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3']
        }
      ]
    });
  });
  Zepto.init();
	
})
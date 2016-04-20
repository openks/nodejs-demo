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
	//用户列表页点击返回跳转到主页
	$(".js-users-back").on("click", function() {
		location.href = "home";
	});
	//用户列表页点击用户所在行触发事件
	$(".js-user-search-result").on("click", ".item-content", function() {
		var id = $(this).attr("data-id");
		sessionStorage.setItem("currentId",id);
		// console.log("要加载的对象",obj);
		Zepto.router.loadPage("#detailPage");
	});
	//用户详情页返回按钮点击事件触发
	$(".user-detail-back").on("click", function() {
		Zepto.router.loadPage("#usersPage");
	});
	//用户名修改页返回按钮点击事件触发
	$(".user-uname-back").on("click", function() {
		Zepto.router.loadPage("#detailPage");
	});
	//用户详情页用户名所在行点击触发事件
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
	$(".js-show-uSex").on("change", function() {
		var _this = $(this);
		_this.attr({
			"data-change": _this.attr("data-old") != SEX[_this.val()],
			"data-new": SEX[_this.val()]
		});
		editBtStatus();
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
		var _this = $(this);
		_this.attr({
			"data-change": _this.attr("data-old") != _this.val(),
			"data-new": _this.val()
		});
		editBtStatus();
		$(".js-show-uAge").val(getYears($(this).val()));
	});
	//用户信息（性别生日等）修改
	$(".user-detail-edit").on("click", function() {
		var uid = $("#uname-change").attr("data-uid");
		var param = {};
		param.editType = "uInfo";
		param.uid = uid;
		param.birthday = $(".js-show-uBirthday").val();
		param.gender = $(".js-show-uSex").attr("data-new")||$(".js-show-uSex").attr("data-old");
		// debugger;
		$.ajax({
			type: "post",
			url: "editUser",
			dataType: 'json',
			data: param,
			async: true, //设置为同步操作就可以给全局变量赋值成功
			success: function(data) {
				// console.log("user-detail-success",data);
				Zepto.toast(data.result);
				if(data.code==0){
					var obj = getObjByProperty("users", "_id", uid, "s");
					obj.birthday=param.birthday;
					obj.gender=param.gender;
					// console.log("修改前",obj);
					setObjByObjProperty("users", "_id", uid,obj,"s");
					// console.log("修改后",getObjByProperty("users", "_id", uid, "s"));
				}
			},
			error: function(data) {
				console.error(data);
			}
		});
		$(this).addClass("hide");
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
				"editType": "uName",
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
	}).picker("open").picker("close");

	$(document).on("pageInit", "#detailPage", function(e, id, page) {
		// console.log("pageInit..");
		var _id = sessionStorage.getItem("currentId");
		fillInfo_user(_id);
		Zepto(".js-show-uBirthday").calendar({
			maxDate: new Date(),
			value: [$(".js-show-uBirthday").val()]
		});
		// console.log("加载完成后性别",$(".js-show-uSex").val());
		Zepto(".js-show-uSex").picker("setValue", [$(".js-show-uSex").val()]);
		$(".js-show-uSex").removeAttr("data-change").removeAttr("data-new");
		editBtStatus();
	});
	$(document).on("pageAnimationEnd", "#detailPage", function(e, id, page) {
				// console.log("pageAnimationEnd");
	});
	//如果在子页面刷新
	if(location.href.indexOf("detailPage")>-1){
		var _id = sessionStorage.getItem("currentId");
		fillInfo_user(_id);
		Zepto(".js-show-uBirthday").calendar({
			maxDate: new Date(),
			value: [$(".js-show-uBirthday").val()]
		});
		Zepto(".js-show-uSex").picker("setValue", [$(".js-show-uSex").val()]);
		$(".js-show-uSex").removeAttr("data-change").removeAttr("data-new");
		editBtStatus();
	}
	if(location.href.indexOf("unamePage")>-1){
		var _id = sessionStorage.getItem("currentId");
		var obj = getObjByProperty("users", "_id", _id, "s");
		$("#uname-change").val(obj.userName).attr({
			"data-uid": id,
			"data-old": obj.userName
		});
	}
	//	Zepto.init();
});

function fillInfo_user(id){
	var obj = getObjByProperty("users", "_id", id, "s");
	$("#detailPage .title,.js-show-uName").text(obj.userName);
	$(".js-show-uSex").val(SEX[obj.gender]).attr("data-old", obj.gender);
	$(".js-show-uBirthday").val(obj.birthday).attr("data-old", obj.birthday);
	$(".js-show-uAge").val(getYears(obj.birthday));
	$("#uname-change").val(obj.userName).attr({
		"data-uid": id,
		"data-old": obj.userName
	});
}

/**
* 根据年龄字符串获取年龄值
* @param {Object} dateStr "2010-01-01"
*/
function getYears(dateStr) {
	var now = new Date();
	var old = new Date(dateStr);
	var years = now.getFullYear() - old.getFullYear();
	if (now.getMonth() < old.getMonth()) {
		years = years - 1;
	}
	if (now.getMonth() == old.getMonth() && now.getDate() < old.getDate()) {
		years = years - 1;
	}
	years = years < 0 ? 0 : years;
	//  console.log(dateStr  + "--" + years);
	return years;
}

function editBtStatus() {
	if ($("[data-change='true']").length > 0) {
		$(".user-detail-edit").removeClass("hide");
	} else {
		$(".user-detail-edit").addClass("hide");
	}
}

var SEX = {};
SEX[0] = "男";
SEX[1] = "女";
SEX[2] = "保密";
SEX["男"] = 0;
SEX["女"] = 1;
SEX["保密"] = 2;

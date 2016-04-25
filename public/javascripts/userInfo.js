$(function() {

  $(".user-detail-back").on("click",function(){
    // Zepto.router.back("home");
    location.href="home";
  });
  $(".js-item-uname").on("click",function(){
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
  var usex=$(".js-show-uSex").val();
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
  }).picker("open").picker("close").picker("setValue", [usex]);

  Zepto(".js-show-uBirthday").calendar({
    maxDate: new Date(),
    value: [$(".js-show-uBirthday").val()]
  });
  //生日变化时计算年龄
  $(".js-show-uBirthday").on("change", function() {
    var _this = $(this);
    _this.attr({
    	"data-change": _this.attr("data-old") != _this.val(),
    	"data-new": _this.val()
    });
    editBtStatus();
    $(".js-show-uAge").val(getAgeByBirthday($(this).val()));
  });
  //性别发生变化
  $(".js-show-uSex").on("change", function() {
		var _this = $(this);
		_this.attr({
			"data-change": _this.attr("data-old") != SEX[_this.val()],
			"data-new": SEX[_this.val()]
		});
		editBtStatus();
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
				Zepto.toast(data.result);
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
					$(".js-show-uName").text(newName);
					// $("[data-id=" + uid + "]").find(".item-after").text(newName);
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
});
function editBtStatus() {
	if ($("[data-change='true']").length > 0) {
		$(".user-detail-edit").removeClass("hide");
	} else {
		$(".user-detail-edit").addClass("hide");
	}
};
var SEX = {};
SEX[0] = "男";
SEX[1] = "女";
SEX[2] = "保密";
SEX["男"] = 0;
SEX["女"] = 1;
SEX["保密"] = 2;

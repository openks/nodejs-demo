$(function() {
	$(".js-exit").on("click", function() {
		location.href="logout";
		// Zepto.router.loadPage("logout");
	});
	$(".js-user-search").on("click", function() {
		location.href="users";
		// Zepto.router.loadPage("users");
	});
	$(".js-user-editPwd").on("click", function() {
		location.href="editPassWord";
		// Zepto.router.loadPage("editPassWord");
	});
	$(".js-user-editInf").on("click", function() {
		location.href="userInfo";
			// Zepto.router.loadPage("userInfo.html");
	});
	Zepto(".swiper-container").swiper();
});

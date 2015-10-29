$(function() {
	$(".js-exit").on("click", function() {
		location.href="logout";
	});
	$(".js-user-search").on("click", function() {
		location.href="users";
	});
	$(".js-user-editPwd").on("click", function() {
		location.href="editPassWord";
	});
	Zepto(".swiper-container").swiper();
});
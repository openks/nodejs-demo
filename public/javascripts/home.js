$(function() {
	$(".js-exit").on("click", function() {
		location.href="logout";
	});
	$(".js-user-search").on("click", function() {
		location.href="users";
	});
	Zepto(".swiper-container").swiper();
});
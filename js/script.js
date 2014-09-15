//scroll with mouse
//$(function(){
//	$(".roadmap-container").mousewheel(function(event, delta) {
//		this.scrollLeft -= (delta * 60);
//		event.preventDefault();
//	});   
//});

function course_selected() {
	$(".coverpage").fadeOut(400,function(){
		$(".main").removeClass("hidden");
	});
}

var mapclicked = false;
var mouseXPos, left;
$(".roadmap").on({
	'mousedown': function(e) {
		e.preventDefault();
		mapclicked = true;
		$(this).css("cursor","-webkit-grabbing");
		mouseXPos = e.pageX;
		left = $(".roadmap-container").scrollLeft();
	},
	'mouseup': function(e) {
		mapclicked = false;
		$(this).css("cursor","-webkit-grab");
	},
	'mousemove': function(e) {
		if (mapclicked) {
			var newX = e.pageX;
			$(".roadmap-container").scrollLeft(left - e.pageX + mouseXPos);
		}
	},
	'mouseleave': function(e) {
		mapclicked = false;
		$(this).css("cursor","default");
	},
	'mouseenter': function(e) {
		$(this).css("cursor","-webkit-grab");	
	}
});
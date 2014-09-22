function course_selected() {
	$(".coverpage").fadeOut(400,function(){
		$(".main").removeClass("hidden");
	});
}


$(".module-set").sortable({
  connectWith: ".module-set",
  dropOnEmpty: true,
  forcePlaceholderSize: true,
  placeholder: "module-placeholder",
  scroll: false,
  helper: "clone",
  appendTo: "body",
  cursor: "-webkit-grabbing"
});


// $("#sem1").droppable({
//   drop: function(){
//     alert("dropped 1");
//   }
// });
// $("#sem2").droppable({
//   drop: function(){
//     alert("dropped 2");
//   }
// });
// $("#sem3").droppable({
//   drop: function(){
//     alert("dropped 3");
//   }
// });
// $("#sem4").droppable({
//   drop: function(){
//     alert("dropped 4");
//   }
// });
// $("#sem5").droppable({
//   drop: function(){
//     alert("dropped 5");
//   }
// });
// $("#sem6").droppable({
//   drop: function(){
//     alert("dropped 6");
//   }
// });
// $("#sem7").droppable({
//   drop: function(){
//     alert("dropped 7");
//   }
// });
// $("#sem8").droppable({
//   drop: function(){
//     alert("dropped 8");
//   }
// });

//scroll with mouse
//$(function(){
//	$(".roadmap-container").mousewheel(function(event, delta) {
//		this.scrollLeft -= (delta * 60);
//		event.preventDefault();
//	});   
//});

//drag scrolling
//var mapclicked = false;
//var mouseXPos, left;
//$(".roadmap").on({
//	'mousedown': function(e) {
//		e.preventDefault();
//		mapclicked = true;
//		$(this).css("cursor","-webkit-grabbing");
//		mouseXPos = e.pageX;
//		left = $(".roadmap-container").scrollLeft();
//	},
//	'mouseup': function(e) {
//		mapclicked = false;
//		$(this).css("cursor","-webkit-grab");
//	},
//	'mousemove': function(e) {
//		if (mapclicked) {
//			var newX = e.pageX;
//			$(".roadmap-container").scrollLeft(left - e.pageX + mouseXPos);
//		}
//	},
//	'mouseleave': function(e) {
//		mapclicked = false;
//		$(this).css("cursor","default");
//	},
//	'mouseenter': function(e) {
//		$(this).css("cursor","-webkit-grab");	
//	}
//});

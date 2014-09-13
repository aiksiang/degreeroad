$(function(){
	$(".roadmap-container").mousewheel(function(event, delta) {
		this.scrollLeft -= (delta * 60);
		event.preventDefault();
	});   
});

function course_selected() {
	$(".coverpage").fadeOut(400,function(){
		$(".main").removeClass("hidden");
	});
}
var noOfSems = 6;

function course_selected() {
	$(".coverpage").fadeOut(400,function(){
		$(".main").removeClass("hidden");
	});
}


var initializeSortable = function(){$(".module-set").sortable({
  connectWith: ".module-set",
  dropOnEmpty: true,
  forcePlaceholderSize: true,
  placeholder: "module-placeholder",
  scroll: false,
  helper: "clone",
  appendTo: "body",
  cursor: "-webkit-grabbing"
})};
initializeSortable();

var semInfo = {
  sem1: {modules: [], mcs: 0},
  sem2: {modules: [], mcs: 0},
  sem3: {modules: [], mcs: 0},
  sem4: {modules: [], mcs: 0},
  sem5: {modules: [], mcs: 0},
  sem6: {modules: [], mcs: 0},
  sem7: {modules: [], mcs: 0},
  sem8: {modules: [], mcs: 0}
};



$("#sem1").droppable({
  drop: function(event,ui){
    var index = semInfo.sem1.modules.indexOf(ui.draggable.html());
    if (index == -1){
      semInfo.sem1.modules.push(ui.draggable.html());
    }
  },
  out: function(event,ui){
    var index = semInfo.sem1.modules.indexOf(ui.draggable.html());
    if (index != -1){
      semInfo.sem1.modules.splice(index,1);
    }
  }
});
$("#sem2").droppable({
  drop: function(event,ui){
    var index = semInfo.sem2.modules.indexOf(ui.draggable.html());
    if (index == -1){
      semInfo.sem2.modules.push(ui.draggable.html());
    }
  },
  out: function(event,ui){
    var index = semInfo.sem2.modules.indexOf(ui.draggable.html());
    if (index != -1){
      semInfo.sem2.modules.splice(index,1);
    }
  }
});
$("#sem3").droppable({
  drop: function(event,ui){
    var index = semInfo.sem3.modules.indexOf(ui.draggable.html());
    if (index == -1){
      semInfo.sem3.modules.push(ui.draggable.html());
    }
  },
  out: function(event,ui){
    var index = semInfo.sem3.modules.indexOf(ui.draggable.html());
    if (index != -1){
      semInfo.sem3.modules.splice(index,1);
    }
  }
});
$("#sem4").droppable({
  drop: function(event,ui){
    var index = semInfo.sem4.modules.indexOf(ui.draggable.html());
    if (index == -1){
      semInfo.sem4.modules.push(ui.draggable.html());
    }
  },
  out: function(event,ui){
    var index = semInfo.sem4.modules.indexOf(ui.draggable.html());
    if (index != -1){
      semInfo.sem4.modules.splice(index,1);
    }
  }
});
$("#sem5").droppable({
  drop: function(event,ui){
    var index = semInfo.sem5.modules.indexOf(ui.draggable.html());
    if (index == -1){
      semInfo.sem5.modules.push(ui.draggable.html());
    }
  },
  out: function(event,ui){
    var index = semInfo.sem5.modules.indexOf(ui.draggable.html());
    if (index != -1){
      semInfo.sem5.modules.splice(index,1);
    }
  }
});
$("#sem6").droppable({
  drop: function(event,ui){
    var index = semInfo.sem6.modules.indexOf(ui.draggable.html());
    if (index == -1){
      semInfo.sem6.modules.push(ui.draggable.html());
    }
  },
  out: function(event,ui){
    var index = semInfo.sem6.modules.indexOf(ui.draggable.html());
    if (index != -1){
      semInfo.sem6.modules.splice(index,1);
    }
  }
});
$("#sem7").droppable({
  drop: function(event,ui){
    var index = semInfo.sem7.modules.indexOf(ui.draggable.html());
    if (index == -1){
      semInfo.sem7.modules.push(ui.draggable.html());
    }
  },
  out: function(event,ui){
    var index = semInfo.sem7.modules.indexOf(ui.draggable.html());
    if (index != -1){
      semInfo.sem7.modules.splice(index,1);
    }
  }
});
$("#sem8").droppable({
  drop: function(event,ui){
    var index = semInfo.sem8.modules.indexOf(ui.draggable.html());
    if (index == -1){
      semInfo.sem8.modules.push(ui.draggable.html());
    }
  },
  out: function(event,ui){
    var index = semInfo.sem8.modules.indexOf(ui.draggable.html());
    if (index != -1){
      semInfo.sem8.modules.splice(index,1);
    }
  }
});

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

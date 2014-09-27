var noOfSems = 6;

(function initializeModules() {
  getModules(function(data) {
    console.log(data);
  });
})();

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

var coreModules = [];
var extension = 0;

$("#coreMods").droppable({
  drop: function(event,ui) {
    var index = coreModules.indexOf(ui.draggable.html());
    if (index == -1) {
      coreModules.push(ui.draggable.html());
      console.log(coreModules);
      reorderModules();
    }
  },
  out: function(event,ui) {
    var index = coreModules.indexOf(ui.draggable.html());
    if (index != -1) {
      coreModules.splice(index,1);
      console.log(coreModules);
      reorderModules();
    }
  }
});

function reorderModules() {
  if ($("#coreMods li").length < 7) {
    if ($("#extlist1 li").length != 0) {
      $("#coreMods .module-set").append($("#extlist1 li")[0]);
    } else {
      if (extension == 1) {
        moduleContractBox(1);
      }
    }
  } else if ($("#coreMods li").length > 6) {
    if (extension == 0) {
      moduleExtendBox(1);
    }
    $("#extlist1 .module-set").prepend($("#coreMods li")[6]);
    initializeSortable();
  }
}

function moduleExtendBox(i) {
  $('<div id="extension' + i + '" class="mod-container-extension"><div id=extlist' + i + ' class="sem-extension"><div class="sem-title">&nbsp;</div><ul class="module-set"></ul></div></div>').insertAfter($("#coreMods").parent());
  $("#extlist" + i).droppable({
    drop: function(event,ui) {
      var index = coreModules.indexOf(ui.draggable.html());
      if (index == -1) {
        coreModules.push(ui.draggable.html());
        console.log(coreModules);
        reorderModules();
      }
    },
    out: function(event,ui) {
      var index = coreModules.indexOf(ui.draggable.html());
      if (index != -1) {
        coreModules.splice(index,1);
        console.log(coreModules);
        reorderModules();
      }
    }
  });
  extension++;
};

function moduleContractBox(i) {
  $('#extension' + i).remove();
  extension--;
}

// scroll with mouse
// $(function(){
// 	$(".roadmap-container").mousewheel(function(event, delta) {
// 		this.scrollLeft -= (delta * 60);
// 		event.preventDefault();
// 	});   
// });

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

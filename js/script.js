var noOfSems = 8;
var listFrom = "";
var listFromWithSpace = "";
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


for (var i = 0; i < noOfSems; i++) {
  (function (i) {
    $("#sem" + i).droppable({
        drop: function(event,ui){
          var currentMC = semInfo["sem" + i].mcs;
          var module = findModule(ui.draggable.html());
          //insertion
          if (listFrom != "" && listFrom != i) {
            currentMC += parseInt(moduleList[module.moduleType].modules[module.i].modularCredits);
            $("#sem" + i + " .sem-mcs").html("MC: " + currentMC);
            semInfo["sem" + i].mcs = currentMC;
            semInfo["sem" + i].modules.push(ui.draggable.html());
          }
          //removal
          if (isNaN(listFrom) && listFrom != "") {
            currentMC = moduleList[listFromWithSpace].totalMC;
            currentMC -= parseInt(moduleList[module.moduleType].modules[module.i].modularCredits);
            $("#" + listFrom + " .sem-mcs").html("MC: " + currentMC);
            moduleList[listFromWithSpace].totalMC = currentMC;
          } else if (!isNaN(listFrom) && listFrom != "") {
            currentMC = semInfo["sem" + listFrom].mcs;
            currentMC -= parseInt(moduleList[module.moduleType].modules[module.i].modularCredits);
            $("#sem" + listFrom + " .sem-mcs").html("MC: " + currentMC);
            semInfo["sem" + listFrom].mcs = currentMC;
            var index = semInfo["sem" + listFrom].modules.indexOf(ui.draggable.html());
            if (index != -1){
              semInfo["sem" + listFrom].modules.splice(index,1);
            }
          }
          listFrom = "";
        },
        out: function(event,ui){
          if (listFrom == "") {
            listFrom = i;
          }
        }
    })
  })(i + 1);
};

function findModule(module) {
  for (moduleType in moduleList) {
    for (i in moduleList[moduleType].modules) {
        var target = moduleList[moduleType].modules[i].module.replace(/&amp;/g, '&');
        var source = module.replace(/&amp;/g, '&');
      if (target == source) {
        return {moduleType: moduleType, i: i};
      }
    }
  }
}

function updateMC(module, semNo, type) {
  if (type == "increase"){ 
    semInfo["sem" + semNo].mcs += parseInt(moduleList[findModule(module).moduleType][findModule(module).i].modularCredits);
  } else {
    semInfo["sem" + semNo].mcs -= parseInt(moduleList[findModule(module).moduleType][findModule(module).i].modularCredits);
  }
  $("#sem" + semNo + " .sem-mcs").html("MC: " + semInfo["sem" + semNo].mcs);
}

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

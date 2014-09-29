var noOfSems = 8;
var listFrom = "";
var listFromWithSpace = "";
var drop = false;
var lostModule = false;
var lostChild;
var lostChildHome;

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
  cursor: "-webkit-grabbing",
  update: function(event,ui) {
    var module = findModule(ui.item.html());
    var identifier = $(this)[0].parentNode.id;
    if (ui.sender == null) { //removal
      if (identifier.indexOf("sem") >= 0) {
        var index = semInfo[identifier].modules.indexOf(ui.item.html());
        if (index != -1){
          semInfo[identifier].modules.splice(index,1);
        }
        var currentMC = semInfo[identifier].mcs;
        currentMC -= parseInt(moduleList[module.moduleType].modules[module.i].modularCredits);
        semInfo[identifier].mcs = currentMC;
      } else {
        //
        var currentMC = moduleList[identifier].totalMC;
        currentMC -= parseInt(moduleList[module.moduleType].modules[module.i].modularCredits);
        moduleList[identifier].totalMC = currentMC;
      }
    } else { //insertion
      if (identifier.indexOf("sem") >= 0) {
        semInfo[identifier].modules.push(ui.item.html());
        var currentMC = semInfo[identifier].mcs;
        currentMC += parseInt(moduleList[module.moduleType].modules[module.i].modularCredits);
        semInfo[identifier].mcs = currentMC;
      } else {
        //
        var currentMC = moduleList[identifier].totalMC;
        currentMC += parseInt(moduleList[module.moduleType].modules[module.i].modularCredits);
        moduleList[identifier].totalMC = currentMC;
      }
    }
    $("#" + identifier + " .sem-mcs").html("MC: " + currentMC);
  }
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

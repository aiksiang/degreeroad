var noOfSems = 8;
var userSavedModules = {
		sem1: {modules: [], mcs: 0},
		sem2: {modules: [], mcs: 0},
		sem3: {modules: [], mcs: 0},
		sem4: {modules: [], mcs: 0},
		sem5: {modules: [], mcs: 0},
		sem6: {modules: [], mcs: 0},
		sem7: {modules: [], mcs: 0},
		sem8: {modules: [], mcs: 0},
		course: "CEG",
		specialization: "None"
};
var storage;

function course_selected() {
	$(".coverpage").fadeOut(400,function(){
		$(".main").removeClass("hidden");
	});
}


var initializeSortable = function(){
	$(".module-set").sortable({
	  connectWith: ".module-set",
	  dropOnEmpty: true,
	  forcePlaceholderSize: true,
	  placeholder: "module-placeholder",
	  scroll: false,
	  helper: "clone",
	  appendTo: "body",
	  cursor: "-webkit-grabbing",
		remove: function(event,ui) {
			var moduleloc = findModule(ui.item.html());
			var module = moduleList[moduleloc.moduleType].modules[moduleloc.i];
			var identifier = $(this)[0].parentNode.id;
			if (identifier.indexOf("sem") >= 0) {
				var index = -1;
				for (var i in userSavedModules[identifier].modules) {
					if (userSavedModules[identifier].modules[i].Code == module.Code) {
						index = i;
						break;
					}
				}
				if (index != -1){
					userSavedModules[identifier].modules.splice(index,1);
				}
				var currentMC = userSavedModules[identifier].mcs;
				currentMC -= parseInt(module.Credit);
				userSavedModules[identifier].mcs = currentMC;
			} else {
				//
				var currentMC = moduleList[identifier].currentMC;
				currentMC -= parseInt(module.Credit);
				moduleList[identifier].currentMC = currentMC;
			}
			$("#" + identifier + " .sem-mcs").html("MC: " + currentMC);
		},
		receive: function(event,ui) {
			var moduleloc = findModule(ui.item.html());
			var module = moduleList[moduleloc.moduleType].modules[moduleloc.i];
			var identifier = $(this)[0].parentNode.id;
			if (identifier.indexOf("sem") >= 0) {
				userSavedModules[identifier].modules.push(module);
				var currentMC = userSavedModules[identifier].mcs;
				currentMC += parseInt(module.Credit);
				userSavedModules[identifier].mcs = currentMC;
			} else {
				//
				var currentMC = moduleList[identifier].currentMC;
				currentMC += parseInt(module.Credit);
				moduleList[identifier].currentMC = currentMC;
			}
			$("#" + identifier + " .sem-mcs").html("MC: " + currentMC);
		},
		update: function() {
			clean();
			storage.put(userSavedModules);
			storage.save();
		}
	})
};
initializeSortable();

function findModule(moduleName) {
  for (moduleType in moduleList) {
    for (i in moduleList[moduleType].modules) {
      	var target = moduleList[moduleType].modules[i].Code + " " + moduleList[moduleType].modules[i].Name;
				target = target.replace(/&amp;/g, '&');
				var source = moduleName.replace(/&amp;/g, '&');
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

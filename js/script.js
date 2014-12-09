var noOfSems = 8;
var defaultUserSavedModules = {
	sem1: {modules: [], mcs: 0},
	sem2: {modules: [], mcs: 0},
	sem3: {modules: [], mcs: 0},
	sem4: {modules: [], mcs: 0},
	sem5: {modules: [], mcs: 0},
	sem6: {modules: [], mcs: 0},
	sem7: {modules: [], mcs: 0},
	sem8: {modules: [], mcs: 0},
	course: "CEG",
	specialization: "None",
	chosenModules: {}
};
var userSavedModules = defaultUserSavedModules;
var storage;

var initializeSortable = function(){
	$(".module-set").sortable({
		connectWith: ".module-set",
		items: ".module, .module-small:not(.selected)",
		dropOnEmpty: true,
		forcePlaceholderSize: true,
		placeholder: "module-placeholder",
		scroll: false,
		helper: "clone",
		appendTo: "body",
		cursor: "-webkit-grabbing",
		remove: function(event,ui) {
			var moduleloc = findModule(ui.item.html());
			var module = requirementModules[moduleloc.moduleType].modules[moduleloc.i];
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
					requirementModules[moduleloc.moduleType].modules[moduleloc.i].selected = false;
				}
				var currentMC = userSavedModules[identifier].mcs;
				currentMC -= parseInt(module.Credit);
				userSavedModules[identifier].mcs = currentMC;
				$("#" + identifier + " .sem-mcs").html("MC: " + currentMC);
			} else {
				
			}
		},
		receive: function(event,ui) {
			var moduleloc = findModule(ui.item.html());
			var module = requirementModules[moduleloc.moduleType].modules[moduleloc.i];
			var identifier = $(this)[0].parentNode.id;
			if (identifier.indexOf("sem") >= 0) {
				userSavedModules[identifier].modules.push(module);
				requirementModules[moduleloc.moduleType].modules[moduleloc.i].selected = true;
				var currentMC = userSavedModules[identifier].mcs;
				currentMC += parseInt(module.Credit);
				userSavedModules[identifier].mcs = currentMC;
				ui.item.addClass("module").removeClass("module-small").css("height","48px");
				$("#" + identifier + " .sem-mcs").html("MC: " + currentMC);
			} else {
				ui.item.addClass("module-small").removeClass("module").css("height","24px");
			}
			mouseoverEffects();		
		},
		update: function() {
			displayModules();
			storage.put(userSavedModules);
			storage.save();
		}
	})
$(".requirement-container").sortable({
		connectWith: ".requirement-container",
		handle: ".req-title",
		dropOnEmpty: true,
		forcePlaceholderSize: true,
		scroll: false,
		helper: "clone",
		appendTo: "body",
		cursor: "-webkit-grabbing",
		delay: 150
	})
};
initializeSortable();

function findModule(moduleName) {
  for (moduleType in requirementModules) {
    for (i in requirementModules[moduleType].modules) {
      	var target = requirementModules[moduleType].modules[i].Code + " " + requirementModules[moduleType].modules[i].Name;
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

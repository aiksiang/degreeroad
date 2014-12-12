var noOfSems = 8;
var defaultUserSavedModules = {};
for (var i = 1; i <= noOfSems; i++) {
	defaultUserSavedModules["sem" + i] = {};
	defaultUserSavedModules["sem" + i].modules = [];
	defaultUserSavedModules["sem" + i].mcs = 0;
}
defaultUserSavedModules.course = "CEG";
defaultUserSavedModules.specialization = "None";
defaultUserSavedModules.chosenModules = {};

var userSavedModules = defaultUserSavedModules;
var storage;

var initializeSortable = function(){
	$(".module-set").sortable({
		connectWith: ".module-set",
		items: ".module, .module-small:not(.selected)",
		dropOnEmpty: true,
		forcePlaceholderSize: true,
		placeholder: "module-placeholder",
		revert: 200,
		scroll: true,
		helper: "clone",
		appendTo: "body",
		cursor: "-webkit-grabbing",
		remove: function(event,ui) {
			var moduleloc = findModule(ui.item.contents().last().text());
			var module = requirementModules[moduleloc.moduleType].modules[moduleloc.i];
			var identifier = $(this)[0].parentNode.id;
			if (identifier.indexOf("sem") >= 0) { // mod removed from sem
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
			} else { // mod removed from req

			}
		},
		receive: function(event,ui) {
			var moduleloc = findModule(ui.item.contents().last().text());
			var module;
			if (moduleloc != undefined) {
				module = requirementModules[moduleloc.moduleType].modules[moduleloc.i];
			} else {
				module = currentMod;
			}
			var identifier = $(this)[0].parentNode.id;
			if (identifier.indexOf("sem") >= 0) { // sem receives a mod
				userSavedModules[identifier].modules.push(module);
				requirementModules[moduleloc.moduleType].modules[moduleloc.i].selected = true;
				var currentMC = userSavedModules[identifier].mcs;
				currentMC += parseInt(module.Credit);
				userSavedModules[identifier].mcs = currentMC;
				ui.item.addClass("module").removeClass("module-small").css("height","48px");
				$("#" + identifier + " .sem-mcs").html("MC: " + currentMC);

				if (!(ui.sender.parent()[0].id.indexOf("sem") >= 0)) { //sem receives from req
					requirementModules[ui.sender.parent()[0].id].currentMC += parseInt(module.Credit);
				}
			} else { // reqs receives a mod
				ui.item.addClass("module-small").removeClass("module").css("height","24px");
				if (ui.sender.parent()[0].id.indexOf("sem") >= 0) {// req receives from sem
					requirementModules[moduleloc.moduleType].currentMC -= parseInt(module.Credit);
				} else { // req receives from req or list
					currentMod = module;
					if (moduleloc != undefined) {
						confirmUpdate(moduleloc.moduleType, identifier);
					} else { // req receives from list
						confirmUpdate("-", identifier);
					}
				}
			}
			mouseoverEffects();		
		},
		update: function() {
			displayRequirements();
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
		delay: 150,
		update: function() {
			updateListOrder();
		}
	})
};
$(".module-drop").sortable({
	connectWith: ".requirement .module-set",
	dropOnEmpty: true,
	forcePlaceholderSize: true,
	placeholder: "module-placeholder",
	scroll: false,
	helper: "clone",
	appendTo: "body",
	cursor: "-webkit-grabbing",
	delay: 150,
	cursorAt: { left: 500 },
	activate: function(event,ui) {
		allModuleListId = ui.item[0].id.match(/\d+/)[0];
		chosenMod = allModuleList[allModuleListId];
		currentMod = chosenMod;
		$(ui.item)[0].setAttribute('onclick', "updateModuleData('" + chosenMod.Code + " " + chosenMod.Name + "','fromList');");
		$(ui.helper)[0].setAttribute('onclick', "updateModuleData('" + chosenMod.Code + " " + chosenMod.Name + "','fromList');");
		$(ui.helper)[0].setAttribute('class', "module-small module-big-highlighted ui-sortable-helper module-list-helper");
		$(ui.helper).prepend("<span class='modMC'>" + chosenMod.Credit + "</span>");
	},
	update: function(event,ui) {
		$(ui.item)[0].setAttribute('class', "module-small");
	}
});
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

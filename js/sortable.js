var initializeSortable = function(){
	$(".module-list").sortable({
		connectWith: ".module-list",
		items: ".module, .module-small:not(.selected)",
		dropOnEmpty: true,
		forcePlaceholderSize: true,
		placeholder: "item module-placeholder",
		revert: 200,
		scroll: true,
		helper: "clone",
		appendTo: "body",
		cursor: "-webkit-grabbing",
		remove: function(event,ui) {
			// var moduleloc = findModule(ui.item.contents().last().text());
			// var module = requirementModules[moduleloc.moduleType].modules[moduleloc.i];
			// var identifier = $(this)[0].parentNode.id;
			// if (identifier.indexOf("sem") >= 0) { // mod removed from sem
			// 	var index = -1;
			// 	for (var i in userSavedModules[identifier].modules) {
			// 		if (userSavedModules[identifier].modules[i].Code == module.Code) {
			// 			index = i;
			// 			break;
			// 		}
			// 	}
			// 	if (index != -1){
			// 		userSavedModules[identifier].modules.splice(index,1);
			// 		requirementModules[moduleloc.moduleType].modules[moduleloc.i].selected = false;
			// 	}
			// 	var currentMC = userSavedModules[identifier].mcs;
			// 	currentMC -= parseInt(module.Credit);
			// 	userSavedModules[identifier].mcs = currentMC;
			// 	$("#" + identifier + " .sem-mcs").html("MC: " + currentMC);
			// } else { // mod removed from req

			// }
		},
		receive: function(event,ui) {
			// var moduleloc = findModule(ui.item.contents().last().text());
			// var module;
			// if (moduleloc != undefined) {
			// 	module = requirementModules[moduleloc.moduleType].modules[moduleloc.i];
			// } else {
			// 	module = currentMod;
			// }
			// var identifier = $(this)[0].parentNode.id;
			// if (identifier.indexOf("sem") >= 0) { // sem receives a mod
			// 	userSavedModules[identifier].modules.push(module);
			// 	requirementModules[moduleloc.moduleType].modules[moduleloc.i].selected = true;
			// 	var currentMC = userSavedModules[identifier].mcs;
			// 	currentMC += parseInt(module.Credit);
			// 	userSavedModules[identifier].mcs = currentMC;
			// 	ui.item.addClass("module").removeClass("module-small").css("height","48px");
			// 	$("#" + identifier + " .sem-mcs").html("MC: " + currentMC);

			// 	if (!(ui.sender.parent()[0].id.indexOf("sem") >= 0)) { //sem receives from req
			// 		requirementModules[ui.sender.parent()[0].id].currentMC += parseInt(module.Credit);
			// 	}
			// } else { // reqs receives a mod
			// 	ui.item.addClass("module-small").removeClass("module").css("height","24px");
			// 	if (ui.sender.parent()[0].id.indexOf("sem") >= 0) {// req receives from sem
			// 		requirementModules[moduleloc.moduleType].currentMC -= parseInt(module.Credit);
			// 	} else { // req receives from req or list
			// 		currentMod = module;
			// 		if (moduleloc != undefined) {
			// 			confirmUpdate(moduleloc.moduleType, identifier);
			// 		} else { // req receives from list
			// 			confirmUpdate("-", identifier);
			// 		}
			// 	}
			// }
			// mouseoverEffects();		
		},
		update: function() {
			// displayRequirements();
			// storage.put(userSavedModules);
			// storage.save();
		}
	});
}

initializeSortable();
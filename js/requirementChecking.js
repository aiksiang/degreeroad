
function traverseSelectedModules(fn) {
	for (var i in userSavedModules) {
		if (i.indexOf("semester") >= 0) {
			for (var j in userSavedModules[i].modules) {
				fn(userSavedModules[i].modules[j]);
			}
		}
	}
}

function insertModulesIntoList(moduleList, rule) {
	checkRequirement(rule);
	//display
	$("#requirementModules .ui.bottom.right.attached.label").html("0/");
}

function checkRequirement(rule) {
	//Parse Include Type
	//console.log(rule.includeType + ": " + rule.includeItem);



	// for (var i in includeTypes) {

	// 	switch (includeTypes[i]) {
	// 		case "LEVEL":
	// 			break;
	// 		case "LIST":
	// 			console.log(includeItems);
	// 			break;
	// 		case "LISTS":
	// 			break;
	// 		case "MODULE":
	// 			break;
	// 		case "MODULES":
	// 			break;
	// 		case "TYPE":
	// 			break;
	// 		case "TYPES":
	// 			break;
	// 		case "ANY":
	// 			break;
	// 		default:
	// 			console.log("Special Type Encountered!");
	// 			break;
	// 	}
	// }

	if (rule.include.includeModuleList != null) {
		for (var i in rule.include.includeModuleList) {
			var id = lookupModule(rule.include.includeModuleList[i].module);
			if (id != undefined)
				listItem("requirementModule", id, "item module", allModuleList[id].Code + " " + allModuleList[id].Name);
			else
				listItem("notFound", rule.include.includeModuleList[i].module, "item module", rule.include.includeModuleList[i].module);
		}
	}
	
}


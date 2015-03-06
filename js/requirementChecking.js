
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
	console.log(rule.includeModuleList)
	if (rule.hasOwnProperty("includeModuleList")) {
		for (var i in rule.includeModuleList) {
			var id = lookupModule(rule.includeModuleList[i].module);
			if (id != undefined)
				$("#requirementModules .list").append(listItem("requirementModule", id, "item module", allModuleList[id].Code + " " + allModuleList[id].Name));
			else
				$("#requirementModules .list").append(listItem("notFound", rule.includeModuleList[i].module, "item module", rule.includeModuleList[i].module));
		}
	}
	
}


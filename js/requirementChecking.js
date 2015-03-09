function checkRequirements(rule) {
	//Parse Include Type
	//console.log(rule.includeType + ": " + rule.includeItem);

	colorCode = {};


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

	return colorCode;
}

function checkRequirement(rule) {

	//return colorCode;
}

function traverseSelectedModules(fn) {
	for (var i in userSavedModules) {
		if (i.indexOf("semester") >= 0) {
			for (var j in userSavedModules[i].modules) {
				fn(userSavedModules[i].modules[j]);
			}
		}
	}
}
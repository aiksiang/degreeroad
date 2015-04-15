function checkRequirements() {

	var colorCodes = {};
	traverseRequirements(function(rule) {
		colorCodes[rule.requirementId] = checkRequirement(rule);
	});

	var colorCode = [];
	traverseSelectedModules(function(mod, semNumber) {
		var result = checkPrerequisite(mod, semNumber);
		if (result.noError == false) {
			colorCode.push(result);
			colorCodes["semester"] = colorCode;
		}
	});

	return colorCodes;
}

function checkRequirement(rule) {
	rule = typeof rule !== 'undefined' ? rule : currentSelectedRule;

	var colorCode = {};

	var inequality = rule.inequality;

	var number = rule.number; //Can be used for MC or Number
	var noOfModules = 0;
	var mcOfModules = 0;

	var quantifier = rule.quantifier;

	if (rule.hasOwnProperty("includeModuleList")) { //LIST, LISTS, MODULE, MODULES
		traverseSelectedModules(function(mod) {
			for (var i in rule.includeModuleList) {
				if (rule.includeModuleList[i].module == mod.Code) {
					mcOfModules += parseInt(mod.Credit);
					noOfModules++;
					colorCode["module" + mod.Code] = "Green";
				}
			}
		});
	}
	if (rule.include.hasOwnProperty("ANY")) {

	}

	var satisfied = false;
	switch (inequality) {
		case "MIN":
			if (quantifier == "MC") {
				if (mcOfModules >= number) {
					satisfied = true;
				}
			} else if (quantifier == "MODULE") {
				if (noOfModules >= number) {
					satisfied = true;
				}
			}
			break;
		case "MAX":
			if (quantifier == "MC") {
				if (mcOfModules <= number) {
					satisfied = true;
				}
			} else if (quantifier == "MODULE") {
				if (noOfModules <= number) {
					satisfied = true;
				}
			}
			break;
		case "EQUAL":
			if (quantifier == "MC") {
				if (mcOfModules == number) {
					satisfied = true;
				}
			} else if (quantifier == "MODULE") {
				if (noOfModules == number) {
					satisfied = true;
				}
			}
			break;
		case "NONE":
			if (noOfModules == 0) {
				satisfied = true;
			}
			break;
		case "ALL":
			if (noOfModules == rule.includeModuleList.length) { //It is definitely a list
				satisfied = true;
			}
			break;
	}

	if (satisfied == true) {
		colorCode.satisfied = true;
	} else {
		colorCode.satisfied = false;
	}

	if (quantifier == "MC") {
		colorCode.percentage = mcOfModules + "/" + rule.number;
	} else if (quantifier == "MODULE") {
		colorCode.percentage = noOfModules + "/" + rule.number;
	} else if (inequality == "ALL") {
		colorCode.percentage = noOfModules + "/" + rule.includeModuleList.length;
	}
	return colorCode;
}

function traverseSelectedModules(fn) {
	for (var i in userSavedModules) {
		if (i.indexOf("semester") >= 0) {
			for (var j in userSavedModules[i].modules) {
				fn(userSavedModules[i].modules[j], i);
			}
		}
	}
}
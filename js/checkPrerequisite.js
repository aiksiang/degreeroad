function checkPrerequisite(mod, modLocationSemester) {
	if (mod != undefined) {
		if (mod.Prereq == undefined || mod.Prereq == "" || mod.Prereq == "Nil") {
			//No Prerequisites
			return {errorType: "", noError: true, mod: mod};
		} else if (mod.Prereq[0] == "*") {
			//Prerequisites not parsed
			return {errorType: "manuallyCheck", noError: false, mod: mod};
		} else {
			modulesPassed = [];
			var result = parsePrerequisite(mod.Prereq,modLocationSemester);
			return {errorType: "prerequisiteNotMet", noError: result, mod: mod};
		}
	} else {
		console.log("Error: Prerequisite parsing for module not found");
	}
}

function parsePrerequisite(preReq, modLocationSemester) {
	var firstBlank = preReq.indexOf(' ');
	if (preReq[0] == "(") {
		var nextNest = preReq.substring(1).indexOf("(");
		var nextEnd = preReq.indexOf(")");
		if (nextNest > nextEnd) {
			var nextPart = preReq.substring(nextEnd + 2);
			var nextBlank = nextPart.indexOf(" ");
			var nextOperator = nextPart.substring(0, nextBlank);
			if (nextOperator == "or" || nextOperator == "OR") {
				return parsePrerequisite(preReq.substring(1,nextEnd), modLocationSemester) || parsePrerequisite(nextPart.substring(nextBlank + 1), modLocationSemester);
			} else if (nextOperator == "and" || nextOperator == "AND") {
				return parsePrerequisite(preReq.substring(1,nextEnd), modLocationSemester) && parsePrerequisite(nextPart.substring(nextBlank + 1), modLocationSemester);
			} else {
				console.log("it shouldnt come here");
			}

		} else {
			return parsePrerequisite(preReq.substring(1,preReq.length - 1), modLocationSemester);
		}
	} else if (preReq[0] == ")") {
	} else if (firstBlank < 0) {
		if (preReq[preReq.length-1] == ")") {
			return isModuleSelected(preReq.substring(0, preReq.length-1), modLocationSemester);
		} else {
			return isModuleSelected(preReq, modLocationSemester);
		}
	} else if (firstBlank >= 0) {
		var firstPart = preReq.substr(0,firstBlank);
		if (firstPart[firstPart.length-1] == ")") {
			firstPart = firstPart.substring(0,firstPart.length-1);
		}
		var nextPart = preReq.substr(firstBlank + 1);
		var nextBlank = nextPart.indexOf(' ');
		var operator = nextPart.substring(0,nextBlank);
		if (operator == "or" || operator == "OR") {
			return isModuleSelected(firstPart, modLocationSemester) || parsePrerequisite(nextPart.substr(nextBlank + 1), modLocationSemester);
		} else if (operator == "and" || operator == "AND") {
			return isModuleSelected(firstPart, modLocationSemester) && parsePrerequisite(nextPart.substr(nextBlank + 1), modLocationSemester);
		} else {
			return isModuleSelected(firstPart, modLocationSemester);
		}
	}
}

function isModuleSelected(moduleToBeCheckedCode, receivedBy) {
	var result = false;
	var indexReceivedBy = receivedBy.substring(8);
	var stop = false;
	var id = lookupModule(moduleToBeCheckedCode);
	var modulesToBeChecked = [];
	if (id != undefined) {
		var moduleToBeChecked = allModuleList[id];
		if (moduleToBeChecked.alternativeModules != null) {
			modulesToBeChecked = moduleToBeChecked.alternativeModules.split(",");
		}
	}
	modulesToBeChecked.push(moduleToBeCheckedCode);


	for (var i in userSavedModules) {
		if (stop == true) break;
		if (i.indexOf("semester") >= 0) {
			for (var j in userSavedModules[i].modules) {
				var module = userSavedModules[i].modules[j];
				var semester = i;
				var indexSemester = semester.substring(8);
				if (indexReceivedBy <= indexSemester) {
					result = false;
				} else {
					var itExists = false;
					for (var k in modulesToBeChecked) {
						if (module.Code == modulesToBeChecked[k]) {
							itExists = true;
						}
					}
					if (itExists) {
						result = true;
						stop = true;
						break;
					}
				}
			}
		}
	}
	return result;
}
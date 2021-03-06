function checkRequirements() {
	var colorCodes = {};
	var colorCode = [];
	traverseSelectedModules(function(mod) {
		mod.doubleCountable = [];
	}, function() {
		traverseRequirements(function(rule) {
			colorCodes[rule.requirementId] = checkRequirement(rule);
		});

		traverseSelectedModules(function(mod, semNumber) {
			var result = checkPrerequisite(mod, semNumber);
			if (result.noError == false) {
				colorCode.push(result);
			}
			var semResult = checkSemester(mod, semNumber);
			if (semResult.noError == false) {
				colorCode.push(semResult);
			}
			colorCodes["semester"] = colorCode;
		});
	});
	

	return colorCodes;
}

function checkSemester(mod, modLocationSemester) {
	if (mod != undefined) {
		if (mod.Semester == undefined || mod.Semester == "") {
			//No semester details
			return {errorType: "manuallyCheck", noError: false, mod: mod};
		} else {
			var result = false;
			var semestersAvailable = mod.Semester.split(",");
			var onlyOfferedIn = "";
			for (var i in semestersAvailable) {
				if (onlyOfferedIn != "")
					onlyOfferedIn += ", "
				if (onlyOfferedIn != "" && i == semestersAvailable.length - 1)
					onlyOfferedIn = onlyOfferedIn.substring(0, onlyOfferedIn.length - 2);
				onlyOfferedIn += semestersAvailable[i];
				var modOfferedIn = parseInt(modLocationSemester.substring(8)) % 2;
				if (modOfferedIn == 0)
					modOfferedIn = 2;
				if (modOfferedIn == semestersAvailable[i]) {
					result = true;
				}
			}
			return {errorType: "wrongSemester", noError: result, mod: mod, details: "Module only offered in Semester " + onlyOfferedIn};
		}
	} else {
		console.log("Error: Semester checking for module not found");
	}
}

function isAnyAncestorExclusive(rule) {
	if (rule.exclusive == "true") {
		return {ancestor: rule, answer: true};
	} else if (rule.level == 0) {
		return {ancestor: rule, answer: false};
	} else {
		return isAnyAncestorExclusive(rule.parentNode);
	}
}

function listHasOriginalModule(list, originalModule) {
	for (var i in list) {
		if (list[i].module == originalModule) {
			return true;
		}
	}
	return false;
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
					var alternativeModule = true;
					var alternativeModulesNumber = 0;
					var originalModule = rule.includeModuleList[i].module; 
					while (alternativeModule == true) {
						if (rule.includeModuleList[i].module == mod.Code) { 
							if (rule.exclusive == "all") {
								mcOfModules += parseInt(mod.Credit);
								noOfModules++;
								colorCode["module" + mod.Code] = {color: "Green"};
							} else if (isAnyAncestorExclusive(rule).answer) {
								modAncestor = isAnyAncestorExclusive(mod.declaration).ancestor;
								ruleAncestor = isAnyAncestorExclusive(rule).ancestor;
								if (modAncestor.ruleName == ruleAncestor.ruleName) {
									if (rule.includeModuleList[i].module != originalModule) {
										colorCode["module" + originalModule] = {color: "Grey"};
										colorCode["module" + originalModule].alternativeModule = rule.includeModuleList[i].module;
									} else {
										colorCode["module" + mod.Code] = {color: "Green"};
										mcOfModules += parseInt(mod.Credit);
										noOfModules++;
									}
								} else {
									if (rule.includeModuleList[i].module != originalModule) {
										colorCode["module" + originalModule] = {color: "Grey"};
										colorCode["module" + originalModule].alternativeModule = rule.includeModuleList[i].module;
									} else {
										colorCode["module" + mod.Code] = {color: "Grey"};
									}
								}

								var itExists = false
								for (var k in mod.doubleCountable) {
									if (isAnyAncestorExclusive(rule).ancestor.ruleName == mod.doubleCountable[k].ruleName) {
										itExists = true;
									}
								}
								if (itExists == false) {
									mod.doubleCountable.push(isAnyAncestorExclusive(rule).ancestor);
								}
							} else {
								modAncestor = isAnyAncestorExclusive(mod.declaration).ancestor;
								ruleAncestor = isAnyAncestorExclusive(rule).ancestor;
								if (isAnyAncestorExclusive(mod.declaration).answer) {
									if (rule.includeModuleList[i].module != originalModule) {
										colorCode["module" + originalModule] = {color: "Grey"};
										colorCode["module" + originalModule].alternativeModule = rule.includeModuleList[i].module;
									} else {
										colorCode["module" + mod.Code] = {color: "Grey"};
									}
								} else {
									mcOfModules += parseInt(mod.Credit);
									noOfModules++;
									if (rule.includeModuleList[i].module != originalModule) {
										colorCode["module" + originalModule] = {color: "Green"};
										colorCode["module" + originalModule].alternativeModule = rule.includeModuleList[i].module;
									} else {
										colorCode["module" + mod.Code] = {color: "Green"};
									}
								}

								var itExists = false
								for (var k in mod.doubleCountable) {
									if (isAnyAncestorExclusive(rule).ancestor.ruleName == mod.doubleCountable[k].ruleName) {
										itExists = true;
									}
								}
								if (itExists == false) {
									mod.doubleCountable.push(isAnyAncestorExclusive(rule).ancestor);
								}
							}
						}
						alternativeModule = false;
						if (rule.includeModuleList[i].hasOwnProperty("alternativeModules")){
							if (rule.includeModuleList[i].module != mod.Code && alternativeModulesNumber < rule.includeModuleList[i].alternativeModules.length) {
								rule.includeModuleList[i].module = rule.includeModuleList[i].alternativeModules[alternativeModulesNumber];
								alternativeModulesNumber++;
								alternativeModule = true;
							}
						}	
					}
					rule.includeModuleList[i].module = originalModule;
				}
			}, function(){
				// console.log(colorCode)
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

	if (rule.hasOwnProperty("children")) {
		if (rule.ruleName.indexOf("Specialization") >= 0 && rule.parent == null) {
			var rulesFulfilled = rule.children.length;
			for (var l in rule.children) {
				if (checkRequirement(rule.children[l]).satisfied == false) {
					rulesFulfilled--;
				}
			}
			if (rulesFulfilled == 0) {
				satisfied = false;
			}
		} else {
			for (var l in rule.children) {
				if (checkRequirement(rule.children[l]).satisfied == false) {
					satisfied = false;
				}
			}
		}
	}

	if (satisfied == true) {
		colorCode.satisfied = true;
	} else {
		colorCode.satisfied = false;
	}

	if (quantifier == "MC") {
		colorCode.percentage = mcOfModules + "/" + rule.number + " MCs";
	} else if (quantifier == "MODULE") {
		colorCode.percentage = noOfModules + "/" + rule.number;
	} else if (inequality == "ALL") {
		colorCode.percentage = noOfModules + "/" + rule.includeModuleList.length;
	}
	return colorCode;
}

function traverseSelectedModules(fn, callback) {
	for (var i in userSavedModules) {
		if (i.indexOf("semester") >= 0) {
			for (var j in userSavedModules[i].modules) {
				fn(userSavedModules[i].modules[j], i);
			}
		}
	}
	if (callback != undefined)
		callback();
}
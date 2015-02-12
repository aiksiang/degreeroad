var requirementModules = {};
var requirements = [];
var noOfExpandedLists = 0;
var listOrder = [];
storage = new Storage();

function initializeRequirementModules() {
	var degreeName = "Computer Engineering";
	var degreeCode = "CEG"
	var academicYear = 1415;
	var specialProgramme = "None";
	var bridgingModules = "None";
	// getRequirementsOld(degreeCode, academicYear, function(data) {
	// 	parseRequirements(data);
	// 	getRequirementModules(degreeCode, function(data) {
	// 	    parseModules(data);
	// 	    loadUserSavedModules();
	// 	    selectSpecialization(userSavedModules.specialization);
 //  		});
	// });
	retrieveDegreeRequirements(academicYear, degreeCode, specialProgramme, function(degreeInfo) {
		console.log(degreeInfo);
		retrieveRules(degreeInfo.requirementId, function(rules) {
			parseRules(rules);
			traverseRequirements(function(rule) {
				parseList(rule);
			});
			displayRequirements();
		});
	});
};
initializeRequirementModules();

function parseRules(rules) {
	var i = 0;
	while (i < rules.length) {
		if (rules[i].parent == null) {	
			requirements.push(rules[i]);
			rules.splice(i,1);
			i--;
		}
		i++;
	}
	while (rules.length != 0) {
		for (var i in rules) {
			findParent(rules[i],requirements);
			rules.splice(i,1);
		}
	}
}

function findParent(rule,node) {
	var targetParent = rule.parent;
	var innerNode;
	for (var i in node) {
		innerNode = node[i];
		if (innerNode.hasOwnProperty("children")) {
			findParent(rule,innerNode.children);
		}
		if (innerNode.ruleId == targetParent) {
			if (innerNode.children == null) {
				innerNode.children = [];
			}
			
			innerNode.children.push(rule);
		}
	}
}

function parseList(rule) {
	if (rule.includeType == "LIST") {
		retrieveList(rule.includeItem, function(list) {
			if (rule.hasOwnProperty("list")) {
				rule.list.push(list);
			} else {
				rule.list = list;
			}
		});
	} else if (rule.includeType == "LISTS") {
		var lists = rule.includeItem.split(",");
		for (var i in lists) {
			retrieveList(lists[i], function(list) {
				if (rule.hasOwnProperty("list")) {
					rule.list.push.apply(rule.list,list);
				} else {
					rule.list = list;
				}
			});
		}
	} else if (rule.includeType.indexOf("LIST") >= 0) {
		console.log("Multiple with list: " + rule.includeItem);
	} else {
		console.log("No Lists: " + rule.includeItem);
	}
}

function traverseRequirements(fn) {
	var currentNode = requirements;
	callFunction(currentNode,fn);
	function callFunction(currentNode,fn) {
		for (var i in currentNode) {
			if (currentNode[i].hasOwnProperty("children")) {
				callFunction(currentNode[i].children,fn);
			}
			fn(currentNode[i]);
		}
	}
}

//---------------------------------------------------------
function parseRequirements(data) {
	requirementModules = {};
	for (var i in data) {
		var moduleType = data[i].moduleType;
		var identifier = removeSpaces(moduleType);
		if (!requirementModules.hasOwnProperty(identifier)) {
			requirementModules[identifier] = {};
			requirementModules[identifier].modules = [];
			requirementModules[identifier].name = moduleType;
			requirementModules[identifier].currentMC = 0;
			requirementModules[identifier].totalMC = data[i].modularCredit;
		}
	}
}

function parseModules(data) {
	for (var i in data) {
		var ModuleType = data[i].ModuleType;
		var identifier = removeSpaces(ModuleType);
		data[i].selected = false;
		requirementModules[identifier].modules.push(data[i]);
	}
}

function loadUserSavedModules() {
	storage.load();
	userSavedModules = storage.get();
	for (var moduleType in userSavedModules.chosenModules) {
		for (var i in userSavedModules.chosenModules[moduleType]) {
			var currentModule = userSavedModules.chosenModules[moduleType][i];
			prevModLoc = findModule(currentModule.Code + " " + currentModule.Name);
			requirementModules[moduleType].modules.push(currentModule);
			if (prevModLoc != undefined){
				requirementModules[prevModLoc.moduleType].modules.splice(prevModLoc.i,1);
			}
		}
	}
	for (var moduleType in requirementModules) {
		requirementModules[moduleType].currentMC = 0;
	}
	var savedMod;
	for (var sem in userSavedModules) {
		$("#" + sem + " .module-set").html("");
		for (var i in userSavedModules[sem].modules) {
			savedMod = userSavedModules[sem].modules[i];
			var savedModLoc = findModule(savedMod.Code + " " + savedMod.Name);
			$("#" + sem + " .module-set").append('<li class="module" onClick = "updateModuleData(' + "'" + savedMod.Code + " " + savedMod.Name + "'" + ',' + "'" + "fromSem" + "'" + ');" data-toggle="modal" data-target="#moduleModal"><span class="modMC">' + savedMod.Credit + '</span>' + savedMod.Code + " " + savedMod.Name + '</li>');
			requirementModules[savedModLoc.moduleType].modules[savedModLoc.i].selected = true;
			requirementModules[savedModLoc.moduleType].currentMC += parseInt(savedMod.Credit);
		}
		$("#" + sem + " .sem-mcs").html("MC: " + userSavedModules[sem].mcs);
	}
}

function clean() {
	for (var sem in userSavedModules) {
		$("#" + sem + " .module-set").html("");
	}
	listOrder = [];
	for (var moduleType in requirementModules) {
		listOrder.push(moduleType);
	}
	storage.clear();
	storage.save();
}

function clearStorage() {
	$("#myModalLabel").html("<div>Are you sure you want to clear all saved modules?</div>");
	$("#myModalBody").html('<button onClick="clean();initializeRequirementModules();" type="button" class="btn btn-default btn-sm" data-dismiss="modal">Yes</button>  <button type="button" class="btn btn-default btn-sm" data-dismiss="modal">No</button>');
}


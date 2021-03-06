var requirementModules = {};
var requirements = [];
var ruleLength = 0;
var ruleLengthUpdated = false;
//storage = new Storage();

function initializeRequirementModules(_degreeCode, clear) {
	_degreeCode = typeof _degreeCode !== 'undefined' ? _degreeCode : null;
	ruleLengthUpdated = false;
	if (clear == true) {
		requirements = [];
		ruleLength = 0;
	}
	$("#requirementModules .module-list").html("");	
	var degreeName = "";
	var degreeCode = _degreeCode;
	var academicYear = 1415;
	var specialProgramme = "None";
	var bridgingModules = "None";

	if (_degreeCode != null) {
		retrieveDegreeRequirements(academicYear, degreeCode, specialProgramme, function(degreeInfo) {
			retrieveRules(degreeInfo.requirementId, function(rules) {
				ruleLength += rules.length;
				ruleLengthUpdated = true;
				parseRules(rules, degreeCode);
				postOrderTraverseRequirements(function(rule) {
					parseIncludeExclude(rule);
				});
				waitForAllParsingDone(function() {
					parseAlternativeModules();
				});
				displayRequirements(degreeInfo.degreeName, clear);
				checkRequirementsAndColorize();
			});
		});
	}
};

function parseRules(rules, degreeCode) {
	var i = 0;
	while (i < rules.length) {
		rules[i].degree = degreeCode;
		if (rules[i].parent == null) {
			rules[i].level = 0;
			rules[i].parentNode = {};
			rules[i].parentNode["exclusive"] = rules[i].exclusive;
			rules[i].parentNode["level"] = rules[i].level;
			rules[i].parentNode["ruleName"] = rules[i].ruleName;
			rules[i].parentNode["degree"] = rules[i].degree;
			rules[i].parentNode["parentNode"] = null;
			requirements.push(rules[i]);
			rules.splice(i,1);
			i--;
		}
		i++;
	}
	while (rules.length != 0) {
		var level = 0;
		findParent(rules[0],requirements,level, degreeCode);
		rules.splice(0,1);
	}
}

function findParent(rule,node,level,degreeCode) {
	var targetParent = rule.parent;
	var innerNode;
	level++;
	for (var i in node) {
		innerNode = node[i];
		if (innerNode.hasOwnProperty("children")) {
			findParent(rule,innerNode.children,level,degreeCode);
		}
		if (innerNode.ruleId == targetParent && innerNode.degree == degreeCode) {
			if (innerNode.children == null) {
				innerNode.children = [];
			}
			rule.level = level;
			rule.parentNode = {};
			rule.parentNode["exclusive"] = innerNode.exclusive;
			rule.parentNode["level"] = innerNode.level;
			rule.parentNode["ruleName"] = innerNode.ruleName;
			rule.parentNode["degree"] = innerNode.degree;
			rule.parentNode["parentNode"] = innerNode.parentNode;

			innerNode.children.push(rule);
		}
	}
}

function parseAlternativeModules() {
	traverseRequirements(function(rule) {
		for (var i in rule.includeModuleList) {
			var moduleCode = rule.includeModuleList[i].module;
			var id = lookupModule(moduleCode);
			if (id != undefined) {
				if (allModuleList[id].hasOwnProperty("alternativeModules")) {
					if (allModuleList[id].alternativeModules != null) {
						var listOfAlternativeModules = allModuleList[id].alternativeModules.split(",");
						rule.includeModuleList[i].alternativeModules = listOfAlternativeModules;
					}
				}
			}
		}
	});
}

function parseIncludeExclude(rule) {
	if (rule.doneParsing != true){
		var includeTypes = rule.includeType.split(",");
		var includeItems; 

		if (includeTypes.length > 1) { // Multiple include types
			includeItems = rule.includeItem.split("),(");
			includeItems[0] = includeItems[0].substring(1,includeItems[0].length);
			includeItems[includeItems.length - 1] = includeItems[includeItems.length - 1].substring(0,includeItems[includeItems.length - 1].length - 1);
		} else { // Only one include type
			includeItems = [rule.includeItem];
		}
		var includeObject = {};


		//Split includeitems of those with "S" to become array
		for (var i = 0; i < includeTypes.length; i++) {
			switch (includeTypes[i]) {
				case "LISTS":
					var lists = includeItems[i].split(",");
					includeObject[includeTypes[i]] = lists;
					break;
				case "MODULES":
					var modules = includeItems[i].split(",");
					for (var j in modules) {
						modules[j] = modules[j].trim();
					}
					includeObject[includeTypes[i]] = modules;
					break;
				case "REGEXS":
					var regexs = includeItems[i].split(",");
					includeObject[includeTypes[i]] = regexs;
					break;
				case "FACULTIES":
					var faculties = includeItems[i].split(",");
					includeObject[includeTypes[i]] = faculties;
					break;
				case "ANY":
					includeObject[includeTypes[i]] = [];
					break;
				default: //those with no S, just append
					includeObject[includeTypes[i]] = includeItems[i];
					break;
			}
		}
		rule.include = includeObject;

		rule.parseCount = 0;

		// Retrieve Lists
		if (rule.include.hasOwnProperty("LIST")) {
			rule.listParseCount = 0;
			parseList(rule, rule.include.LIST);
		} else if (rule.include.hasOwnProperty("LISTS")) {
			rule.listParseCount = 0;
			parseLists(rule);
		}

		// Retrieve Modules
		if (rule.include.hasOwnProperty("MODULE")) {
			rule.moduleParseCount = 0;
			parseModule(rule, rule.include.MODULE);
		} else if (rule.include.hasOwnProperty("MODULES")) {
			rule.moduleParseCount = 0;
			parseModules(rule);
		}

		// Retrieve Regular Expression
		if (rule.include.hasOwnProperty("REGEX")) {
			rule.regexParseCount = 0;
			parseRegex(rule, rule.include.REGEX);
		} else if (rule.include.hasOwnProperty("REGEXS")) {
			rule.regexParseCount = 0;
			parseRegexs(rule);
		}

		// Retrieve Child
		if (rule.include.hasOwnProperty("CHILD")) {
			rule.childParseCount = 0;
			parseChild(rule);
		}

		// Retrieve Faculty hosted modules
		if (rule.include.hasOwnProperty("FACULTY")) {
			rule.facultyParseCount = 0;
			parseFaculty(rule, rule.include.FACULTY);
		} else if (rule.include.hasOwnProperty("FACULTIES")) {
			rule.facultyParseCount = 0;
			parseFaculties(rule);
		}

		if (rule.include.hasOwnProperty("FROMLIST")) {
			rule.parseCount++;
		}

		// Since ANY is also a checked to see if it has been loaded, we need to just say it is done.
		if (rule.include.hasOwnProperty("ANY")) {
			parseAny(rule);
		}
	}
}

function parseList(rule, listName) {
	retrieveList(listName, function(list) {
		if (rule.hasOwnProperty("includeModuleList")) {
			rule.includeModuleList.push.apply(rule.includeModuleList,list);
		} else {
			rule.includeModuleList = list;
		}
		rule.listParseCount++;
		if (rule.include.hasOwnProperty("LISTS")){
			if (rule.listParseCount == rule.include.LISTS.length){
				rule.parseCount++;
			}
		} else {
			rule.parseCount++;
		}
	});
}

function parseLists(rule) {
	for (var i in rule.include.LISTS) {
		parseList(rule, rule.include.LISTS[i]);
	}
}

function parseModule(rule, mod) {
	if (rule.hasOwnProperty("includeModuleList")) {
		rule.includeModuleList.push.apply(rule.includeModuleList,[{module: mod}]);
	} else {
		rule.includeModuleList = [{module: mod}];
	}
	rule.moduleParseCount++;
	if (rule.include.hasOwnProperty("MODULES")) {
		if (rule.moduleParseCount == rule.include.MODULES.length) {
			rule.parseCount++;
		}
	} else {
		rule.parseCount++;
	}
}

function parseModules(rule) {
	for (var i in rule.include.MODULES) {
		parseModule(rule, rule.include.MODULES[i]);
	}
}

function parseRegex(rule, regex) {
	waitForAllModuleList(function() {
		var regexpString = regex;
		var regexp = new RegExp(regexpString, "g");
		var list = [];
		for (var i in allModuleList) {
			if (regexp.test(allModuleList[i].Code)) {
				list.push({module: allModuleList[i].Code.trim()});
			}
		}
		if (rule.hasOwnProperty("includeModuleList")) {
			rule.includeModuleList.push.apply(rule.includeModuleList,list);
		} else {
			rule.includeModuleList = list;
		}
		rule.regexParseCount++;
		if (rule.include.hasOwnProperty("REGEXS")) {
			if (rule.regexParseCount == rule.include.REGEXS.length) {
				rule.parseCount++;
			}
		} else {
			rule.parseCount++;
		}
	});
}

function parseRegexs(rule) {
	for (var i in rule.include.REGEXS) {
		parseRegex(rule, rule.include.REGEXS[i]);
	}
}

function parseChild(targetRule) {
	targetRule.includeModuleList = [];
	postOrderTraverseRequirements(function(rule) {
		waitForChildParsing(rule, function() {
			targetRule.includeModuleList.push.apply(targetRule.includeModuleList,rule.includeModuleList);
			targetRule.childParseCount++;
			if (targetRule.childParseCount == targetRule.children.length) {
				targetRule.parseCount++;
				targetRule.includeModuleList = removeDuplicates(targetRule.includeModuleList);
			}
		});
		
	},targetRule);
}

function parseFaculty(rule, facultyName) {
	var fullFacultyName;
	switch (facultyName) {
		case "SOC":
			fullFacultyName = "SCHOOL OF COMPUTING";
			break;
		case "ENG":
			fullFacultyName = "ENGINEERING";
			break;
		case "SCI":
			fullFacultyName = "SCIENCE";
			break;
		case "BIZ":
			fullFacultyName = "SCHOOL OF BUSINESS";
			break;
		case "SDE":
			fullFacultyName = "SCHOOL OF DESIGN AND ENVIRONMENT";
			break;
		case "YST":
			fullFacultyName = "YONG SIEW TOH CONSERVATORY OF MUSIC";
			break;
		case "FASS":
			fullFacultyName = "ARTS & SOCIAL SCIENCES";
			break;
		case "MED":
			fullFacultyName = "YONG LOO LIN SCHOOL OF MEDICINE";
			break;
		case "LAW":
			fullFacultyName = "LAW";
			break;
		case "MDP":
			fullFacultyName = "JOINT MULTI-DISCIPLINARY PROGRAMMES";
			break;
		default:
			fullFacultyName = "NON-FACULTY-BASED DEPARTMENTS";
			break;
	}
	waitForAllModuleList(function() {
		var list = [];
		for (var i in allModuleList) {
			if (fullFacultyName == allModuleList[i].Faculty) {
				list.push({module: allModuleList[i].Code.trim()});
			}
		}
		if (rule.hasOwnProperty("includeModuleList")) {
			rule.includeModuleList.push.apply(rule.includeModuleList,list);
		} else {
			rule.includeModuleList = list;
		}
		rule.facultyParseCount++;
		if (rule.include.hasOwnProperty("FACULTIES")) {
			if (rule.facultyParseCount == rule.include.FACULTIES.length) {
				rule.parseCount++;
			}
		} else {
			rule.parseCount++;
		}
	});
}

function parseFaculties(rule) {
	for (var i in rule.include.FACULTIES) {
		parseFaculty(rule, rule.include.FACULTIES[i]);
	}	
}

function parseAny(rule) {
	waitForAllModuleList(function() {
		var list = [];
		for (var i in allModuleList) {
			list.push({module: allModuleList[i].Code.trim()});
		}
		rule.includeModuleList = list;
		
		rule.parseCount++;
	});
}

function removeDuplicates(arrayList) {
	var unique = [];
	for(var i in arrayList) {
		var itExists = false;
		for(var j in unique) {
			if (arrayList[i].module == unique[j].module) {
				itExists = true;
			}
		}
		if (itExists == false) {
			unique.push(arrayList[i]);
		}
	}
	return unique;
}

function traverseRequirements(fn,inputNode) {
	var currentNode = typeof inputNode !== 'undefined' ? inputNode.children : requirements;
	callFunction(currentNode,fn);
	function callFunction(currentNode,fn) {
		for (var i in currentNode) {
			fn(currentNode[i]);
			if (currentNode[i].hasOwnProperty("children")) {
				callFunction(currentNode[i].children,fn);
			}
		}
	}
}

function postOrderTraverseRequirements(fn,inputNode) {
	var currentNode = typeof inputNode !== 'undefined' ? inputNode.children : requirements;
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

function waitForAllModuleList(fn) {
	var busyWaiting = setInterval(function () {
		if (allModuleList != undefined) {
			fn();
			clearInterval(busyWaiting);
		} else {
			console.log("allModuleList not ready yet.");
		}
	},1);
}

function waitForChildParsing(rule, fn) {
	var busyWaiting = setInterval(function () {
		if (checkParsingDone(rule)) {
			fn();
			clearInterval(busyWaiting);
		} else {
			//console.log("Waiting for " + rule.ruleName + ": " + rule.parseCount + "/" + Object.keys(rule.include).length);
		}
	},5);
}

function checkParsingDone(rule) {
	if (rule.doneParsing == true)
		return true;
	if (Object.keys(rule.include).length == rule.parseCount) {
		rule.doneParsing = true;
	}
	return Object.keys(rule.include).length == rule.parseCount;
}

function checkAllParsingDone() {
	var counter = 0;
	traverseRequirements(function(rule) {
		if (!checkParsingDone(rule)) {
			counter = 0;
		} else {
			counter++;
		}
	});
	if (counter == ruleLength)
		return true;
	else
		return false;
}

function waitForAllParsingDone(fn) {
	var busyWaiting = setInterval(function () {
		if (checkAllParsingDone() == true) {
			fn();
			clearInterval(busyWaiting);
		} else {
			console.log("Not all the parsing is complete.");
		}
	},10);
}
		
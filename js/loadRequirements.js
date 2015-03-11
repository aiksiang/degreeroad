var requirementModules = {};
var requirements = [];
//storage = new Storage();

function initializeRequirementModules() {
	var degreeName = "";
	var degreeCode = "PS_HONS"
	var academicYear = 1415;
	var specialProgramme = "None";
	var bridgingModules = "None";

	retrieveDegreeRequirements(academicYear, degreeCode, specialProgramme, function(degreeInfo) {
		console.log(degreeInfo);
		retrieveRules(degreeInfo.requirementId, function(rules) {
			parseRules(rules);
			postOrderTraverseRequirements(function(rule) {
				parseIncludeExclude(rule);
			});
			console.log(requirements);
			displayRequirements();
			loadUserSavedModules();
			checkRequirementsAndColorize();
		});
	});
};
initializeRequirementModules();

function parseRules(rules) {
	var i = 0;
	while (i < rules.length) {
		if (rules[i].parent == null) {
			rules[i].level = 0;
			requirements.push(rules[i]);
			rules.splice(i,1);
			i--;
		}
		i++;
	}
	while (rules.length != 0) {
		var level = 0;
		findParent(rules[0],requirements,level);
		rules.splice(0,1);
	}
}

function parseIncludeExclude(rule) {

	var includeTypes = rule.includeType.split(",");
	var includeItems; 

	if (includeTypes.length > 1) { // Multiple include types
		includeItems = rule.includeItem.match(/\(([^)]+)\)/g);
		for (var i in includeItems)
			includeItems[i] = includeItems[i].substring(1, includeItems[i].length - 1);
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
		parseList(rule, rule.include.LIST);
	} else if (rule.include.hasOwnProperty("LISTS")) {
		rule.listParseCount = 0;
		parseLists(rule);
	}

	// Retrieve Modules
	if (rule.include.hasOwnProperty("MODULE")) {
		parseModule(rule, rule.include.MODULE);
	} else if (rule.include.hasOwnProperty("MODULES")) {
		parseModules(rule);
	}

	// Retrieve Regular Expression
	if (rule.include.hasOwnProperty("REGEX")) {
		parseRegex(rule);
	} else if (rule.include.hasOwnProperty("REGEXS")) {
		parseRegexs(rule);
	}

	// Retrieve Child
	if (rule.include.hasOwnProperty("CHILD")) {
		rule.childParseCount = 0;
		parseChild(rule);
	}

	if (rule.include.hasOwnProperty("FACULTY")) {
		rule.parseCount++;console.log("FACULTY NOT IMPLEMENTED")
	} else if (rule.include.hasOwnProperty("FACULTIES")) {
		rule.parseCount++;console.log("FACULTIES NOT IMPLEMENTED")
	}

	if (rule.include.hasOwnProperty("FROMLIST")) {
		rule.parseCount++;
	}

	// Since ANY is also a checked to see if it has been loaded, we need to just say it is done.
	if (rule.include.hasOwnProperty("ANY")) {
		rule.parseCount++;
	}
}

function findParent(rule,node,level) {
	var targetParent = rule.parent;
	var innerNode;
	level++;
	for (var i in node) {
		innerNode = node[i];
		if (innerNode.hasOwnProperty("children")) {
			findParent(rule,innerNode.children,level);
		}
		if (innerNode.ruleId == targetParent) {
			if (innerNode.children == null) {
				innerNode.children = [];
			}
			rule.level = level;
			innerNode.children.push(rule);
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
	rule.parseCount++;
}
function parseModules(rule) {
	for (var i in rule.include.MODULES) {
		parseModule(rule, rule.include.MODULES[i]);
	}
	rule.parseCount++;
}

function parseRegex(rule) {
	waitForAllModuleList(function() {
		var regexpString = rule.include.REGEX;
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
		rule.parseCount++;
	});
}

function parseChild(targetRule) {
	targetRule.includeModuleList = [];
	postOrderTraverseRequirements(function(rule) {
		waitForChildParsing(rule, function() {
			targetRule.includeModuleList.push.apply(targetRule.includeModuleList,rule.includeModuleList);
			targetRule.childParseCount++;
			if (targetRule.childParseCount == targetRule.children.length) {
				targetRule.parseCount++;
			}
		});
		
	},targetRule);
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
			console.log("Waiting for " + rule.ruleName + ": " + rule.parseCount + "/" + Object.keys(rule.include).length);
		}
	},1);
}

function checkParsingDone(rule) {
	return Object.keys(rule.include).length == rule.parseCount;
}

		
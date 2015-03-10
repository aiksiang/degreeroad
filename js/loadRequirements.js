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
			traverseRequirements(function(rule) {
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
	for (var i = 0; i < includeTypes.length; i++) {
		switch (includeTypes[i]) {
			case "LISTS":
				var lists = includeItems[i].split(",");
				includeObject[includeTypes[i]] = lists;
				break;
			case "TYPES":
				var types = includeItems[i].split(",");
				includeObject[includeTypes[i]] = types;
				break;
			case "MODULES":
				var modules = includeItems[i].split(",");
				for (var j in modules) {
					modules[j] = modules[j].trim();
				}
				includeObject[includeTypes[i]] = modules;
				break;
			case "ANY":
				break;
			default:
				includeObject[includeTypes[i]] = includeItems[i];
				break;
		}
	}
	rule.include = includeObject;

	// Retrieve Lists
	if (rule.include.hasOwnProperty("LIST")) {
		parseList(rule, rule.include.LIST);
	} else if (rule.include.hasOwnProperty("LISTS")) {
		parseLists(rule);
	}

	// Retrieve Modules
	if (rule.include.hasOwnProperty("MODULE")) {
		parseModule(rule, rule.include.MODULE);
	} else if (rule.include.hasOwnProperty("MODULES")) {
		parseModules(rule);
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
}
function parseModules(rule) {
	for (var i in rule.include.MODULES) {
		parseModule(rule, rule.include.MODULES[i]);
	}
}

function traverseRequirements(fn) {
	var currentNode = requirements;
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

var requirementModules = {};
var requirements = [];
//storage = new Storage();

function initializeRequirementModules() {
	var degreeName = "Computer Engineering";
	var degreeCode = "CEG"
	var academicYear = 1415;
	var specialProgramme = "None";
	var bridgingModules = "None";

	retrieveDegreeRequirements(academicYear, degreeCode, specialProgramme, function(degreeInfo) {
		console.log(degreeInfo);
		retrieveRules(degreeInfo.requirementId, function(rules) {
			parseRules(rules);
			traverseRequirements(function(rule) {
				parseList(rule);
			});
			console.log(requirements);
			displayRequirements();
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
		for (var i in rules) {
			var level = 0;
			findParent(rules[i],requirements,level);
			rules.splice(i,1);
		}
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
		//console.log("Multiple with list: " + rule.includeItem);
	} else {
		//console.log("No Lists: " + rule.includeItem);
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

var requirementSpecification = $("#requirement-specification .module-list");
var currentSelectedRule;
var ruleModuleList = [];
var currentModuleDisplayedUntil = 0;

function displayRequirements(degreeName, clear) {
	requirementSpecification.html("");

	var currentDegree;
	traverseRequirements(function(rule){
		if (currentDegree != rule.degree) {
			requirementSpecification.append('<div class="ui horizontal divider">'+ degreeList[rule.degree] +'</div>')
			currentDegree = rule.degree;
		}
		requirementSpecification.append(listItem("requirement", rule.requirementId, "item", requirementText(rule)));
	});
	InitializeActiveClass();
	InitializeRequirementSelection();

}


function InitializeRequirementSelection() {
	$('#requirement-specification .menu a.item').on('click', function() {
		var selectedId = $(this).attr('id');
		selectedId = selectedId.substring(11);
		if (currentSelectedRule != null)
			removePreviousEnglish();
		traverseRequirements(function(rule) {
			if (rule.requirementId == selectedId)
				currentSelectedRule = rule;
		});
		populateRequirementModulesList(currentSelectedRule);
	});
}

function requirementText(rule) {
	var text;
	switch (rule.level) {
		case 0:
			text = rule.ruleName;
			break;
		case 1:
			text = '<i class="caret right icon"></i>' + rule.ruleName;
			break;
		default:
			text = '<span style="float:left">' + Array(parseInt(rule.level) * 3).join('&nbsp') + '</span>' + '<i class="caret right icon"></i>' + rule.ruleName;
			break;
	}
	return text;
}

function listItem(idPrefix, idName, className, text) {
	if (idPrefix == "")
		return "<a class='"+ className +"'>"+ text +"</a>";
	else
		return "<a id='"+ idPrefix + idName +"' class='"+ className +"'>"+ text +"</a>";
}

function lookupModule(moduleCode) {
	for (var i in allModuleList) {
		if (allModuleList[i].Code == moduleCode) {
			return i;
		}
	}
}

function populateRequirementModulesList(rule) {
	var moduleList = $("#requirementModules .module-list");
	var listItems = 0;

	moduleList.transition({
		animation: 'slide down',
		onComplete: function() {
			moduleList.html("");
			insertModulesIntoList(rule);
			displayRequirementInEnglish();
    		InitializeModalsTrigger();
		}
	});
	moduleList.transition('slide down');
}

function insertModulesIntoList(rule) {
	ruleModuleList = [];
	if (rule.hasOwnProperty("includeModuleList")) {
		for (var i in rule.includeModuleList) {
			var id = lookupModule(rule.includeModuleList[i].module);
			if (id != undefined) {
				ruleModuleList.push({
					title: allModuleList[id].Code + " " + allModuleList[id].Name,
					index: id
				});
			} else {
				ruleModuleList.push({
					title: rule.includeModuleList[i].module,
					index: null
				});
			}
		}
		$("#requirementModules .ui.bottom.right.attached.label").html("0/0");
	} else {
		$("#requirementModules .ui.bottom.right.attached.label").html("0/0");
	}
	initializeSearch();
	$("#requirementModules .list").html("");
	currentModuleDisplayedUntil = 0;
	updateModuleList("", 0);
}

function initializeSearch() {
	$(".ui.search .input input").keyup(function() {
		var searchVal = $("#requirementModules input").val();
		$("#requirementModules .list").html("");
		currentModuleDisplayedUntil = 0;
		updateModuleList(searchVal, 0);
	});
}

function updateModuleList(searchVal, initialValue) {
	var numberOfModulesShown = 20;
	var j = 0;
	for (var i in ruleModuleList) {
		i = parseInt(i) + parseInt(initialValue);
		if (j >= numberOfModulesShown || i > ruleModuleList.length - 1)
			break;
		if (ruleModuleList[i].title.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0) {
			if (ruleModuleList[i].index != null)
				$("#requirementModules .list").append(listItem("requirementModule", ruleModuleList[i].index, "item module", ruleModuleList[i].title));
			else
				$("#requirementModules .list").append(listItem("notFound", ruleModuleList[i].title, "item module", ruleModuleList[i].title));
			j++;
		}
	}
	currentModuleDisplayedUntil += j;
	checkRequirementsAndColorize();
}

$("#requirementModules .module-list").scroll(function() {
	var searchVal = $("#requirementModules input").val();
	var list = $("#requirementModules .module-list");
	if (list.scrollTop() + list.height() > list[0].lastChild.offsetTop) {
		updateModuleList(searchVal,currentModuleDisplayedUntil);
	}
});

function removePreviousEnglish() {
	$("#requirement" + currentSelectedRule.requirementId).html(requirementText(currentSelectedRule));
}

function displayRequirementInEnglish() {
	var requirementInEnglish = "";
	switch (currentSelectedRule.inequality) {
		case "MIN":
			requirementInEnglish += "A <b>Minimum</b> of ";
			break;
		case "MAX":
			requirementInEnglish += "A <b>Maximum</b> of ";
			break;
		case "EQUAL":
			requirementInEnglish += "<b>Equal</b> to ";
			break;
		case "NONE":
			requirementInEnglish += "No ";
			break;
		case "ALL":
			if (currentSelectedRule.includeModuleList.length == 1) {
				requirementInEnglish += "Module: " + currentSelectedRule.includeModuleList[0].module;
			} else {
				requirementInEnglish += "<b>All</b> modules from ";
			}
			break;
	}

	if (currentSelectedRule.quantifier == "MC") {
		requirementInEnglish += "<b>" + currentSelectedRule.number + "</b>";
		requirementInEnglish += " MCs ";
	} else if (currentSelectedRule.quantifier == "MODULE") {
		requirementInEnglish += "<b>" + currentSelectedRule.number + "</b>";
		requirementInEnglish += " Modules ";
	} else if (currentSelectedRule.quantifier == null) {

	}

	if(currentSelectedRule.include.hasOwnProperty("LIST")) {
		requirementInEnglish += "from the list";
	} else if(currentSelectedRule.include.hasOwnProperty("LISTS")) {
		requirementInEnglish += "from the list";
	} else if(currentSelectedRule.include.hasOwnProperty("MODULES")) {
		requirementInEnglish += "from these modules";
	} else {
		var multipleRule = false;
		if(currentSelectedRule.include.hasOwnProperty("LEVEL")) {
			requirementInEnglish += "of level " + currentSelectedRule.include.LEVEL + " ";
			multipleRule = true;
		}
		if (multipleRule == true) {requirementInEnglish += "and "; multipleRule = false;}
		if (currentSelectedRule.include.hasOwnProperty("TYPE")) {
			requirementInEnglish += "that has module code " + currentSelectedRule.include.TYPE;
		}// else if (currentSelectedRule.include.hasOwnProperty("TYPES")) {
		// 	requirementInEnglish += "that has module code ";
		// 	for(var i in currentSelectedRule.include.TYPES) {
		// 		requirementInEnglish += currentSelectedRule.include.TYPES[i];
		// 		if (i != currentSelectedRule.include.TYPES.length - 1) {
		// 			requirementInEnglish += ", ";
		// 		}
		// 	}
		// }
	}

	if (currentSelectedRule.includeType == "ANY") {
		requirementInEnglish += "of any Modules";
	}
			//requirementInEnglish = requirementInEnglish.substring(0,requirementInEnglish.length - 5);

	$("#requirement" + currentSelectedRule.requirementId).append(" (" + requirementInEnglish + ")");
}
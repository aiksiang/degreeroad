var requirementSpecification = $("#requirement-specification .module-list");
var currentSelectedRule;

function displayRequirements() {
	requirementSpecification.html("");

	traverseRequirements(function(rule){
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
			checkRequirementsAndColorize();
			displayRequirementInEnglish();
		}
	});
	moduleList.transition('slide down');
}

function insertModulesIntoList(rule) {
	if (rule.hasOwnProperty("includeModuleList")) {
		for (var i in rule.includeModuleList) {
			var id = lookupModule(rule.includeModuleList[i].module);
			if (id != undefined)
				$("#requirementModules .list").append(listItem("requirementModule", id, "item module", allModuleList[id].Code + " " + allModuleList[id].Name));
			else
				$("#requirementModules .list").append(listItem("notFound", rule.includeModuleList[i].module, "item module", rule.includeModuleList[i].module));
		}
		$("#requirementModules .ui.bottom.right.attached.label").html("0/0");
	} else {
		$("#requirementModules .ui.bottom.right.attached.label").html("0/0");
	}
}

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
	} else {
		var multipleRule = false;
		if(currentSelectedRule.include.hasOwnProperty("LEVEL")) {
			requirementInEnglish += "of level " + currentSelectedRule.include.LEVEL + " ";
			multipleRule = true;
		}
		if (multipleRule == true) {requirementInEnglish += "and "; multipleRule = false;}
		if (currentSelectedRule.include.hasOwnProperty("TYPE")) {
			requirementInEnglish += "that has module code " + currentSelectedRule.include.TYPE;
		} else if (currentSelectedRule.include.hasOwnProperty("TYPES")) {
			requirementInEnglish += "that has module code ";
			for(var i in currentSelectedRule.include.TYPES) {
				requirementInEnglish += currentSelectedRule.include.TYPES[i];
				if (i != currentSelectedRule.include.TYPES.length - 1) {
					requirementInEnglish += ", ";
				}
			}
		}
	}

	if (currentSelectedRule.includeType == "ANY") {
		requirementInEnglish += "of any Modules";
	}
			//requirementInEnglish = requirementInEnglish.substring(0,requirementInEnglish.length - 5);

	$("#requirement" + currentSelectedRule.requirementId).append(" (" + requirementInEnglish + ")");
}
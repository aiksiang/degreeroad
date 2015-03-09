var requirementSpecification = $("#requirement-specification .module-list");
var currentSelectedRule;

function displayRequirements() {
	requirementSpecification.html("");

	traverseRequirements(function(rule){
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
		requirementSpecification.append(listItem("requirement", rule.requirementId, "item", text));
	});
	InitializeActiveClass();
	InitializeRequirementSelection();

}


function InitializeRequirementSelection() {
	$('#requirement-specification .menu a.item').on('click', function() {
		var selectedId = $(this).attr('id');
		selectedId = selectedId.substring(11);
		traverseRequirements(function(rule) {
			if (rule.requirementId == selectedId)
				currentSelectedRule = rule;
		});
		populateRequirementModulesList(currentSelectedRule);
	});
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
		$("#requirementModules .ui.bottom.right.attached.label").html("0/" + rule.includeModuleList.length);
	} else {
		$("#requirementModules .ui.bottom.right.attached.label").html("0/0");
	}
}

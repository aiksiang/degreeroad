var requirementSpecification = $("#requirement-specification .module-list");

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
		var selectedRule;
		var selectedId = $(this).attr('id');
		selectedId = selectedId.substring(11);
		traverseRequirements(function(rule) {
			if (rule.requirementId == selectedId)
				selectedRule = rule;
		});
		populateRequirementModulesList(selectedRule);
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
			insertModulesIntoList(moduleList, rule);
		}
	});
	moduleList.transition('slide down');
}
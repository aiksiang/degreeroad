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

function populateRequirementModulesList(rule) {

	console.log(rule.includeType + ": " + rule.includeItem);

	var moduleList = $("#requirementModules .module-list");
	var listItems = 0;
	moduleList.html("");
	if (rule.hasOwnProperty("list")) {
		for (var i in rule.list) {
			var id = lookupModule(rule.list[i].module);
			if (id != undefined)
				moduleList.append(listItem("requirementModule", id, "item module", allModuleList[id].Code + " " + allModuleList[id].Name));
			else
				moduleList.append(listItem("requirementModule", rule.list[i].module, "item module", rule.list[i].module));
			listItems++;
		}
	} else {

	}
	$("#requirementModules .ui.bottom.right.attached.label").html("0/" + listItems);
}

function lookupModule(moduleCode) {
	for (var i in allModuleList) {
		if (allModuleList[i].Code == moduleCode) {
			return i;
		}
	}
}
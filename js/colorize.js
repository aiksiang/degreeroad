function colorizeRequirementModuleList(colorCode, rule) {
	rule = typeof rule !== 'undefined' ? rule : currentSelectedRule;

	var requirementList = $("#requirementModules .module-list a");
	for (var i in colorCode){
		if (i.indexOf("module") >= 0) { //Only the indexes, not other properties
			i = i.substring(6,i.length);
			$(requirementList[i]).addClass("selectedModule");
			if ($(requirementList[i]).attr("id").indexOf("clone") < 0)
				$(requirementList[i]).attr("id", $(requirementList[i]).attr("id") + "clone");
		}
	}
	if (colorCode.satisfied) {
		$("#requirement" + currentSelectedRule.requirementId).addClass("ruleSatisfied");
	} else {
		$("#requirement" + currentSelectedRule.requirementId).removeClass("ruleSatisfied");
	}
	$("#requirementModules .ui.bottom.right.attached.label").html(colorCode.percentage);
}

function colorizeRequirements(colorCodes) {
	traverseRequirements(function(rule) {
		if (rule == currentSelectedRule) {
			colorizeRequirementModuleList(colorCodes[rule.requirementId], rule);
		} else {
			if (colorCodes[rule.requirementId].satisfied) {
				$("#requirement" + rule.requirementId).addClass("ruleSatisfied");
			} else {
				$("#requirement" + rule.requirementId).removeClass("ruleSatisfied");
			}
		}
	});

}
function colorizeRequirementModuleList(colorCode, rule) {
	rule = typeof rule !== 'undefined' ? rule : currentSelectedRule;

	var requirementList = $("#requirementModules .module-list a");
	for (var i in colorCode){
		if (i.indexOf("module") >= 0) { //Only the indexes, not other properties
			i = i.substring(6,i.length);
			var id = lookupModule(i);
			if (id != undefined)
				identifier = "#requirementModule" + id;
			else
				identifier = "#notFound" + i;

			if ($("#requirementModules "+ identifier) != undefined) {
				$("#requirementModules "+ identifier).attr("id", $("#requirementModules "+ identifier).attr("id") + "clone");
			}
			$("#requirementModules "+ identifier + "clone").addClass("selectedModule");
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

function colorizeSemesters(colorCodes) {
	traverseSelectedModules(function(mod) {
		var id = lookupModule(mod.Code);
		if (id != undefined)
			identifier = "#requirementModule" + id;
		else
			identifier = "#notFound" + mod.Code;
		$("#semester-container " + identifier).removeClass("errorModule");
		$("#semester-container " + identifier).removeAttr("data-content");
		$("#semester-container " + identifier).removeAttr("data-position");
		$("#semester-container " + identifier).popup('destroy');
	});
	for (var i in colorCodes.semester) {
		var index = colorCodes.semester[i].mod.Code;
		var id = lookupModule(index);
		if (id != undefined)
			identifier = "#requirementModule" + id;
		else
			identifier = "#notFound" + index;

		if (colorCodes.semester[i].errorType == "prerequisiteNotMet") {
			$("#semester-container " + identifier).addClass("errorModule");
			$(".errorModule").attr("data-content", "Pre-Requisites not met");
			$(".errorModule").attr("data-position", "top center");
		} else if (colorCodes.semester[i].errorType == "manuallyCheck") {
			$("#semester-container " + identifier).addClass("noticeModule");
			$(".noticeModule").attr("data-content", "Manually check Pre-Requisites");
			$(".noticeModule").attr("data-position", "top center");
		}
		if (id == undefined) {
			$("#semester-container " + identifier).addClass("noticeModule");
			$(".noticeModule").attr("data-content", "Module not in database");
			$(".noticeModule").attr("data-position", "top center");
		}
	}
	$(".errorModule").popup();
	$(".noticeModule").popup();
}
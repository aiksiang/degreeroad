var pushToTop = false;

function colorizeRequirementModuleList(colorCode, rule) {
	rule = typeof rule !== 'undefined' ? rule : currentSelectedRule;
	var requirementList = $("#requirementModules .module-list a");
	for (var i in colorCode){
		if (i.indexOf("module") >= 0) { //Only the indexes, not other properties
			idx = i.substring(6,i.length);
			var id = lookupModule(idx);
			var mod;
			if (id != undefined) {
				identifier = "#requirementModule" + id;
				mod = {
					title: allModuleList[id].Code + " " + allModuleList[id].Name,
					index: id
				};
			} else {
				identifier = "#notFound" + idx;
				mod = {
					title: idx,
					index: null
				};
			}

			if ($("#requirementModules "+ identifier) != undefined) {
				$("#requirementModules "+ identifier).attr("id", $("#requirementModules "+ identifier).attr("id") + "clone");
			}
			if (colorCode[i].color == "Green")
				$("#requirementModules "+ identifier + "clone").addClass("selectedModule").addClass("greenModule").removeClass("greyModule");
			else if (colorCode[i].color == "Grey")
				$("#requirementModules "+ identifier + "clone").addClass("selectedModule").addClass("greyModule").removeClass("greenModule");

			if (colorCode[i].hasOwnProperty("alternativeModule")) {
				$("#requirementModules "+ identifier + "clone").attr("data-content", "Replaced By: " + colorCode[i].alternativeModule);
				$("#requirementModules "+ identifier + "clone").attr("data-position", "right center");
				$("#requirementModules "+ identifier + "clone").popup();
			}

			if ((rule.degree == "UNI" || 
				rule.requirementId == "20" || 
				rule.requirementId == "21" || 
				rule.requirementId == "22" ||
				rule.requirementId == "23" || 
				rule.requirementId == "24" || 
				rule.requirementId == "25") && pushToTop != true) {
				for (var j in ruleModuleList) {
					if (ruleModuleList[j].title == mod.title) {
						ruleModuleList.splice(j,1);
						ruleModuleList.unshift(mod);
						$("#requirementModules .list").html("");
						updateModuleList("", 0);
						break;
					}
				}
			}
		}
	}
	pushToTop = true;
	var ruleSatisfied = false;
	if (colorCode.satisfied) {
		$(".requirement" + currentSelectedRule.requirementId).addClass("ruleSatisfied");
		ruleSatisfied = true;
	} else {
		$(".requirement" + currentSelectedRule.requirementId).removeClass("ruleSatisfied");
		ruleSatisfied = false;
	}
	$("#requirementModules .ui.bottom.right.attached.label").html(colorCode.percentage);
	return ruleSatisfied;
}

function colorizeRequirements(colorCodes) {
	var totalRuleSatisfied = 0;
	traverseRequirements(function(rule) {
		var ruleSatisfied;
		if (rule == currentSelectedRule) {
			ruleSatisfied = colorizeRequirementModuleList(colorCodes[rule.requirementId], rule);
		} else {
			if (colorCodes[rule.requirementId].satisfied) {
				$(".requirement" + rule.requirementId).addClass("ruleSatisfied");
				ruleSatisfied = true;
			} else {
				$(".requirement" + rule.requirementId).removeClass("ruleSatisfied");
			}
		}
		if (ruleSatisfied)
			totalRuleSatisfied++;
	});
	$("#requirement-specification .ui.bottom.right.label").html(totalRuleSatisfied + "/" + ruleLength);
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
			$("#semester-container " + identifier).attr("data-position", "top center");
			$("#semester-container " + identifier).popup({content: "Pre-Requisites not met"});
		} else if (colorCodes.semester[i].errorType == "manuallyCheck") {
			$("#semester-container " + identifier).addClass("noticeModule");
			$("#semester-container " + identifier).attr("data-position", "top center");
			$("#semester-container " + identifier).popup({content: "Manually check Pre-Requisites"});
		}
		if (colorCodes.semester[i].errorType == "wrongSemester") {
			$("#semester-container " + identifier).addClass("errorModule").removeClass("noticeModule");
			$("#semester-container " + identifier).attr("data-position", "top center");
			$("#semester-container " + identifier).popup({content: colorCodes.semester[i].details});
		}

		if (id == undefined) {
			$("#semester-container " + identifier).addClass("noticeModule");
			$(".noticeModule").attr("data-content", "Module not in database");
			$(".noticeModule").attr("data-position", "top center");
		}
	}
	//$(".errorModule").popup();
	// $(".noticeModule").popup();
}
var removeClone = true;

$("#semester-container .module-list").sortable({
	connectWith: ".module-list",
	items: ".module, .module-small:not(.selected)",
	dropOnEmpty: true,
	forcePlaceholderSize: true,
	placeholder: "item module-placeholder",
	revert: 200,
	scroll: true,
	helper: "clone",
	appendTo: "body",
	cursor: "-webkit-grabbing",
	remove: function(event,ui) {
		var removedFrom = $($(this)[0].parentNode).parent().attr('id');
		var itemLocation;

		if (ui.item.attr('id').indexOf("requirementModule") >= 0) {
			itemLocation = ui.item.attr('id').substring(17);
		} else {
			moduleCode = ui.item.attr('id').substring(8);console.log(moduleCode)
		}

		if (itemLocation != null) {
			var index = userSavedModules[removedFrom].modules.indexOf(allModuleList[itemLocation]);
			if (index >= 0) {
				userSavedModules[removedFrom].modules.splice(index, 1);
				userSavedModules[removedFrom].mcs -= parseInt(allModuleList[itemLocation].Credit);
				updateMC(removedFrom, userSavedModules[removedFrom].mcs);
			} else {
				console.log("Error: Unable to remove module, module not found");
			}
		} else {
			console.log("Warning: Module is not found in database");
			//TODO remove module without details into sem
		}
	},
	receive: function(event,ui) {
		removeClone = false;
		var receivedBy = $($(this)[0].parentNode).parent().attr('id');
		var itemLocation;

		if (ui.item.attr('id').indexOf("requirementModule") >= 0) {
			itemLocation = ui.item.attr('id').substring(17);
		} else {
			itemLocation = null;
		}
		
		if (itemLocation != null) {
			if (checkPrerequisite(itemLocation, receivedBy) == false) {
				removeClone = true;
				showNotice("<b>You do not meet the Prerequisites for this module: </b><br>" + allModuleList[itemLocation].Prereq)
			} else {
				userSavedModules[receivedBy].modules.push(allModuleList[itemLocation]);
				userSavedModules[receivedBy].mcs += parseInt(allModuleList[itemLocation].Credit);
				updateMC(receivedBy, userSavedModules[receivedBy].mcs);
			}
		} else {
			console.log("Module is not found in database");
			//TODO add module without details into sem
		}
		checkRequirementsAndColorize();
	},
	update: function(event, ui) {
		// showAll();
		//console.log($(ui.sender).parent());
		// displayRequirements();
		// storage.put(userSavedModules);
		// storage.save();
	}
});

$("#requirementModules .module-list").sortable({
	connectWith: ".module-list",
	items: ".module:not(.selectedModule)",
	dropOnEmpty: true,
	forcePlaceholderSize: true,
	placeholder: "blank-placeholder",
	revert: 200,
	scroll: true,
	appendTo: "body",
	cursor: "-webkit-grabbing",
	helper: function(event, li) {
		copyHelper = li.clone();
		copyHelper.attr("id", li.attr("id") + "clone");
		copyHelper.insertAfter(li);
		return li.clone();
	},
	receive: function(e,ui) {
		removeClone = true;
		$("#" + ui.item.attr("id")).remove();
		$("#" + ui.item.attr("id") + "clone").attr("id", ui.item.attr("id")).removeClass("selectedModule");
		checkRequirementsAndColorize();
	},
	stop: function(e,ui) {
		if (removeClone) {
			e.preventDefault();
			$("#" + ui.item.attr("id") + "clone").remove();
		}
		removeClone = true;
	},
	update: function(event, ui) {
		//colorizeRequirementModuleList(colorCode);

		// showAll();
		//console.log($(ui.sender).parent());
		// displayRequirements();
		// storage.put(userSavedModules);
		// storage.save();
	}
});

function checkRequirementsAndColorize() {
	//var colorCode = checkRequirement();
	//colorizeRequirementModuleList(colorCode);
	waitForAllParsingDone(function() {
		var colorCode = checkRequirements();
		colorizeRequirements(colorCode);
	});
}

function checkPrerequisite(itemLocation, receivedBy) {
	if (itemLocation != undefined) {
		if (allModuleList[itemLocation].Prereq == undefined || allModuleList[itemLocation].Prereq == "") {
			//No Prerequisites
			return true;
		} else if (allModuleList[itemLocation].Prereq[0] == "*") {
			//Prerequisites not parsed
			showNotice("<b>Please manually check the Prerequisites for this module: </b><br>" + allModuleList[itemLocation].Prereq.substring(1));
			return true;
		} else {
			modulesPassed = [];
			return parsePrerequisite(allModuleList[itemLocation].Prereq,receivedBy);
		}
	} else {
		console.log("it shouldnt come here");
	}
}

function parsePrerequisite(preReq, receivedBy) {
	console.log("current: " + preReq)
	var firstBlank = preReq.indexOf(' ');
	if (preReq[0] == "(") {
		var nextNest = preReq.substring(1).indexOf("(");
		var nextEnd = preReq.indexOf(")");
		if (nextNest > nextEnd) {
			var nextPart = preReq.substring(nextEnd + 2);
			var nextBlank = nextPart.indexOf(" ");
			var nextOperator = nextPart.substring(0, nextBlank);
			if (nextOperator == "or" || nextOperator == "OR") {
				return parsePrerequisite(preReq.substring(1,nextEnd), receivedBy) || parsePrerequisite(nextPart.substring(nextBlank + 1), receivedBy);
			} else if (nextOperator == "and" || nextOperator == "AND") {
				return parsePrerequisite(preReq.substring(1,nextEnd), receivedBy) && parsePrerequisite(nextPart.substring(nextBlank + 1), receivedBy);
			} else {
				console.log("it shouldnt come here");
			}

		} else {
			return parsePrerequisite(preReq.substring(1,preReq.length - 1), receivedBy);
		}
	} else if (preReq[0] == ")") {
		console.log("here got )")
	} else if (firstBlank < 0) {
		if (preReq[preReq.length-1] == ")") {console.log(preReq.substring(0, preReq.length-1) + ": " + isModuleSelected(preReq.substring(0, preReq.length-1), receivedBy));
			return isModuleSelected(preReq.substring(0, preReq.length-1), receivedBy);
		} else {
			return isModuleSelected(preReq, receivedBy);
		}
	} else if (firstBlank >= 0) {
		var firstPart = preReq.substr(0,firstBlank);
		if (firstPart[firstPart.length-1] == ")") {
			firstPart = firstPart.substring(0,firstPart.length-1);
		}
		var nextPart = preReq.substr(firstBlank + 1);
		var nextBlank = nextPart.indexOf(' ');
		var operator = nextPart.substring(0,nextBlank);
		if (operator == "or" || operator == "OR") {console.log(firstPart + ": " + isModuleSelected(firstPart, receivedBy));
			return isModuleSelected(firstPart, receivedBy) || parsePrerequisite(nextPart.substr(nextBlank + 1), receivedBy);
		} else if (operator == "and" || operator == "AND") {console.log(firstPart + ": " + isModuleSelected(firstPart, receivedBy));
			return isModuleSelected(firstPart, receivedBy) && parsePrerequisite(nextPart.substr(nextBlank + 1), receivedBy);
		} else {console.log(firstPart + ": " + isModuleSelected(firstPart, receivedBy));
			return isModuleSelected(firstPart, receivedBy);
		}
	}
	console.log(preReq);
}

function isModuleSelected(moduleToBeChecked, receivedBy) {
	var result = false;
	var indexReceivedBy = receivedBy.substring(8);
	var stop = false;
	for (var i in userSavedModules) {
		if (stop == true) break;
		if (i.indexOf("semester") >= 0) {
			for (var j in userSavedModules[i].modules) {
				var module = userSavedModules[i].modules[j];
				var semester = i;
				var indexSemester = semester.substring(8);
				if (indexReceivedBy <= indexSemester) {
					result = false;
				} else if (module.Code == moduleToBeChecked) {
					result = true;
					stop = true;
					break;
				}
			}
		}
	}
	return result;
}

//$(".module-list").sortable("refresh");

function showNotice(text) {
	$('.noticeAlert.modal').modal('show');
	$('.noticeAlert .description').html(text);
}

function updateMC(identifier, mc) {
	$("#" + identifier + " .ui.bottom.right.attached.label").html("MCs: " + mc);
}

//for debugging
function showAll() {
	for (var i in userSavedModules) {
		if (i.indexOf("semester") >= 0) {console.log(i);
			for (var j in userSavedModules[i].modules) {
				console.log(userSavedModules[i].modules[j]);
			}
			console.log("MCs: " + userSavedModules[i].mcs)
		}
	}
}
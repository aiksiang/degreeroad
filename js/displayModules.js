function displayRequirements() {
	$(".sortable-view-requirement").html("");

	if (listOrder.length == 0) {
		for (var moduleType in requirementModules) {
			listOrder.push(moduleType);
		}
		for (var i in listOrder) {
			var moduleType = listOrder[i];
			if (requirementModules[moduleType].currentMC >= requirementModules[moduleType].totalMC) {
				if (!(moduleType == "Program Requirement" || moduleType == "Depth" || moduleType == "Breadth")) {
					requirementModules[moduleType].collapsed = true;
				}
			} else {
				requirementModules[moduleType].collapsed = false;
			}
		}
	}
	noOfExpandedLists = listOrder.length;

	for (var i in listOrder) {
		var moduleType = listOrder[i];
		$(".sortable-view-requirement").append('<div id = "' + moduleType + '" class="sem sem-expanded"><div class="req-title" onClick="toggleExpansion(' + "'" + moduleType + "'" + ');">' + requirementModules[moduleType].name + '</div><ul class="module-set"></ul><div class="sem-mcs">MC: 0' + '/' + requirementModules[moduleType].totalMC + '</div></div>');
		for (var i in requirementModules[moduleType].modules) {
			var module = requirementModules[moduleType].modules[i];
			if (!module.selected) {
				if (module.highlighted) {
					$("#" + moduleType + " .module-set").prepend('<li class="module-small highlighted" onClick = "updateModuleData(' + "'" + module.Code + " " + module.Name + "'" + ',' + "'" + "fromReq" + "'" + ');" data-toggle="modal" data-target="#moduleModal"><span class="modMC">' + requirementModules[moduleType].modules[i].Credit + '</span>' + requirementModules[moduleType].modules[i].Code + " " + requirementModules[moduleType].modules[i].Name + '</li>');
				} else {
					$("#" + moduleType + " .module-set").append('<li class="module-small" onClick = "updateModuleData(' + "'" + module.Code + " " + module.Name + "'" + ',' + "'" + "fromReq" + "'" + ');" data-toggle="modal" data-target="#moduleModal"><span class="modMC">' + requirementModules[moduleType].modules[i].Credit + '</span>' + requirementModules[moduleType].modules[i].Code + " " + requirementModules[moduleType].modules[i].Name + '</li>');
				}
			} else {
				if (module.highlighted) {
					$("#" + moduleType + " .module-set").prepend('<li class="module-small selected highlighted" onClick = "updateModuleData(' + "'" + module.Code + " " + module.Name + "'" + ',' + "'" + "fromReq" + "'" + ');" data-toggle="modal" data-target="#moduleModal"><span class="modMC">' + requirementModules[moduleType].modules[i].Credit + '</span>' + requirementModules[moduleType].modules[i].Code + " " + requirementModules[moduleType].modules[i].Name + '</li>');
				} else {
					$("#" + moduleType + " .module-set").append('<li class="module-small selected" onClick = "updateModuleData(' + "'" + module.Code + " " + module.Name + "'" + ',' + "'" + "fromReq" + "'" + ');" data-toggle="modal" data-target="#moduleModal"><span class="modMC">' + requirementModules[moduleType].modules[i].Credit + '</span>' + requirementModules[moduleType].modules[i].Code + " " + requirementModules[moduleType].modules[i].Name + '</li>');
				}
			}
		}
		var requirementContainerWidth;
		if (noOfExpandedLists == listOrder.length) {
			requirementContainerWidth = (noOfExpandedLists) * 230 + 40;
		} else {
			requirementContainerWidth = (noOfExpandedLists + 1) * 230 + 40;
		}
		$(".sortable-view-requirement").css("width", requirementContainerWidth + "px");
		$("#" + moduleType + " .sem-mcs").html("MC: " + requirementModules[moduleType].currentMC + "/" + requirementModules[moduleType].totalMC);
		if (requirementModules[moduleType].currentMC >= requirementModules[moduleType].totalMC) {
			$(".requirement #" + moduleType).css("background","#1EC573");
			$(".requirement #" + moduleType + " .sem-mcs").css("color","white");
		}
	}
	for (var i in listOrder) {
		var moduleType = listOrder[i];
		if (requirementModules[moduleType].collapsed == true) {
			contractList(moduleType,false);
			updateContainerSize();
		}
	}
	updateListOrder();

	checkSpecializationFulfillment();
	calculateTotalMCs();

	mouseoverEffects();
	initializeSortable();
}

function calculateTotalMCs() {
	var currentMC = 0;
	var totalMCs = 0;
	getTotalMCs(userSavedModules.course, function(data) {
		totalMCs = data.totalMCs;
		for (var sem in userSavedModules) {
			if (sem.indexOf("sem") >= 0) {
				currentMC += parseInt(userSavedModules[sem].mcs);
			}
		}
		// if (1) {//(currentMC >= totalMCs) {
		// 	$(".total-sem-mcs").css("background", "white");
		// }
		$(".total-sem-mcs").html("Total MCs: " + currentMC + "/" + totalMCs);
	});
}

function toggleExpansion(moduleType) {
	if ($("#" + moduleType).hasClass("sem-expanded")) {
		contractList(moduleType,true);
	} else {
		expandList(moduleType);
	}
	updateContainerSize();
	updateListOrder();
}

function expandList(moduleType) {
	var temp = $("#" + moduleType);
	$("#" + moduleType).remove();
	if (noOfExpandedLists != 0) {
		temp.insertAfter("#" + $(".sortable-view-requirement .sem").get(noOfExpandedLists-1).id);
	} else {
		temp.prependTo(".sortable-view-requirement");
	}
	$("#" + moduleType + " ul").switchClass("module-set-collapsed","module-set", 100, function(){initializeSortable();});
	$("#" + moduleType).addClass("sem-expanded");
	if (moduleType.length >  13) {
		$("#" + moduleType).css("height","396px");
	}
	requirementModules[moduleType].collapsed = false;

	noOfExpandedLists++;
	
	mouseoverEffects();
}

function contractList(moduleType, animation) {
	noOfExpandedLists--;
	var temp = $("#" + moduleType);
	$("#" + moduleType).remove();
	if (noOfExpandedLists != 0) {
		temp.insertAfter("#" + $(".sortable-view-requirement .sem").get(noOfExpandedLists-1).id);
	} else {
		temp.prependTo(".sortable-view-requirement");
	}
	$("#" + moduleType).removeClass("sem-expanded");
	if (animation == false) {
		$("#" + moduleType + " ul").switchClass("module-set","module-set-collapsed",0);
	} else {
		$("#" + moduleType + " ul").switchClass("module-set","module-set-collapsed", 100);
	}
	if (moduleType.length >  13) {
		$("#" + moduleType).css("height","50px");
	}
	requirementModules[moduleType].collapsed = true;
}

function updateContainerSize() {
	var requirementContainerWidth;
	if (noOfExpandedLists == listOrder.length) {
		requirementContainerWidth = (noOfExpandedLists) * 230 + 40;
	} else {
		requirementContainerWidth = (noOfExpandedLists + 1) * 230 + 40;
	}
	$(".sortable-view-requirement").css("width", requirementContainerWidth + "px");
}

function updateListOrder() {
	var i = 0;
	listOrder = [];
	for (var moduleType in requirementModules) {
		listOrder.push($(".sortable-view-requirement .sem").get(i).id);
		i++;
	}
}
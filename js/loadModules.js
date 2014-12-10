var requirementModules = {};
var noOfExpandedLists = 0;
var listOrder = [];
storage = new Storage();

function initializeRequirementModules() {
	var degreeName = "Computer Engineering";
	var degreeCode = "CEG"
	var academicYear = "13/14"
	getRequirements(degreeCode, academicYear, function(data) {
		parseRequirements(data);
		getRequirementModules(degreeCode, function(data) {
		    parseModules(data);
		    loadUserSavedModules();
		    selectSpecialization(userSavedModules.specialization);
  		});
	});
};
initializeRequirementModules();

function parseRequirements(data) {
	requirementModules = {};
	for (var i in data) {
		var moduleType = data[i].moduleType;
		var identifier = moduleType.replace(/\s/g, '');
		if (!requirementModules.hasOwnProperty(identifier)) {
			requirementModules[identifier] = {};
			requirementModules[identifier].modules = [];
			requirementModules[identifier].name = moduleType;
			requirementModules[identifier].currentMC = 0;
			requirementModules[identifier].totalMC = data[i].modularCredit;
		}
	}
}

function parseModules(data) {
	for (var i in data) {
		var ModuleType = data[i].ModuleType;
		var identifier = ModuleType.replace(/\s/g, '');
		data[i].selected = false;
		requirementModules[identifier].modules.push(data[i]);
	}
}

function displayModules() {
	for (var sem in userSavedModules) {
		$("#" + sem + " .module-set").html("");
	}
	$(".requirement-container").html("");

	for (var moduleType in requirementModules) {
		requirementModules[moduleType].currentMC = 0;
	}
	noOfExpandedLists = 0;

	//Loads Semester Modules
	var savedMod;
	for (var sem in userSavedModules) {
		for (var i in userSavedModules[sem].modules) {
			savedMod = userSavedModules[sem].modules[i];
			savedModLoc = findModule(savedMod.Code + " " + savedMod.Name);
			$("#" + sem + " .module-set").append('<li class="module" onClick = "updateModuleData(requirementModules.' + savedModLoc.moduleType + '.modules[' + savedModLoc.i + '],' + "'fromMod'" + ');" data-toggle="modal" data-target="#moduleModal">' + savedMod.Code + " " + savedMod.Name + '</li>');
			requirementModules[savedModLoc.moduleType].modules[savedModLoc.i].selected = true;
			requirementModules[savedModLoc.moduleType].currentMC += parseInt(savedMod.Credit);
		}
		$("#" + sem + " .sem-mcs").html("MC: " + userSavedModules[sem].mcs);
	}

	//Loads Requirement Modules
	if (listOrder.length == 0) {
		for (var identifier in requirementModules) {
			listOrder.push(identifier);
		}
	}
	for (var i in listOrder) {
		var identifier = listOrder[i];
		$(".requirement-container").append('<div id = "' + identifier + '" class="sem"><div class="req-title" onClick="toggleExpansion(' + "'" + identifier + "'" + ');">' + requirementModules[identifier].name + '</div><ul class="module-set-collapsed"></ul><div class="sem-mcs">MC: 0' + '/' + requirementModules[identifier].totalMC + '</div></div>');
		for (var i in requirementModules[identifier].modules) {
			if (i == 0){
				$("#" + identifier + " ul").removeClass("module-set-collapsed");
				$("#" + identifier + " ul").addClass("module-set");
				$("#" + identifier).addClass("sem-expanded");
				noOfExpandedLists++;
			}
			if (!requirementModules[identifier].modules[i].selected) {
				if (requirementModules[identifier].modules[i].highlighted) {
					$("#" + identifier + " .module-set").append('<li class="module-small highlighted" onClick = "updateModuleData(requirementModules.'+ identifier +'.modules['+ i +'],' + "'fromMod'" + ');" data-toggle="modal" data-target="#moduleModal">' + requirementModules[identifier].modules[i].Code + " " + requirementModules[identifier].modules[i].Name + '</li>');
				} else {
					$("#" + identifier + " .module-set").append('<li class="module-small" onClick = "updateModuleData(requirementModules.'+ identifier +'.modules['+ i +'],' + "'fromMod'" + ');" data-toggle="modal" data-target="#moduleModal">' + requirementModules[identifier].modules[i].Code + " " + requirementModules[identifier].modules[i].Name + '</li>');
				}
			} else {
				$("#" + identifier + " .module-set").append('<li class="module-small selected" onClick = "updateModuleData(requirementModules.'+ identifier +'.modules['+ i +'],' + "'fromMod'" + ');" data-toggle="modal" data-target="#moduleModal">' + requirementModules[identifier].modules[i].Code + " " + requirementModules[identifier].modules[i].Name + '</li>');
			}
		}
		var requirementContainerWidth = (noOfExpandedLists + 1) * 230 + 40;
		$(".requirement-container").css("width", requirementContainerWidth + "px");
		$("#" + identifier + " .sem-mcs").html("MC: " + requirementModules[identifier].currentMC + "/" + requirementModules[identifier].totalMC);
	}
	mouseoverEffects();
	initializeSortable();
}

function toggleExpansion(moduleType) {
	if ($("#" + moduleType).hasClass("sem-expanded")) {
		noOfExpandedLists--;
		var temp = $("#" + moduleType);
		$("#" + moduleType).remove();
		if (noOfExpandedLists != 0) {
			temp.insertAfter("#" + $(".requirement-container .sem").get(noOfExpandedLists-1).id);
		} else {
			temp.prependTo(".requirement-container");
		}
		$("#" + moduleType).removeClass("sem-expanded");
		$("#" + moduleType + " ul").addClass("module-set-collapsed");
		$("#" + moduleType + " ul").removeClass("module-set");
		if (moduleType.length >  13) {
			$("#" + moduleType).css("height","50px");
		}
	} else {
		var temp = $("#" + moduleType);
		$("#" + moduleType).remove();
		if (noOfExpandedLists != 0) {
			temp.insertAfter("#" + $(".requirement-container .sem").get(noOfExpandedLists-1).id);
		} else {
			temp.prependTo(".requirement-container");
		}
		$("#" + moduleType + " ul").removeClass("module-set-collapsed");
		$("#" + moduleType + " ul").addClass("module-set");
		$("#" + moduleType).addClass("sem-expanded");
		if (moduleType.length >  13) {
			$("#" + moduleType).css("height","396px");
		}
		noOfExpandedLists++;
		initializeSortable();
		mouseoverEffects();
	}
	var requirementContainerWidth = (noOfExpandedLists + 1) * 230 + 40;
	$(".requirement-container").css("width", requirementContainerWidth + "px");
	var i = 0;
	listOrder = [];
	for (var identifier in requirementModules) {
		listOrder.push($(".requirement-container .sem").get(i).id);
		i++
	}
}

function loadUserSavedModules() {
	storage.load();
	userSavedModules = storage.get();
	for (var identifier in userSavedModules.chosenModules) {
		for (var i in userSavedModules.chosenModules[identifier]) {
			currentMod = userSavedModules.chosenModules[identifier][i];
			requirementModules[identifier].modules.push(currentMod);
		}
	}
}

function clean() {
	storage.clear();
	storage.save();
}

function clearStorage() {
	$("#myModalLabel").html("<div>Are you sure you want to clear all saved modules?</div>");
	$("#myModalBody").html('<button onClick="clean();initializeRequirementModules();" type="button" class="btn btn-default btn-sm" data-dismiss="modal">Yes</button>  <button type="button" class="btn btn-default btn-sm" data-dismiss="modal">No</button>');
}

function mouseoverEffects() {
	$(".module-small").mouseover(function() {
		$(this).css("color","white");
		$(this).css("height","48px");
	});
	$(".module-small").mouseout(function() {
		$(this).css("color","#1abc9c");
		$(this).css("height","24px");
	});
	$(".module").mouseover(function() {
		$(this).css("color","white");
		$(this).css("height","48px");
	});
	$(".module").mouseout(function() {
		$(this).css("color","#1abc9c");
		$(this).css("height","48px");
	});
	$(".selected").mouseover(function() {
		$(this).css("color","rgb(15,15,15)");
		$(this).css("height","48px");
	});
	$(".selected").mouseout(function() {
		$(this).css("color","rgb(235,235,235)");
		$(this).css("height","24px");
	});
}

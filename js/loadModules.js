var requirementModules = {};
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
		    displayModules();
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
	for (var identifier in requirementModules) {
		$(".requirement-container").append('<div class="mod-container"><div id = "' + identifier + '" class="sem"><div class="req-title" onClick="toggleExpansion(' + "'" + identifier + "'" + ');">' + requirementModules[identifier].name + '</div><ul class="module-set-collapsed"></ul><div class="sem-mcs">MC: 0' + '/' + requirementModules[identifier].totalMC + '</div></div></div>');
		for (var i in requirementModules[identifier].modules) {
			$("#" + identifier + " ul").removeClass("module-set-collapsed");
			$("#" + identifier + " ul").addClass("module-set");
			$("#" + identifier).addClass("sem-expanded");
			if (!requirementModules[identifier].modules[i].selected) {
				if (requirementModules[identifier].modules[i].highlighted) {
					$("#" + identifier + " .module-set").append('<li class="module-small highlighted" onClick = "updateModuleData(requirementModules.'+ identifier +'.modules['+ i +'],' + "'fromMod'" + ');" data-toggle="modal" data-target="#moduleModal">' + requirementModules[identifier].modules[i].Code + " " + requirementModules[identifier].modules[i].Name + '</li>');
				} else {
					$("#" + identifier + " .module-set").append('<li class="module-small" onClick = "updateModuleData(requirementModules.'+ identifier +'.modules['+ i +'],' + "'fromMod'" + ');" data-toggle="modal" data-target="#moduleModal">' + requirementModules[identifier].modules[i].Code + " " + requirementModules[identifier].modules[i].Name + '</li>');
				}
				
			}
		}
		$("#" + identifier + " .sem-mcs").html("MC: " + requirementModules[identifier].currentMC + "/" + requirementModules[identifier].totalMC);
	}

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
	initializeSortable();
}

function toggleExpansion(moduleType) {
	if ($(".mod-container #" + moduleType).hasClass("sem-expanded")) {
		$(".mod-container #" + moduleType).removeClass("sem-expanded");
		$(".mod-container #" + moduleType + " ul").addClass("module-set-collapsed");
		$(".mod-container #" + moduleType + " ul").removeClass("module-set");
	} else {
		$(".mod-container #" + moduleType + " ul").removeClass("module-set-collapsed");
		$(".mod-container #" + moduleType + " ul").addClass("module-set");
		$(".mod-container #" + moduleType).addClass("sem-expanded");
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

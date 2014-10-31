var requirementModules = {};

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
	for (var i in data) {
		var moduleType = data[i].moduleType;
		var identifier = moduleType.replace(/\s/g, '');
		if (!requirementModules.hasOwnProperty(identifier)) {
		if (identifier == "breadth") {identifier = "Breadth"}
		if (identifier == "depth") {identifier = "Depth"}
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
		data[i].Selected = false;
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

	var savedMod;
	for (var sem in userSavedModules) {
		for (var i in userSavedModules[sem].modules) {
			savedMod = userSavedModules[sem].modules[i];
			savedModLoc = findModule(savedMod.Code + " " + savedMod.Name);
			$("#" + sem + " .module-set").append('<li class="module" onClick = "updateModuleData(requirementModules.' + savedModLoc.moduleType + '.modules[' + savedModLoc.i + ']);" data-toggle="modal" data-target="#moduleModal">' + savedMod.Code + " " + savedMod.Name + '</li>');
			requirementModules[savedModLoc.moduleType].modules[savedModLoc.i].Selected = true;
			requirementModules[savedModLoc.moduleType].currentMC += parseInt(savedMod.Credit);
		}
		$("#" + sem + " .sem-mcs").html("MC: " + userSavedModules[sem].mcs);
	}

	for (var identifier in requirementModules) {
		$(".requirement-container").append('<div class="mod-container"><div id = "' + identifier + '" class="sem"><div class="sem-title">' + requirementModules[identifier].name + '</div><ul class="module-set"></ul><div class="sem-mcs">MC: 0' + '/' + requirementModules[identifier].totalMC + '</div></div></div>');
		for (var i in requirementModules[identifier].modules) {
			if (!requirementModules[identifier].modules[i].Selected) {
				if (requirementModules[identifier].modules[i].highlighted) {
					$("#" + identifier + " .module-set").append('<li class="module-small highlighted" onClick = "updateModuleData(requirementModules.'+ identifier +'.modules['+ i +']);" data-toggle="modal" data-target="#moduleModal">' + requirementModules[identifier].modules[i].Code + " " + requirementModules[identifier].modules[i].Name + '</li>');
				} else {
					$("#" + identifier + " .module-set").append('<li class="module-small" onClick = "updateModuleData(requirementModules.'+ identifier +'.modules['+ i +']);" data-toggle="modal" data-target="#moduleModal">' + requirementModules[identifier].modules[i].Code + " " + requirementModules[identifier].modules[i].Name + '</li>');
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

function loadUserSavedModules() {
	storage = new Storage();
	storage.load();
	userSavedModules = storage.get();
}

function clean() {
	storage = new Storage();
	userSavedModules = {
			sem1: {modules: [], mcs: 0},
			sem2: {modules: [], mcs: 0},
			sem3: {modules: [], mcs: 0},
			sem4: {modules: [], mcs: 0},
			sem5: {modules: [], mcs: 0},
			sem6: {modules: [], mcs: 0},
			sem7: {modules: [], mcs: 0},
			sem8: {modules: [], mcs: 0},
			course: "CEG",
			specialization: "None"
	};
	storage.clear();
	storage.save();
}

function clearStorage() {
	$("#myModalLabel").html("<div>Are you sure you want to clear all saved modules?</div>");
	$("#myModalBody").html('<button onClick="clean();initializeRequirementModules();" type="button" class="btn btn-default btn-sm" data-dismiss="modal">Yes</button>  <button type="button" class="btn btn-default btn-sm" data-dismiss="modal">No</button>');
}

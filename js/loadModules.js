var requirementModules = {};

(function initializeRequirementModules() {
	var degreeName = "Computer Engineering";
	var degreeCode = "CEG"
	var academicYear = "13/14"
	getRequirements(degreeCode, academicYear, function(data) {
		parseRequirements(data);
		getRequirementModules(degreeCode, function(data) {
	    parseModules(data);
	    loadModules();
  		});
	});
})();

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
		requirementModules[identifier].modules.push(data[i]);
	}
}

function loadModules() {
	$(".requirement-container").html("");
	for (var identifier in requirementModules) {
		$(".requirement-container").append('<div class="mod-container"><div id = "' + identifier + '" class="sem"><div class="sem-title">' + requirementModules[identifier].name + '</div><ul class="module-set"></ul><div class="sem-mcs">MC: 0</div></div></div>');
		var totalMC = 0;
		for (var i in requirementModules[identifier].modules) {
			//extensionLength = (Math.ceil(requirementModules[identifier].modules.length / 6)) * 200;
			//extensionPercentage = (Math.floor((requirementModules[identifier].modules.length - 1) / 6)) * 11 + 12.5;
			totalMC += parseInt(requirementModules[identifier].modules[i].Credit);
			requirementModules[identifier].currentMC = requirementModules[identifier].currentMC;
			//$("#" + identifier).parent().css("width", extensionPercentage + "%");
			//$("#" + identifier).css("min-width", extensionLength);
			$("#" + identifier + " .module-set").append('<li class="module-small" onClick = "updateModuleData(requirementModules.'+ identifier +'.modules['+ i +']);" data-toggle="modal" data-target="#moduleModal">' + requirementModules[identifier].modules[i].Code + " " + requirementModules[identifier].modules[i].Name + '</li>');
			$("#" + identifier + " .sem-mcs").html("MC: " + requirementModules[identifier].currentMC + "/" + requirementModules[identifier].totalMC);
		}
	}
	$(".module-small").mouseover(function() {
		$(this).css("color","white");
		$(this).css("height","48px");
	});
	$(".module-small").mouseout(function() {
		$(this).css("color","#1abc9c");
		$(this).css("height","24px");
	});
	initializeSortable();
	loadUserSavedModules();
}

function loadUserSavedModules() {
	storage = new Storage();
	storage.load();
	userSavedModules = storage.get();
	for (var sem in userSavedModules) {
		$("#" + sem + " .module-set").html("");
	}
	for (var moduleType in requirementModules) {
		requirementModules[moduleType].currentMC = 0;
	}
	initializeSortable();
	var savedMod;
	var identifier = 0;
	for (var sem in userSavedModules) {
		for (var i in userSavedModules[sem].modules) {
			savedMod = userSavedModules[sem].modules[i];
			savedModLoc = findModule(savedMod.Code + " " + savedMod.Name);
			$("#" + sem + " .module-set").append('<li class="module" onClick = "updateModuleData(requirementModules.' + savedModLoc.moduleType + '.modules[' + savedModLoc.i + ']);" data-toggle="modal" data-target="#moduleModal">' + savedMod.Code + " " + savedMod.Name + '</li>');
			for (var moduleType in requirementModules) {
				var uiList = $("#" + moduleType + " .module-set").children();
				for (var j = 0; j < uiList.length; j++) {
					var savedModFullName = savedMod.Code + " " + savedMod.Name;
					savedModFullname = savedModFullName.replace(/&amp;/g, '&');
					if ($(uiList[j]).html() == savedModFullname) {
						requirementModules[moduleType].currentMC += parseInt(savedMod.Credit);
						uiList[j].remove();
					}
				}
				$("#" + moduleType + " .sem-mcs").html("MC: " + requirementModules[moduleType].currentMC + "/" + requirementModules[moduleType].totalMC);
			}
		}
		$("#" + sem + " .sem-mcs").html("MC: " + userSavedModules[sem].mcs);
	}

	$(".module").mouseover(function() {
		$(this).css("color","white");
		$(this).css("height","48px");
	});
	$(".module").mouseout(function() {
		$(this).css("color","#1abc9c");
		$(this).css("height","48px");
	});
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
	$("#myModalBody").html('<button onClick="clean();loadModules();" type="button" class="btn btn-default btn-sm" data-dismiss="modal">Yes</button>  <button type="button" class="btn btn-default btn-sm" data-dismiss="modal">No</button>');
}

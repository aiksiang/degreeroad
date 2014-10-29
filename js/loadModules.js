(function initializeModules() {
	var degreeName;
	degreeName = "Computer Engineering";
	degreeCode = "CEG"
	getRequirements(degreeCode, function(data) {
    parseModules(data);
    loadModules();
  });
})();

var moduleList = {};

function parseModules(data) {
	for (var i in data) {
		var ModuleType = data[i].ModuleType;
		var identifier = ModuleType.replace(/\s/g, '');
		if (!moduleList.hasOwnProperty(identifier)) {
			moduleList[identifier] = {};
			moduleList[identifier].modules = [];
			moduleList[identifier].name = ModuleType;
			moduleList[identifier].currentMC = 0;
		}
		moduleList[identifier].modules.push(data[i]);
	}

}
function loadModules() {
	for (var identifier in moduleList) {
		$(".requirement-container").append('<div class="mod-container"><div id = "' + identifier + '" class="sem"><div class="sem-title">' + moduleList[identifier].name + '</div><ul class="module-set"></ul><div class="sem-mcs">MC: 0</div></div></div>');
		var totalMC = 0;
		for (var i in moduleList[identifier].modules) {
			extensionLength = (Math.ceil(moduleList[identifier].modules.length / 6)) * 200;
			extensionPercentage = (Math.floor((moduleList[identifier].modules.length - 1) / 6)) * 11 + 12.5;
			totalMC += parseInt(moduleList[identifier].modules[i].Credit);
			moduleList[identifier].totalMC =  totalMC;
			moduleList[identifier].currentMC = moduleList[identifier].currentMC;
			$("#" + identifier).parent().css("width", extensionPercentage + "%");
			$("#" + identifier).css("min-width", extensionLength);
			$("#" + identifier + " .module-set").append('<li class="module" onClick = "updateModuleData(moduleList.'+ identifier +'.modules['+ i +']);" data-toggle="modal" data-target="#moduleModal">' + moduleList[identifier].modules[i].Code + " " + moduleList[identifier].modules[i].Name + '</li>');
			$("#" + identifier + " .sem-mcs").html("MC: " + moduleList[identifier].currentMC + "/" + moduleList[identifier].totalMC);
		}
	}
	$(".module").mouseover(function() {
		$(this).css("color","white");
	});
	$(".module").mouseout(function() {
		$(this).css("color","#1abc9c");
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
	for (var moduleType in moduleList) {
		moduleList[moduleType].currentMC = 0;
	}
	initializeSortable();
	var savedMod;
	var identifier = 0;
	for (var sem in userSavedModules) {
		for (var i in userSavedModules[sem].modules) {
			savedMod = userSavedModules[sem].modules[i];
			savedModLoc = findModule(savedMod.Code + " " + savedMod.Name);
			$("#" + sem + " .module-set").append('<li class="module" onClick = "updateModuleData(moduleList.' + savedModLoc.moduleType + '.modules[' + savedModLoc.i + ']);" data-toggle="modal" data-target="#moduleModal">' + savedMod.Code + " " + savedMod.Name + '</li>');
			for (var moduleType in moduleList) {
				var uiList = $("#" + moduleType + " .module-set").children();
				for (var j = 0; j < uiList.length; j++) {
					var savedModFullName = savedMod.Code + " " + savedMod.Name;
					savedModFullname = savedModFullName.replace(/&amp;/g, '&');
					if ($(uiList[j]).html() == savedModFullname) {
						moduleList[moduleType].currentMC += parseInt(savedMod.Credit);
						uiList[j].remove();
					}
				}
				$("#" + moduleType + " .sem-mcs").html("MC: " + moduleList[moduleType].currentMC + "/" + moduleList[moduleType].totalMC);
			}
		}
		$("#" + sem + " .sem-mcs").html("MC: " + userSavedModules[sem].mcs);
	}
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

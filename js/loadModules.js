(function initializeModules() {
	var degreeName;
	degreeName = "Computer Engineering";
	getRequirements(degreeName, function(data) {
    parseModules(data);
    loadModules();
  });
})();

var moduleList = {};

function parseModules(data) {
	for (var i in data) {
		var moduleType = data[i].moduleType;
		var identifier = moduleType.replace(/\s/g, '');
		if (!moduleList.hasOwnProperty(identifier)) {
			moduleList[identifier] = {};
			moduleList[identifier].modules = [];
			moduleList[identifier].name = moduleType;
		}
		moduleList[identifier].modules.push({
			module: data[i].Code + " " + data[i].Name,
			modularCredits: data[i].Credit
			});
	}
}
function loadModules() {
	for (var identifier in moduleList) {
		$(".requirement-container").append('<div class="mod-container"><div id = "' + identifier + '" class="sem"><div class="sem-title">' + moduleList[identifier].name + '</div><ul class="module-set"></ul><div class="sem-mcs">MC: 0</div></div></div>');
		var totalMC = 0;
		for (var i in moduleList[identifier].modules) {
			extensionLength = (Math.ceil(moduleList[identifier].modules.length / 6)) * 200;
			extensionPercentage = (Math.floor(moduleList[identifier].modules.length / 6)) * 11 + 12.5;
			totalMC += parseInt(moduleList[identifier].modules[i].modularCredits);
			moduleList[identifier].totalMC =  totalMC;
			$("#" + identifier).parent().css("width", extensionPercentage + "%");
			$("#" + identifier).css("min-width", extensionLength);
			$("#" + identifier + " .module-set").append('<li class="module">' + moduleList[identifier].modules[i].module + '</li>');
			$("#" + identifier + " .sem-mcs").html("MC: " + totalMC);
		}
	}
	initializeSortable();
}

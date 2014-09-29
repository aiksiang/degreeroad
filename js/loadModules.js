(function initializeModules() {
	var degreeName;
	degreeName = "Computer Engineering";
  	getModules(degreeName, function(data) {
    parseModules(data);
    loadModules();
  });
})();

var moduleList = {};

function parseModules(data) {
	for (var i in data) {
		if (!moduleList.hasOwnProperty(data[i].moduleType)) {
			moduleList[data[i].moduleType] = {};
			moduleList[data[i].moduleType].modules = [];
		}
		moduleList[data[i].moduleType].modules.push({
			module: data[i].moduleCode + " " + data[i].moduleTitle,
			modularCredits: data[i].modularCredits
			});
	}
}
function loadModules() {
	for (var moduleType in moduleList) {
		var id = moduleType.replace(/\s/g, '');
		$(".requirement-container").append('<div class="mod-container"><div id = "' + id + '" class="sem"><div class="sem-title">' + moduleType + '</div><ul class="module-set"></ul><div class="sem-mcs">MC: 0</div></div></div>');
		var totalMC = 0;
		for (var i in moduleList[moduleType].modules) {
			extensionLength = (Math.ceil(moduleList[moduleType].modules.length / 6)) * 200;
			extensionPercentage = (Math.floor(moduleList[moduleType].modules.length / 6)) * 11 + 12.5;
			totalMC += parseInt(moduleList[moduleType].modules[i].modularCredits);
			moduleList[moduleType].totalMC =  totalMC;
			$("#" + id).parent().css("width", extensionPercentage + "%");
			$("#" + id).css("min-width", extensionLength);
			$("#" + id + " .module-set").append('<li class="module">' + moduleList[moduleType].modules[i].module + '</li>');
			$("#" + id + " .sem-mcs").html("MC: " + totalMC);
		}

		(function(id,moduleType) {
			$("#" + id).droppable({
				drop: function(event,ui){
					var currentMC = moduleList[moduleType].totalMC;
					var module = findModule(ui.draggable.html());
					//insertion
					if (listFrom != "" && listFrom != id) {
						currentMC += parseInt(moduleList[module.moduleType].modules[module.i].modularCredits);
						$("#" + id + " .sem-mcs").html("MC: " + currentMC);
						moduleList[moduleType].totalMC = currentMC;
					}
					//removal
					if (isNaN(listFrom) && listFrom != "") {
						currentMC = moduleList[listFromWithSpace].totalMC;
						currentMC -= parseInt(moduleList[module.moduleType].modules[module.i].modularCredits);
						$("#" + listFrom + " .sem-mcs").html("MC: " + currentMC);
						moduleList[listFromWithSpace].totalMC = currentMC;
					} else if (!isNaN(listFrom) && listFrom != "") {
						currentMC = semInfo["sem" + listFrom].mcs;
						currentMC -= parseInt(moduleList[module.moduleType].modules[module.i].modularCredits);
						$("#sem" + listFrom + " .sem-mcs").html("MC: " + currentMC);
						semInfo["sem" + listFrom].mcs = currentMC;
						var index = semInfo["sem" + listFrom].modules.indexOf(ui.draggable.html());
			            if (index != -1){
			              semInfo["sem" + listFrom].modules.splice(index,1);
			            }
					}
					listFrom = "";
				},
				out: function(event,ui){
					if (listFrom == "") {
						listFrom = id;
						listFromWithSpace = moduleType;
					}
				}
	    	});
		})(id,moduleType);
	}
	initializeSortable();
}
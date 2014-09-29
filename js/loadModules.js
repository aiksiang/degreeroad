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
			moduleList[data[i].moduleType] = [];
		}
		moduleList[data[i].moduleType].push(data[i].moduleCode + " " + data[i].moduleTitle);
	}
}

function loadModules() {
	for (var moduleType in moduleList) {
		var id = moduleType.replace(/\s/g, '');
		$(".requirement-container").append('<div class="mod-container"><div id = "' + id + '" class="sem"><div class="sem-title">' + moduleType + '</div><ul class="module-set"></ul></div></div>');
		for (var i in moduleList[moduleType]) {
			extensionLength = (Math.ceil(moduleList[moduleType].length / 6)) * 200;
			$("#" + id).css("min-width", extensionLength);
			$("#" + id + " .module-set").append('<li class="module">' + moduleList[moduleType][i] + '</li>');
		}
	}
	initializeSortable();
}
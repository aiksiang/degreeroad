var specializationList;
var specializationMods;

(function initializeSpecializationList(){
	var degreeCode = "CEG";
	getSpecializations(degreeCode, function(data){
		specializationList = data;
		specializationList.push({coursecode: degreeCode, specialization: "None"});
	});
})();

$('.specialization').on('show.bs.dropdown', function () {
	$(".spec-drop").empty();
	for (var i = 0; i < specializationList.length; i++) {
		var Specialization = specializationList[i].specialization;
		$(".spec-drop").append('<li class="specialization-list" onClick="selectSpecialization(' + "'" + removeSpaces(specializationList[i].specialization) + "'" + ');">' + Specialization + '</li>');
	}
});

function checkSpecializationFulfillment() {
	if (userSavedModules.specialization != "None") {
		var breadthfulfiled = 0;
		var depthfulfilled = 0;
		for (var moduleType in requirementModules) {
			if (moduleType == "Breadth" || moduleType == "Depth") {
				for (var j in requirementModules[moduleType].modules) {
					for (var i in specializationMods) {
						if (requirementModules[moduleType].modules[j].Code == specializationMods[i].Code) {
							if (specializationMods[i].ModuleType == "breadth" && requirementModules[moduleType].modules[j].selected) {
								breadthfulfiled += parseInt(specializationMods[i].Credit);
							} else if (specializationMods[i].ModuleType == "depth" && requirementModules[moduleType].modules[j].selected) {
								depthfulfilled += parseInt(specializationMods[i].Credit);
							}
						}
					}
				}
			}
		}
		$("#specialization-breadth").html("Breadth: " + breadthfulfiled + "/" + requirementModules.Breadth.totalMC);
		$("#specialization-depth").html("Depth: " + depthfulfilled + "/" + requirementModules.Depth.totalMC);
		if (breadthfulfiled >= requirementModules.Breadth.totalMC) {
			$("#specialization-breadth").css("color", "rgb(0, 237, 255)");
		} else {
			$("#specialization-breadth").css("color", "white");
		}
		if (depthfulfilled >= requirementModules.Depth.totalMC) {
			$("#specialization-depth").css("color", "rgb(0, 237, 255)");
		} else {
			$("#specialization-depth").css("color", "white");
		}
		if (breadthfulfiled >= requirementModules.Breadth.totalMC &&
			depthfulfilled >= requirementModules.Depth.totalMC) {
			$(".specialization a").css("color", "rgb(43, 234, 140)");
		} else {
			$(".specialization a").css("color", "white");
		}
	} else {
		$("#specialization-breadth").html("");
		$("#specialization-depth").html("");
	}
}

function selectSpecialization(specialization) {
	var i;
	for (var i = 0; i < specializationList.length; i++) {
		if (removeSpaces(specializationList[i].specialization) == specialization) {
			break;
		}
	}
	if (specialization != "None") {
		$("#specialization-name").html(specializationList[i].specialization + " " + '<span class="glyphicon glyphicon-chevron-down"></span>');
		getSpecializationModules(specializationList[i].specialization, function(data){
			specializationMods = data;
			$(".requirement-container").html("");
			for (var moduleType in requirementModules) {
				for (var j in requirementModules[moduleType].modules) {
					requirementModules[moduleType].modules[j].highlighted = false;
				}
				for (var j in requirementModules[moduleType].modules) {
					for (var i in specializationMods) {
						if (requirementModules[moduleType].modules[j].Code == specializationMods[i].Code) {
							requirementModules[moduleType].modules[j].highlighted = true;
						}
					}
				}
			}

			//Refresh highlighted state in sem
			for (var sem in userSavedModules) {
				for (var i in userSavedModules[sem].modules) {
					var modLoc = findModule(userSavedModules[sem].modules[i].Code + " " + userSavedModules[sem].modules[i].Name);
						for (var child = 0; child < $("#" + sem + " .module-set").children().length; child++) {
							if ($("#" + sem + " .module-set").children()[child].lastChild.data == userSavedModules[sem].modules[i].Code + " " + userSavedModules[sem].modules[i].Name) {
								if (requirementModules[modLoc.moduleType].modules[modLoc.i].highlighted == true) {
									$("#" + sem + " .module-set").find($("#" + sem + " .module-set").children()[child]).addClass("highlighted");
								} else {
									$("#" + sem + " .module-set").find($("#" + sem + " .module-set").children()[child]).removeClass("highlighted");
								}
							}
						}
				}
			}

			displayRequirements();
		});
		userSavedModules.specialization = specialization;
		storage.put(userSavedModules);
		storage.save();
	} else {
		$(".specialization a").html("Specialization" + ' <span class="glyphicon glyphicon-chevron-down"></span>');
		for (var moduleType in requirementModules) {
			if (moduleType == "Breadth" || moduleType == "Depth") {
				for (var j in requirementModules[moduleType].modules) {
					requirementModules[moduleType].modules[j].highlighted = false;
				}
			}
		}
		userSavedModules.specialization = specialization;
		storage.put(userSavedModules);
		storage.save();
		displayRequirements();
	}
}

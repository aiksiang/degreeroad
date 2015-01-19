function listView() {
	$(".sortable-view-icon").parent().removeClass("active");
	$(".list-view-icon").parent().addClass("active");
	$(".sortable-view-semester").fadeOut(100, function() {
		$(".list-view-semester").fadeIn(100);
	});
	$(".sortable-view-requirement").fadeOut(100, function() {
		$(".list-view-requirement").fadeIn(100);
	});
	$(".requirement").css("height", "inherit");
	
	loadSemModulesIntoList();
	loadReqModulesIntoList();
}
function sortableView() {
	$(".sortable-view-icon").parent().addClass("active");
	$(".list-view-icon").parent().removeClass("active");
	$(".list-view-requirement").fadeOut(100, function() {
		$(".sortable-view-requirement").fadeIn(100);
	});
	$(".list-view-semester").fadeOut(100, function() {
		$(".sortable-view-semester").fadeIn(100);
	});
	$(".requirement").css("height", "440px");
}



function loadSemModulesIntoList() {
	$(".list-view-semester table").html("");
	year = 0;
	var CAP = 0.0;
	for (var sem in userSavedModules) {
		if (sem.indexOf("sem") >= 0) {
			i = parseInt(sem.substr(3,1));
			year = Math.floor((i-1) / semestersInAYear) + 1;
			var semester = ((i-1) % semestersInAYear) + 1;
			$(".list-view-semester table").append("<thead><tr><td colspan='5'>Year " + year + " Sem "+ semester + "</td></tr></thead><tbody id='table-sem-" + i + "'></tbody>");

			for (var modNo in userSavedModules[sem].modules) {
				var module = userSavedModules[sem].modules[modNo];
				$("#table-sem-" + i).append("<tr><td>" + module.Code + "</td><td>" + module.Name + "</td><td>" + module.Credit + " MCs</td><td>" + module.ModuleType + "</td><td>" + ((module.Grade==undefined)?"-":module.Grade) + "</td></tr>");
			}
			$("#table-sem-" + i).append("<tr style='color:white'><td>Total</td><td></td><td>" + userSavedModules[sem].mcs + " MCs</td><td></td><td>CAP: " + CAP + "</td></tr>");
		}
	}
}

function loadReqModulesIntoList() {
	$(".list-view-requirement table").html("");
	for (var moduleType in requirementModules) {
		$(".list-view-requirement table").append("<thead><tr><td colspan='5'>" + requirementModules[moduleType].name + "</td></tr></thead><tbody id='table-" + moduleType + "'></tbody>");

		for (var modNo in requirementModules[moduleType].modules) {
			var module = requirementModules[moduleType].modules[modNo];
			if (module.highlighted) {
				if (module.selected) {
					$("#table-" + moduleType).prepend("<tr class='list-view-table-selected list-view-table-highlighted'><td>" + module.Code + "</td><td>" + module.Name + "</td><td>" + module.Credit + " MCs</td><td>" + module.ModuleType + "</td><td></td></tr>");
				} else {
					$("#table-" + moduleType).prepend("<tr class='list-view-table-highlighted'><td>" + module.Code + "</td><td>" + module.Name + "</td><td>" + module.Credit + " MCs</td><td>" + module.ModuleType + "</td><td></td></tr>");
				}
			} else {
				if (requirementModules[moduleType].name == "Breadth" || requirementModules[moduleType].name == "Depth") {continue;}
				if (module.selected) {
					$("#table-" + moduleType).append("<tr class='list-view-table-selected'><td>" + module.Code + "</td><td>" + module.Name + "</td><td>" + module.Credit + " MCs</td><td>" + module.ModuleType + "</td><td></td></tr>");
				} else {
					$("#table-" + moduleType).append("<tr><td>" + module.Code + "</td><td>" + module.Name + "</td><td>" + module.Credit + " MCs</td><td>" + module.ModuleType + "</td><td></td></tr>");
				}
			}
		}
		$("#table-" + moduleType).append("<tr style='color:white'><td>Total</td><td></td><td>" + requirementModules[moduleType].currentMC + "/" + requirementModules[moduleType].totalMC +" MCs</td><td></td><td></td></tr>");



	}
}
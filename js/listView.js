function listView() {
	$(".sortable-view-icon").parent().removeClass("active");
	$(".list-view-icon").parent().addClass("active");
	$(".sortable-view-semester").fadeOut(100, function() {
		$(".list-view-semester").fadeIn(100);
	});
	$(".requirement-container").fadeOut(200);
	
	loadModulesIntoList();
}
function sortableView() {
	$(".sortable-view-icon").parent().addClass("active");
	$(".list-view-icon").parent().removeClass("active");
	$(".requirement-container").fadeIn(200);
	$(".list-view-semester").fadeOut(100, function() {
		$(".sortable-view-semester").fadeIn(100);
	});
}



function loadModulesIntoList() {
	$(".list-view-semester table").html("");
	year = 0;
	for (var sem in userSavedModules) {
		if (sem.indexOf("sem") >= 0) {
			i = parseInt(sem.substr(3,1));
			year = Math.floor((i-1) / semestersInAYear) + 1;
			var semester = ((i-1) % semestersInAYear) + 1;
			$(".list-view-semester table").append("<thead><tr><td colspan='4'>Year " + year + " Sem "+ semester + "</td></tr></thead><tbody id='table-sem-" + i + "'></tbody>");

			for (var modNo in userSavedModules[sem].modules) {
				module = userSavedModules[sem].modules[modNo];
				$("#table-sem-" + i).append("<tr><td>" + module.Code + "</td><td>" + module.Name + "</td><td>" + module.Credit + " MCs</td><td>" + module.ModuleType + "</td></tr>");
			}
			$("#table-sem-" + i).append("<tr style='color:white'><td>Total</td><td></td><td>" + userSavedModules[sem].mcs + " MCs</td><td></td></tr>");
		}
	}
}

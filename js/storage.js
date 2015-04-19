function saveStorage(location) {
	localStorage[location] = JSON.stringify(userSavedModules);
}

function loadStorage(location) {
	userSavedModules = JSON.parse(localStorage[location]);
	traverseSelectedModules(function(mod,sem) {
		var id = lookupModule(mod.Code);
		var identifier;
		var title;
		if (id != undefined) {
			identifier = "requirementModule" + id;
			title = mod.Code + " " + mod.Name;
		} else {
			identifier = "notFound" + mod.Code;
			title = mod.Code;
		}
		$("#semester" + sem.substring(8) + " .module-list").append('<a id="' + identifier + '" class="item module">' + title + '</a>');
	});
}

function clearStorage(location) {
	var defaultUserSavedModules = {};
	for (var i = 1; i <= noOfSems; i++) {
		defaultUserSavedModules["semester" + i] = {};
		defaultUserSavedModules["semester" + i].modules = [];
		defaultUserSavedModules["semester" + i].mcs = 0;
	}
	defaultUserSavedModules.currentDegree = null;
	defaultUserSavedModules.currentSecondDegree = null;
	defaultUserSavedModules.chosenModules = {};
	localStorage[location] = JSON.stringify(defaultUserSavedModules);
}

$("#loadData").popup({
	content: "Load Previous Plan",
	position: "bottom right"
});

$("#clearData").popup({
	content: "Delete Save File",
	position: "bottom right"
});

function initalizeLoadData() {
	$("#loadData").click(function() {
		loadStorage("user");
		currentDegree = userSavedModules.currentDegree;
		currentSecondDegree = userSavedModules.currentSecondDegree;
		$('#course-selection .text').html(currentDegree);
		if (currentSecondDegree == null)
			$('#second-course-selection .text').html("+");
		else
			$('#second-course-selection .text').html(currentSecondDegree);

		chooseDegree();
		InitializeModalsTrigger();
		for (var i = 1; i <= noOfSems; i++) {
			$("#semester" + i + " .ui.bottom.right.label").html("MCs: " + userSavedModules["semester" + i].mcs);
		}
		$("#loadData").off('click');
		$("#loadData").addClass("iconNoHover");
		$("#loadData").popup("destroy");
	});
}
initalizeLoadData();

$("#clearData").click(function() {
	clearStorage("user");
	for (var i = 1; i <= noOfSems; i++) {
		$("#semester" + i + " .module-list").html("");
		$("#semester" + i + " .ui.bottom.right.label").html("MCs: 0");
	}
	loadStorage("user");
	currentDegree = null;
	currentSecondDegree = null;
	chooseDegree();
	requirementSpecification.html("");
	$('#second-course-selection .text').html("+");
	$('#course-selection .text').html("Course");
	$('#course-selection .item').removeClass("active").removeClass("selected");
	$('#second-course-selection .item').removeClass("active").removeClass("selected");
	$("#requirementModules .ui.bottom.right.label").html("0/0");
	$("#requirement-specification .ui.bottom.right.label").html("0/0");
	InitializeModalsTrigger();
});


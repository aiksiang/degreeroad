var removeClone = true;
var passedModule = null;

$("#semester-container .module-list").sortable({
	connectWith: ".module-list",
	items: ".module, .module-small:not(.selected)",
	dropOnEmpty: true,
	forcePlaceholderSize: true,
	placeholder: "item module-placeholder",
	revert: 200,
	delay: 150,
	scroll: true,
	helper: "clone",
	appendTo: "body",
	cursor: "-webkit-grabbing",
	remove: function(event,ui) {
		var removedFrom = $($(this)[0].parentNode).parent().attr('id');
		var moduleCode;

		if (ui.item.attr('id').indexOf("requirementModule") >= 0) {
			var module;
			var itemLocation;
			itemLocation = ui.item.attr('id').substring(17);
			module = allModuleList[itemLocation];
			moduleCode = module.Code;
			for (var i in userSavedModules[removedFrom].modules) {
				if (userSavedModules[removedFrom].modules[i].Code == moduleCode) {
					passedModule = userSavedModules[removedFrom].modules[i];
					userSavedModules[removedFrom].modules.splice(i, 1);
					userSavedModules[removedFrom].mcs -= parseInt(allModuleList[itemLocation].Credit);
					updateMC(removedFrom, userSavedModules[removedFrom].mcs);
				}
			}
		} else {
			moduleCode = ui.item.attr('id').substring(8);
			for (var j in userSavedModules[removedFrom].modules) {
				if (userSavedModules[removedFrom].modules[j].Code == moduleCode) {
					userSavedModules[removedFrom].modules.splice(j, 1);
				}
			}
		}
	},
	receive: function(event,ui) {
		removeClone = false;
		var receivedBy = $($(this)[0].parentNode).parent().attr('id');
		var module;

		if (ui.item.attr('id').indexOf("requirementModule") >= 0) {
			var itemLocation;
			itemLocation = ui.item.attr('id').substring(17);
			waitForPassedModule(function() {
				if (passedModule != null && passedModule != "fromList") {
					module = passedModule;
				} else {
					var moduleFromList = allModuleList[itemLocation];
					module = {};
					module.Code = moduleFromList.Code;
					module.Name = moduleFromList.Name;
					module.Credit = moduleFromList.Credit;
					module.acadYear = moduleFromList.acadYear;
					module.Description = moduleFromList.Description;
					module.Examdate = moduleFromList.Examdate;
					module.Faculty = moduleFromList.Faculty;
					module.Preclude = moduleFromList.Preclude;
					module.Prereq = moduleFromList.Prereq;
					module.Semester = moduleFromList.Semester;
					module.declaration = currentSelectedRule;
				}
				userSavedModules[receivedBy].modules.push(module);
				userSavedModules[receivedBy].mcs += parseInt(allModuleList[itemLocation].Credit);
				updateMC(receivedBy, userSavedModules[receivedBy].mcs);
			});
		} else {
			waitForPassedModule(function() {
				if (passedModule != null && passedModule != "fromList") {
					module = passedModule;
				} else {
					module = {};
					module.Code = ui.item.attr('id').substring(8);
					module.Name = "";
					module.Credit = 0;
					module.acadYear = "";
					module.Description = "";
					module.Examdate = "";
					module.Faculty = "";
					module.Preclude = "";
					module.Prereq = "*";
					module.Semester = "";
					module.declaration = currentSelectedRule;
				}
				userSavedModules[receivedBy].modules.push(module);
			});
		}
		checkRequirementsAndColorize();
	},
	update: function(event, ui) {
		waitForPassedModule(function() {
			saveStorage("user");
		});
		// console.log($(ui.sender).parent());
		// displayRequirements();
		// storage.put(userSavedModules);
		// storage.save();
	}
});

$("#requirementModules .module-list").sortable({
	connectWith: ".module-list",
	items: ".module:not(.selectedModule)",
	dropOnEmpty: true,
	forcePlaceholderSize: true,
	placeholder: "blank-placeholder",
	revert: 200,
	delay: 150,
	scroll: true,
	appendTo: "body",
	cursor: "-webkit-grabbing",
	helper: function(event, li) {
		copyHelper = li.clone();
		copyHelper.attr("id", li.attr("id") + "clone");
		copyHelper.insertAfter(li);
		return li.clone();
	},
	receive: function(e,ui) {
		removeClone = true;
		$("#" + ui.item.attr("id")).remove();
		$("#" + ui.item.attr("id") + "clone").attr("id", ui.item.attr("id")).removeClass("selectedModule").removeClass("greenModule").removeClass("greyModule");
		checkRequirementsAndColorize();
	},
	remove: function() {
		passedModule = "fromList";
	},
	stop: function(e,ui) {
		if (removeClone) {
			e.preventDefault();
			$("#" + ui.item.attr("id") + "clone").remove();
		}
		removeClone = true;
	},
	update: function(event, ui) {
		InitializeModalsTrigger();
		//colorizeRequirementModuleList(colorCode);
		// showAll();
		//console.log($(ui.sender).parent());
		// displayRequirements();
		// storage.put(userSavedModules);
		// storage.save();
	}
});

function checkRequirementsAndColorize() {
	//var colorCode = checkRequirement();
	//colorizeRequirementModuleList(colorCode);
	waitForAllParsingDone(function() {
		var colorCodes = checkRequirements();
		colorizeRequirements(colorCodes);
		colorizeSemesters(colorCodes);
	});
}

//$(".module-list").sortable("refresh");

function showNotice(text) {
	$('.noticeAlert.modal').modal('show');
	$('.noticeAlert .content').html(text);
}

function updateMC(identifier, mc) {
	$("#" + identifier + " .ui.bottom.right.attached.label").html("MCs: " + mc);
}

//for debugging
function showAll() {
	for (var i in userSavedModules) {
		if (i.indexOf("semester") >= 0) {console.log(i);
			for (var j in userSavedModules[i].modules) {
				console.log(userSavedModules[i].modules[j]);
			}
			console.log("MCs: " + userSavedModules[i].mcs);
		}
	}
}

function waitForPassedModule(fn) {
	var busyWaiting = setInterval(function () {
		if (passedModule != undefined) {
			fn();
			clearInterval(busyWaiting);
		} else {
			console.log("Wait for passing of module");
		}
	},1);
}
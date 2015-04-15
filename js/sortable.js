var removeClone = true;

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
		var itemLocation;

		if (ui.item.attr('id').indexOf("requirementModule") >= 0) {
			itemLocation = ui.item.attr('id').substring(17);
		} else {
			moduleCode = ui.item.attr('id').substring(8);console.log(moduleCode)
		}

		if (itemLocation != null) {
			var index = userSavedModules[removedFrom].modules.indexOf(allModuleList[itemLocation]);
			if (index >= 0) {
				userSavedModules[removedFrom].modules.splice(index, 1);
				userSavedModules[removedFrom].mcs -= parseInt(allModuleList[itemLocation].Credit);
				updateMC(removedFrom, userSavedModules[removedFrom].mcs);
			} else {
				console.log("Error: Unable to remove module, module not found");
			}
		} else {
			console.log("Warning: Module is not found in database");
			var module = {};
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
			for (var j in userSavedModules[removedFrom].modules) {
				if (userSavedModules[removedFrom].modules[j].Code == module.Code) {
					userSavedModules[removedFrom].modules.splice(j, 1);
				}
			}
		}
	},
	receive: function(event,ui) {
		removeClone = false;
		var receivedBy = $($(this)[0].parentNode).parent().attr('id');
		var itemLocation;

		if (ui.item.attr('id').indexOf("requirementModule") >= 0) {
			itemLocation = ui.item.attr('id').substring(17);
		} else {
			itemLocation = null;
		}
		
		if (itemLocation != null) {
			userSavedModules[receivedBy].modules.push(allModuleList[itemLocation]);
			userSavedModules[receivedBy].mcs += parseInt(allModuleList[itemLocation].Credit);
			updateMC(receivedBy, userSavedModules[receivedBy].mcs);
		} else {
			console.log("Warning: Module is not found in database");
			var module = {};
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
			userSavedModules[receivedBy].modules.push(module);
		}
		checkRequirementsAndColorize();
	},
	update: function(event, ui) {
		// showAll();
		//console.log($(ui.sender).parent());
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
		$("#" + ui.item.attr("id") + "clone").attr("id", ui.item.attr("id")).removeClass("selectedModule");
		checkRequirementsAndColorize();
	},
	stop: function(e,ui) {
		if (removeClone) {
			e.preventDefault();
			$("#" + ui.item.attr("id") + "clone").remove();
		}
		removeClone = true;
	},
	update: function(event, ui) {
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
			console.log("MCs: " + userSavedModules[i].mcs)
		}
	}
}
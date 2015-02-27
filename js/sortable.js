var initializeSortable = function(){
	$(".module-list").sortable({
		connectWith: ".module-list",
		items: ".module, .module-small:not(.selected)",
		dropOnEmpty: true,
		forcePlaceholderSize: true,
		placeholder: "item module-placeholder",
		revert: 200,
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
				console.log("Module is not found in database");
			}

			if (removedFrom != undefined) {
				if (removedFrom.indexOf("semester") >= 0) { //semester removes a mod
					var index = userSavedModules[removedFrom].modules.indexOf(allModuleList[itemLocation]);
					if (index >= 0) {
						userSavedModules[removedFrom].modules.splice(index, 1);
						userSavedModules[removedFrom].mcs -= parseInt(allModuleList[itemLocation].Credit);
						updateMC(removedFrom, userSavedModules[removedFrom].mcs);
						//TODO Unselect module in requirements
					} else {
						console.log("Unable to remove module, module not found");
					}
				} else { //something else removes a mod

				}
			} else {
				console.log("Module does not exist in list");
			}
		},
		receive: function(event,ui) {
			var receivedBy = $($(this)[0].parentNode).parent().attr('id');
			var itemLocation;

			if (ui.item.attr('id').indexOf("requirementModule") >= 0) {
				itemLocation = ui.item.attr('id').substring(17);
			} else {
				console.log("Module is not found in database");
			}
			
			if (receivedBy != undefined) {
				if (receivedBy.indexOf("semester") >= 0) { //semester receives a mod
					userSavedModules[receivedBy].modules.push(allModuleList[itemLocation]);
					userSavedModules[receivedBy].mcs += parseInt(allModuleList[itemLocation].Credit);
					updateMC(receivedBy, userSavedModules[receivedBy].mcs);
					//TODO Select module in requirements
				} else { //something else receives a mod

				}
			} else {
				console.log("module does not exist in list");
			}
		},
		update: function(event, ui) {
			showAll();
			//console.log($(ui.sender).parent());
			// displayRequirements();
			// storage.put(userSavedModules);
			// storage.save();
		}
	});
}

initializeSortable();

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
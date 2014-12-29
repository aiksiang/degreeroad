var requirementModules = {};
var noOfExpandedLists = 0;
var listOrder = [];
storage = new Storage();

function initializeRequirementModules() {
	var degreeName = "Computer Engineering";
	var degreeCode = "CEG"
	var academicYear = "13/14"
	getRequirements(degreeCode, academicYear, function(data) {
		parseRequirements(data);
		getRequirementModules(degreeCode, function(data) {
		    parseModules(data);
		    loadUserSavedModules();
		    selectSpecialization(userSavedModules.specialization);
  		});
	});
};
initializeRequirementModules();

function parseRequirements(data) {
	requirementModules = {};
	for (var i in data) {
		var moduleType = data[i].moduleType;
		var identifier = moduleType.replace(/\s/g, '');
		if (!requirementModules.hasOwnProperty(identifier)) {
			requirementModules[identifier] = {};
			requirementModules[identifier].modules = [];
			requirementModules[identifier].name = moduleType;
			requirementModules[identifier].currentMC = 0;
			requirementModules[identifier].totalMC = data[i].modularCredit;
		}
	}
}

function parseModules(data) {
	for (var i in data) {
		var ModuleType = data[i].ModuleType;
		var identifier = ModuleType.replace(/\s/g, '');
		data[i].selected = false;
		requirementModules[identifier].modules.push(data[i]);
	}
}

function loadUserSavedModules() {
	storage.load();
	userSavedModules = storage.get();
	for (var moduleType in userSavedModules.chosenModules) {
		for (var i in userSavedModules.chosenModules[moduleType]) {
			var currentModule = userSavedModules.chosenModules[moduleType][i];
			prevModLoc = findModule(currentModule.Code + " " + currentModule.Name);
			requirementModules[moduleType].modules.push(currentModule);
			if (prevModLoc != undefined){
				requirementModules[prevModLoc.moduleType].modules.splice(prevModLoc.i,1);
			}
		}
	}
	for (var moduleType in requirementModules) {
		requirementModules[moduleType].currentMC = 0;
	}
	var savedMod;
	for (var sem in userSavedModules) {
		$("#" + sem + " .module-set").html("");
		for (var i in userSavedModules[sem].modules) {
			savedMod = userSavedModules[sem].modules[i];
			var savedModLoc = findModule(savedMod.Code + " " + savedMod.Name);
			$("#" + sem + " .module-set").append('<li class="module" onClick = "updateModuleData(' + "'" + savedMod.Code + " " + savedMod.Name + "'" + ',' + "'" + "fromSem" + "'" + ');" data-toggle="modal" data-target="#moduleModal"><span class="modMC">' + savedMod.Credit + '</span>' + savedMod.Code + " " + savedMod.Name + '</li>');
			requirementModules[savedModLoc.moduleType].modules[savedModLoc.i].selected = true;
			requirementModules[savedModLoc.moduleType].currentMC += parseInt(savedMod.Credit);
		}
		$("#" + sem + " .sem-mcs").html("MC: " + userSavedModules[sem].mcs);
	}
}

function displayRequirements() {
	$(".requirement-container").html("");

	if (listOrder.length == 0) {
		for (var moduleType in requirementModules) {
			listOrder.push(moduleType);
		}
		for (var i in listOrder) {
			var moduleType = listOrder[i];
			if (requirementModules[moduleType].currentMC >= requirementModules[moduleType].totalMC) {
				if (!(moduleType == "Program Requirement" || moduleType == "Depth" || moduleType == "Breadth")) {
					requirementModules[moduleType].collapsed = true;
				}
			} else {
				requirementModules[moduleType].collapsed = false;
			}
		}
	}
	noOfExpandedLists = listOrder.length;

	for (var i in listOrder) {
		var moduleType = listOrder[i];
		$(".requirement-container").append('<div id = "' + moduleType + '" class="sem sem-expanded"><div class="req-title" onClick="toggleExpansion(' + "'" + moduleType + "'" + ');">' + requirementModules[moduleType].name + '</div><ul class="module-set"></ul><div class="sem-mcs">MC: 0' + '/' + requirementModules[moduleType].totalMC + '</div></div>');
		for (var i in requirementModules[moduleType].modules) {
			var module = requirementModules[moduleType].modules[i];
			if (!module.selected) {
				if (module.highlighted) {
					$("#" + moduleType + " .module-set").prepend('<li class="module-small highlighted" onClick = "updateModuleData(' + "'" + module.Code + " " + module.Name + "'" + ',' + "'" + "fromReq" + "'" + ');" data-toggle="modal" data-target="#moduleModal"><span class="modMC">' + requirementModules[moduleType].modules[i].Credit + '</span>' + requirementModules[moduleType].modules[i].Code + " " + requirementModules[moduleType].modules[i].Name + '</li>');
				} else {
					$("#" + moduleType + " .module-set").append('<li class="module-small" onClick = "updateModuleData(' + "'" + module.Code + " " + module.Name + "'" + ',' + "'" + "fromReq" + "'" + ');" data-toggle="modal" data-target="#moduleModal"><span class="modMC">' + requirementModules[moduleType].modules[i].Credit + '</span>' + requirementModules[moduleType].modules[i].Code + " " + requirementModules[moduleType].modules[i].Name + '</li>');
				}
			} else {
				if (module.highlighted) {
					$("#" + moduleType + " .module-set").prepend('<li class="module-small selected highlighted" onClick = "updateModuleData(' + "'" + module.Code + " " + module.Name + "'" + ',' + "'" + "fromReq" + "'" + ');" data-toggle="modal" data-target="#moduleModal"><span class="modMC">' + requirementModules[moduleType].modules[i].Credit + '</span>' + requirementModules[moduleType].modules[i].Code + " " + requirementModules[moduleType].modules[i].Name + '</li>');
				} else {
					$("#" + moduleType + " .module-set").append('<li class="module-small selected" onClick = "updateModuleData(' + "'" + module.Code + " " + module.Name + "'" + ',' + "'" + "fromReq" + "'" + ');" data-toggle="modal" data-target="#moduleModal"><span class="modMC">' + requirementModules[moduleType].modules[i].Credit + '</span>' + requirementModules[moduleType].modules[i].Code + " " + requirementModules[moduleType].modules[i].Name + '</li>');
				}
			}
		}
		var requirementContainerWidth;
		if (noOfExpandedLists == listOrder.length) {
			requirementContainerWidth = (noOfExpandedLists) * 230 + 40;
		} else {
			requirementContainerWidth = (noOfExpandedLists + 1) * 230 + 40;
		}
		$(".requirement-container").css("width", requirementContainerWidth + "px");
		$("#" + moduleType + " .sem-mcs").html("MC: " + requirementModules[moduleType].currentMC + "/" + requirementModules[moduleType].totalMC);
		if (requirementModules[moduleType].currentMC >= requirementModules[moduleType].totalMC) {
			$(".requirement #" + moduleType).css("background","#1EC573");
			$(".requirement #" + moduleType + " .sem-mcs").css("color","white");
		}
	}
	for (var i in listOrder) {
		var moduleType = listOrder[i];
		if (requirementModules[moduleType].collapsed == true) {
			contractList(moduleType,false);
			updateContainerSize();
		}
	}
	updateListOrder();

	checkSpecializationFulfillment();
	calculateTotalMCs();

	mouseoverEffects();
	initializeSortable();
}

function calculateTotalMCs() {
	var currentMC = 0;
	var totalMCs = 0;
	getTotalMCs(userSavedModules.course, function(data) {
		totalMCs = data.totalMCs;
		for (var sem in userSavedModules) {
			if (sem.indexOf("sem") >= 0) {
				currentMC += parseInt(userSavedModules[sem].mcs);
			}
		}
		// if (1) {//(currentMC >= totalMCs) {
		// 	$(".total-sem-mcs").css("background", "white");
		// }
		$(".total-sem-mcs").html("Total MCs: " + currentMC + "/" + totalMCs);
	});
}

function createNewModule() {
	$("#myModalLabel").html('<input type="text" class="add-module-field" placeholder="Module Name">');
	$("#myModalBody").html("<div><span class='modBodyKey'>" + "Module Code: " + "</span>" + "<span class='modBodyValue'>" + '<input id="inputModuleCode" type="text" class="add-module-field" placeholder="eg. CS1010">' + "</span></div>" +
	"<div><span class='modBodyKey'>" + "Modular Credits: " + "</span>" + "<span class='modBodyValue'>" + '<input id="inputModuleCredit" type="text" class="add-module-field" placeholder="0">' + "</span></div>" +
	"<div><span class='modBodyKey'>" + "Exam Date: " + "</span>" + "<span class='modBodyValue'>" + '<input id="inputExamDate" type="text" class="add-module-field" placeholder="-">' + "</span></div>" +
	"<div><span class='modBodyKey'>" + "Preclusion: " + "</span>" + "<span class='modBodyValue'>" + '<input id="inputPreclusion" type="text" class="add-module-field" placeholder="-">' + "</span></div>" +
	"<div><span class='modBodyKey'>" + "Prerequisite: " + "</span>" + "<span class='modBodyValue'>" + '<input id="inputPrerequisite" type="text" class="add-module-field" placeholder="-">' + "</span></div>" +
	"<div><span class='modBodyKey'>" + "Description: " + "</span>" + "<span class='modBodyValue'>" + '<input id="inputDescription" type="text" class="add-module-field" placeholder="-">' + "</span></div>" +
	"<div class='line-spacing'></div>" +
	"<div class='module-declaration'><span>Module Declaration: </span>" +
	"<div class='dropdown modBodyValue' style='display: inline-block;'><div class='moduleType' data-toggle='dropdown'>" + '-' + " <span class='caret'></span></div><ul class='moduleTypeUl dropdown-menu' role='menu' aria-labelledby='dLabel'></ul></div>" + "  " +
	"<span onClick='confirmCreateNewModule();' class='tickCross confirmAddModule'><span class='glyphicon glyphicon-ok'></span> Add Module</span></div>");
	for (var moduleType in requirementModules) { //TODO check available declarations
		$(".moduleTypeUl").append("<li onClick='setDeclaration("+ '"' + requirementModules[moduleType].name + '"' + ");'>" + requirementModules[moduleType].name + "</li>");
	}
}

function setDeclaration(moduleType) {
	$(".moduleType").html(moduleType + " <span class='caret'></span>");
}

function confirmCreateNewModule() {
	var allFieldsFilled = true;
	if ($("#myModalLabel input").val() == "" ) {
		$("#myModalLabel input").addClass("incomplete-module-info");
		allFieldsFilled = false;
	} 
	if ($("#inputModuleCode").val() == "") {
		$("#inputModuleCode").addClass("incomplete-module-info");
		allFieldsFilled = false;
	} 
	if ($("#inputModuleCredit").val() == "") {
		$("#inputModuleCredit").addClass("incomplete-module-info");
		allFieldsFilled = false;
	} 
	var modularCredit = $("#inputModuleCredit").val();
	if (isNaN(modularCredit)) {
		$("#inputModuleCredit").addClass("incomplete-module-info");
		$("#inputModuleCredit").parent().append("<span> Please insert a number</span>");
		allFieldsFilled = false;
	}
	if ($('.module-declaration .moduleType').text() == "- ") {
		$('.module-declaration .moduleType').addClass("incomplete-module-info");
		allFieldsFilled = false;
	}

	$("#myModalLabel input").on('input', function() {
		$("#myModalLabel input").removeClass("incomplete-module-info");
	});
	$("#inputModuleCode").on('input', function() {
		$("#inputModuleCode").removeClass("incomplete-module-info");
	});
	$("#inputModuleCredit").on('input', function() {
		$("#inputModuleCredit").removeClass("incomplete-module-info");
		console.log($($("#inputModuleCredit").parent()[0].lastChild).remove());
	});
	$('.module-declaration .moduleType').on('input', function() {
		$('.module-declaration .moduleType').removeClass("incomplete-module-info");
	});

	if (allFieldsFilled == true) {
		$("#moduleModal").modal('hide');
		var newModule = {
			Code: $("#inputModuleCode").val(),
			CourseCode: defaultUserSavedModules.course,
			Credit: modularCredit,
			Description: ($("#inputDescription").val() != "-") ? $("#inputDescription").val() : "Not Available",
			Examdate: ($("#inputExamDate").val() != "-") ? $("#inputExamDate").val() : "Not Available",
			ModuleType: $('.module-declaration .moduleType').text(),
			Name: $("#myModalLabel input").val(),
			Preclude: ($("#inputPreclusion").val() != "-") ? $("#inputPreclusion").val() : "Not Available",
			Prereq: ($("#inputPrerequisite").val() != "-") ? $("#inputPrerequisite").val() : "Not Available",
			selected: false,
			highlighted: false
		}
		var moduleType = $('.module-declaration .moduleType').text().replace(/\s/g, '');
		requirementModules[moduleType].modules.push(newModule);
		if (!userSavedModules.chosenModules.hasOwnProperty(moduleType)) {
			userSavedModules.chosenModules[moduleType] = [];
		}
		userSavedModules.chosenModules[moduleType].push(newModule);
		displayRequirements();
	}
}

function toggleExpansion(moduleType) {
	if ($("#" + moduleType).hasClass("sem-expanded")) {
		contractList(moduleType,true);
	} else {
		expandList(moduleType);
	}
	updateContainerSize();
	updateListOrder();
}

function expandList(moduleType) {
	var temp = $("#" + moduleType);
	$("#" + moduleType).remove();
	if (noOfExpandedLists != 0) {
		temp.insertAfter("#" + $(".requirement-container .sem").get(noOfExpandedLists-1).id);
	} else {
		temp.prependTo(".requirement-container");
	}
	$("#" + moduleType + " ul").switchClass("module-set-collapsed","module-set", 100, function(){initializeSortable();});
	$("#" + moduleType).addClass("sem-expanded");
	if (moduleType.length >  13) {
		$("#" + moduleType).css("height","396px");
	}
	requirementModules[moduleType].collapsed = false;

	noOfExpandedLists++;
	
	mouseoverEffects();
}

function contractList(moduleType, animation) {
	noOfExpandedLists--;
	var temp = $("#" + moduleType);
	$("#" + moduleType).remove();
	if (noOfExpandedLists != 0) {
		temp.insertAfter("#" + $(".requirement-container .sem").get(noOfExpandedLists-1).id);
	} else {
		temp.prependTo(".requirement-container");
	}
	$("#" + moduleType).removeClass("sem-expanded");
	if (animation == false) {
		$("#" + moduleType + " ul").switchClass("module-set","module-set-collapsed",0);
	} else {
		$("#" + moduleType + " ul").switchClass("module-set","module-set-collapsed", 100);
	}
	if (moduleType.length >  13) {
		$("#" + moduleType).css("height","50px");
	}
	requirementModules[moduleType].collapsed = true;
}

function updateContainerSize() {
	var requirementContainerWidth;
	if (noOfExpandedLists == listOrder.length) {
		requirementContainerWidth = (noOfExpandedLists) * 230 + 40;
	} else {
		requirementContainerWidth = (noOfExpandedLists + 1) * 230 + 40;
	}
	$(".requirement-container").css("width", requirementContainerWidth + "px");
}

function updateListOrder() {
	var i = 0;
	listOrder = [];
	for (var moduleType in requirementModules) {
		listOrder.push($(".requirement-container .sem").get(i).id);
		i++;
	}
}

function clean() {
	for (var sem in userSavedModules) {
		$("#" + sem + " .module-set").html("");
	}
	listOrder = [];
	for (var moduleType in requirementModules) {
		listOrder.push(moduleType);
	}
	storage.clear();
	storage.save();
}

function clearStorage() {
	$("#myModalLabel").html("<div>Are you sure you want to clear all saved modules?</div>");
	$("#myModalBody").html('<button onClick="clean();initializeRequirementModules();" type="button" class="btn btn-default btn-sm" data-dismiss="modal">Yes</button>  <button type="button" class="btn btn-default btn-sm" data-dismiss="modal">No</button>');
}


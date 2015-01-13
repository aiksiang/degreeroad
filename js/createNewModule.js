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
		$($("#inputModuleCredit").parent()[0].lastChild).remove();
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
		var moduleType = removeSpaces($('.module-declaration .moduleType').text());
		requirementModules[moduleType].modules.push(newModule);
		if (!userSavedModules.chosenModules.hasOwnProperty(moduleType)) {
			userSavedModules.chosenModules[moduleType] = [];
		}
		userSavedModules.chosenModules[moduleType].push(newModule);
		displayRequirements();
	}
}
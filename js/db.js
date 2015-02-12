// function getRequirementsOld(degreeCode, academicYear, callback) {
// 	$.getJSON("database.php?action=getRequirementsOld&degreeCode=" + degreeCode + "&academicYear=" + academicYear, function(data) {
// 		callback(data);
// 	}).error(function(error) {
// 		console.log("API error:", error.responseText);
// 	});
// }

function retrieveDegreeRequirements(academicYear, degreeCode, specialProgramme, callback) {
	$.getJSON("database.php?action=retrieveDegreeRequirements&academicYear=" + academicYear + "&degreeCode=" + degreeCode + "&specialProgramme=" + specialProgramme, function(data) {
		callback(data);
	}).error(function(error) {
		console.log("API error:", error.responseText);
	});
}

function retrieveRules(requirementIds, callback) {
	$.getJSON("database.php?action=retrieveRules&requirementIds=" + requirementIds, function(data) {
		callback(data);
	}).error(function(error) {
		console.log("API error:", error.responseText);
	});
}

function retrieveList(listName, callback) {
	$.getJSON("database.php?action=retrieveList&listName=" + listName, function(data) {
		callback(data);
	}).error(function(error) {
		console.log("API error:", error.responseText);
	});
}

function getRequirementModules(degreeCode, callback) {
	$.getJSON("database.php?action=getRequirementModules&degreeCode=" + degreeCode, function(data) {
		callback(data);
	}).error(function(error) {
		console.log("API error:", error.responseText);
	});
}

function getAllModuleList(callback) {
	$.getJSON("database.php?action=getAllModuleList", function(data) {
		callback(data);
	}).error(function(error) {
		console.log("API error:", error.responseText);
	});
}

function getSpecializations(degreeCode, callback) {
	$.getJSON("database.php?action=getSpecializations&degreeCode=" + degreeCode, function(data) {
		callback(data);
	}).error(function(error) {
		console.log("API error:", error.responseText);
	});
}
function getSpecializationModules(specialization, callback) {
	$.getJSON("database.php?action=getSpecializationModules&specialization=" + specialization, function(data) {
		callback(data);
	}).error(function(error) {
		console.log("API error:", error.responseText);
	});
}

function getTotalMCs(degreeCode, callback) {
	$.getJSON("database.php?action=getTotalMCs&degreeCode=" + degreeCode, function(data) {
		callback(data);
	}).error(function(error) {
		console.log("API error:", error.responseText);
	});
}
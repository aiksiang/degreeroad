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

function getAllModuleList(callback) {
	// $.getJSON('http://api.nusmods.com/2014-2015/modules.json', function (data) {
	// 	console.log(data);
	// });
	$.getJSON("database.php?action=getAllModuleList", function(data) {
		callback(data);
	}).error(function(error) {
		console.log("API error:", error.responseText);
	});
}

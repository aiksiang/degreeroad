function getRequirements(degreeCode, callback) {
	$.getJSON("database.php?action=getRequirements&degreeCode=" + degreeCode, function(data) {
		callback(data);
	}).error(function(ex) {
		console.log("API error", ex.responseText);
	});
}

function getAllModuleList(callback) {
	$.getJSON("database.php?action=getAllModuleList", function(data) {
		callback(data);
	}).error(function(ex) {
		console.log("API error", ex.responseText);
	});
}

function getSpecializations(degreeCode, callback) {
	$.getJSON("database.php?action=getSpecializations&degreeCode=" + degreeCode, function(data) {
		callback(data);
	}).error(function(ex) {
		console.log("API error", ex.responseText);
	});
}
function getSpecializationModules(specialization, callback) {
	$.getJSON("database.php?action=getSpecializationModules&specialization=" + specialization, function(data) {
		callback(data);
	}).error(function(ex) {
		console.log("API error", ex.responseText);
	});
}

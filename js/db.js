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

function getModules(degreeName, callback) {
	$.getJSON("database.php?action=getModules&degreeName=" + degreeName, function(data) {
		callback(data);
	}).error(function(ex) {
		console.log("API error", ex.responseText);
	});
}
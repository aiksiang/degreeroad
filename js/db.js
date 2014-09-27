function getModules(callback) {
	$.getJSON("database.php?action=getModules", function(data) {
		callback(data);
	}).error(function(ex) {
		console.log("API error", ex.responseText);
	});
}
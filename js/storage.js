function Storage() {
	this.storageKey = "degreeroad";
	this.data = defaultUserSavedModules;
	this.load();
}
Storage.prototype.load = function() {
	try {
		if (typeof(localStorage[this.storageKey]) != "undefined") {
			this.data = JSON.parse(localStorage[this.storageKey]);
		}
	} catch (ex) {
		console.log("Storage fetch error", ex);
	}
}
Storage.prototype.save = function() {
	try {
		localStorage[this.storageKey] = JSON.stringify(this.data);
	} catch (ex) {
		console.log("Storage save error", ex);
	}
}
Storage.prototype.get = function() {
	if (typeof(this.data) != "undefined") {
		return this.data;
	} else {
		return null;
	}
}
Storage.prototype.put = function(value) {
	if (value != null) {
		this.data = value;
	}
	this.save();
}

Storage.prototype.clear = function() {
	this.data = defaultUserSavedModules;
}

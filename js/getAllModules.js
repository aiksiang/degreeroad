var allModuleList;
var allModuleListSearch;

(function initializeModuleList() {
	getAllModuleList(function(data){
		allModuleList = data;
		allModuleListSearch = [];
		for (var i in allModuleList) {
			allModuleListSearch.push({title: allModuleList[i].Code + ' ' + allModuleList[i].Name});
		}
		InitializeSearchContent();
	});
})();
var allModuleList;

function initializeModuleList() {
	getAllModuleList(function(data){
		allModuleList = data;
	});
}
initializeModuleList();
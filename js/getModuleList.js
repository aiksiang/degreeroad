var allModuleList;

(function initializeModuleList() {
  getAllModuleList(function(data){
    allModuleList = data;
  });
})();

$('.moduleinput').on('show.bs.dropdown', function () {
  $(".module-drop").empty();
  for (var i = 0; i < allModuleList.length; i++){
    var moduleName;
    moduleName = allModuleList[i].Code + " " + allModuleList[i].Name;
    $(".module-drop").append('<li>' + moduleName + '</li>');
  }
});

//update  moduleName = $('.moduleinput .form-control').val();

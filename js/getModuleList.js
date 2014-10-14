var allModuleList;

(function initializeModuleList() {
  getAllModuleList(function(data){
    allModuleList = data;
  });
})();

$('.moduleinput').on('show.bs.dropdown', function () {
  if ($('.moduleinput .form-control').val() == "") {
    $(".module-drop").empty();
    for (var i = 0; i < allModuleList.length; i++){
      var moduleName;
      moduleName = allModuleList[i].Code + " " + allModuleList[i].Name;
      $(".module-drop").append('<li onClick="updateModuleData('+ i +')"; data-toggle="modal" data-target="#moduleModal">' + moduleName + '</li>');
    }
  }
});

$('.moduleinput').on('input', function() {
  var query = $('.moduleinput .form-control').val();
  $(".module-drop").empty();
  var mod_count = 0;
  for(var i in allModuleList) {
    var moduleName;
    moduleName = allModuleList[i].Code + " " + allModuleList[i].Name;
    if (moduleName.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
      $(".module-drop").append('<li>' + moduleName + '</li>');
      mod_count++;
    }
  }
  if (mod_count == 0) {
    $(".module-drop").append('<li>' + "Nothing Found!" + '</li>');
    $(".moduleinput .dropdown-menu").css('height',32);
  } else if (mod_count < 8) {
    var height = mod_count * 32;
    $(".moduleinput .dropdown-menu").css('height',height);
  } else {
    $(".moduleinput .dropdown-menu").css('height',245);
  }
});

function updateModuleData(i) {
  console.log(allModuleList[i]);
  $("#myModalLabel").html(allModuleList[i].Name);
  $("#myModalBody").html("<div><span class='modBodyKey'>" + "Module Code: " + "</span>" + "<span class='modBodyValue'>" + allModuleList[i].Code + "</span></div>" +
  "<div><span class='modBodyKey'>" + "Modular Credits: " + "</span>" + "<span class='modBodyValue'>" + allModuleList[i].Credit + "</span></div>" +
  "<div><span class='modBodyKey'>" + "Exam Date: " + "</span>" + "<span class='modBodyValue'>" + allModuleList[i].Examdate + "</span></div>" +
  "<div><span class='modBodyKey'>" + "Preclusion: " + "</span>" + "<span class='modBodyValue'>" + allModuleList[i].Preclude + "</span></div>" +
  "<div><span class='modBodyKey'>" + "Prerequisite: " + "</span>" + "<span class='modBodyValue'>" + allModuleList[i].Prereq + "</span></div>" +
  "<div><span class='modBodyKey'>" + "Description: " + "</span>" + "<span class='modBodyValue'>" + allModuleList[i].Description + "</span></div>");
}

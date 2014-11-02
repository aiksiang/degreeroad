var allModuleList;
var currentMod;

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
      $(".module-drop").append('<li onClick="updateModuleData(allModuleList[' + i + '])"; data-toggle="modal" data-target="#moduleModal">' + moduleName + '</li>');
    }
  }
});

$('.moduleinput').on('input', function() {
  if (!$('.moduleinput').hasClass("open")){
    $(".module-drop").dropdown('toggle');
  }
  var query = $('.moduleinput .form-control').val();
  $(".module-drop").empty();
  var mod_count = 0;
  for(var i in allModuleList) {
    var moduleName;
    moduleName = allModuleList[i].Code + " " + allModuleList[i].Name;
    if (moduleName.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
      $(".module-drop").append('<li onClick="updateModuleData(allModuleList[' + i + '])"; data-toggle="modal" data-target="#moduleModal">' + moduleName + '</li>');
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

function updateModuleData(mod) {
  currentMod = mod;
  $("#myModalLabel").html(mod.Name);
  $("#myModalBody").html("<div><span class='modBodyKey'>" + "Module Code: " + "</span>" + "<span class='modBodyValue'>" + mod.Code + "</span></div>" +
  "<div><span class='modBodyKey'>" + "Modular Credits: " + "</span>" + "<span class='modBodyValue'>" + mod.Credit + "</span></div>" +
  "<div><span class='modBodyKey'>" + "Exam Date: " + "</span>" + "<span class='modBodyValue'>" + mod.Examdate + "</span></div>" +
  "<div><span class='modBodyKey'>" + "Preclusion: " + "</span>" + "<span class='modBodyValue'>" + mod.Preclude + "</span></div>" +
  "<div><span class='modBodyKey'>" + "Prerequisite: " + "</span>" + "<span class='modBodyValue'>" + mod.Prereq + "</span></div>" +
  "<div><span class='modBodyKey'>" + "Description: " + "</span>" + "<span class='modBodyValue'>" + mod.Description + "</span></div>" +
  "<div class='dropdown' style='display: inline-block;'><button class='moduleType btn btn-default btn-sm' data-toggle='dropdown' >Module Type <span class='caret'></span></button><ul class='moduleTypeUl dropdown-menu' role='menu' aria-labelledby='dLabel'></ul></div>" +
  '  <span class = addToList><button onClick="addToList();" type="button" class="btn btn-default btn-sm" data-dismiss="modal">Add To List</button></span>');
  for (var moduleType in requirementModules) {
    $(".moduleTypeUl").append("<li onClick='updateDestination(" + '"' +  requirementModules[moduleType].name + '"' + ");'>" + requirementModules[moduleType].name + "</li>");
  }
}

function updateDestination(moduleType) {
  $(".moduleType").html(moduleType + " <span class='caret'></span>");
  $("#myModalBody .addToList").html('<button onClick="addToList(' + "'" + moduleType + "'" + ');" type="button" class="btn btn-default btn-sm" data-dismiss="modal">Add To List</button>');
}

function addToList(moduleType) {
  var identifier = moduleType.replace(/\s/g, '');
  requirementModules[identifier].modules.push(currentMod);
  if (!userSavedModules.chosenModules.hasOwnProperty(identifier)) {
    userSavedModules.chosenModules[identifier] = [];
    userSavedModules.chosenModules[identifier].push(currentMod);
  }
  storage = new Storage();
  storage.put(userSavedModules);
  storage.save();
  displayModules();
}


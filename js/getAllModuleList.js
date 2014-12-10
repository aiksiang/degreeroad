var allModuleList;
var currentMod;
storage = new Storage();

(function initializeModuleList() {
  getAllModuleList(function(data){
    allModuleList = data;
  });
})();

//Loads module input box with all modules
$('.moduleinput').on('show.bs.dropdown', function () {
  if ($('.moduleinput .form-control').val() == "") {
    $(".module-drop").empty();
    for (var i = 0; i < allModuleList.length; i++){
      var moduleName;
      moduleName = allModuleList[i].Code + " " + allModuleList[i].Name;
      $(".module-drop").append('<li onClick="updateModuleData(allModuleList[' + i + '],' + "'fromAllModuleList'" + ')"; data-toggle="modal" data-target="#moduleModal">' + moduleName + '</li>');
    }
  }
});
//Searches module input box
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
      $(".module-drop").append('<li onClick="updateModuleData(allModuleList[' + i + '],' + "'fromAllModuleList'" + ')"; data-toggle="modal" data-target="#moduleModal">' + moduleName + '</li>');
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
//Loads modal with module data
function updateModuleData(mod,source) {
  currentMod = mod;
  $("#myModalLabel").html(mod.Name);
  if (source == "fromAllModuleList") {
    $("#myModalBody").html("<div><span class='modBodyKey'>" + "Module Code: " + "</span>" + "<span class='modBodyValue'>" + mod.Code + "</span></div>" +
    "<div><span class='modBodyKey'>" + "Modular Credits: " + "</span>" + "<span class='modBodyValue'>" + mod.Credit + "</span></div>" +
    "<div><span class='modBodyKey'>" + "Exam Date: " + "</span>" + "<span class='modBodyValue'>" + mod.Examdate + "</span></div>" +
    "<div><span class='modBodyKey'>" + "Preclusion: " + "</span>" + "<span class='modBodyValue'>" + mod.Preclude + "</span></div>" +
    "<div><span class='modBodyKey'>" + "Prerequisite: " + "</span>" + "<span class='modBodyValue'>" + mod.Prereq + "</span></div>" +
    "<div><span class='modBodyKey'>" + "Description: " + "</span>" + "<span class='modBodyValue'>" + mod.Description + "</span></div>" +
    "<div class='dropdown' style='display: inline-block;'><button class='moduleType btn btn-default btn-sm' data-toggle='dropdown' >Module Type <span class='caret'></span></button><ul class='moduleTypeUl dropdown-menu' role='menu' aria-labelledby='dLabel'></ul></div>" +
    '  <span class = addToList><button disabled="disabled" type="button" class="btn btn-default btn-sm" data-dismiss="modal">Add To List</button></span>');
  } else {
    $("#myModalBody").html("<div><span class='modBodyKey'>" + "Module Code: " + "</span>" + "<span class='modBodyValue'>" + mod.Code + "</span></div>" +
    "<div><span class='modBodyKey'>" + "Modular Credits: " + "</span>" + "<span class='modBodyValue'>" + mod.Credit + "</span></div>" +
    "<div><span class='modBodyKey'>" + "Exam Date: " + "</span>" + "<span class='modBodyValue'>" + mod.Examdate + "</span></div>" +
    "<div><span class='modBodyKey'>" + "Preclusion: " + "</span>" + "<span class='modBodyValue'>" + mod.Preclude + "</span></div>" +
    "<div><span class='modBodyKey'>" + "Prerequisite: " + "</span>" + "<span class='modBodyValue'>" + mod.Prereq + "</span></div>" +
    "<div><span class='modBodyKey'>" + "Description: " + "</span>" + "<span class='modBodyValue'>" + mod.Description + "</span></div>" + 
    '<div style="height:25px"><span class="remove-module glyphicon glyphicon glyphicon-trash" onClick="removeModule();" data-dismiss="modal"></span></div>');
  }
  
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
  } else {
    userSavedModules.chosenModules[identifier].push(currentMod);
  }
  storage.put(userSavedModules);
  storage.save();
  displayRequirements();
}

function removeModule() {
  for (var identifier in requirementModules) {
    var index = requirementModules[identifier].modules.indexOf(currentMod);
    if (index >= 0) {
      requirementModules[identifier].modules.splice(index,1);
    }
  }
  for (var identifier in userSavedModules.chosenModules) {
    var index = userSavedModules.chosenModules[identifier].indexOf(currentMod);
    if (index >= 0) {
      userSavedModules.chosenModules[identifier].splice(index,1);
      if (userSavedModules.chosenModules[identifier].length == 0) {
        delete userSavedModules.chosenModules[identifier];
      }
    }
  }
  storage.put(userSavedModules);
  storage.save();
  displayRequirements();
}
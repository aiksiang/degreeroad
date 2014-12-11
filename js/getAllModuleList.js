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
      $(".module-drop").append('<li onClick="updateModuleData(allModuleList[' + i + '],' + "'-'" + ')"; data-toggle="modal" data-target="#moduleModal">' + moduleName + '</li>');
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
      $(".module-drop").append('<li onClick="updateModuleData(allModuleList[' + i + '],' + "'-'" + ')"; data-toggle="modal" data-target="#moduleModal">' + moduleName + '</li>');
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
function updateModuleData(mod,originalDeclaration) {
  if (originalDeclaration == "fromSem" || originalDeclaration == "fromReq") {
    var modLoc = findModule(mod);
    mod = requirementModules[modLoc.moduleType].modules[modLoc.i];
    originalDeclaration = requirementModules[modLoc.moduleType].name;
  }
  currentMod = mod;
  $("#myModalLabel").html(mod.Name);
  $("#myModalBody").html("<div><span class='modBodyKey'>" + "Module Code: " + "</span>" + "<span class='modBodyValue'>" + mod.Code + "</span></div>" +
    "<div><span class='modBodyKey'>" + "Modular Credits: " + "</span>" + "<span class='modBodyValue'>" + mod.Credit + "</span></div>" +
    "<div><span class='modBodyKey'>" + "Exam Date: " + "</span>" + "<span class='modBodyValue'>" + mod.Examdate + "</span></div>" +
    "<div><span class='modBodyKey'>" + "Preclusion: " + "</span>" + "<span class='modBodyValue'>" + mod.Preclude + "</span></div>" +
    "<div><span class='modBodyKey'>" + "Prerequisite: " + "</span>" + "<span class='modBodyValue'>" + mod.Prereq + "</span></div>" +
    "<div><span class='modBodyKey'>" + "Description: " + "</span>" + "<span class='modBodyValue'>" + mod.Description + "</span></div>" +
    "<div class='line-spacing'></div>" +
    "<div class='module-declaration'><span>Module Declaration: </span>" +
    "<div class='dropdown modBodyValue' style='display: inline-block;'><div class='moduleType' data-toggle='dropdown'>" + originalDeclaration + " <span class='caret'></span></div><ul class='moduleTypeUl dropdown-menu' role='menu' aria-labelledby='dLabel'></ul></div>" + "  " +
    "<span class='tickCross'></span></div>");
  
  for (var moduleType in requirementModules) { //TODO check available declarations
    $(".moduleTypeUl").append("<li onClick='updateDeclaration(" + '"' +  originalDeclaration + '","' +  requirementModules[moduleType].name + '"' + ");'>" + requirementModules[moduleType].name + "</li>");
  }

  var moduleLoc = findModule(mod.Code + " " + mod.Name);
  if (moduleLoc != undefined) {
    if (moduleLoc.moduleType != 'ProgramRequirement' && moduleLoc.moduleType != 'Breadth' && moduleLoc.moduleType != 'Depth') {
      $(".moduleTypeUl").append("<li onClick='updateDeclaration(" + '"' +  originalDeclaration + '","removeModule"' + ");'>" + "Remove Module" + "</li>");
    }
  }
}

function updateDeclaration(prevModuleType,moduleType) {
  if (moduleType == "removeModule") {
    $(".moduleType").html("Remove Module" + " <span class='caret'></span>");
    $("#myModalBody .tickCross").html('<span data-dismiss="modal" onClick="removeModule();" class="confirmAdd glyphicon glyphicon-ok"></span>' + 
      '<span onClick="cancelDeclaration(' + "'" + prevModuleType + "'" + ');" class="remove-module glyphicon glyphicon-remove"></span>');
  } else {
    $(".moduleType").html(prevModuleType + "<span class='mod-to-mod glyphicon glyphicon-play'></span>" + moduleType + " <span class='caret'></span>");
    $("#myModalBody .tickCross").html('<span data-dismiss="modal" onClick="confirmUpdate(' + "'" + prevModuleType + "','" + moduleType + "'" + ');" class="confirmAdd glyphicon glyphicon-ok"></span>' + 
      '<span onClick="cancelDeclaration(' + "'" + prevModuleType + "'" + ');" class="remove-module glyphicon glyphicon-remove"></span>');
  }
}

function cancelDeclaration(prevModuleType) {
  $(".moduleType").html(prevModuleType + " <span class='caret'></span>");
  $("#myModalBody .tickCross").html("");
}

function confirmUpdate(prevModuleType,moduleType) {
  var origin = prevModuleType;
  if (prevModuleType != "-") {
    var prevModuleLoc = findModule(currentMod.Code + " " + currentMod.Name);
    if (requirementModules[prevModuleLoc.moduleType].modules[prevModuleLoc.i].selected){
      requirementModules[prevModuleLoc.moduleType].currentMC -= requirementModules[prevModuleLoc.moduleType].modules[prevModuleLoc.i].Credit;
    }
    requirementModules[prevModuleLoc.moduleType].modules.splice(prevModuleLoc.i,1);
    var prevType = prevModuleType.replace(/\s/g, '');
    for (var selectedModules in userSavedModules.chosenModules[prevType]) {
      if (userSavedModules.chosenModules[prevType][selectedModules].Code == currentMod.Code) {
        userSavedModules.chosenModules[prevType].splice(selectedModules,1);
        if (userSavedModules.chosenModules[prevType].length == 0) {
          delete userSavedModules.chosenModules[prevType];
        }
      }
    }
  }

  var identifier = moduleType.replace(/\s/g, '');
  requirementModules[identifier].modules.push(currentMod);
  if (currentMod.selected) {
    requirementModules[identifier].currentMC += parseInt(currentMod.Credit);
  }

  if (!userSavedModules.chosenModules.hasOwnProperty(identifier)) {
    userSavedModules.chosenModules[identifier] = [];
  }
  
  userSavedModules.chosenModules[identifier].push(currentMod);

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
      if (currentMod.selected) {
        for (var semNo = 1; semNo <= noOfSems; semNo++) {
          for (var semIndex in userSavedModules["sem" + semNo].modules) {
            if (userSavedModules["sem" + semNo].modules[semIndex].Code == currentMod.Code) {
              userSavedModules["sem" + semNo].mcs -= currentMod.Credit;
              userSavedModules["sem" + semNo].modules.splice(semIndex,1);
              break;
            }
          }
        }
      }
      userSavedModules.chosenModules[identifier].splice(index,1);
      if (userSavedModules.chosenModules[identifier].length == 0) {
        delete userSavedModules.chosenModules[identifier];
      }
    }
  }
  storage.put(userSavedModules);
  storage.save();
  loadUserSavedModules();
  displayRequirements();
}
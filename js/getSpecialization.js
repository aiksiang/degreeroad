var specializationList;
var specializationMods;

(function initializeSpecializationList(){
  var degreeCode = "CEG";
  getSpecializations(degreeCode, function(data){
    specializationList = data;
    specializationList.push({coursecode: degreeCode, specialization: "None"});
  });
})();

$('.specialization').on('show.bs.dropdown', function () {
  $(".spec-drop").empty();
  for (var i = 0; i < specializationList.length; i++) {
    var Specialization = specializationList[i].specialization;
    $(".spec-drop").append('<li class="specialization-list" onClick="selectSpecialization(' + "'" + specializationList[i].specialization.replace(/\s/g, '') + "'" + ');">' + Specialization + '</li>');
  }
});

function selectSpecialization(specialization) {
  var i;
  for (var i = 0; i < specializationList.length; i++) {
    if (specializationList[i].specialization.replace(/\s/g, '') == specialization) {
      break;
    }
  }
  if (specialization != "None") {  
    $(".specialization a").html(specializationList[i].specialization + ' <span class="glyphicon glyphicon-chevron-down"></span>');
    getSpecializationModules(specializationList[i].specialization, function(data){
      specializationMods = data;
      $(".requirement-container").html("");
      requirementModules.Breadth.currentMC = 0;
      requirementModules.Depth.currentMC = 0;
      for (var moduleType in requirementModules) {
        if (moduleType == "Breadth" || moduleType == "Depth") {
          for (var j in requirementModules[moduleType].modules) {
            requirementModules[moduleType].modules[j].highlighted = false;
          }
          for (var j in requirementModules[moduleType].modules) {
            for (var i in specializationMods) {
              if (requirementModules[moduleType].modules[j].Code == specializationMods[i].Code) {
                requirementModules[moduleType].modules[j].highlighted = true;
              }
            }
          }
        } else {
          continue;
        }
      }
      displayModules();
    });
    userSavedModules.specialization = specialization;
    storage.put(userSavedModules);
    storage.save();
  } else {
    $(".specialization a").html("Specialization" + ' <span class="glyphicon glyphicon-chevron-down"></span>');
    for (var moduleType in requirementModules) {
      if (moduleType == "Breadth" || moduleType == "Depth") {
        for (var j in requirementModules[moduleType].modules) {
          requirementModules[moduleType].modules[j].highlighted = false;
        }
      }
    }
    userSavedModules.specialization = specialization;
    storage.put(userSavedModules);
    storage.save();
    displayModules();
  }
}

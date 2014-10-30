var specializationList;
var specializationMods;

(function initializeSpecializationList(){
  var degreeCode = "CEG";
  getSpecializations(degreeCode, function(data){
    specializationList = data;
  });
})();

$('.specialization').on('show.bs.dropdown', function () {
  $(".spec-drop").empty();
  for (var i = 0; i < specializationList.length; i++) {
    var Specialization = specializationList[i].specialization;
    $(".spec-drop").append('<li class="specialization-list" onClick="selectSpecialization(' + i + ');">' + Specialization + '</li>');
  }
});

function selectSpecialization(i) {
  $(".specialization a").html(specializationList[i].specialization + ' <span class="glyphicon glyphicon-chevron-down"></span>');

  getSpecializationModules(specializationList[i].specialization, function(data){
    specializationMods = data;
    $(".requirement-container").html("");
    requirementModules.Breadth.modules = [];
    requirementModules.Breadth.currentMC = 0;
    requirementModules.Breadth.totalMC = 12;
    requirementModules.Depth.modules = [];
    requirementModules.Depth.currentMC = 0;
    requirementModules.Depth.totalMC = 12;
    for (var i in specializationMods) {
      if (specializationMods[i].ModuleType == "breadth") {
        requirementModules.Breadth.modules.push(specializationMods[i]);
      } else if (specializationMods[i].ModuleType == "depth") {
        requirementModules.Depth.modules.push(specializationMods[i]);
      }
    }
    loadModules();
  });
}

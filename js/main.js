var currentDegree = null;
var currentSecondDegree = null;
var currentMod = null;

//Initialize UI elements
$(document).ready(function(){
	//Initialize dropdown
	$('.ui.dropdown').dropdown();
	$('#course-selection').dropdown({
		onChange: function(value,text) {
			currentDegree = text;
			if (currentDegree == currentSecondDegree) {
				$('#second-course-selection .text').html("+");
				currentSecondDegree = null;
			}
			chooseDegree();
		}
	});
	$('#second-course-selection').dropdown({
		onChange: function(value,text) {
			if (text != currentDegree && currentDegree != null) {
				$('#second-course-selection .text').html(text);
				currentSecondDegree = text;
				chooseDegree();
			} else {
				$('#second-course-selection .text').html("+");
				currentSecondDegree = null;
			}
		}
	});
	

	//Initialize popup
	$('.popup').popup();

	//Initialize active class
    InitializeActiveClass();
    
    //Initialize Degrees
    populateDegreeList();
});

var degreeList = {
	UNI: "University",
	ENG: "Engineering",
	ARTS: "Arts",
	CEG: "Computer Engineering",
	PS_HONS: "Political Science(Honours)",
	PS_2MAJ: "Political Science(2nd Major)",
	PS_MIN: "Political Science(Minor)"
};

function populateDegreeList() {
	$("#course-selection .menu").html("");
	$("#second-course-selection .menu").html("");
	for (var i in degreeList) {
		if (i != "ENG" && i!= "ARTS" && i!= "UNI" ) { // We dont want the faculty to be displayed
			if (i.indexOf("2MAJ") < 0 && i.indexOf("MIN") < 0) {
				$("#course-selection .menu").append('\
					<div class="item">'+ degreeList[i] +'</div>\
				');
			}
			$("#second-course-selection .menu").append('\
				<div class="item">'+ degreeList[i] +'</div>\
			');
		}
	}
}

function chooseDegree() {
	var degreeCode = getDegreeCode(currentDegree)[0];
	var faculty = getDegreeCode(currentDegree)[1];
	
	initializeRequirementModules(degreeCode, true);
	waitForAllParsingDone(function() {
		initializeRequirementModules(faculty, false);
		waitForAllParsingDone(function() {
			initializeRequirementModules("UNI", false);
			if (currentSecondDegree != null) {
				waitForAllParsingDone(function() {
					degreeCode = getDegreeCode(currentSecondDegree)[0];
					faculty = getDegreeCode(currentSecondDegree)[1];
					initializeRequirementModules(degreeCode, false);
					waitForAllParsingDone(function() {
						initializeRequirementModules(faculty, false);
					});
				});
			}
		});
		
	});
}

function getDegreeCode(text) {
	var degreeCode;
	var faculty;
	switch(text) {
		case "Computer Engineering":
			degreeCode = "CEG";
			faculty = "ENG";
			break;
		case "Political Science(Honours)":
			degreeCode = "PS_HONS";
			faculty = "ARTS";
			break;
		case "Political Science(2nd Major)":
			degreeCode = "PS_2MAJ";
			faculty = null;
			break;
		case "Political Science(Minor)":
			degreeCode = "PS_MIN";
			faculty = null;
			break;
	}
	return [degreeCode, faculty];
}

function InitializeActiveClass() {
	$('.menu a.item').on('click', function() {
    	if(!$(this).hasClass('dropdown')) {
          $(this).addClass('active').closest('.ui.menu').find('.item').not($(this)).removeClass('active');
        }
	});
}

function InitializeModalsTrigger() {
	$('.modal').modal();
	$('.standard.modal').modal('attach events', '.item.module');
	$('.item.module').on('click', function() {
		var mod = {};
		var HTMLtoBeInserted = "";
		if ($(this).attr("id").indexOf("notFound") < 0) {
			var moduleLocation = $(this).attr("id").substring(17,$(this).attr("id").length);
			if (moduleLocation.indexOf("clone") >= 0) {
				moduleLocation = moduleLocation.substring(0,moduleLocation.length - 5);
			}
			var modFromList = allModuleList[moduleLocation];
			mod = allModuleList[moduleLocation];
			traverseSelectedModules(function(moduleFromSem) {
				if (moduleFromSem.Code == modFromList.Code) {
					HTMLtoBeInserted = "\
						<div><h5>Module Code: </h5><span class='modBodyValue'>" + moduleFromSem.Code + "</span></div>\
						<div><h5>Modular Credits: </h5><span class='modBodyValue'>" + moduleFromSem.Credit + "</span></div>\
						<div><h5>Exam Date: </h5><span class='modBodyValue'>" + moduleFromSem.Examdate + "</span></div>\
						<div><h5>Preclusion: </h5><span class='modBodyValue'>" + moduleFromSem.Preclude + "</span></div>\
						<div><h5>Prerequisite: </h5><span class='modBodyValue'>" + moduleFromSem.Prereq + "</span></div>\
						<div><h5>Description: </h5><span class='modBodyValue'>" + moduleFromSem.Description + "</span></div>\
						<div class='ui horizontal divider'>Module Declaration</div>\
						<div id='module-declaration' class='ui dropdown item'>\
					";
					HTMLtoBeInserted += '\
							<div class="text">' + moduleFromSem.declaration.ruleName + '</div>\
							<i class="dropdown icon"></i>\
							<div id="declaration-options" class="menu">\
					';
					for (var k in moduleFromSem.doubleCountable) {
						HTMLtoBeInserted += '\
								<div class="item">'+ moduleFromSem.doubleCountable[k].ruleName +'</div>\
						';
					}
					HTMLtoBeInserted += '\
							</div>\
						</div>\
					';
					
					$(".modal .content").html(HTMLtoBeInserted);
					currentMod = moduleFromSem;
					waitForInsertionOfHTML(function() {
						$('#module-declaration').dropdown({
							onChange: function(value,text) {
								for (var l in currentMod.doubleCountable) {
									if (currentMod.doubleCountable[l].ruleName == text) {
										currentMod.declaration = currentMod.doubleCountable[l];
									}
								}
							}
						});
					});
				}
			});
		} else {
			var modCode = $(this).attr("id").substring(8);
			mod.Code = modCode;
			mod.Name = modCode;
			mod.Credit = 0;
			mod.acadYear = "";
			mod.Description = "Module is not found in database";
			mod.Examdate = "";
			mod.Faculty = "";
			mod.Preclude = "";
			mod.Prereq = "";
			mod.Semester = "";
		}
		$(".modal .header").html(mod.Name);
		if (HTMLtoBeInserted == "") {
			HTMLtoBeInserted = "\
				<div><h5>Module Code: </h5><span class='modBodyValue'>" + mod.Code + "</span></div>\
				<div><h5>Modular Credits: </h5><span class='modBodyValue'>" + mod.Credit + "</span></div>\
				<div><h5>Exam Date: </h5><span class='modBodyValue'>" + mod.Examdate + "</span></div>\
				<div><h5>Preclusion: </h5><span class='modBodyValue'>" + mod.Preclude + "</span></div>\
				<div><h5>Prerequisite: </h5><span class='modBodyValue'>" + mod.Prereq + "</span></div>\
				<div><h5>Description: </h5><span class='modBodyValue'>" + mod.Description + "</span></div>\
			";
			$(".modal .actions").html("");
			currentMod = mod;
		}

		$(".modal .content").html(HTMLtoBeInserted);
	});
}

var qwe;
var noOfSems = 8;

//Initialize storage structure
var defaultUserSavedModules = {};
for (var i = 1; i <= noOfSems; i++) {
	defaultUserSavedModules["semester" + i] = {};
	defaultUserSavedModules["semester" + i].modules = [];
	defaultUserSavedModules["semester" + i].mcs = 0;
}
defaultUserSavedModules.course = "CEG";
defaultUserSavedModules.chosenModules = {};


var userSavedModules = defaultUserSavedModules;
var storage;
var year = 0;
var semestersInAYear = 2;
var semesterContainer = $("#semester-container");
var topContainer = $("#top-container");
var requirementContainer = $("#requirement-container");

//Insert semesters
for (var i = 1; i <= noOfSems; i++) {
	year = Math.floor((i-1) / semestersInAYear) + 1;
	var semesterNo = ((i-1) % semestersInAYear) + 1;
	semesterContainer.append(
		'<div id="semester' + i + '" class="semester">\
			<div class="ui segment">\
				<div class="ui top attached label">\
					Year ' + year + ' Semester ' + semesterNo + '\
				</div>\
				<ul class="ui selection list module-list"></ul>\
				<div class="ui bottom right attached label">MCs: 0</div>\
			</div>\
		</div>');
	semesterContainer.css("min-width", noOfSems * 11.3 + "rem");
}


//Insert Requirement Module List
requirementContainer.append(
	'<div id="requirementModules" class="semester">\
		<div class="ui segment">\
			<div class="ui top attached label">\
				Requirement Modules\
				<div class="ui search">\
					<div class="ui icon input">\
						<input class="prompt" type="text" placeholder="Search Modules">\
						<i class="search icon"></i>\
					</div>\
				</div>\
			</div>\
			<ul class="ui selection list module-list"></ul>\
			<div class="ui bottom right attached label">0/0</div>\
		</div>\
	</div>');

//Insert Requirement Specifications
requirementContainer.append(
	'<div id="requirement-specification" class="semester">\
		<div class="ui segment">\
			<div class="ui top attached label">\
				Requirements\
			</div>\
			<ul class="ui secondary pointing vertical menu module-list"></ul>\
			<div class="ui bottom right attached label">0/0</div>\
		</div>\
	</div>');



//Drag Scrolling
var reqContainerClicked = false;
var mouseXPos, left;
topContainer.on({
	'mousedown': function(e) {
		e.preventDefault();
		reqContainerClicked = true;
		if (topContainer.width() < semesterContainer.width()){
			$(this).css("cursor","-webkit-grabbing");
			mouseXPos = e.pageX;
			left = topContainer.scrollLeft();
		}
	},
	'mouseup': function(e) {
		reqContainerClicked = false;
		if (topContainer.width() < semesterContainer.width())
			$(this).css("cursor","-webkit-grab");
	},
	'mousemove': function(e) {
		if (reqContainerClicked) {
			var newX = e.pageX;
			topContainer.scrollLeft(left - e.pageX + mouseXPos);
		}
	},
	'mouseleave': function(e) {
		reqContainerClicked = false;
		$(this).css("cursor","default");
	},
	'mouseenter': function(e) {
		if (topContainer.width() < semesterContainer.width())
			$(this).css("cursor","-webkit-grab");
	}
});

function waitForInsertionOfHTML(fn) {
	var busyWaiting = setInterval(function () {
		if ($('#module-declaration')[0] != undefined) {
			fn();
			clearInterval(busyWaiting);
		} else {
			console.log("Wait for insertion of HTML");
		}
	},1);
}